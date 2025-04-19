// قائمة من الأسئلة المقترحة المرتبطة بمواضيع محددة
const topicSuggestions: Record<string, string[]> = {
  تخصص: [
    "ما هي شروط القبول في تخصص الطب؟",
    "ما هي المواد المطلوبة لتخصص الهندسة؟",
    "ما هي فرص العمل لتخصص إدارة الأعمال؟",
    "ما هي الجامعات التي تقدم تخصص تقنية المعلومات؟",
    "كيف يتم احتساب النسبة الموزونة لتخصص الطب؟",
    "ما هي التخصصات المطلوبة في سوق العمل؟",
    "ما هي البعثات المتاحة لتخصص الهندسة؟",
    "ما هي مجالات العمل بعد التخرج من تخصص العلوم؟",
  ],
  بعثة: [
    "ما هي شروط الحصول على البعثات الخارجية؟",
    "ما هي أنواع البعثات المتاحة؟",
    "كيف يتم احتساب النسبة الموزونة للبعثات؟",
    "متى يبدأ التسجيل للبعثات الداخلية؟",
    "ما هي الدول المتاحة للبعثات الخارجية؟",
    "ما هي المخصصات المالية للبعثات الخارجية؟",
    "هل يمكن تغيير التخصص أثناء البعثة؟",
    "ما الفرق بين البعثة الداخلية والمنحة الداخلية؟",
  ],
  تسجيل: [
    "ما هي خطوات التسجيل في نظام القبول الموحد؟",
    "ما هي المستندات المطلوبة للتسجيل؟",
    "متى يبدأ التسجيل في نظام القبول الموحد؟",
    "كيف يمكنني تعديل اختياراتي بعد التسجيل؟",
    "هل يمكن التسجيل بعد انتهاء الفترة المحددة؟",
    "كم عدد البرامج التي يمكنني اختيارها عند التسجيل؟",
    "كيف أتأكد من اكتمال تسجيلي في النظام؟",
    "ما هي رسوم التسجيل في نظام القبول الموحد؟",
  ],
  قبول: [
    "ما هي مراحل القبول الموحد؟",
    "كيف يتم الفرز في نظام القبول الموحد؟",
    "متى تظهر نتائج القبول؟",
    "ما هي المعايير العامة للقبول؟",
    "ماذا يحدث إذا لم أقبل في أي من اختياراتي؟",
    "هل يمكنني رفض العرض المقدم لي والانتظار للفرز الثاني؟",
    "كيف أعرف أنني قبلت في إحدى البرامج؟",
    "ما هي خطوات تأكيد القبول بعد ظهور النتائج؟",
  ],
  كلية: [
    "ما هي الكليات الحكومية في سلطنة عمان؟",
    "ما هي الكليات الخاصة المعتمدة؟",
    "ما هي شروط القبول في كلية العلوم الشرعية؟",
    "ما هي التخصصات المتاحة في كلية التقنية؟",
    "أين تقع كلية العلوم التطبيقية؟",
    "ما هي رسوم الدراسة في الكليات الخاصة؟",
    "هل توفر الكليات سكنًا للطلبة؟",
    "ما هي الكليات التي تقدم تخصص الطب في عمان؟",
  ],
  جامعة: [
    "ما هي شروط القبول في جامعة السلطان قابوس؟",
    "ما هي التخصصات المتاحة في جامعة نزوى؟",
    "ما هي الجامعات الخاصة المعتمدة في عمان؟",
    "كيف يتم التقديم للجامعات الخارجية؟",
    "ما هي رسوم الدراسة في جامعة ظفار؟",
    "هل توفر جامعة السلطان قابوس سكنًا للطلبة؟",
    "ما هي البرامج المتاحة في الجامعة الألمانية للتكنولوجيا؟",
    "كيف يمكنني الحصول على منحة دراسية في جامعة صحار؟",
  ],
  نسبة: [
    "كيف يتم احتساب النسبة الموزونة؟",
    "ما هي النسبة المطلوبة لتخصص الطب؟",
    "ما هي النسبة المطلوبة للبعثات الخارجية؟",
    "هل يمكن تحسين النسبة الموزونة؟",
    "ما هي المواد التي تدخل في حساب النسبة الموزونة للهندسة؟",
    "كيف تؤثر درجات المواد المختلفة على النسبة الموزونة؟",
    "ما هي النسبة المطلوبة للقبول في كلية العلوم الصحية؟",
    "هل تختلف طريقة حساب النسبة الموزونة بين التخصصات المختلفة؟",
  ],
  مواعيد: [
    "متى يبدأ التسجيل في نظام القبول الموحد؟",
    "متى تظهر نتائج الفرز الأول؟",
    "متى يبدأ الفرز الثاني؟",
    "ما هي المواعيد المهمة في التقويم السنوي للقبول الموحد؟",
    "متى تبدأ الدراسة في الجامعات والكليات؟",
    "ما هو آخر موعد لتأكيد القبول بعد ظهور النتائج؟",
    "متى يمكنني تعديل اختياراتي في نظام القبول الموحد؟",
    "ما هي فترة تقديم طلبات الاستثناء؟",
  ],
  كلمة_المرور: [
    "كيف يمكنني استعادة كلمة المرور المنسية؟",
    "ما هي خطوات تغيير كلمة المرور؟",
    "ماذا أفعل إذا لم أتمكن من استعادة كلمة المرور؟",
    "كيف أحافظ على أمان كلمة المرور الخاصة بي؟",
    "ما هي متطلبات كلمة المرور القوية في نظام القبول الموحد؟",
    "هل يمكنني استخدام نفس كلمة المرور من العام الماضي؟",
    "كيف أتواصل مع الدعم الفني إذا نسيت كلمة المرور ورقم الهاتف؟",
    "ما هي الخطوات إذا تم اختراق حسابي؟",
  ],
  توجيه: [
    "كيف أختار التخصص المناسب لميولي؟",
    "ما هي التخصصات المطلوبة في سوق العمل؟",
    "كيف أوازن بين ميولي وفرص العمل المستقبلية؟",
    "ما هي نصائحك لاختيار التخصص المناسب؟",
    "كيف أعرف التخصص المناسب لقدراتي؟",
    "ما هي المهارات المطلوبة للنجاح في تخصص الهندسة؟",
    "ما هي مجالات العمل المتاحة بعد دراسة تخصص العلوم؟",
    "كيف أستعد للدراسة الجامعية؟",
  ],
  منحة: [
    "ما هي أنواع المنح الدراسية المتاحة؟",
    "ما الفرق بين المنحة الكاملة والجزئية؟",
    "ما هي شروط الحصول على المنح الداخلية؟",
    "هل يمكن الجمع بين منحتين دراسيتين؟",
    "ما هي المخصصات المالية للمنح الداخلية الكاملة؟",
    "هل يمكن تحويل المنحة الداخلية إلى بعثة خارجية؟",
    "ما هي الجهات التي تقدم منحًا دراسية في عمان؟",
    "كيف أتقدم للحصول على منحة دراسية خاصة؟",
  ],
  فرز: [
    "كيف تتم عملية الفرز في نظام القبول الموحد؟",
    "متى تظهر نتائج الفرز الأول؟",
    "ما هي معايير الفرز بين المتقدمين؟",
    "ماذا يحدث إذا لم أقبل في الفرز الأول؟",
    "كيف أعرف نتيجة الفرز الخاصة بي؟",
    "هل يمكنني تغيير اختياراتي بعد الفرز الأول؟",
    "ما هي فرص القبول في الفرز الثاني؟",
    "كم عدد مراحل الفرز في نظام القبول الموحد؟",
  ],
  اختبار: [
    "هل هناك اختبارات قبول للتخصصات الطبية؟",
    "متى تقام اختبارات القبول للكليات؟",
    "ما هي طبيعة اختبارات القدرات؟",
    "كيف أستعد لاختبارات القبول؟",
    "هل اختبارات القبول إلزامية لجميع التخصصات؟",
    "ما هي المواد التي يشملها اختبار القبول للطب؟",
    "هل يمكن إعادة اختبار القبول إذا لم أجتزه؟",
    "كيف تؤثر نتيجة اختبار القبول على فرص القبول؟",
  ],
  مقابلة: [
    "ما هي التخصصات التي تتطلب مقابلة شخصية؟",
    "كيف أستعد للمقابلة الشخصية؟",
    "ما هي الأسئلة المتوقعة في مقابلة القبول؟",
    "متى تجرى المقابلات الشخصية للقبول؟",
    "كيف تؤثر المقابلة الشخصية على فرص القبول؟",
    "ماذا يجب أن أرتدي في المقابلة الشخصية؟",
    "هل المقابلة الشخصية باللغة العربية أم الإنجليزية؟",
    "ما هي المهارات التي يبحث عنها المقابلون؟",
  ],
}

