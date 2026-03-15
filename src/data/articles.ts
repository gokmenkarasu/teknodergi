import type { Article, CategorySlug } from "@/types/article";

export const articles: readonly Article[] = [
  {
    slug: "tiktok-apple-music-tam-sarki-entegrasyonu",
    title: "TikTok, Apple Music Abonelerine Uygulama İçinden Tam Şarkı Dinleme İmkânı Sunuyor",
    excerpt: "TikTok artık Apple Music abonelerinin kısa videodan tam şarkıya geçişini tek bir uygulama içinde tamamlamasına izin veriyor.",
    content: `<p><strong>TikTok</strong>, <strong>Apple Music</strong> abonelerinin şarkıları uygulama içinden tam olarak dinleyebileceği yeni bir özellik başlattı. Kullanıcılar artık bir videoda keşfettikleri şarkıyı dinlemek için TikTok'tan çıkmak zorunda kalmayacak.</p>
<h3>Keşiften Dinlemeye Tek Adım</h3>
<p>TikTok, müzik endüstrisinde zaten güçlü bir keşif kanalı. Viral olan şarkıların çoğu platformda yükselişe geçiyor. Ancak şimdiye kadar kullanıcılar tam şarkıyı dinlemek için Spotify, Apple Music veya YouTube Music'e geçmek zorundaydı. Yeni entegrasyonla bu adım ortadan kalkıyor — en azından Apple Music aboneleri için.</p>
<h3>TikTok Neden Müzik Platformuna Dönüşüyor?</h3>
<p>Hamlenin arkasında TikTok'un kullanıcıları uygulama içinde tutma stratejisi var. Keşif ile tüketim arasındaki boşluğu kapatmak, kullanıcı başına geçirilen süreyi doğrudan artırıyor. TikTok bu sayede sadece müzik keşif motoru değil, aynı zamanda dinleme platformu konumuna geçiyor.</p>
<p>Apple açısından ise ortaklık, Music servisinin erişimini genişletiyor. Spotify'a karşı abone kazanma yarışında, milyarlarca aktif kullanıcıya sahip bir sosyal platformda tam entegrasyon ciddi bir avantaj.</p>
<h3>Sektör İçin Ne Anlama Geliyor?</h3>
<p>Sosyal medya ve müzik streaming arasındaki sınırlar hızla bulanıklaşıyor. Instagram'ın Spotify entegrasyonu, YouTube'un Shorts-Music bağlantısı derken, TikTok-Apple Music ortaklığı bu trendin en somut adımlarından biri. Müzik dinleme deneyimi artık ayrı bir uygulama değil, sosyal akışın parçası haline geliyor.</p>`,
    category: "big-tech",
    coverImage: "/images/articles/tiktok-apple-music.svg",
    publishedAt: "2026-03-15T14:00:00Z",
    readingTime: 4,
    author: "TeknoDergi",
    tags: ["TikTok", "Apple Music", "müzik streaming", "entegrasyon"],
    featured: true,
  },
  {
    slug: "meta-moltbook-satin-alimi-ai-agent-ticaret",
    title: "Meta, Moltbook'u Satın Alarak Yapay Zeka Ajanlarının Yöneteceği Ticaret Altyapısına Yatırım Yapıyor",
    excerpt: "Meta'nın Moltbook satın alımı, şirketin geleceği insan kullanıcılardan çok otonom AI ajanlarının şekillendireceği bir internet vizyonuna işaret ediyor.",
    content: `<p><strong>Meta</strong>, sosyal ticaret altyapısı sunan <strong>Moltbook</strong>'u satın aldı. Anlaşma, şirketin reklam ve ticaret stratejisini köklü biçimde değiştirmeye hazırlandığının en somut göstergesi: Meta artık kullanıcılar yerine, onlar adına alışveriş yapan yapay zeka ajanlarının hâkim olacağı bir ekosisteme hazırlanıyor.</p>
<h3>Neden Moltbook?</h3>
<p>Moltbook ilk bakışta sıradan bir sosyal içerik platformu gibi görünse de asıl değeri, AI ajanlarının ticari işlemleri yürütmesine olanak tanıyan altyapısında yatıyor. Sektör analistlerinin <strong>"agentic commerce"</strong> olarak adlandırdığı bu model, otonom sistemlerin kullanıcılar adına ürün araştırması, fiyat karşılaştırması ve satın alma işlemlerini gerçekleştirmesini öngörüyor.</p>
<h3>Sosyal Ticaretten Ajan Ticaretine</h3>
<p>Meta'nın hamlesi, şirketin mevcut sosyal ticaret modelinden stratejik bir kopuşa işaret ediyor. Bugünkü sistemde kullanıcılar Instagram veya Facebook üzerinden doğrudan alışveriş yapıyor. Yeni vizyonda ise AI ajanları bu platformlarda kullanıcı gibi hareket ederek işlemleri otomatize edecek.</p>
<p>Bu dönüşüm sadece Meta'yı değil, dijital reklamcılık sektörünü de doğrudan etkiliyor. Reklamların hedef kitlesi artık insanlar değil, onların dijital temsilcileri olan AI ajanları olacak — bu da reklam modellerinin yeniden tasarlanmasını gerektiriyor.</p>
<h3>Daha Geniş Bir Trend</h3>
<p>Meta bu yarışta yalnız değil. Büyük teknoloji şirketleri, ajan tabanlı ticaretin ölçeklenebilir altyapısını kurmak için yoğun yatırım yapıyor. Moltbook satın alımı, Meta'nın bu alanda erken pozisyon almaya çalıştığını gösteriyor — ancak modelin ne zaman ve nasıl gelir üretmeye başlayacağı henüz belirsiz.</p>`,
    category: "big-tech",
    coverImage: "/images/articles/meta-moltbook.svg",
    publishedAt: "2026-03-15T10:00:00Z",
    readingTime: 5,
    author: "TeknoDergi",
    tags: ["Meta", "Moltbook", "yapay zeka", "AI ajanları", "agentic commerce"],
  },
  {
    slug: "meta-16-bin-calisan-isten-cikarma-yapay-zeka",
    title: "Meta, Yapay Zeka Harcamalarını Karşılamak İçin 16 Bin Kişiyi İşten Çıkarmayı Planlıyor",
    excerpt: "Facebook ve Instagram'ın ana şirketi Meta, çalışanlarının yüzde 20'sine varan büyük çaplı bir işten çıkarma planı üzerinde çalışıyor.",
    content: `<p>Facebook ve Instagram'ın ana şirketi Meta, çalışanlarının yüzde 20'sine varan büyük çaplı bir işten çıkarma planı üzerinde çalışıyor. Reuters'ın haberine göre şirket, yaklaşık 79 bin kişilik kadrosundan 16 bine yakın çalışanı işten çıkarmayı değerlendiriyor.</p>
<h2>Neden Bu Kadar Büyük Bir Kesinti?</h2>
<p>Kararın arkasında Meta'nın yapay zeka alanına yaptığı devasa yatırımlar yatıyor. Şirket, AI altyapısı için milyarlarca dolar harcıyor; üstüne bir de yapay zeka odaklı startup satın alımları ve yeni işe alımlar eklenince maliyet baskısı had safhaya ulaşmış durumda.</p>
<p>Meta'nın 2025'te yapay zeka altyapısına harcadığı tutar 72,2 milyar dolardı. 2026 hedefi ise 115 ila 135 milyar dolar — neredeyse iki katı.</p>
<h2>Gelirler Yükseliyor, Kadro Düşüyor</h2>
<p>Dikkat çeken nokta şu: Meta, mali açıdan hiç de kötü durumda değil. Şirketin 2025 yılı son çeyrek geliri yaklaşık 60 milyar dolar, yıllık toplam geliri ise 200 milyar doların üzerinde. Ancak Zuckerberg'in yapay zeka vizyonu, şirketi daha az çalışanla, AI destekli bir yapıya dönüştürmeyi gerektiriyor.</p>`,
    category: "big-tech",
    coverImage: "/images/articles/meta-layoffs.svg",
    publishedAt: "2026-03-14T09:00:00Z",
    readingTime: 5,
    author: "TeknoDergi",
    tags: ["Meta", "işten çıkarma", "yapay zeka", "Big Tech"],
  },
  {
    slug: "openai-gpt-5-turkiye-etkisi",
    title: "OpenAI'nin GPT-5 Modeli Türkiye'deki Yazılım Sektörünü Nasıl Etkileyecek?",
    excerpt: "OpenAI'nin yeni nesil dil modeli GPT-5'in beta sürümü yayınlandı. Türkiye'deki yazılımcılar ve startup'lar için ne anlama geliyor?",
    content: `<p>OpenAI, geçtiğimiz hafta GPT-5 modelinin beta sürümünü yayınladı. Yeni model, önceki versiyonlara kıyasla çok daha güçlü akıl yürütme yetenekleri ve çok dilli destek sunuyor.</p>
<h2>Türkiye'deki Yazılım Ekosistemi</h2>
<p>Türkiye'de yaklaşık 200.000 aktif yazılımcı bulunuyor. GPT-5'in gelişmiş Türkçe dil desteği, yerli yazılım şirketleri için önemli bir fırsat penceresi açıyor. Özellikle müşteri hizmetleri, içerik üretimi ve kod yardımcısı alanlarında büyük bir dönüşüm bekleniyor.</p>
<h2>Startup'lar İçin Fırsatlar</h2>
<p>Yeni model, özellikle Türkçe dil desteği konusunda önemli iyileştirmeler getirdi. Bu durum, Türk startup'larının küresel pazarda rekabet edebilirliğini artırabilir. AI destekli ürünler geliştiren girişimler için maliyet-performans dengesi de önemli ölçüde iyileşti.</p>`,
    category: "yapay-zeka",
    coverImage: "/images/articles/gpt5.svg",
    publishedAt: "2026-03-13T14:00:00Z",
    readingTime: 7,
    author: "TeknoDergi",
    tags: ["OpenAI", "GPT-5", "yapay zeka", "Türkiye"],
  },
  {
    slug: "apple-vision-pro-2-ozellikleri",
    title: "Apple Vision Pro 2 Tanıtıldı: Daha Hafif, Daha Güçlü ve Daha Uygun Fiyatlı",
    excerpt: "Apple'ın ikinci nesil karma gerçeklik gözlüğü Vision Pro 2, ilk modelin tüm eksikliklerini gidermeyi hedefliyor.",
    content: `<p>Apple, uzun süredir beklenen Vision Pro 2'yi bugün düzenlediği özel etkinlikte tanıttı. İkinci nesil karma gerçeklik gözlüğü, ilk modele kıyasla yüzde 40 daha hafif ve iki kat daha güçlü bir M5 çipi ile geliyor.</p>
<h2>Öne Çıkan Özellikler</h2>
<p>Vision Pro 2'nin en dikkat çeken özelliği, 1.999 dolardan başlayan fiyatıyla ilk modelin yarısı kadar bir etikete sahip olması. Apple, bu stratejiyle karma gerçeklik teknolojisini kitlesel pazara taşımayı hedefliyor.</p>
<h2>Türkiye Fiyatı ve Çıkış Tarihi</h2>
<p>Cihazın Türkiye'ye gelişi Haziran 2026 olarak planlanıyor. Türkiye fiyatının ise 85.000 TL civarında olması bekleniyor. Apple, Türkçe sesli asistan desteğini de bu modelle birlikte sunacak.</p>`,
    category: "donanim",
    coverImage: "/images/articles/vision-pro.svg",
    publishedAt: "2026-03-12T10:00:00Z",
    readingTime: 6,
    author: "TeknoDergi",
    tags: ["Apple", "Vision Pro", "karma gerçeklik", "donanım"],
  },
  {
    slug: "turkiye-yapay-zeka-startup-yatirim-rekoru",
    title: "Türk AI Startup'ları 2026'nın İlk Çeyreğinde 450 Milyon Dolar Yatırım Aldı",
    excerpt: "Türkiye'deki yapay zeka girişimleri, 2026'nın ilk üç ayında rekor seviyede yatırım çekmeyi başardı.",
    content: `<p>Türkiye'nin yapay zeka ekosistemi, 2026'nın ilk çeyreğinde ciddi bir ivme kazandı. Toplam 450 milyon dolarlık yatırım, geçen yılın aynı dönemine göre yüzde 280'lik bir artışa işaret ediyor.</p>
<h2>Öne Çıkan Yatırımlar</h2>
<p>En büyük payı, doğal dil işleme alanında çalışan bir İstanbul merkezli girişim aldı. 120 milyon dolarlık Seri B turunu Sequoia Capital liderliğinde tamamlayan şirket, Türkçe ve Arapça dil modellerinde uzmanlaşıyor.</p>
<h2>Ekosistem Nereye Gidiyor?</h2>
<p>Uzmanlar, Türkiye'nin bölgesel bir AI merkezi olma potansiyelinin altını çiziyor. Genç mühendis popülasyonu, rekabetçi maliyet yapısı ve Avrupa-Asya köprüsü konumu, yabancı yatırımcılar için cazip faktörler arasında yer alıyor.</p>`,
    category: "startup",
    coverImage: "/images/articles/ai-startup.svg",
    publishedAt: "2026-03-11T16:00:00Z",
    readingTime: 5,
    author: "TeknoDergi",
    tags: ["startup", "yatırım", "yapay zeka", "Türkiye"],
    featured: true,
  },
  {
    slug: "rust-programlama-dili-2026-trendleri",
    title: "Rust 2026'da Neden En Çok Tercih Edilen Sistem Programlama Dili Oldu?",
    excerpt: "Stack Overflow'un 2026 anketine göre Rust, art arda sekizinci kez 'en sevilen programlama dili' seçildi.",
    content: `<p>Stack Overflow'un 2026 Geliştirici Anketi sonuçları açıklandı ve Rust bir kez daha zirvede. Ama bu sefer sadece "en sevilen" değil, aynı zamanda en hızlı büyüyen dil kategorisinde de birinci oldu.</p>
<h2>Neden Rust?</h2>
<p>Bellek güvenliği garantileri, sıfır maliyetli soyutlamalar ve modern araç ekosistemi, Rust'ı sistem programlamanın geleceği olarak konumlandırıyor. Microsoft, Google ve Amazon gibi devler, kritik altyapılarını Rust'a taşımaya devam ediyor.</p>
<h2>Türkiye'de Rust Ekosistemi</h2>
<p>Türkiye'de de Rust topluluğu hızla büyüyor. İstanbul ve Ankara'da düzenli meetup'lar yapılıyor, birçok fintech ve güvenlik şirketi Rust'ı production'da kullanmaya başladı.</p>`,
    category: "yazilim",
    coverImage: "/images/articles/rust-lang.svg",
    publishedAt: "2026-03-10T11:00:00Z",
    readingTime: 6,
    author: "TeknoDergi",
    tags: ["Rust", "programlama", "yazılım", "Stack Overflow"],
  },
  {
    slug: "google-gemini-ultra-2-yapay-zeka",
    title: "Google Gemini Ultra 2 Tanıtıldı: GPT-5'e Doğrudan Rakip",
    excerpt: "Google'ın yeni yapay zeka modeli Gemini Ultra 2, benchmark testlerinde GPT-5'i geride bırakarak büyük ses getirdi.",
    content: `<p>Google DeepMind, Gemini Ultra 2 modelini resmi olarak duyurdu. Yeni model, matematik, kodlama ve çok dilli anlama testlerinde GPT-5'in önüne geçerek yapay zeka yarışını kızıştırdı.</p>
<h2>Benchmark Sonuçları</h2>
<p>Gemini Ultra 2, MMLU-Pro testinde yüzde 94,2 doğruluk oranıyla birinci sırayı aldı. Kodlama benchmarklarında ise HumanEval Plus'ta yüzde 96,8'lik bir başarı gösterdi.</p>
<h2>Fiyatlandırma ve Erişim</h2>
<p>Google, Gemini Ultra 2'yi öncelikle kurumsal müşterilere sunacak. API fiyatlandırması, GPT-5'in yaklaşık yüzde 30 altında olacak şekilde belirlendi. Bireysel kullanıcılar ise Google One AI Premium planı üzerinden erişebilecek.</p>`,
    category: "yapay-zeka",
    coverImage: "/images/articles/gemini-ultra.svg",
    publishedAt: "2026-03-09T08:00:00Z",
    readingTime: 5,
    author: "TeknoDergi",
    tags: ["Google", "Gemini", "yapay zeka", "AI yarışı"],
  },
  {
    slug: "nvidia-blackwell-ultra-gpu-tanitim",
    title: "NVIDIA Blackwell Ultra: Yapay Zeka Eğitiminde Yeni Çağ Başlıyor",
    excerpt: "NVIDIA'nın yeni nesil Blackwell Ultra GPU'ları, AI model eğitimini 3 kat hızlandırırken enerji tüketimini yarıya indiriyor.",
    content: `<p>NVIDIA CEO'su Jensen Huang, GTC 2026 konferansında Blackwell Ultra GPU mimarisini tanıttı. Yeni nesil çipler, önceki H200 serisine kıyasla yapay zeka eğitiminde 3 kat performans artışı sunuyor.</p>
<h2>Teknik Detaylar</h2>
<p>Blackwell Ultra, 208 milyar transistör içeriyor ve HBM4 bellek teknolojisini kullanan ilk GPU olma özelliğini taşıyor. Çip, 192 GB HBM4 bellek ile geliyor ve saniyede 12 TB bant genişliği sunuyor.</p>
<h2>Enerji Verimliliği</h2>
<p>En dikkat çeken gelişme enerji verimliliğinde yaşandı. Blackwell Ultra, watt başına performansta H200'ün 2,5 katı verimlilik sağlıyor. Bu, büyük veri merkezleri için milyonlarca dolarlık enerji tasarrufu anlamına geliyor.</p>`,
    category: "donanim",
    coverImage: "/images/articles/nvidia-blackwell.svg",
    publishedAt: "2026-03-08T15:00:00Z",
    readingTime: 7,
    author: "TeknoDergi",
    tags: ["NVIDIA", "Blackwell", "GPU", "yapay zeka"],
  },
  {
    slug: "microsoft-github-copilot-workspace",
    title: "Microsoft, GitHub Copilot Workspace ile Yazılım Geliştirmeyi Tamamen Değiştiriyor",
    excerpt: "GitHub Copilot'un yeni 'Workspace' özelliği, bir issue'dan tam bir pull request'e kadar tüm süreci otomatize ediyor.",
    content: `<p>Microsoft'un sahibi olduğu GitHub, Copilot Workspace'i genel kullanıma açtı. Bu yeni özellik, bir GitHub issue'sundan başlayarak plan oluşturma, kod yazma, test etme ve pull request açma süreçlerinin tamamını yapay zeka ile otomatize ediyor.</p>
<h2>Nasıl Çalışıyor?</h2>
<p>Geliştirici bir issue açtığında, Copilot Workspace otomatik olarak kod tabanını analiz ediyor, bir uygulama planı oluşturuyor ve gerekli kod değişikliklerini yapıyor. Geliştirici her adımı inceleyip onaylayabiliyor veya düzenleyebiliyor.</p>
<h2>Yazılımcıların Tepkisi</h2>
<p>Özellik, yazılım dünyasında tartışmalara neden oldu. Bazı geliştiriciler bunun verimliliği artıracağını savunurken, diğerleri junior pozisyonların tehlikeye gireceği endişesini dile getiriyor.</p>`,
    category: "yazilim",
    coverImage: "/images/articles/copilot-workspace.svg",
    publishedAt: "2026-03-07T12:00:00Z",
    readingTime: 6,
    author: "TeknoDergi",
    tags: ["Microsoft", "GitHub", "Copilot", "yazılım geliştirme"],
  },
  {
    slug: "avrupa-yapay-zeka-duzenlemesi-ai-act",
    title: "Avrupa AI Act Yürürlüğe Girdi: Teknoloji Şirketlerini Neler Bekliyor?",
    excerpt: "AB'nin kapsamlı yapay zeka düzenlemesi AI Act, 1 Mart 2026 itibarıyla tam olarak yürürlüğe girdi.",
    content: `<p>Avrupa Birliği'nin yapay zeka düzenlemesi AI Act, 1 Mart 2026 tarihinde tam kapsamıyla yürürlüğe girdi. Düzenleme, yapay zeka sistemlerini risk seviyelerine göre sınıflandırarak her kategori için farklı yükümlülükler getiriyor.</p>
<h2>Yüksek Riskli AI Sistemleri</h2>
<p>İşe alım, kredi değerlendirmesi ve sağlık tanı sistemleri gibi alanlarda kullanılan yapay zeka uygulamaları artık sıkı denetim altında. Bu sistemlerin şeffaflık raporları sunması, insan denetimi mekanizmaları bulundurması ve düzenli güvenlik testlerinden geçmesi zorunlu hale geldi.</p>
<h2>Türk Şirketlerine Etkisi</h2>
<p>AB pazarında faaliyet gösteren Türk teknoloji şirketleri de bu düzenlemeden doğrudan etkileniyor. Özellikle Avrupa'ya AI ürünleri ihraç eden girişimlerin uyum süreçlerini hızlandırması gerekiyor.</p>`,
    category: "big-tech",
    coverImage: "/images/articles/eu-ai-act.svg",
    publishedAt: "2026-03-06T09:00:00Z",
    readingTime: 8,
    author: "TeknoDergi",
    tags: ["AB", "AI Act", "düzenleme", "yapay zeka"],
  },
  {
    slug: "getir-yapay-zeka-lojistik-optimizasyonu",
    title: "Getir, Yapay Zeka ile Teslimat Sürelerini Yüzde 35 Kısalttı",
    excerpt: "Getir'in geliştirdiği AI tabanlı rotalama sistemi, teslimat sürelerini önemli ölçüde düşürmeyi başardı.",
    content: `<p>Türkiye'nin en büyük hızlı teslimat platformu Getir, kendi geliştirdiği yapay zeka tabanlı lojistik optimizasyon sistemiyle teslimat sürelerini ortalama yüzde 35 kısaltmayı başardı.</p>
<h2>Sistem Nasıl Çalışıyor?</h2>
<p>Getir'in AI sistemi, gerçek zamanlı trafik verileri, hava durumu, sipariş yoğunluğu ve kurye konumlarını analiz ederek en optimal teslimat rotalarını hesaplıyor. Sistem, her 30 saniyede bir rotaları yeniden optimize ediyor.</p>
<h2>Küresel Genişleme Planları</h2>
<p>Getir CEO'su, bu teknolojinin şirketin küresel genişleme stratejisinin temel taşı olacağını açıkladı. Sistem, şu anda İstanbul, Ankara ve İzmir'de aktif kullanılıyor ve yıl sonuna kadar tüm operasyon ülkelerine yaygınlaştırılacak.</p>`,
    category: "startup",
    coverImage: "/images/articles/getir-ai.svg",
    publishedAt: "2026-03-05T13:00:00Z",
    readingTime: 5,
    author: "TeknoDergi",
    tags: ["Getir", "yapay zeka", "lojistik", "startup"],
  },
] as const;

export function getAllArticles(): readonly Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: CategorySlug): readonly Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getFeaturedArticle(): Article | undefined {
  return getAllArticles().find((a) => a.featured);
}

export function getRelatedArticles(article: Article, limit = 3): readonly Article[] {
  return getAllArticles()
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, limit);
}
