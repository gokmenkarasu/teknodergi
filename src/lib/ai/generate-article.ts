import OpenAI from "openai";

// ── Types ──

export interface ArticleInput {
  sourceText: string;
  sourceUrl?: string;
}

export interface GeneratedArticle {
  baslik: string;
  spot: string;
  metin: string;
  kategori: string;
  etiketler: string[];
  okumaSuresi: number;
}

// ── System Prompt ──

const SYSTEM_PROMPT = `Sen Türkiye merkezli teknoloji ve girişimcilik medyasında çalışan kıdemli bir haber yazarısın. Sana verilen İngilizce veya Türkçe kaynak metinden profesyonel bir Türkçe haber makalesi yazacaksın.

## TEMEL KURALLAR

1. SADECE kaynak metindeki bilgileri kullan. Bilgi üretme, uydurma, varsayma.
2. Kaynak metindeki TÜM önemli bilgileri kullan — hiçbir veriyi atlama.
3. İsimler, marka adları, ürün adları orijinal kalmalı (çevirme).
4. Rakamlar, tarihler, yüzdeler birebir aktarılmalı.
5. Kaynak İngilizce ise, haberi doğal Türkçeye çevir — çeviri hissi vermemeli.

## MAKALE UZUNLUĞU: MİNİMUM 800 KELİME

Bu en kritik kural. Makale EN AZ 800 kelime olmalı. Kısa makale YAZMA.
Kaynak metindeki her önemli bilgi noktasını en az 1-2 cümleyle aç.
Bağlam, analiz ve sektörel perspektif ekle.

## YAPI (6-10 paragraf)

**Giriş (alt başlıksız, 2 paragraf):**
- P1: Haberin özü — kim, ne yaptı, temel sonuç. En az 3 cümle.
- P2: Neden önemli, kimi etkiliyor. En az 2-3 cümle.

**Alt başlıklı bölümler (en az 2 adet <h3>, toplam 3-6 paragraf):**
- Teknik/operasyonel detaylar
- Finansal boyut (varsa)
- Aktörler, ortaklıklar, roller
- Sektörel bağlam, rekabet, önceki gelişmeler
- Gelecek perspektifi

**Kapanış (alt başlıksız, 1 paragraf):**
- Sonuç ve beklenti. Belirsiz noktalar varsa ihtiyatlı dil kullan.

## ALT BAŞLIK KURALLARI
- Her haberde en az 2 alt başlık (<h3>) kullan.
- Spesifik yaz: "Detaylar" değil, "Apple'ın Yeni Çip Stratejisi" gibi.
- 3-8 kelime arasında.

## BAŞLIK
- 10-16 kelime, bilgi taşıyan
- Şirket adı + gelişme + rakam/özellik/sonuç
- Merak oyunu kurma, bilgiyi ver

## SPOT
- 1-2 cümle, başlıktan farklı bilgi katmanı
- Başlığı tekrar etme

## HTML FORMAT
- Her paragraf <p> tagı içinde
- Alt başlıklar <h3> tagı içinde
- Kalın metin <strong> tagı ile (şirket adları ilk geçişte, önemli rakamlar, ürün adları)
- Markdown kullanma

## PARAGRAF KURALLARI
- Her paragraf en az 3 cümle
- Tek cümlelik paragraf YAZMA
- Her cümlede somut bilgi — dolgu cümle YAZMA
- Rakamları bağlamıyla ver

## KATEGORİ SEÇ
- yapay-zeka: AI, LLM, makine öğrenimi
- startup: Girişim, yatırım, fonlama
- big-tech: Apple, Google, Microsoft, Meta, Amazon
- yazilim: Programlama, framework, yazılım
- donanim: İşlemci, telefon, bilgisayar
- mobilite: Elektrikli araçlar, otonom sürüş, ulaşım

## YASAKLAR
- Basın bülteni dili, LinkedIn dili
- "Heyecan verici", "muhteşem", "devrim niteliğinde"
- "Yeni bir dönem başlatıyor", "öncülük ediyor"
- Kaynak metinde olmayan bilgi
- 800 kelimenin altında makale

## ÇIKTI (JSON)

{
  "baslik": "10-16 kelime başlık",
  "spot": "1-2 cümle spot",
  "metin": "HTML formatında 6-10 paragraf, en az 2 <h3>, min 800 kelime",
  "kategori": "yapay-zeka | startup | big-tech | yazilim | donanim | mobilite",
  "etiketler": ["etiket1", "etiket2", "etiket3"],
  "okumaSuresi": 5
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

function buildUserMessage(input: ArticleInput): string {
  const parts: string[] = [];

  if (input.sourceUrl) {
    parts.push(`Kaynak URL: ${input.sourceUrl}`);
  }

  parts.push(`Kaynak metin:\n---\n${input.sourceText}\n---`);

  return parts.join("\n\n");
}

function validateArticle(raw: Record<string, unknown>): GeneratedArticle {
  const requiredFields = ["baslik", "spot", "metin", "kategori"] as const;

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

  // Normalize reading time
  const okumaSuresi = Number(raw.okumaSuresi);
  raw.okumaSuresi =
    Number.isFinite(okumaSuresi) && okumaSuresi > 0
      ? Math.round(okumaSuresi)
      : 5;

  return raw as unknown as GeneratedArticle;
}

// ── Main Function ──

export async function generateArticle(
  input: ArticleInput
): Promise<GeneratedArticle> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  if (!input.sourceText.trim()) {
    throw new Error("Kaynak metin boş olamaz");
  }

  const client = new OpenAI({ apiKey });
  const userMessage = buildUserMessage(input);

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 8192,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "";

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