// الكلمات المفتاحية العامة وأسئلتها المقترحة
const generalSuggestions: string[] = [
  "ما هي خطوات التسجيل في نظام القبول الموحد؟",
  "كيف يتم احتساب النسبة الموزونة؟",
  "ما هي مراحل القبول الموحد؟",
  "ما هي أنواع البعثات المتاحة؟",
  "ما هي المواعيد المهمة في التقويم السنوي للقبول الموحد؟",
  "كيف أختار التخصص المناسب لميولي وقدراتي؟",
  "ما هي المستندات المطلوبة للتسجيل في نظام القبول الموحد؟",
  "كيف يمكنني استعادة كلمة المرور المنسية؟",
]

// تصنيف الأسئلة حسب المرحلة في عملية القبول
const stageSuggestions: Record<string, string[]> = {
  قبل_التسجيل: [
    "متى يبدأ التسجيل في نظام القبول الموحد؟",
    "ما هي المستندات المطلوبة للتسجيل؟",
    "كيف أختار التخصص المناسب لميولي؟",
    "ما هي التخصصات المتاحة في الجامعات العمانية؟",
  ],
  أثناء_التسجيل: [
    "كيف أرتب اختياراتي بشكل صحيح؟",
    "كم عدد البرامج التي يمكنني اختيارها؟",
    "هل يمكنني تعديل اختياراتي بعد التسجيل؟",
    "كيف أتأكد من اكتمال تسجيلي في النظام؟",
  ],
  بعد_التسجيل: [
    "متى تظهر نتائج الفرز الأول؟",
    "كيف أعرف نتيجة قبولي؟",
    "ماذا أفعل إذا لم أقبل في أي من اختياراتي؟",
    "ما هي خطوات تأكيد القبول بعد ظهور النتائج؟",
  ],
  بعد_القبول: [
    "ما هي إجراءات التسجيل في المؤسسة التعليمية بعد القبول؟",
    "متى تبدأ الدراسة في الجامعات والكليات؟",
    "هل يمكنني تأجيل القبول للعام القادم؟",
    "ما هي المستندات المطلوبة للتسجيل في المؤسسة التعليمية؟",
  ],
}

