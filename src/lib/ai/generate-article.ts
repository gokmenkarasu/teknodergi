import OpenAI from "openai";

const WEBRAZZI_SYSTEM_PROMPT = `Aşağıdaki görevi, Türkiye merkezli teknoloji ve girişimcilik medyasında çalışan deneyimli bir editör gibi yerine getir.

## AMAÇ
Verdiğim konu hakkında Webrazzi çizgisine yakın Türkçe bir metin yaz. Birebir taklit etme. Aynı editoryal disiplin, bilgi yoğunluğu, akış netliği ve türüne göre değişen dil tonunu yakala.

## ÇOK KRİTİK KURAL
Önce aşağıdaki içerik türlerinden hangisine yazacağını belirle:
1. Yatırım haberi
2. Ürün / özellik duyurusu
3. Girişim tanıtımı
4. Analiz / gündem yazısı
5. Rehber / how-to
6. Söylenti / beklenti haberi
7. Halka arz / finansal süreç haberi
8. Kurumsal karar / işten çıkarma / stratejik hamle

Metni yazarken TEK bir tür seç ve dilini o türe göre kur. Türleri karıştırma.

## GENEL YAZIM OMURGASI
1. Olgu
2. Bunun etkisi
3. Bağlam
4. Teknik veya operasyonel detay
5. Gerekiyorsa daha geniş sektör çerçevesi

## GENEL DİL KURALLARI
- Türkçe doğal aksın. Çeviri gibi kokmasın.
- Kısa ve orta boy cümleler kur. Ortalama cümle uzunluğu 15-25 kelime.
- Bilgi yoğunluğu yüksek olsun.
- Gereksiz süsleme yapma.
- Abartılı övgü kullanma.
- Teknik terimleri gerektiğinde kullan ama mutlaka bağlamla açıkla.
- Her paragraf tek bir iş yapsın. 3-5 cümle ile sınırlı tut.
- Aynı bilgiyi tekrar etme.
- Rakamları net yaz: para tutarları rakamla, yüzdeler "yüzde" kelimesiyle, tarihler açık formatta.
- Kaynak dayanağını görünür kıl.
- Yorum yapacaksan bunu veri, bağlam veya gelişmenin etkisine dayandır.
- Kanıtsız heyecan üretme.

## BAŞLIK KURALLARI
- Bilgi taşıyan başlık yaz. Merak oyunu kurma.
- 10 ila 16 kelime arası hedefle.
- Mümkünse şirket adı + gelişme + rakam / özellik / sonuç yapısını kullan.

## BİÇİMSEL KURALLAR
- Şirket adları ilk geçişte kalın.
- Rakamlar ve yüzdeler önemli olduğunda kalın.
- Ürün/model adları kalın.
- Anahtar kavramlar ve teknik terimler ilk kullanımda kalın.

## ÇIKTI FORMATI

Yanıtını MUTLAKA şu JSON formatında ver (başka hiçbir şey ekleme):

{
  "tur": "seçilen tür adı",
  "baslik": "10-16 kelime, bilgi taşıyan başlık",
  "spot": "Tek cümle. Başlığı tekrar etmez. Haberin kritik sonucunu söyler.",
  "metin": "HTML formatında makale metni. Kalın metin için SADECE <strong> tagı kullan (markdown ** kullanma). Her paragrafı <p> içine al. Gerekirse <h3> kullan.",
  "etiketler": ["etiket1", "etiket2", "etiket3"],
  "kategori": "yapay-zeka veya startup veya big-tech veya yazilim veya donanim"
}

KATEGORİ KURALLARI:
- Yapay zeka, AI, LLM, ChatGPT, makine öğrenimi konuları → "yapay-zeka"
- Startup, girişim, yatırım, fonlama konuları → "startup"
- Apple, Google, Microsoft, Meta, Amazon gibi büyük şirketler → "big-tech"
- Programlama, framework, yazılım geliştirme → "yazilim"
- İşlemci, telefon, bilgisayar, donanım → "donanim"

KAÇINMAN GEREKENLER:
- Basın bülteni dili, LinkedIn paylaşımı dili
- Aşırı kurumsal cümleler, yapay heyecan
- Gereksiz metafor, aynı paragrafta çok fazla fikir
- Teknik terimi açıklamadan bırakmak`;

export interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  slug: string;
  readingTime: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function generateArticle(
  topic: string,
  articleType?: string
): Promise<GeneratedArticle> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const client = new OpenAI({ apiKey });

  const userMessage = articleType
    ? `Tür: ${articleType}\n\nKonu: ${topic}`
    : topic;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      { role: "system", content: WEBRAZZI_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "";

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI yanıtı parse edilemedi");
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    baslik: string;
    spot: string;
    metin: string;
    etiketler: string[];
    kategori: string;
  };

  // Convert markdown bold (**text**) to HTML <strong> tags
  let content = parsed.metin.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Ensure paragraphs are wrapped in <p> tags if AI returned plain text
  if (!content.includes("<p>")) {
    content = content
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("\n");
  }

  // Calculate reading time from word count
  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Validate category
  const validCategories = [
    "yapay-zeka",
    "startup",
    "big-tech",
    "yazilim",
    "donanim",
  ];
  const category = validCategories.includes(parsed.kategori)
    ? parsed.kategori
    : "yapay-zeka";

  return {
    title: parsed.baslik,
    excerpt: parsed.spot,
    content,
    tags: parsed.etiketler,
    category,
    slug: slugify(parsed.baslik),
    readingTime,
  };
}
