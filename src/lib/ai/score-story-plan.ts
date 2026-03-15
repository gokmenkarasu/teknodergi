import OpenAI from "openai";
import type { StoryPlan } from "./generate-story-plan";

// ── Types ──

export interface CriterionScore {
  skor: number;
  not: string;
}

export interface StoryPlanScorecard {
  genel_karar: "Hazır" | "Revize gerekli";
  toplam_skor: number;
  kriterler: {
    tur_secimi: CriterionScore;
    ana_olgu_koruma: CriterionScore;
    kritik_detay_koruma: CriterionScore;
    kaynak_gorunurlugu: CriterionScore;
    teknik_operasyonel_netlik: CriterionScore;
    baglam_gucu: CriterionScore;
    haber_degeri_yogunlugu: CriterionScore;
    pr_dili_riski: CriterionScore;
  };
  eksikler: string[];
  yaziya_gecmeden_once_eklenmesi_gerekenler: string[];
}

// ── Constants ──

const CRITERION_KEYS = [
  "tur_secimi",
  "ana_olgu_koruma",
  "kritik_detay_koruma",
  "kaynak_gorunurlugu",
  "teknik_operasyonel_netlik",
  "baglam_gucu",
  "haber_degeri_yogunlugu",
  "pr_dili_riski",
] as const;

const MAX_RAW_SCORE = CRITERION_KEYS.length * 10; // 80

// ── System Prompt ──

const SCORER_PROMPT = `Sen Türkiye merkezli teknoloji ve girişimcilik medyasında çalışan kıdemli bir haber editörüsün. Görevin: sana verilen story plan'ı yazıya geçmeden ÖNCE denetlemek ve bir scorecard üretmek.

## AMAÇ

Story plan'ı 8 kriter üzerinden değerlendir. Her kriter 0-10 arası puanlanır.
Yumuşatma. Eksik varsa eksik de. Kırıcı olma ama dürüst ol.

## KRİTERLER

### 1. tur_secimi (0-10)
Seçilen haber türü kaynak bilgiyle uyumlu mu?
- 10: Tür isabetli, alternatif yok
- 5: Makul ama daha iyi bir seçenek olabilirdi
- 0: Yanlış tür

### 2. ana_olgu_koruma (0-10)
Haberin ana olgusu ("ne_oldu") net, tam ve doğru şekilde yakalanmış mı?
- 10: Olgu eksiksiz ve net
- 5: Olgu var ama muğlak veya eksik
- 0: Ana olgu kayıp veya yanlış

### 3. kritik_detay_koruma (0-10)
"kritik_maddi_gercekler" listesi haberin gerektirdiği tüm somut verileri içeriyor mu?
- 10: Rakamlar, tarihler, isimler eksiksiz
- 5: Bazı önemli veriler eksik
- 0: Liste boş veya içerik yetersiz

### 4. kaynak_gorunurlugu (0-10)
"kaynak_dayanaklari" haberin güvenilirliğini sağlayacak kadar güçlü mü?
- 10: Birden fazla somut kaynak var (resmi açıklama, rapor, sosyal medya paylaşımı vb.)
- 5: Tek veya belirsiz kaynak
- 0: Kaynak yok veya "Belirtilmemiş"

### 5. teknik_operasyonel_netlik (0-10)
Teknik veya operasyonel detaylar haberin türüne göre yeterli mi?
- 10: Okuyucunun anlayacağı düzeyde açık ve yeterli
- 5: Bazı teknik boşluklar var
- 0: Haberin gerektirdiği teknik bilgi hiç yok
Not: Her haber teknik detay gerektirmez — türe göre değerlendir.

### 6. baglam_gucu (0-10)
"baglam" listesi haberi anlamlı kılacak sektörel/tarihsel çerçeveyi sağlıyor mu?
- 10: Rekabet, trend, geçmiş gelişme gibi zengin bağlam
- 5: Bir-iki genel bağlam maddesi
- 0: Bağlam boş veya alakasız

### 7. haber_degeri_yogunlugu (0-10)
Plan, haberin neden haber olduğunu ve okuyucunun neden okuması gerektiğini net kılıyor mu?
- 10: "neden_onemli" ve "haber_acisi" güçlü, kimin etkilendiği belli
- 5: Genel bir önem ifadesi var ama spesifik değil
- 0: Neden haber olduğu belirsiz

### 8. pr_dili_riski (0-10)
Plan'da basın bülteni kokusu veya şişirilmiş ifade var mı?
- 10: Tamamen nötr, editoryal dil
- 5: Bazı ifadeler PR'a yakın ama düzeltilebilir
- 0: Plan PR metni gibi, editoryal mesafe yok

## EKSİKLER ve ÖNERİLER

"eksikler": Plan'da tespit ettiğin somut eksiklikleri listele. Boş olabilir.
"yaziya_gecmeden_once_eklenmesi_gerekenler": Haberi yazabilmek için MUTLAKA eklenmesi gereken bilgileri listele. Boş olabilir.

## GENEL KARAR

- Toplam ham puan 8 kriterin toplamıdır (0-80).
- 56 ve üzeri (yüzde 70+): "Hazır"
- 56 altı: "Revize gerekli"

## ÇIKTI FORMATI

Yanıtını MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir şey ekleme:

{
  "genel_karar": "Hazır" veya "Revize gerekli",
  "kriterler": {
    "tur_secimi": { "skor": 0-10, "not": "Kısa açıklama" },
    "ana_olgu_koruma": { "skor": 0-10, "not": "Kısa açıklama" },
    "kritik_detay_koruma": { "skor": 0-10, "not": "Kısa açıklama" },
    "kaynak_gorunurlugu": { "skor": 0-10, "not": "Kısa açıklama" },
    "teknik_operasyonel_netlik": { "skor": 0-10, "not": "Kısa açıklama" },
    "baglam_gucu": { "skor": 0-10, "not": "Kısa açıklama" },
    "haber_degeri_yogunlugu": { "skor": 0-10, "not": "Kısa açıklama" },
    "pr_dili_riski": { "skor": 0-10, "not": "Kısa açıklama" }
  },
  "eksikler": ["eksiklik1", "eksiklik2"],
  "yaziya_gecmeden_once_eklenmesi_gerekenler": ["gerekli1", "gerekli2"]
}`;