// تصنيف الأسئلة حسب نوع المستخدم
const userTypeSuggestions: Record<string, string[]> = {
  طالب_متفوق: [
    "ما هي البعثات المخصصة للطلبة المتفوقين؟",
    "ما هي شروط القبول في تخصص الطب؟",
    "ما هي فرص الابتعاث للجامعات المرموقة عالمياً؟",
    "هل هناك منح تميز للطلبة المتفوقين؟",
  ],
  طالب_متوسط: [
    "ما هي التخصصات المناسبة لمعدلي المتوسط؟",
    "ما هي فرص القبول في الكليات التقنية؟",
    "ما هي البدائل المتاحة إذا لم أقبل في اختياراتي الأولى؟",
    "ما هي التخصصات المطلوبة في سوق العمل ولا تتطلب معدلات عالية؟",
  ],
  ذوي_احتياجات_خاصة: [
    "ما هي التسهيلات المقدمة لذوي الاحتياجات الخاصة؟",
    "هل هناك مقاعد مخصصة لذوي الاحتياجات الخاصة؟",
    "ما هي المؤسسات التعليمية المهيأة لاستقبال ذوي الاحتياجات الخاصة؟",
    "ما هي إجراءات التقديم الخاصة بذوي الاحتياجات الخاصة؟",
  ],
  طالب_ضمان_اجتماعي: [
    "ما هي المنح المخصصة لطلبة الضمان الاجتماعي؟",
    "ما هي المستندات الإضافية المطلوبة لطلبة الضمان الاجتماعي؟",
    "هل هناك مقاعد مخصصة لطلبة الضمان الاجتماعي؟",
    "ما هي المخصصات المالية الإضافية لطلبة الضمان الاجتماعي؟",
  ],
}

