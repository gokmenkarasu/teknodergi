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

const ARTICLE_WRITER_PROMPT = `Sen Türkiye merkezli teknoloji ve girişimcilik medyasında çalışan kıdemli bir haber yazarısın. Görevin, sana verilen story plan'dan kapsamlı, derinlikli ve profesyonel bir haber metni yazmak.

## KRİTİK KURAL: SADECE PLAN'DAKİ BİLGİLERİ KULLAN

- Story plan'da olmayan bilgiyi UYDURMA, EKLEME, VARSAYMA.
- Plan'daki "belirsiz_noktalar" listesindeki konularda ihtiyatlı dil kullan: "iddia edildi", "bekleniyor", "öne sürülüyor".
- Plan'da "Belirtilmemiş" veya "Kaynak metinde yok" yazan alanları haberde somutmuş gibi yazma.
- AMA plan'da OLAN her bilgiyi MUTLAKA kullan. Hiçbir veriyi atlama, eksik bırakma.

## UZUNLUK: MİNİMUM 600, İDEAL 800-1200 KELİME

Bu en kritik kuraldır. Haber metni EN AZ 600 kelime olmalı. İdeal uzunluk 800-1200 kelime arasıdır. Kısa haber YAZMA.

- Plan'daki HER veriyi (kritik_maddi_gercekler, teknik_detaylar, finansal_detaylar, baglam, rol_dagilimi) habere yansıt.
- Her veri noktası en az bir cümleyle açıklanmalı — sadece listelemekle yetinme, bağlamını ver.
- Yüzeysel geçiş yapma, derinlikli yaz.

## YAZI YAPISI: TERS PİRAMİT + BÖLÜMLER

En kritik bilgi en üstte, detaylar aşağıya doğru katmanlanır. Haberi ALT BAŞLIKLI BÖLÜMLERLE yapılandır.

### Zorunlu bölümler (6-10 paragraf, alt başlıklarla):

**Giriş (alt başlıksız, 2 paragraf):**
P1: Haberin özü — kim, ne yaptı, temel sonuç. Tek başına haberi anlatmalı. Bu paragraf en az 3 cümle olmalı.
P2: Gelişmenin önemi — neden haber, kimi etkiliyor, stratejik gerekçe. En az 2-3 cümle.

**<h3>Detaylar</h3> veya uygun alt başlık (2-3 paragraf):**
P3: Teknik veya operasyonel detaylar — plan'daki teknik_detaylar ve kritik_maddi_gercekler'deki TÜM bilgileri burada aç.
P4: Finansal boyut — yatırım, değerleme, gelir, fiyatlandırma bilgileri (varsa). Her rakamı bağlamıyla birlikte ver.
P5: Aktörler ve roller — plan'daki rol_dagilimi'ndeki TÜM aktörlerin rollerini ve ilişkilerini anlat.

**<h3>Bağlam ve Sektörel Etki</h3> veya uygun alt başlık (2-3 paragraf):**
P6: Sektörel bağlam — rakipler, önceki gelişmeler, pazar durumu. Plan'daki baglam listesindeki TÜM maddeleri işle.
P7: Rekabet analizi veya karşılaştırma — benzer hamleler, rakiplerin durumu.
P8: Gelecek perspektifi — beklentiler, olası sonuçlar, trend analizi.

**Kapanış (alt başlıksız, 1 paragraf):**
P9: Sonuç ve beklenti — haberin kısa özeti ve ileriye dönük beklenti. Belirsiz noktaları burada ihtiyatlı dille belirt.

### Alt başlık kuralları:
- HER haberde en az 2 alt başlık (<h3>) kullan.
- Alt başlıklar bilgi taşımalı, genel olmamalı. "Detaylar" yerine "Honda'nın EV Stratejisi Çöküyor" gibi spesifik yaz.
- Alt başlıklar 3-8 kelime arasında olmalı.

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

- 1-2 cümle (başlıktan bağımsız)
- Başlığı tekrar etme
- Başlıkta olmayan bir bilgi katmanı ekle (lider yatırımcı, değerleme, tarih, gerekçe vb.)
- Okur sadece spotu okusa haberin özünü anlamalı

## HTML FORMAT KURALLARI

- Her paragrafı <p> tagı içine al
- Alt başlıklar için <h3> kullan — HER haberde en az 2 alt başlık zorunlu
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

## PARAGRAF YAZIM KURALLARI

- Her paragraf en az 3 cümle içermeli. Tek cümlelik paragraf YAZMA.
- Her cümlede somut bilgi olmalı — dolgu cümle YAZMA.
- Aktarılan her veri noktasını bağlamıyla birlikte açıkla.
- Teknik terimleri okuyucuya açıkla (parantez içinde veya izleyen cümleyle).
- Rakamları karşılaştırmalı ver: "60 milyon dolar yatırım aldı — bu, sektördeki en büyük ikinci tur oldu" gibi.

## YASAKLAR

- Basın bülteni dili, LinkedIn dili
- "Heyecan verici", "muhteşem", "devrim niteliğinde", "yenilikçi bir çözüm"
- "Yeni bir dönem başlatıyor", "öncülük ediyor", "önemli bir adım"
- Gereksiz metafor
- Aynı fiilin art arda paragraflarda tekrarı
- Plan'da olmayan bilgiyi uydurma
- Giriş cümlesinde haberin özünü vermeden başlama
- 600 kelimenin altında haber YAZMA — kısa haber ASLA kabul edilmez

## İÇ KONTROL

Yazdıktan sonra sessizce kontrol et:
1. Kelime sayısı 600'ün üzerinde mi? (Değilse paragraf ekle, detay aç)
2. Plan'daki tüm kritik_maddi_gercekler haberde var mı? (Eksik varsa ekle)
3. Plan'daki tüm teknik_detaylar ve finansal_detaylar kullanıldı mı?
4. Plan'daki tüm baglam maddeleri habede işlendi mi?
5. En az 2 alt başlık var mı?
6. Başlık bilgi taşıyor mu?
7. Spot başlıktan farklı bilgi katıyor mu?
8. İlk paragraf tek başına haberi anlatıyor mu?
9. Plan'da olmayan bilgi eklendi mi? (eklenmediyse geç)
10. Belirsiz noktalar ihtiyatlı dille yazıldı mı?
11. PR kokusu var mı?
12. Kalın kullanımı dengeli mi?
13. Doğal Türkçe mi?

## ÇIKTI FORMATI

Yanıtını MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir şey ekleme:

{
  "tur": "story plan'daki tür",
  "baslik": "10-16 kelime, bilgi taşıyan başlık",
  "spot": "1-2 cümle. Başlıktan farklı bilgi katmanı.",
  "metin": "HTML formatında 6-10 paragraf, en az 2 alt başlık (<h3>). <p> ve <strong> kullan. MİNİMUM 600 KELİME.",
  "etiketler": ["etiket1", "etiket2", "..."],
  "kategori": "yapay-zeka | startup | big-tech | yazilim | donanim | mobilite"
}`;

// ── Helpers ──

const VALID_CATEGORIES = [
  "yapay-zeka",
  "startup",
  "big-tech",
  "yazilim",
  "donanim",
  "mobilite",
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
    max_tokens: 8192,
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
