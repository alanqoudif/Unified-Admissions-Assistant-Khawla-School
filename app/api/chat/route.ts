import { type NextRequest, NextResponse } from "next/server"
import { studentGuideContent } from "@/data/student-guide"

// وظيفة لتقسيم النص إلى أجزاء أصغر
function splitTextIntoChunks(text: string, maxChunkSize = 8000): string[] {
  const chunks: string[] = []
  let currentChunk = ""

  // تقسيم النص إلى فقرات
  const paragraphs = text.split("\n\n")

  for (const paragraph of paragraphs) {
    // إذا كانت إضافة الفقرة الحالية ستتجاوز الحد الأقصى، قم بحفظ الجزء الحالي وابدأ جزءًا جديدًا
    if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
      chunks.push(currentChunk)
      currentChunk = paragraph
    } else {
      // وإلا، أضف الفقرة إلى الجزء الحالي
      if (currentChunk.length > 0) {
        currentChunk += "\n\n"
      }
      currentChunk += paragraph
    }
  }

  // إضافة الجزء الأخير إذا لم يكن فارغًا
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

// وظيفة للبحث عن المعلومات ذات الصلة في دليل الطالب
function findRelevantInformation(query: string, guideContent: string): string {
  // تقسيم دليل الطالب إلى أجزاء
  const chunks = splitTextIntoChunks(guideContent)

  // تحويل الاستعلام والأجزاء إلى أحرف صغيرة للمقارنة
  const lowerQuery = query.toLowerCase()

  // البحث عن الكلمات الرئيسية في الاستعلام
  const keywords = lowerQuery.split(/\s+/).filter((word) => word.length > 3)

  // تصنيف الأجزاء حسب عدد الكلمات الرئيسية التي تحتوي عليها
  const rankedChunks = chunks
    .map((chunk) => {
      const lowerChunk = chunk.toLowerCase()
      let score = 0

      // حساب عدد الكلمات الرئيسية الموجودة في الجزء
      for (const keyword of keywords) {
        if (lowerChunk.includes(keyword)) {
          score += 1
        }
      }

      return { chunk, score }
    })
    .sort((a, b) => b.score - a.score)

  // اختيار الأجزاء الأكثر صلة (بحد أقصى 3 أجزاء)
  const relevantChunks = rankedChunks.slice(0, 3).map((item) => item.chunk)

  // دمج الأجزاء ذات الصلة
  return relevantChunks.join("\n\n")
}

