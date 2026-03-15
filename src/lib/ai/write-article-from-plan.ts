import OpenAI from "openai";
import type { StoryPlan } from "./generate-story-plan";

// ── Types ──

export interface GeneratedArticle {
  tur: string;
  baslik: string;
  spot: string;
  metin: string;
  etiketler: string[];
  kategori: string;
}

// ── System Prompt ──

const ARTICLE_WRITER_PROMPT = `Sen Türkiye merkezli teknoloji ve girişimcilik medyasında çalışan kıdemli bir haber yazarısın. Görevin, sana verilen story plan'dan final haber metnini yazmak.

## KRİTİK KURAL: SADECE PLAN'DAKİ BİLGİLERİ KULLAN

- Story plan'da olmayan bilgiyi UYDURMA, EKLEME, VARSAYMA.
- Plan'daki "belirsiz_noktalar" listesindeki konularda ihtiyatlı dil kullan: "iddia edildi", "bekleniyor", "öne sürülüyor".
- Plan'da "Belirtilmemiş" veya "Kaynak metinde yok" yazan alanları haberde somutmuş gibi yazma.

## YAZI YAPISI: TERS PİRAMİT

En kritik bilgi en üstte, detaylar aşağıya doğru katmanlanır.

Paragraf akışı (3-5 paragraf):
P1: Haberin özü — kim, ne yaptı, temel sonuç. Tek başına haberi anlatmalı.
P2: Etki veya stratejik gerekçe — neden önemli, kimi etkiliyor.
P3: Detay — teknik, finansal veya operasyonel bilgiler.
P4: Bağlam — sektörel konum, rekabet, geçmiş gelişmeler.
P5 (opsiyonel): Geniş çerçeve — trend, gelecek beklentisi.

## TÜRE GÖRE DİL AYARI

Story plan'daki "tur" alanına göre dilini ayarla:

- Yatırım haberi → En nötr, rakam odaklı, minimum yorum
- Ürün duyurusu → Haber + teknik açıklama dengesi, kullanıcı etkisi vurgulu
- Girişim tanıtımı → Açıklayıcı ama PR değil, ölçülü ton
- Analiz / gündem → Yorumlu ama veri dayanaklı, öznel değil
- Rehber / how-to → Kullanıcıya hitap, adım mantığı
- Söylenti → İhtiyatlı dil zorunlu, kesin konuşma
- Halka arz → Finansal haber dili, prosedür netliği
- Kurumsal karar → Serinkanlı, neden-sonuç odaklı

## BAŞLIK KURALLARI

- 10-16 kelime, bilgi taşıyan başlık
- Merak oyunu kurma, bilgiyi ver
- Mümkünse: şirket adı + gelişme + rakam/özellik/sonuç

## SPOT KURALLARI

- Tek cümle
- Başlığı tekrar etme
- Başlıkta olmayan bir bilgi katmanı ekle (lider yatırımcı, değerleme, tarih, gerekçe vb.)
- Okur sadece spotu okusa haberin özünü anlamalı

## HTML FORMAT KURALLARI

- Her paragrafı <p> tagı içine al
- Alt başlıklar için <h3> kullan (gerekiyorsa)
- Kalın metin için SADECE <strong> tagı kullan
- Markdown ** kullanma

## KALIN (STRONG) KULLANIMI

- Şirket adları ilk geçişte <strong>
- Önemli rakamlar ve yüzdeler <strong>
- Ürün/model adları <strong>
- Anahtar teknik terimler ilk kullanımda <strong>
- Abartma — her cümlede kalın eleman olmasın

## SAYISAL VERİ SUNUMU

- Para: "105 milyon dolar" (rakamla, birim açık)
- Yüzde: "yüzde 295 artış" (rakamla + yüzde kelimesiyle)
- Tarih: "4 Mart 2026" (gün + ay + yıl)

## KAYNAK ATIF KALIPLARI

Plan'daki kaynak_dayanaklari alanını kullanarak uygun atıf yap:
- "Şirket tarafından yapılan açıklamada..."
- "[Kaynak]'ın aktardığı bilgilere göre..."
- "[Platform] üzerinden yaptığı paylaşımda..."

## YASAKLAR

- Basın bülteni dili, LinkedIn dili
- "Heyecan verici", "muhteşem", "devrim niteliğinde", "yenilikçi bir çözüm"
- "Yeni bir dönem başlatıyor", "öncülük ediyor", "önemli bir adım"
- Gereksiz metafor
- Aynı fiilin art arda paragraflarda tekrarı
- Plan'da olmayan bilgiyi uydurma
- Giriş cümlesinde haberin özünü vermeden başlama

## İÇ KONTROL

Yazdıktan sonra sessizce kontrol et:
- Başlık bilgi taşıyor mu?
- Spot başlıktan farklı bilgi katıyor mu?
- İlk paragraf tek başına haberi anlatıyor mu?
- Plan'da olmayan bilgi eklendi mi? (eklenmediyse geç)
- Belirsiz noktalar ihtiyatlı dille yazıldı mı?
- PR kokusu var mı?
- Kalın kullanımı dengeli mi?
- Doğal Türkçe mi?

## ÇIKTI FORMATI

Yanıtını MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir şey ekleme:

{
  "tur": "story plan'daki tür",
  "baslik": "10-16 kelime, bilgi taşıyan başlık",
  "spot": "Tek cümle. Başlıktan farklı bilgi katmanı.",
  "metin": "HTML formatında 3-5 paragraf. <p> ve <strong> kullan.",
  "etiketler": ["etiket1", "etiket2", "..."],
  "kategori": "yapay-zeka | startup | big-tech | yazilim | donanim"
}`;

