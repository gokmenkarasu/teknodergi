import OpenAI from "openai";

// ── Types ──

export interface StoryPlanInput {
  topic: string;
  articleType?: string;
  sourceText?: string;
  sourceUrl?: string;
  editorNote?: string;
}

export interface StoryPlan {
  tur: string;
  haber_acisi: string;
  kim: string[];
  ne_oldu: string;
  nerede: string;
  ne_zaman: string;
  neden_onemli: string;
  kritik_maddi_gercekler: string[];
  rol_dagilimi: Record<string, string>;
  teknik_detaylar: string[];
  finansal_detaylar: string[];
  baglam: string[];
  kaynak_dayanaklari: string[];
  belirsiz_noktalar: string[];
  kategori_onerisi: string;
  etiket_onerileri: string[];
}

// ── System Prompt ──

const STORY_PLANNER_PROMPT = `Sen Türkiye merkezli teknoloji ve girişimcilik medyasında çalışan kıdemli bir haber editörüsün. Görevin bir haber konusunu analiz edip yapılandırılmış bir "story plan" çıkarmak.

## AMAÇ

Sana verilen konu, kaynak metin veya editör notunu analiz et. Haberin yazılabilmesi için gerekli tüm yapısal bilgiyi çıkar ve organize et. Bu aşamada haber metni, başlık veya spot YAZMA — sadece plan üret.

## TÜR TESPİTİ

Aşağıdaki türlerden en uygun olanı seç:

1. Yatırım haberi
2. Ürün / özellik duyurusu
3. Girişim tanıtımı
4. Analiz / gündem yazısı
5. Rehber / how-to
6. Söylenti / beklenti haberi
7. Halka arz / finansal süreç haberi
8. Kurumsal karar / işten çıkarma / stratejik hamle

Editör bir tür önermişse, bunu dikkate al ama kaynak metinle çelişiyorsa kendi değerlendirmeni yap ve doğru türü seç.

## HABER AÇISI

Haberin temel açısını tek cümlede belirle. Bu cümle:
- Haberin neden haber olduğunu söylemeli
- Okuyucunun neden okuması gerektiğini ima etmeli
- PR açısı değil, editoryal açı olmalı

## 5N1K ÇIKARIMI

Her haberin temelinde 5N1K yatar. Kaynak metni SATIR SATIR tara ve tüm bilgileri çıkar:
- KİM: İlgili TÜM aktörler — şirketler, alt markalar, kişi isimleri, kurumlar, ortaklar. Kaynak metinde geçen HER şirket ve kişi adını dahil et.
- NE OLDU: Haberin özü — somut ve spesifik. "Üretimi durdurdu" yerine "X, Y ve Z modellerinin üretimini durdurdu" gibi detaylı yaz.
- NEREDE: Coğrafi bağlam — ülke, pazar (ör. "ABD pazarı"), şehir. Kaynak metinde geçiyorsa MUTLAKA yaz.
- NE ZAMAN: Tarih, gün, hafta, dönem. Kaynak metinde "this week", "Thursday", "Friday" gibi ifadeler varsa tarihe çevir.
- NEDEN ÖNEMLİ: Haberin sektörel/toplumsal önemi — spesifik ol.

## KRİTİK MADDİ GERÇEKLER

Bu alan haberin OMURGASIDIR. Kaynak metni dikkatle oku ve aşağıdakilerin HEPSİNİ çıkar:
- Ürün/model adları (ör. "Honda 0 sedan", "Acura RDX", "Prologue")
- Rakamlar (yatırım tutarı, kullanıcı sayısı, fiyat, adet, yüzde vb.)
- Tarihler ve zaman çizelgeleri
- Resmi isimler, unvanlar, şirket adları
- Doğrudan alıntılar (varsa, tırnak içinde)
- Ortaklıklar, anlaşmalar, ilişkiler (ör. "GM tarafından tasarlanıp üretilen")
- Karar gerekçeleri (ör. "ABD gümrük tarifeleri ve Çin rekabeti")

Kaynak metinde geçen SOMUT her bilgi burada olmalı. Genel ifadeler değil, spesifik veriler.

## ROL DAĞILIMI

Haberdeki her aktörün rolünü belirle. Kaynak metinde geçen TÜM şirket ve kişileri dahil et. Örnek:
- "Uber": "Platform sağlayıcı, müşteri erişim altyapısı"
- "Wayve": "Otonom sürüş teknolojisi geliştiricisi"
- "GM": "Prologue aracının tasarım ve üretim ortağı"

## TEKNİK DETAYLAR

Haberde geçen teknik bilgileri listele:
- Ürün özellikleri, teknoloji türleri (ör. "yazılım tanımlı araç", "elektrikli aktarma organı")
- Teknik karşılaştırmalar veya sektörel teknik trendler
- Altyapı, platform, yazılım bilgileri
Kaynak metinde teknik detay VARSA burası boş KALMAMALI.

## FİNANSAL DETAYLAR

Yatırım tutarları, değerleme, gelir, fiyatlandırma, pazar payı gibi finansal verileri listele. Kaynak metinde finansal veri varsa burası boş kalmamalı.

## BAĞLAM

Haberi anlamlı kılacak sektörel, tarihsel veya rekabet bağlamını listele:
- Benzer önceki gelişmeler
- Rakiplerin durumu
- Sektörel trendler
- Düzenleyici çerçeve

## KAYNAK DAYANAKLARI

Haberde referans gösterilebilecek kaynakları listele:
- Resmi açıklama, blog yazısı, basın bülteni
- Sosyal medya paylaşımı
- Araştırma raporu
- Kaynak metin veya URL verilmişse onları da dahil et

## BELİRSİZ NOKTALAR

Kaynak metinde veya konuda eksik, belirsiz veya doğrulanamayan noktaları listele. Bu bilgiler haberde ihtiyatlı dil kullanılması gerektiğini işaret eder.

## KATEGORİ

Aşağıdaki kategorilerden en uygun olanı seç:
- yapay-zeka: AI, LLM, makine öğrenimi
- startup: Girişim, yatırım, fonlama
- big-tech: Apple, Google, Microsoft, Meta, Amazon gibi büyük teknoloji şirketleri
- yazilim: Programlama, framework, yazılım geliştirme
- donanim: İşlemci, telefon, bilgisayar, donanım
- mobilite: Elektrikli araçlar, otonom sürüş, ulaşım teknolojileri, otomotiv

## ETİKETLER

3-8 etiket öner: şirket adları, sektör, teknoloji, coğrafya.

## ÇIKTI FORMATI

Yanıtını MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir şey ekleme:

{
  "tur": "seçilen tür adı",
  "haber_acisi": "Haberin editoryal açısı — tek cümle",
  "kim": ["aktör1", "aktör2"],
  "ne_oldu": "Haberin özü — tek cümle",
  "nerede": "Coğrafi bağlam veya 'Belirtilmemiş'",
  "ne_zaman": "Zaman çerçevesi veya 'Belirtilmemiş'",
  "neden_onemli": "Haberin sektörel önemi — tek cümle",
  "kritik_maddi_gercekler": ["gerçek1", "gerçek2"],
  "rol_dagilimi": {"aktör": "rolü"},
  "teknik_detaylar": ["detay1", "detay2"],
  "finansal_detaylar": ["detay1", "detay2"],
  "baglam": ["bağlam1", "bağlam2"],
  "kaynak_dayanaklari": ["kaynak1", "kaynak2"],
  "belirsiz_noktalar": ["belirsizlik1", "belirsizlik2"],
  "kategori_onerisi": "yapay-zeka | startup | big-tech | yazilim | donanim",
  "etiket_onerileri": ["etiket1", "etiket2", "etiket3"]
}

## KURALLAR

- Bilgi üretme, uydurma. Kaynak metinde olmayan veriyi ekleme.
- AMA kaynak metinde OLAN bilgiyi de ATLAMA. Metni satır satır tara — her isim, rakam, tarih, model adı, şirket adı, coğrafi bilgi plan'a yansımalı.
- Belirsiz noktaları açıkça belirt.
- Eksik alanları boş bırakma, "Belirtilmemiş" veya "Kaynak metinde yok" yaz.
- Haber metni, başlık veya spot YAZMA. Sadece plan üret.
- Kaynak metin İngilizce olsa bile, plan'ı Türkçe yaz. İsimler ve marka adları orijinal kalabilir.
- "kritik_maddi_gercekler" listesi en az 5 madde içermeli. Kaynak metinde bu kadar veri yoksa olanı yaz ve belirsiz_noktalar'a not düş.`;

