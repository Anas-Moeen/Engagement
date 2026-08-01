/**
 * ملف المحتوى الوحيد — كل ما يمكن تعديله في الموقع موجود هنا.
 *
 * THE ONLY FILE YOU NEED TO EDIT.
 * Every name, date, phone number, path and piece of text on the site is read
 * from this file. No component contains hard-coded content.
 */

/* ─────────────────────────── الروابط والنطاق ─────────────────────────── */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anas-aya.com'
).replace(/\/$/, '');

/* ─────────────────────────── العروسان ─────────────────────────── */

export const couple = {
  bride: { first: ' أنس ', full: ' أنس ' },
  groom: { first: ' آية ', full: ' آية ' },
  /** يظهر في الشعار والأيقونة */
  monogram: 'A & A',
} as const;

/* ─────────────────────────── المناسبة ─────────────────────────── */

export const event = {
  /** ISO 8601 مع فرق التوقيت — لكي يكون العدّ التنازلي واحداً في كل الأجهزة */
  startsAt: '2026-08-08T17:30:00+03:00',
  endsAt: '2026-08-08T19:00:00+03:00',

  hijriLabel: '٢٥ صفر ١٤٤٨ هـ',
  dateLabel: 'السبت ٨ آب ٢٠٢٦',
  timeLabel: 'الخامسة مساءً',

  venue: {
    name: 'قاعات البادي للإحتفالات',
    hall: '',
    address: 'ماركا، شارع الحزام، دخلة المغيرات، عمان',
    city: 'عمان',
    /** رابط خرائط جوجل — استبدله برابط موقعك */
    mapsUrl: 'https://maps.app.goo.gl/dzEf3tkgWN7GrwRy6',
    /** الإحداثيات تُستخدم للخريطة المصغّرة داخل الصفحة */
    lat: 31.9719, 
    lng: 36.0110,
    parkingNote: '',
  },
} as const;

/* ─────────────────────────── برنامج الحفل ─────────────────────────── */

export const timeline = [
  { time: '', title: '', detail: '' },
  { time: '05:00', title: 'تجمع أهل العروس ', detail: 'قاعة الحفل' },
  { time: '05:15', title: 'تجمع أهل العريس ', detail: 'قاعة الحفل' },
  { time: '05:30', title: 'بداية الجاهة - الحفل', detail: '' },
  { time: '07:30', title: 'نهاية الحفل', detail: '' },
] as const;

/* ─────────────────────────── تأكيد الحضور ─────────────────────────── */

export const rsvp = {
  deadlineLabel: 'نرجو تأكيد الحضور قبل ١٠ أكتوبر',
  maxGuests: 6,
} as const;

/* ─────────────────────────── للتواصل ─────────────────────────── */

export const contacts = [
  { name: 'معين عسيله', role: 'والد العريس', phone: '+962786391654' },
  { name: 'علي الجلامنه', role: 'والد العروس ', phone: '+962795534336' },
] as const;

/* ─────────────────────────── الوسائط ─────────────────────────── */

export const media = {
  /**
   * فيديو الخلفية — نسختان: أفقية للحاسوب، وعمودية للجوال.
   * Two crops so neither device gets a letterboxed or over-zoomed frame.
   * اجعله null لاستخدام الخلفية المتحركة بدل الفيديو.
   */
  heroVideo: {
    landscape: '/assets/video/hero-landscape.mp4',
    portrait: '/assets/video/hero-portrait.mp4',
  } as { landscape: string; portrait: string } | null,

  /** الصورة الثابتة التي تظهر ريثما يُحمّل الفيديو */
  heroPoster: {
    landscape: '/assets/images/hero-landscape-poster.jpg',
    portrait: '/assets/images/hero-portrait-poster.jpg',
  },

  /** الموسيقى — ضع ملفك في: public/assets/audio/theme.mp3 */
  music: {
    src: '/assets/audio/theme.mp3',
    title: 'مقطوعة الفرح',
    /** مستوى الصوت الافتراضي من ٠ إلى ١ */
    defaultVolume: 0.37 as number,
    /**
     * تشغيل الموسيقى تلقائياً عند أول لمسة من الزائر.
     * اجعله false ليبدأ الصوت فقط عند الضغط على زر التشغيل.
     */
    autoplay: true,
  },
} as const;

/* ─────────────────────────── نصوص الواجهة ─────────────────────────── */