// ── Helpers ──

/** Serialize story plan into a structured message for the scorer */
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
  } else {
    sections.push("\nKritik maddi gerçekler: (boş)");
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
  } else {
    sections.push("\nTeknik detaylar: (boş)");
  }

  if (plan.finansal_detaylar.length > 0) {
    sections.push(
      `\nFinansal detaylar:\n${plan.finansal_detaylar.map((d) => `- ${d}`).join("\n")}`
    );
  } else {
    sections.push("\nFinansal detaylar: (boş)");
  }

  if (plan.baglam.length > 0) {
    sections.push(
      `\nBağlam:\n${plan.baglam.map((b) => `- ${b}`).join("\n")}`
    );
  } else {
    sections.push("\nBağlam: (boş)");
  }

  if (plan.kaynak_dayanaklari.length > 0) {
    sections.push(
      `\nKaynak dayanakları:\n${plan.kaynak_dayanaklari.map((k) => `- ${k}`).join("\n")}`
    );
  } else {
    sections.push("\nKaynak dayanakları: (boş)");
  }

  if (plan.belirsiz_noktalar.length > 0) {
    sections.push(
      `\nBelirsiz noktalar:\n${plan.belirsiz_noktalar.map((b) => `- ${b}`).join("\n")}`
    );
  }

  sections.push(`\nKategori önerisi: ${plan.kategori_onerisi}`);
  sections.push(`Etiket önerileri: ${plan.etiket_onerileri.join(", ")}`);

  return sections.join("\n");
}

/** Clamp a score to the 0-10 range */
function clampScore(value: unknown): number {
  const num = typeof value === "number" ? value : 0;
  return Math.max(0, Math.min(10, Math.round(num)));
}

/** Validate and normalize a single criterion */
function validateCriterion(raw: unknown): CriterionScore {
  if (!raw || typeof raw !== "object") {
    return { skor: 0, not: "Değerlendirme yapılamadı" };
  }

  const obj = raw as Record<string, unknown>;
  return {
    skor: clampScore(obj.skor),
    not: typeof obj.not === "string" && obj.not.trim()
      ? obj.not.trim()
      : "Açıklama yok",
  };
}

/** Validate the full scorecard output from the model */
function validateScorecard(raw: Record<string, unknown>): StoryPlanScorecard {
  const kriterlerRaw =
    raw.kriterler && typeof raw.kriterler === "object" && !Array.isArray(raw.kriterler)
      ? (raw.kriterler as Record<string, unknown>)
      : {};

  const kriterler = {
    tur_secimi: validateCriterion(kriterlerRaw.tur_secimi),
    ana_olgu_koruma: validateCriterion(kriterlerRaw.ana_olgu_koruma),
    kritik_detay_koruma: validateCriterion(kriterlerRaw.kritik_detay_koruma),
    kaynak_gorunurlugu: validateCriterion(kriterlerRaw.kaynak_gorunurlugu),
    teknik_operasyonel_netlik: validateCriterion(kriterlerRaw.teknik_operasyonel_netlik),
    baglam_gucu: validateCriterion(kriterlerRaw.baglam_gucu),
    haber_degeri_yogunlugu: validateCriterion(kriterlerRaw.haber_degeri_yogunlugu),
    pr_dili_riski: validateCriterion(kriterlerRaw.pr_dili_riski),
  };

  // Compute normalized total score (0-100)
  const rawSum = CRITERION_KEYS.reduce(
    (sum, key) => sum + kriterler[key].skor,
    0
  );
  const toplam_skor = Math.round((rawSum / MAX_RAW_SCORE) * 100);

  // Determine verdict based on computed score (override AI's judgment)
  const genel_karar: StoryPlanScorecard["genel_karar"] =
    rawSum >= 56 ? "Hazır" : "Revize gerekli";

  // Validate array fields
  const eksikler = Array.isArray(raw.eksikler)
    ? (raw.eksikler as unknown[]).filter((e): e is string => typeof e === "string" && e.trim() !== "")
    : [];

  const yaziya_gecmeden_once_eklenmesi_gerekenler = Array.isArray(
    raw.yaziya_gecmeden_once_eklenmesi_gerekenler
  )
    ? (raw.yaziya_gecmeden_once_eklenmesi_gerekenler as unknown[]).filter(
        (e): e is string => typeof e === "string" && e.trim() !== ""
      )
    : [];

  return {
    genel_karar,
    toplam_skor,
    kriterler,
    eksikler,
    yaziya_gecmeden_once_eklenmesi_gerekenler,
  };
}

// ── Main Function ──

export async function scoreStoryPlan(
  plan: StoryPlan
): Promise<StoryPlanScorecard> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  if (!plan.ne_oldu || !plan.tur) {
    throw new Error("Story plan eksik: tür ve ne_oldu alanları zorunlu");
  }

  const client = new OpenAI({ apiKey });
  const userMessage = buildUserMessage(plan);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1024,
    temperature: 0.2,
    messages: [
      { role: "system", content: SCORER_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "";

  // Parse JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Scorecard JSON parse edilemedi");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Scorecard JSON formatı geçersiz");
  }

  return validateScorecard(parsed);
}