// ── Helpers ──

const VALID_CATEGORIES = [
  "yapay-zeka",
  "startup",
  "big-tech",
  "yazilim",
  "donanim",
  "mobilite",
] as const;

/** Build the user message from input fields */
function buildUserMessage(input: StoryPlanInput): string {
  const parts: string[] = [];

  if (input.articleType) {
    parts.push(`Önerilen tür: ${input.articleType}`);
  }

  parts.push(`Konu: ${input.topic}`);

  if (input.sourceUrl) {
    parts.push(`Kaynak URL: ${input.sourceUrl}`);
  }

  if (input.sourceText) {
    parts.push(`Kaynak metin:\n---\n${input.sourceText}\n---`);
  }

  if (input.editorNote) {
    parts.push(`Editör notu: ${input.editorNote}`);
  }

  return parts.join("\n\n");
}

/** Validate required fields and normalize the parsed plan */
function validatePlan(raw: Record<string, unknown>): StoryPlan {
  const requiredStringFields = [
    "tur",
    "haber_acisi",
    "ne_oldu",
    "nerede",
    "ne_zaman",
    "neden_onemli",
    "kategori_onerisi",
  ] as const;

  for (const field of requiredStringFields) {
    if (!raw[field] || typeof raw[field] !== "string") {
      throw new Error(`Story plan'da zorunlu alan eksik: ${field}`);
    }
  }

  const requiredArrayFields = [
    "kim",
    "kritik_maddi_gercekler",
    "teknik_detaylar",
    "finansal_detaylar",
    "baglam",
    "kaynak_dayanaklari",
    "belirsiz_noktalar",
    "etiket_onerileri",
  ] as const;

  for (const field of requiredArrayFields) {
    if (!Array.isArray(raw[field])) {
      raw[field] = [];
    }
  }

  if (
    !raw.rol_dagilimi ||
    typeof raw.rol_dagilimi !== "object" ||
    Array.isArray(raw.rol_dagilimi)
  ) {
    raw.rol_dagilimi = {};
  }

  // Normalize category
  const kategori = String(raw.kategori_onerisi).toLowerCase();
  raw.kategori_onerisi = VALID_CATEGORIES.includes(
    kategori as (typeof VALID_CATEGORIES)[number]
  )
    ? kategori
    : "yapay-zeka";

  return raw as unknown as StoryPlan;
}

// ── Main Function ──

export async function generateStoryPlan(
  input: StoryPlanInput
): Promise<StoryPlan> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  if (!input.topic.trim()) throw new Error("Konu boş olamaz");

  const client = new OpenAI({ apiKey });
  const userMessage = buildUserMessage(input);

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 2048,
    messages: [
      { role: "system", content: STORY_PLANNER_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "";

  // Parse JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Story plan JSON parse edilemedi");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Story plan JSON formatı geçersiz");
  }

  return validatePlan(parsed);
}