// كلمات مفتاحية بديلة للمساعدة في تحديد المواضيع
const alternativeKeywords: Record<string, string[]> = {
  تخصص: ["مجال", "دراسة", "برنامج", "فرع", "قسم", "مسار"],
  بعثة: ["منحة", "ابتعاث", "دراسة بالخارج", "مقعد دراسي"],
  تسجيل: ["التحاق", "تقديم", "اشتراك", "إدخال البيانات"],
  قبول: ["التحاق", "استيعاب", "دخول", "قبولات"],
  كلية: ["معهد", "مؤسسة تعليمية", "مركز"],
  جامعة: ["كلية", "مؤسسة تعليم عالي", "أكاديمية"],
  نسبة: ["معدل", "درجة", "علامة", "تقدير", "نتيجة"],
  مواعيد: ["تواريخ", "أوقات", "فترات", "جدول زمني"],
  كلمة_المرور: ["باسورد", "كلمة السر", "رمز الدخول", "رقم سري"],
  توجيه: ["إرشاد", "نصيحة", "مساعدة", "توجيه مهني"],
  منحة: ["بعثة", "مساعدة مالية", "تمويل دراسي", "مقعد مدفوع"],
  فرز: ["تصنيف", "ترتيب", "اختيار", "انتقاء", "توزيع"],
  اختبار: ["امتحان", "فحص", "تقييم", "اختبار قبول", "اختبار قدرات"],
  مقابلة: ["لقاء", "مقابلة شخصية", "اختبار شفهي", "مقابلة قبول"],
}

// تخزين سجل المحادثة وتفضيلات المستخدم
interface ConversationContext {
  recentTopics: string[] // المواضيع الأخيرة التي تمت مناقشتها
  userInterests: string[] // اهتمامات المستخدم المستنتجة
  userType: string | null // نوع المستخدم (متفوق، متوسط، إلخ)
  stage: string | null // مرحلة المستخدم في عملية القبول
  clickedSuggestions: string[] // الاقتراحات التي نقر عليها المستخدم
  lastQuestionTimestamp: number // توقيت آخر سؤال
}

// إنشاء سياق محادثة افتراضي
const defaultContext: ConversationContext = {
  recentTopics: [],
  userInterests: [],
  userType: null,
  stage: null,
  clickedSuggestions: [],
  lastQuestionTimestamp: Date.now(),
}

// تخزين سياق المحادثة
let conversationContext: ConversationContext = { ...defaultContext }