// ── Helpers ──

const VALID_CATEGORIES = [
  "yapay-zeka",
  "startup",
  "big-tech",
  "yazilim",
  "donanim",
] as const;

/** Serialize story plan into a structured user message */
function buildUserMessage(plan: StoryPlan): string {
  const sections: string[] = [
    `Tür: ${plan.tur}`,
    `Haber açısı: ${plan.haber_acisi}`,
    `\nKİM: ${plan.kim.join(", ")}`,
    `NE OLDU: ${plan.ne_oldu}`,
    `NEREDE: ${plan.nerede}`,
    `NE ZAMAN: ${plan.ne_zaman}`,
    `NEDEN ÖNEMLİ: ${plan.neden_onemli}`,
  ];

  if (plan.kritik_maddi_gercekler.length > 0) {
    sections.push(
      `\nKritik maddi gerçekler:\n${plan.kritik_maddi_gercekler.map((g) => `- ${g}`).join("\n")}`
    );
  }

  const roles = Object.entries(plan.rol_dagilimi);
  if (roles.length > 0) {
    sections.push(
      `\nRol dağılımı:\n${roles.map(([actor, role]) => `- ${actor}: ${role}`).join("\n")}`
    );
  }

  if (plan.teknik_detaylar.length > 0) {
    sections.push(
      `\nTeknik detaylar:\n${plan.teknik_detaylar.map((d) => `- ${d}`).join("\n")}`
    );
  }

  if (plan.finansal_detaylar.length > 0) {
    sections.push(
      `\nFinansal detaylar:\n${plan.finansal_detaylar.map((d) => `- ${d}`).join("\n")}`
    );
  }

  if (plan.baglam.length > 0) {
    sections.push(
      `\nBağlam:\n${plan.baglam.map((b) => `- ${b}`).join("\n")}`
    );
  }

  if (plan.kaynak_dayanaklari.length > 0) {
    sections.push(
      `\nKaynak dayanakları:\n${plan.kaynak_dayanaklari.map((k) => `- ${k}`).join("\n")}`
    );
  }

  if (plan.belirsiz_noktalar.length > 0) {
    sections.push(
      `\nBELİRSİZ NOKTALAR (ihtiyatlı dil kullan):\n${plan.belirsiz_noktalar.map((b) => `- ${b}`).join("\n")}`
    );
  }

  sections.push(`\nKategori önerisi: ${plan.kategori_onerisi}`);
  sections.push(`Etiket önerileri: ${plan.etiket_onerileri.join(", ")}`);

  return sections.join("\n");
}

/** Validate the generated article output */
function validateArticle(raw: Record<string, unknown>): GeneratedArticle {
  const requiredFields = [
    "tur",
    "baslik",
    "spot",
    "metin",
    "kategori",
  ] as const;

  for (const field of requiredFields) {
    if (!raw[field] || typeof raw[field] !== "string") {
      throw new Error(`Makale çıktısında zorunlu alan eksik: ${field}`);
    }
  }

  if (!Array.isArray(raw.etiketler)) {
    raw.etiketler = [];
  }

  // Ensure metin has <p> tags
  let metin = raw.metin as string;
  metin = metin.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  if (!metin.includes("<p>")) {
    metin = metin
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("\n");
  }
  raw.metin = metin;

  // Normalize category
  const kategori = String(raw.kategori).toLowerCase();
  raw.kategori = VALID_CATEGORIES.includes(
    kategori as (typeof VALID_CATEGORIES)[number]
  )
    ? kategori
    : "yapay-zeka";

  return raw as unknown as GeneratedArticle;
}

// ── Main Function ──

export async function writeArticleFromPlan(
  plan: StoryPlan
): Promise<GeneratedArticle> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  if (!plan.ne_oldu || !plan.tur) {
    throw new Error("Story plan eksik: tur ve ne_oldu alanları zorunlu");
  }

  const client = new OpenAI({ apiKey });
  const userMessage = buildUserMessage(plan);

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      { role: "system", content: ARTICLE_WRITER_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "";

  // Parse JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Makale JSON parse edilemedi");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Makale JSON formatı geçersiz");
  }

  return validateArticle(parsed);
}