export const ui = {
  hero: {
    eyebrow: 'بسم الله الرحمن الرحيم',
    intro: 'بكل الحبّ والامتنان، ندعوكم لمشاركتنا فرحة',
    occasion: 'حفل خطوبتنا',
    and: 'و',
    scroll: 'مرر للأسفل',
    verse: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا',
  },

  nav: {
    details: 'التفاصيل',
    program: 'البرنامج',
    location: 'الموقع',
    rsvp: 'تأكيد الحضور',
    toTop: 'العودة للأعلى',
  },

  details: {
    eyebrow: 'الدعوة',
    title: 'مساءٌ واحد، وفرحٌ يجمعنا',
    lede: '',
    date: 'التاريخ',
    time: 'الوقت',
    place: 'المكان',
  },

  countdown: {
    eyebrow: 'العدّ التنازلي',
    title: 'باقٍ على لقائنا',
    days: 'يوم',
    day: 'يوم',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    today: 'اليوم هو الموعد',
    remaining: 'الوقت المتبقي حتى بدء الحفل',
  },

  timeline: {
    eyebrow: '',
    title: 'برنامج المساء',
    lede: 'تفضّلوا في أي وقت، أهلاً وسهلاً, حيَّاكم الله.',
  },

  location: {
    eyebrow: 'أين نلتقي',
    title: 'موقع الحفل',
    lede: 'اضغط على الزر ليفتح الموقع مباشرة في تطبيق الخرائط.',
    openMaps: 'افتح في خرائط جوجل',
    mapTitle: 'خريطة موقع الحفل',
  },

  rsvp: {
    eyebrow: 'الرد على الدعوة',
    title: 'هل ستشرّفوننا؟',
    name: 'الاسم الكريم',
    phone: 'رقم الجوال',
    question: 'هل ستحضر؟',
    yes: 'بكل سرور، نعم',
    no: 'للأسف، لا أستطيع',
    guests: 'عدد الحضور',
    guestOne: 'ضيف واحد',
    guestMany: 'ضيوف',
    note: 'رسالة لنا',
    optional: '(اختياري)',
    submit: 'إرسال الرد',
    sending: 'جارٍ الإرسال',
    successYes: 'وصلنا ردّكم، وسنرسل التفاصيل النهائية قبل الموعد بأسبوع.',
    successNo: 'سنفتقد وجودكم، وشكراً لإعلامنا.',
    successTitleYes: 'أسعدتمونا',
    successTitleNo: 'شكراً لكم',
    errorRead: 'تعذّرت قراءة الرد، حاول مرة أخرى.',
    errorFields: 'أدخل الاسم ورقم الجوال.',
    errorChoice: 'اختر ما إذا كنت ستحضر.',
    errorGeneric: 'حدث خطأ، حاول مرة أخرى.',
  },

  share: {
    eyebrow: '',
    title: 'مشاركة الدعوة',
    lede: 'دعوتكم تسعدنا، وحضوركم يُكمل فرحتنا.',
    whatsapp: 'مشاركة عبر واتساب',
    telegram: 'مشاركة عبر تيليجرام',
    copy: 'نسخ الرابط',
    copied: 'تم النسخ',
    more: 'مشاركة أخرى',
  },

  contact: {
    eyebrow: 'لأي استفسار',
    title: 'تواصلوا معنا',
    lede: 'الطريق، أو الترتيبات، أو أي سؤال — سيسعدون بمساعدتكم.',
    call: 'اتصال',
    chat: 'واتساب',
  },

  music: {
    label: 'الموسيقى',
    playing: 'قيد التشغيل',
    paused: 'متوقفة',
    play: 'تشغيل الموسيقى',
    pause: 'إيقاف الموسيقى',
    volume: 'مستوى الصوت',
    mute: 'كتم الصوت',
    unmute: 'إلغاء الكتم',
    open: 'فتح مشغّل الموسيقى',
    close: 'إغلاق المشغّل',
  },

  footer: {
    thanks: 'شكراً لكونكم جزءاً من فرحنا.',
  },
} as const;

/* ─────────────────────────── تحسين محركات البحث والمشاركة ─────────────────────────── */

export const seo = {
  locale: 'ar_SA',
  title: `${couple.bride.first} و ${couple.groom.first} — حفل الخطوبة`,
  /** أقل من ١١٠ حرفاً — واتساب وتيليجرام يقصّان ما زاد */
  description: `يسعدنا حضوركم حفل خطوبتنا يوم السبت ٨ آب ٢٠٢٦ في ${event.venue.name} - عمان.`,
  shareMessage: `دعوة حضور حفل خطوبة ${couple.bride.first} و ${couple.groom.first} — السبت ٨ آب ٢٠٢٦:`,
  ogImageAlt: `دعوة حفل خطوبة ${couple.bride.first} و ${couple.groom.first}`,
  keywords: [
    'دعوة خطوبة',
    'حفل خطوبة',
    `${couple.bride.first} و ${couple.groom.first}`,
    event.venue.name,
    'دعوة إلكترونية',
  ],
} as const;

/* ─────────────────────────── إعدادات العرض ─────────────────────────── */

export const settings = {
  /** استخدام الأرقام العربية (٠١٢٣) بدل (0123) */
  arabicNumerals: true,
  /** تعتيم فيديو الخلفية — كلما زاد الرقم زادت قراءة النص */
  videoOverlayOpacity: 0.72,
  /**
   * شفافية الأقسام فوق الفيديو (٠ = شفاف تماماً، ١ = معتم).
   * الفيديو يظهر خلف الصفحة كاملة، وهذا يتحكم بمقدار ظهوره.
   */
  sectionOpacity: 0.78,
} as const;