// وظيفة لتحديث سياق المحادثة بناءً على سؤال المستخدم
function updateConversationContext(userQuestion: string, isClicked = false): void {
  const lowerQuestion = userQuestion.toLowerCase()

  // تحديث توقيت آخر سؤال
  conversationContext.lastQuestionTimestamp = Date.now()

  // إذا كان السؤال من اقتراح تم النقر عليه، أضفه إلى قائمة الاقتراحات المنقورة
  if (isClicked && !conversationContext.clickedSuggestions.includes(userQuestion)) {
    conversationContext.clickedSuggestions.push(userQuestion)
    // الاحتفاظ بآخر 5 اقتراحات فقط
    if (conversationContext.clickedSuggestions.length > 5) {
      conversationContext.clickedSuggestions.shift()
    }
  }

  // تحديد المواضيع في السؤال
  const detectedTopics: string[] = []

  // البحث عن المواضيع باستخدام الكلمات المفتاحية والبدائل
  for (const [topic, alternatives] of Object.entries(alternativeKeywords)) {
    if (
      lowerQuestion.includes(topic) ||
      alternatives.some((alt) => lowerQuestion.includes(alt)) ||
      (topic === "كلمة_المرور" &&
        (lowerQuestion.includes("كلمة المرور") ||
          lowerQuestion.includes("كلمة السر") ||
          lowerQuestion.includes("باسورد")))
    ) {
      detectedTopics.push(topic)
    }
  }

  // تحديث المواضيع الأخيرة
  if (detectedTopics.length > 0) {
    // إضافة المواضيع الجديدة في بداية القائمة
    conversationContext.recentTopics = [...detectedTopics, ...conversationContext.recentTopics]
    // إزالة التكرارات
    conversationContext.recentTopics = [...new Set(conversationContext.recentTopics)]
    // الاحتفاظ بآخر 5 مواضيع فقط
    if (conversationContext.recentTopics.length > 5) {
      conversationContext.recentTopics = conversationContext.recentTopics.slice(0, 5)
    }
  }

  // تحديد نوع المستخدم
  if (lowerQuestion.includes("متفوق") || lowerQuestion.includes("معدل عالي") || lowerQuestion.includes("الأول")) {
    conversationContext.userType = "طالب_متفوق"
  } else if (
    lowerQuestion.includes("متوسط") ||
    lowerQuestion.includes("معدل متوسط") ||
    lowerQuestion.includes("ليس مرتفع")
  ) {
    conversationContext.userType = "طالب_متوسط"
  } else if (
    lowerQuestion.includes("إعاقة") ||
    lowerQuestion.includes("احتياجات خاصة") ||
    lowerQuestion.includes("ذوي الهمم")
  ) {
    conversationContext.userType = "ذوي_احتياجات_خاصة"
  } else if (
    lowerQuestion.includes("ضمان") ||
    lowerQuestion.includes("ضمان اجتماعي") ||
    lowerQuestion.includes("دخل محدود")
  ) {
    conversationContext.userType = "طالب_ضمان_اجتماعي"
  }

  // تحديد مرحلة المستخدم في عملية القبول
  if (
    lowerQuestion.includes("متى يبدأ التسجيل") ||
    lowerQuestion.includes("قبل التسجيل") ||
    lowerQuestion.includes("استعد للتسجيل")
  ) {
    conversationContext.stage = "قبل_التسجيل"
  } else if (
    lowerQuestion.includes("كيفية التسجيل") ||
    lowerQuestion.includes("أثناء التسجيل") ||
    lowerQuestion.includes("تعديل الاختيارات")
  ) {
    conversationContext.stage = "أثناء_التسجيل"
  } else if (
    lowerQuestion.includes("نتائج الفرز") ||
    lowerQuestion.includes("بعد التسجيل") ||
    lowerQuestion.includes("انتظار النتائج")
  ) {
    conversationContext.stage = "بعد_التسجيل"
  } else if (
    lowerQuestion.includes("بعد القبول") ||
    lowerQuestion.includes("إجراءات التسجيل في الجامعة") ||
    lowerQuestion.includes("تأجيل القبول")
  ) {
    conversationContext.stage = "بعد_القبول"
  }

  // تحديث اهتمامات المستخدم
  for (const [topic, _] of Object.entries(topicSuggestions)) {
    if (
      lowerQuestion.includes(topic) ||
      (alternativeKeywords[topic] && alternativeKeywords[topic].some((alt) => lowerQuestion.includes(alt)))
    ) {
      if (!conversationContext.userInterests.includes(topic)) {
        conversationContext.userInterests.push(topic)
        // الاحتفاظ بآخر 5 اهتمامات فقط
        if (conversationContext.userInterests.length > 5) {
          conversationContext.userInterests.shift()
        }
      }
    }
  }

  // حفظ السياق في التخزين المحلي إذا كان متاحًا
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("conversationContext", JSON.stringify(conversationContext))
    } catch (e) {
      console.error("Error saving conversation context to localStorage:", e)
    }
  }
}

// وظيفة لاسترجاع سياق المحادثة من التخزين المحلي
function loadConversationContext(): void {
  if (typeof window !== "undefined") {
    try {
      const savedContext = localStorage.getItem("conversationContext")
      if (savedContext) {
        const parsedContext = JSON.parse(savedContext) as ConversationContext

        // التحقق من صلاحية السياق (إذا كان آخر سؤال قبل أكثر من 24 ساعة، إعادة تعيين السياق)
        const oneDayInMs = 24 * 60 * 60 * 1000
        if (Date.now() - parsedContext.lastQuestionTimestamp > oneDayInMs) {
          conversationContext = { ...defaultContext }
          localStorage.removeItem("conversationContext")
        } else {
          conversationContext = parsedContext
        }
      }
    } catch (e) {
      console.error("Error loading conversation context from localStorage:", e)
      conversationContext = { ...defaultContext }
    }
  }
}

