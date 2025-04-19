import { studentGuide } from "@/data/student-guide"
import { admissionReference } from "@/data/admission-reference"

// تعريف متغير لمعلومات استعادة كلمة المرور
const passwordRecoveryInfo = `
# معلومات استعادة كلمة المرور

## كيفية استعادة كلمة المرور الخاصة بك

1. انتقل إلى صفحة تسجيل الدخول.
2. انقر على رابط "نسيت كلمة المرور".
3. أدخل عنوان بريدك الإلكتروني المسجل.
4. تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور.
5. انقر على الرابط واتبع التعليمات لإنشاء كلمة مرور جديدة.

## إذا لم تتلق رسالة بريد إلكتروني

1. تحقق من مجلد البريد العشوائي (Spam).
2. تأكد من أنك أدخلت عنوان البريد الإلكتروني الصحيح.
3. حاول مرة أخرى بعد بضع دقائق.
4. إذا كنت لا تزال تواجه مشكلة، فاتصل بفريق الدعم.
`

// وظيفة لتحميل محتوى دليل الطالب
export async function loadGuideContent(): Promise<string> {
  // في بيئة الإنتاج، يمكن استرجاع المحتوى من قاعدة بيانات أو ملف
  // لكن في هذا المثال، سنستخدم التخزين المحلي إذا كان متاحًا
  if (typeof window !== "undefined") {
    const savedContent = localStorage.getItem("studentGuideContent")
    if (savedContent) {
      return savedContent
    }
  }

  // إذا لم يكن هناك محتوى مخزن، نعيد المحتوى الافتراضي
  return studentGuide
}

// وظيفة لحفظ محتوى دليل الطالب
export async function saveGuideContent(content: string): Promise<boolean> {
  try {
    // في بيئة الإنتاج، يمكن حفظ المحتوى في قاعدة بيانات أو ملف
    // لكن في هذا المثال، سنستخدم التخزين المحلي إذا كان متاحًا
    if (typeof window !== "undefined") {
      localStorage.setItem("studentGuideContent", content)
    }
    return true
  } catch (error) {
    console.error("Error saving guide content:", error)
    return false
  }
}

// تقسيم النص إلى أجزاء أصغر للبحث
export function splitGuideContent() {
  // دمج دليل الطالب مع المرجع الإضافي للقبول
  const combinedContent = studentGuide + "\n\n" + admissionReference

  // تقسيم المحتوى إلى فقرات
  const paragraphs = combinedContent.split("\n\n")

  // تقسيم الفقرات الطويلة إلى أجزاء أصغر
  const chunks: string[] = []

  paragraphs.forEach((paragraph) => {
    if (paragraph.length > 500) {
      // تقسيم الفقرات الطويلة إلى جمل
      const sentences = paragraph.split(/(?<=[.!?])\s+/)
      let currentChunk = ""

      sentences.forEach((sentence) => {
        if (currentChunk.length + sentence.length < 500) {
          currentChunk += (currentChunk ? " " : "") + sentence
        } else {
          if (currentChunk) {
            chunks.push(currentChunk)
          }
          currentChunk = sentence
        }
      })

      if (currentChunk) {
        chunks.push(currentChunk)
      }
    } else if (paragraph.trim()) {
      chunks.push(paragraph)
    }
  })

  return chunks
}

// التحقق مما إذا كان السؤال يتعلق باستعادة كلمة المرور
export function isPasswordRecoveryQuestion(query: string): boolean {
  const passwordKeywords = [
    "كلمة المرور",
    "كلمة مرور",
    "باسورد",
    "password",
    "نسيت كلمة",
    "استعادة كلمة",
    "استرجاع كلمة",
    "reset password",
    "forgot password",
    "recover password",
    "تغيير كلمة",
    "لا أتذكر كلمة",
    "فقدت كلمة",
  ]

  return passwordKeywords.some((keyword) => query.toLowerCase().includes(keyword.toLowerCase()))
}

