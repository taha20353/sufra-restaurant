// بيانات المطعم والمنيو — عدّل هنا بس عشان تغيّر الأصناف والأسعار والأرقام
const RESTAURANT = {
  name: "سُفرة",
  // رقم تجريبي: غيّره لرقم واتساب المطعم بالصيغة الدولية من غير + (مثال: 2010xxxxxxxx)
  whatsapp: "201000000000",
  phone: "0100 000 0000",
  address: "شارع التسعين الجنوبي، التجمع الخامس، القاهرة",
  mapQuery: "التجمع الخامس القاهرة",
  deliveryFee: 25,
  freeDeliveryOver: 300,
  hours: [
    ["السبت – الخميس", "12 ظهراً – 1 صباحاً"],
    ["الجمعة", "2 ظهراً – 2 صباحاً"],
  ],
};

const CATEGORIES = [
  { id: "all", name: "الكل" },
  { id: "grill", name: "مشويات" },
  { id: "starters", name: "مقبلات" },
  { id: "mains", name: "أطباق رئيسية" },
  { id: "desserts", name: "حلويات" },
  { id: "drinks", name: "مشروبات" },
];

const MENU = [
  { id: 1, cat: "grill", name: "كفتة مشوية على الفحم", desc: "ربع كيلو كفتة بلدي متبّلة، مع عيش وطحينة وسلطة", price: 210, img: "kofta", tags: ["popular"] },
  { id: 2, cat: "grill", name: "كباب ضاني", desc: "ربع كيلو كباب ضاني طري مع بطاطس وبصل بالسماق", price: 280, img: "skewers", tags: [] },
  { id: 3, cat: "grill", name: "شيش طاووق", desc: "صدور فراخ متبّلة بالزبادي والليمون مع فلفل ألوان", price: 190, img: "kebab", tags: ["popular"] },
  { id: 4, cat: "grill", name: "فراخ مشوية على الفحم", desc: "نص فرخة متبّلة بخلطة سُفرة مع رز وثومية", price: 220, img: "grilled-chicken", tags: [] },
  { id: 5, cat: "grill", name: "كفتة حاتي", desc: "كفتة على الطريقة الحاتي مع فلفل مشوي وعيش بلدي", price: 230, img: "kofta-plate", tags: ["spicy"] },

  { id: 6, cat: "starters", name: "حمص بالطحينة", desc: "حمص كريمي بزيت الزيتون والبابريكا", price: 65, img: "hummus", tags: [] },
  { id: 7, cat: "starters", name: "طعمية بلدي", desc: "6 أقراص طعمية مقرمشة مع مخلل وطحينة", price: 45, img: "falafel", tags: ["popular"] },
  { id: 8, cat: "starters", name: "سلطة سُفرة", desc: "خضار طازة، جرجير، رمان وصوص ليمون", price: 50, img: "salad", tags: [] },
  { id: 9, cat: "starters", name: "مزة سُفرة المشكلة", desc: "حمص، بابا غنوج، محمرة، لبنة وعيش شامي", price: 160, img: "mezze", tags: [] },

  { id: 10, cat: "mains", name: "فراخ بالرز البسمتي", desc: "ربع فرخة بالبهارات على رز بسمتي مع صوص الطماطم", price: 230, img: "chicken-rice", tags: [] },
  { id: 11, cat: "mains", name: "مندي لحم", desc: "لحم ضاني مطهو على البطيء فوق رز المندي", price: 340, img: "mandi", tags: ["popular"] },
  { id: 12, cat: "mains", name: "شاورما فراخ عربي", desc: "شاورما ملفوفة في عيش صاج مع ثومية ومخلل وبطاطس", price: 95, img: "shawarma", tags: [] },
  { id: 13, cat: "mains", name: "طبق سُفرة المشكل", desc: "شاورما، طعمية، حمص، تبولة وعيش — يكفي فردين", price: 380, img: "platter", tags: ["popular"] },
  { id: 14, cat: "mains", name: "طبق الشيف", desc: "اختيار الشيف اليومي من المشويات والسلطات", price: 260, img: "dish", tags: [] },

  { id: 15, cat: "desserts", name: "بقلاوة بالمكسرات", desc: "6 قطع بقلاوة طازة بالفستق والعسل", price: 120, img: "baklava", tags: [] },
  { id: 16, cat: "desserts", name: "كنافة بالفستق", desc: "كنافة شعر مقرمشة محشية قشطة ومزينة بالفستق", price: 140, img: "kunafa", tags: ["popular"] },

  { id: 17, cat: "drinks", name: "ليمون بالنعناع", desc: "ليمون فريش مع نعناع وثلج", price: 55, img: "lemon-mint", tags: [] },
  { id: 18, cat: "drinks", name: "قهوة عربي", desc: "دلّة قهوة عربي بالهيل تكفي 3 فناجين", price: 70, img: "coffee", tags: [] },
];

const OFFERS = [
  {
    id: "family", title: "عرض العيلة", badge: "لـ 4 أفراد",
    desc: "نص كيلو مشكل مشويات + 3 مقبلات + رز + 4 مشروبات",
    price: 650, old: 820, img: "platter",
  },
  {
    id: "lunch", title: "وجبة الغدا", badge: "من 12 لـ 5 العصر",
    desc: "أي طبق مشويات فردي + سلطة + مشروب",
    price: 199, old: 260, img: "kofta",
  },
  {
    id: "sweet", title: "حلّي بُقّك", badge: "مع أي طلب",
    desc: "كنافة بالفستق + 2 قهوة عربي",
    price: 170, old: 210, img: "kunafa",
  },
];

const REVIEWS = [
  { name: "أحمد م.", text: "الكفتة على الفحم بجد من أحلى اللي أكلتها، والتوصيل جه سخن في أقل من ساعة.", stars: 5 },
  { name: "سارة ع.", text: "حجزت ترابيزة لعيد ميلاد ماما من الموقع في دقيقة، والمكان والخدمة كانوا ممتازين.", stars: 5 },
  { name: "محمود ك.", text: "عرض العيلة كفّانا إحنا الخمسة، والأسعار معقولة جداً مقارنة بالكمية.", stars: 4 },
];