// تحميل سياق المحادثة عند بدء التطبيق
loadConversationContext()

/**
 * توليد أسئلة مقترحة بناءً على سؤال المستخدم وسياق المحادثة
 */
export function generateSuggestedQuestions(userQuestion: string): string[] {
  // تحديث سياق المحادثة
  updateConversationContext(userQuestion)

  // إذا كان السؤال فارغًا، أعد الاقتراحات العامة
  if (!userQuestion.trim()) {
    return generalSuggestions
  }

  const lowerQuestion = userQuestion.toLowerCase()
  const suggestedQuestions: string[] = []
  const usedQuestions = new Set<string>()

  // 1. أولاً، ابحث عن الأسئلة المتعلقة بالمواضيع في السؤال الحالي
  for (const [topic, questions] of Object.entries(topicSuggestions)) {
    if (
      lowerQuestion.includes(topic) ||
      (alternativeKeywords[topic] && alternativeKeywords[topic].some((alt) => lowerQuestion.includes(alt))) ||
      (topic === "كلمة_المرور" &&
        (lowerQuestion.includes("كلمة المرور") ||
          lowerQuestion.includes("كلمة السر") ||
          lowerQuestion.includes("باسورد")))
    ) {
      // إضافة سؤالين عشوائيين من هذا الموضوع
      const shuffled = [...questions].sort(() => 0.5 - Math.random())
      for (const question of shuffled) {
        if (!usedQuestions.has(question)) {
          suggestedQuestions.push(question)
          usedQuestions.add(question)
          if (suggestedQuestions.length >= 2) break
        }
      }
    }
  }

  // 2. ثانيًا، أضف أسئلة من المواضيع الأخيرة في سياق المحادثة
  if (suggestedQuestions.length < 3 && conversationContext.recentTopics.length > 0) {
    for (const topic of conversationContext.recentTopics) {
      if (topicSuggestions[topic] && suggestedQuestions.length < 3) {
        const shuffled = [...topicSuggestions[topic]].sort(() => 0.5 - Math.random())
        for (const question of shuffled) {
          if (!usedQuestions.has(question)) {
            suggestedQuestions.push(question)
            usedQuestions.add(question)
            if (suggestedQuestions.length >= 3) break
          }
        }
      }
    }
  }

  // 3. ثالثًا، أضف أسئلة بناءً على نوع المستخدم إذا تم تحديده
  if (suggestedQuestions.length < 3 && conversationContext.userType) {
    const userTypeQuestions = userTypeSuggestions[conversationContext.userType]
    if (userTypeQuestions) {
      const shuffled = [...userTypeQuestions].sort(() => 0.5 - Math.random())
      for (const question of shuffled) {
        if (!usedQuestions.has(question)) {
          suggestedQuestions.push(question)
          usedQuestions.add(question)
          if (suggestedQuestions.length >= 3) break
        }
      }
    }
  }

  // 4. رابعًا، أضف أسئلة بناءً على مرحلة المستخدم في عملية القبول
  if (suggestedQuestions.length < 3 && conversationContext.stage) {
    const stageQuestions = stageSuggestions[conversationContext.stage]
    if (stageQuestions) {
      const shuffled = [...stageQuestions].sort(() => 0.5 - Math.random())
      for (const question of shuffled) {
        if (!usedQuestions.has(question)) {
          suggestedQuestions.push(question)
          usedQuestions.add(question)
          if (suggestedQuestions.length >= 3) break
        }
      }
    }
  }

  // 5. خامسًا، أضف أسئلة من اهتمامات المستخدم
  if (suggestedQuestions.length < 3 && conversationContext.userInterests.length > 0) {
    for (const interest of conversationContext.userInterests) {
      if (topicSuggestions[interest] && suggestedQuestions.length < 3) {
        const shuffled = [...topicSuggestions[interest]].sort(() => 0.5 - Math.random())
        for (const question of shuffled) {
          if (!usedQuestions.has(question)) {
            suggestedQuestions.push(question)
            usedQuestions.add(question)
            if (suggestedQuestions.length >= 3) break
          }
        }
      }
    }
  }

  // 6. أخيرًا، إذا لم نجد أسئلة كافية، أضف من الاقتراحات العامة
  if (suggestedQuestions.length < 3) {
    const shuffledGeneral = [...generalSuggestions].sort(() => 0.5 - Math.random())
    for (const question of shuffledGeneral) {
      if (!usedQuestions.has(question)) {
        suggestedQuestions.push(question)
        usedQuestions.add(question)
        if (suggestedQuestions.length >= 3) break
      }
    }
  }

  return suggestedQuestions
}