// تحسين وظيفة البحث عن المعلومات ذات الصلة
export function findRelevantInfo(query: string) {
  // إذا كان السؤال يتعلق باستعادة كلمة المرور، أضف معلومات استعادة كلمة المرور
  const isCareerQuestion = isCareerGuidanceQuestion(query)
  const isPasswordQuestion = isPasswordRecoveryQuestion(query)

  // بدلاً من تقسيم المحتوى إلى أجزاء صغيرة، استخدم المحتوى الكامل
  // هذا سيضمن أن AI يقرأ المحتوى الكامل ويستخرج المعلومات ذات الصلة
  const fullContent = studentGuide + "\n\n" + admissionReference

  // إضافة معلومات إضافية حسب نوع السؤال
  if (isPasswordQuestion) {
    return {
      relevantContent: passwordRecoveryInfo + "\n\n" + fullContent,
      isPasswordRecovery: true,
      isCareerGuidance: false,
    }
  }

  if (isCareerQuestion) {
    const careerGuidanceInfo = `
# نصائح لاختيار التخصص المناسب

## كيفية اختيار التخصص المناسب لميولك وقدراتك

1. تعرف على ميولك واهتماماتك الحقيقية من خلال:
  - تحليل المواد الدراسية التي تتفوق فيها وتستمتع بدراستها
  - التفكير في الأنشطة والهوايات التي تقضي وقتاً طويلاً في ممارستها
  - تحديد القيم المهنية المهمة بالنسبة لك (مثل: الإبداع، مساعدة الآخرين، الاستقلالية)

2. قيّم قدراتك ومهاراتك:
  - حدد نقاط القوة الأكاديمية لديك
  - تعرف على مهاراتك الشخصية والاجتماعية
  - فكر في المهارات التي يمكنك تطويرها مستقبلاً

3. ابحث عن التخصصات المطلوبة في سوق العمل:
  - اطلع على الإحصائيات والدراسات حول احتياجات سوق العمل
  - تعرف على التخصصات المطلوبة ضمن رؤية عُمان 2040
  - استشر الخبراء والمختصين في مجال التوجيه المهني

4. استكشف طبيعة الدراسة والعمل في التخصصات المختلفة:
  - تحدث مع خريجين أو طلاب في التخصصات التي تهتم بها
  - حاول زيارة أماكن العمل المرتبطة بالتخصصات التي تفكر فيها
  - اقرأ عن طبيعة المواد الدراسية والمهارات المطلوبة في كل تخصص

5. وازن بين شغفك وفرص العمل المستقبلية:
  - لا تختر تخصصاً فقط لأنه مطلوب في سوق العمل إذا كنت لا تميل إليه
  - لا تختر تخصصاً فقط لأنك تحبه دون التفكير في فرص العمل المستقبلية
  - حاول إيجاد توازن بين ميولك واحتياجات سوق العمل

## أدوات مساعدة لاختيار التخصص المناسب

1. اختبارات الميول المهنية: يمكنك الاستفادة من اختبارات الميول المهنية المتوفرة في مدرستك أو عبر الإنترنت
2. المعارض التعليمية: احرص على زيارة معارض الجامعات والكليات للتعرف على التخصصات المختلفة
3. الاستشارة المهنية: تحدث مع أخصائي التوجيه المهني في مدرستك للحصول على توجيه شخصي
4. البرامج التعريفية: شارك في البرامج التعريفية التي تنظمها الجامعات والكليات للتعرف على التخصصات المختلفة

تذكر أن اختيار التخصص المناسب هو قرار مهم يؤثر على مستقبلك المهني، لذا خذ وقتك الكافي في البحث والاستكشاف قبل اتخاذ القرار.
`

    return {
      relevantContent: careerGuidanceInfo + "\n\n" + fullContent,
      isCareerGuidance: true,
      isPasswordRecovery: false,
    }
  }

  // إرجاع المحتوى الكامل للأسئلة العادية
  return {
    relevantContent: fullContent,
    isPasswordRecovery: false,
    isCareerGuidance: false,
  }
}

// وظيفة للتعرف على الأسئلة المتعلقة بالتوجيه المهني
export function isCareerGuidanceQuestion(query: string): boolean {
  const careerKeywords = [
    "مستقبل",
    "وظيفة",
    "مهنة",
    "عمل",
    "تخصص",
    "مجال",
    "اختيار",
    "ميول",
    "قدرات",
    "مهارات",
    "فرص عمل",
    "سوق العمل",
    "راتب",
    "دخل",
    "توظيف",
    "مناسب لي",
    "أنسب",
    "أفضل",
    "توجيه",
    "إرشاد",
    "نصيحة",
    "اقتراح",
  ]

  return careerKeywords.some((keyword) => query.toLowerCase().includes(keyword.toLowerCase()))
}