// قائمة النماذج المتاحة للاستخدام مع آلية الانتقال التلقائي
const GEMINI_MODELS = [
  "gemini-2.0-flash", // النموذج المطلوب من المستخدم
  "gemini-1.0-pro", // نموذج احتياطي
  "gemini-1.5-flash", // نموذج احتياطي آخر
  "gemini-1.5-pro", // نموذج احتياطي آخر
]

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((msg: any) => msg.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // إضافة وظيفة لتحسين صياغة الأسئلة
    function enhanceUserQuery(query: string): string {
      return `بناءً على المعلومات الموجودة في دليل الطالب للقبول الموحد، ${query}`
    }

    // تحسين السؤال الأخير من المستخدم
    const enhancedUserMessage = {
      role: lastUserMessage.role,
      content: enhanceUserQuery(lastUserMessage.content),
    }

    // استخدام الرسالة المحسنة في سجل المحادثة
    const conversationHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // إضافة الرسالة المحسنة في نهاية سجل المحادثة
    conversationHistory.push({
      role: enhancedUserMessage.role,
      content: enhancedUserMessage.content,
    })

    // التحقق من وجود مفتاح API لـ Gemini
    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key is missing")
      return NextResponse.json({ error: "مفتاح API غير متوفر. يرجى التواصل مع مسؤول النظام." }, { status: 500 })
    }

    // البحث عن المعلومات ذات الصلة في دليل الطالب بناءً على سؤال المستخدم
    const relevantGuideContent = findRelevantInformation(lastUserMessage.content, studentGuideContent)
    console.log(`Found relevant guide content (${relevantGuideContent.length} characters)`)

    // إعداد الرسالة النظامية مع المحتوى ذي الصلة فقط
    const systemMessage = `أنت مساعد القبول الموحد، مساعد ذكي في مدرسة خولة بنت حكيم للتعليم الأساسي(10-12) في ظفار، عُمان. 
    مهمتك هي مساعدة الطلاب بالإجابة على أسئلتهم المتعلقة بالقبول الموحد للمؤسسات التعليمية العالية في عُمان.
    
    يجب أن تكون إجاباتك دقيقة ومستندة فقط على المعلومات الموجودة في "دليل الطالب" للقبول الموحد.
    
    فيما يلي الأجزاء ذات الصلة من دليل الطالب التي يجب أن تعتمد عليها في إجاباتك:
    
    ${relevantGuideContent}
    
    استخدم لهجة ودودة ولطيفة في ردودك. حاول تحديد جنس المستخدم من خلال المحادثة:
    
    1. إذا كان المستخدم ذكراً، استخدم صيغة المذكر مثل "عزيزي الطالب"، "أحسنت"، "شكراً لك"، "يمكنك"، إلخ.
    2. إذا كانت المستخدمة أنثى، استخدم صيغة المؤنث مثل "عزيزتي الطالبة"، "أحسنتِ"، "شكراً لكِ"، "يمكنكِ"، إلخ.
    3. إذا لم تتمكن من تحديد الجنس، استخدم صيغة محايدة أو اجمع بين الصيغتين مثل "عزيزي الطالب/عزيزتي الطالبة".
    
    كن لطيفاً ومتعاطفاً في ردودك، واستخدم عبارات تشجيعية وداعمة.
    
    إذا لم تكن المعلومات متوفرة في دليل الطالب، اعتذر بلطف وأخبر المستخدم أن هذه المعلومات غير متوفرة في دليل القبول الموحد.
    
    عند الإجابة على أسئلة حول برامج دراسية محددة، قم بذكر رمز البرنامج والحد الأدنى للتقدم للبرنامج والمعلومات الإضافية المتعلقة به كما هي مذكورة في دليل الطالب.`

    // تحضير محتوى الرسالة
    const prompt = `${systemMessage}\n\nسؤال المستخدم: ${enhancedUserMessage.content}`

    // وظيفة لإرسال طلب إلى Gemini API
    async function callGeminiAPI(modelName: string) {
      console.log(`Trying model: ${modelName}...`)

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY as string,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      })

      console.log(`${modelName} response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`${modelName} error (${response.status}):`, errorText)

        // إذا كان الخطأ هو تجاوز حد الاستخدام، ارفع استثناءً خاصًا
        if (response.status === 429) {
          throw new Error(`RATE_LIMIT:${errorText}`)
        }

        throw new Error(`API_ERROR:${errorText}`)
      }

      const data = await response.json()

      // التحقق من صحة بنية الاستجابة
      if (!data || !data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error(`Unexpected ${modelName} response structure:`, data)
        throw new Error(`INVALID_RESPONSE:${JSON.stringify(data)}`)
      }

      return data.candidates[0].content.parts[0].text
    }

    // تنفيذ محاولات متعددة باستخدام نماذج مختلفة
    let lastError = null

    for (const model of GEMINI_MODELS) {
      try {
        const assistantResponse = await callGeminiAPI(model)
        console.log(`Successfully got response from ${model}`)

        // إرجاع الاستجابة الناجحة
        return NextResponse.json({ response: assistantResponse })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`Error with ${model}:`, errorMessage)

        lastError = error

        // إذا كان الخطأ ليس بسبب تجاوز حد الاستخدام، جرب النموذج التالي
        if (!errorMessage.startsWith("RATE_LIMIT:")) {
          continue
        }

        // إذا كان الخطأ بسبب تجاوز حد الاستخدام، انتظر قليلاً قبل المحاولة مرة أخرى
        console.log(`Rate limit hit for ${model}, waiting before trying next model...`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // إذا لم ننجح مع أي نموذج، ارجع خطأ
    console.error("All models failed:", lastError)
    return NextResponse.json(
      {
        error: "عذراً، لم نتمكن من معالجة طلبك في الوقت الحالي. يرجى المحاولة مرة أخرى لاحقاً.",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Error processing chat request:", error)
    // تحسين رسالة الخطأ للمستخدم
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء معالجة طلبك"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