/**
 * توليد أسئلة متابعة بناءً على إجابة المساعد وسياق المحادثة
 */
export function generateFollowUpQuestions(assistantResponse: string): string[] {
  const followUpQuestions: string[] = []
  const usedQuestions = new Set<string>()

  // البحث عن الكلمات المفتاحية في إجابة المساعد
  const lowerResponse = assistantResponse.toLowerCase()

  // 1. أولاً، ابحث عن المواضيع في إجابة المساعد
  const detectedTopics: string[] = []
  for (const [topic, alternatives] of Object.entries(alternativeKeywords)) {
    if (
      lowerResponse.includes(topic) ||
      alternatives.some((alt) => lowerResponse.includes(alt)) ||
      (topic === "كلمة_المرور" &&
        (lowerResponse.includes("كلمة المرور") ||
          lowerResponse.includes("كلمة السر") ||
          lowerResponse.includes("باسورد")))
    ) {
      detectedTopics.push(topic)
    }
  }

  // 2. إضافة أسئلة متابعة من المواضيع المكتشفة في الإجابة
  for (const topic of detectedTopics) {
    if (topicSuggestions[topic] && followUpQuestions.length < 2) {
      const shuffled = [...topicSuggestions[topic]].sort(() => 0.5 - Math.random())
      for (const question of shuffled) {
        if (!usedQuestions.has(question) && !conversationContext.clickedSuggestions.includes(question)) {
          followUpQuestions.push(question)
          usedQuestions.add(question)
          if (followUpQuestions.length >= 2) break
        }
      }
    }
  }

  // 3. إضافة أسئلة متابعة من المواضيع الأخيرة في سياق المحادثة
  if (followUpQuestions.length < 3 && conversationContext.recentTopics.length > 0) {
    for (const topic of conversationContext.recentTopics) {
      if (topicSuggestions[topic] && followUpQuestions.length < 3) {
        const shuffled = [...topicSuggestions[topic]].sort(() => 0.5 - Math.random())
        for (const question of shuffled) {
          if (!usedQuestions.has(question) && !conversationContext.clickedSuggestions.includes(question)) {
            followUpQuestions.push(question)
            usedQuestions.add(question)
            if (followUpQuestions.length >= 3) break
          }
        }
      }
    }
  }

  // 4. إضافة أسئلة متابعة من نوع المستخدم
  if (followUpQuestions.length < 3 && conversationContext.userType) {
    const userTypeQuestions = userTypeSuggestions[conversationContext.userType]
    if (userTypeQuestions) {
      const shuffled = [...userTypeQuestions].sort(() => 0.5 - Math.random())
      for (const question of shuffled) {
        if (!usedQuestions.has(question) && !conversationContext.clickedSuggestions.includes(question)) {
          followUpQuestions.push(question)
          usedQuestions.add(question)
          if (followUpQuestions.length >= 3) break
        }
      }
    }
  }

  // 5. إضافة سؤال عام إذا لم نجد أسئلة كافية
  if (followUpQuestions.length < 3) {
    const shuffledGeneral = [...generalSuggestions].sort(() => 0.5 - Math.random())
    for (const question of shuffledGeneral) {
      if (!usedQuestions.has(question) && !conversationContext.clickedSuggestions.includes(question)) {
        followUpQuestions.push(question)
        usedQuestions.add(question)
        if (followUpQuestions.length >= 3) break
      }
    }
  }

  return followUpQuestions
}

/**
 * تسجيل اختيار المستخدم للسؤال المقترح
 */
export function recordSuggestionClick(question: string): void {
  updateConversationContext(question, true)
}

/**
 * إعادة تعيين سياق المحادثة
 */
export function resetConversationContext(): void {
  conversationContext = { ...defaultContext }
  if (typeof window !== "undefined") {
    localStorage.removeItem("conversationContext")
  }
}
