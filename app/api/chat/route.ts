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

// قائمة بالنماذج المتاحة للاستخدام مرتبة حسب الأولوية
const MODELS = {
  // النماذج المجانية تمامًا - نبدأ بها دائمًا
  FREE_TIER: [
    "meta-llama/llama-4-scout:free",
    "undi95/toppy-m-7b",
    "google/gemini-2.5-pro-exp-03-25:free",
    "mistralai/mistral-7b-instruct",
    "meta-llama/llama-3-8b-instruct",
    "nousresearch/nous-hermes-2-mixtral-8x7b-dpo",
  ],
  // النماذج ذات التكلفة المنخفضة - ننتقل إليها إذا فشلت النماذج المجانية
  BUDGET_TIER: [
    "meta-llama/llama-4-maverick",
    "anthropic/claude-instant-v1",
    "openai/gpt-3.5-turbo",
    "mistralai/mixtral-8x7b-instruct",
    "google/gemini-1.5-pro-latest",
  ],
  // النماذج المتقدمة - نستخدمها كملاذ أخير
  PREMIUM_TIER: ["anthropic/claude-3-opus", "openai/gpt-4o", "google/gemini-1.5-flash"],
}

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

    // التحقق من وجود مفتاح API
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is missing")
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

    // إعداد الرسائل للطلب
    const requestMessages = [
      {
        role: "system",
        content: systemMessage,
      },
      ...conversationHistory,
    ]

    // تنفيذ محاولات متعددة باستخدام نماذج مختلفة
    let lastError = null
    let successfulResponse = null

    // دمج جميع النماذج في مصفوفة واحدة مع الحفاظ على الترتيب حسب الأولوية
    const allModels = [...MODELS.FREE_TIER, ...MODELS.BUDGET_TIER, ...MODELS.PREMIUM_TIER]

    // تجربة كل نموذج في القائمة حتى نجد واحدًا يعمل
    for (const model of allModels) {
      try {
        console.log(`Trying model: ${model}...`)

        // محاولة الاتصال بـ OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://khawla-school.com",
            "X-Title": "Khawla Chatbot",
          },
          body: JSON.stringify({
            model: model,
            messages: requestMessages,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        })

        // التحقق من استجابة API
        if (!response.ok) {
          const errorStatus = response.status
          let errorData

          try {
            errorData = await response.json()
            console.error(`Model error (${errorStatus}):`, errorData)
          } catch (e) {
            const errorText = await response.text()
            console.error(`Model error (${errorStatus}):`, errorText)
            errorData = { message: errorText }
          }

          // إذا كان الخطأ هو تجاوز حد الاستخدام، جرب النموذج التالي بصمت
          if (errorStatus === 429) {
            console.log(`Rate limit exceeded, trying next model...`)
            lastError = new Error(`Rate limit exceeded`)
            continue
          }

          // إذا كان هناك خطأ آخر، ارفع استثناءً
          throw new Error(`Error: ${JSON.stringify(errorData)}`)
        }

        // معالجة الاستجابة
        let data
        try {
          data = await response.json()
          console.log(`Received response successfully from model: ${model}`)

          // التحقق من صحة بنية الاستجابة
          if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
            console.error(`Unexpected API response structure:`, data)
            throw new Error(`Invalid response structure`)
          }

          // استخراج الاستجابة
          const assistantResponse = data.choices[0].message.content
          successfulResponse = assistantResponse

          // إذا نجحت المحاولة، اخرج من الحلقة
          break
        } catch (parseError) {
          console.error(`Error parsing response:`, parseError)
          lastError = parseError
          continue
        }
      } catch (modelError) {
        console.error(`Error:`, modelError)
        lastError = modelError
        continue
      }
    }

    // إذا لم ننجح مع أي نموذج، ارجع خطأ
    if (!successfulResponse) {
      console.error("All models failed:", lastError)
      return NextResponse.json(
        {
          error: "عذراً، لم نتمكن من معالجة طلبك في الوقت الحالي. يرجى المحاولة مرة أخرى لاحقاً.",
        },
        { status: 500 },
      )
    }

    // إرجاع الاستجابة الناجحة
    return NextResponse.json({ response: successfulResponse })
  } catch (error) {
    console.error("Error processing chat request:", error)
    // تحسين رسالة الخطأ للمستخدم
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء معالجة طلبك"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
