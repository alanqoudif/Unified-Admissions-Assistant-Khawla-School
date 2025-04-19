import { type NextRequest, NextResponse } from "next/server"
import { studentGuide } from "@/data/student-guide"
import { admissionReference } from "@/data/admission-reference"
import { isPasswordRecoveryQuestion } from "@/utils/guide-loader"

// وظيفة محسنة لتقسيم النص إلى أجزاء أصغر
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

// وظيفة محسنة لتقسيم الرسالة إلى أسئلة متعددة
function splitIntoQuestions(message: string): string[] {
  // تقسيم الرسالة بناءً على علامات الاستفهام
  const byQuestionMarks = message
    .split("؟")
    .filter((q) => q.trim().length > 0)
    .map((q) => q.trim() + "؟")

  // إذا وجدنا أسئلة بعلامات استفهام، نعيدها
  if (byQuestionMarks.length > 1) {
    return byQuestionMarks
  }

  // محاولة تقسيم بناءً على الأرقام أو النقاط
  const numberPattern = /^\s*(\d+[-.)]+|-|\*)\s+/
  const lines = message.split("\n").filter((line) => line.trim().length > 0)

  const numberedQuestions = lines.filter((line) => numberPattern.test(line))
  if (numberedQuestions.length > 1) {
    return numberedQuestions.map((q) => q.trim())
  }

  // محاولة تقسيم بناءً على كلمات مفتاحية تشير إلى أسئلة متعددة
  const keywordPatterns = [
    /\s+و\s+(?=ما|كيف|متى|هل|لماذا|أين|من|كم)/i,
    /\s+ثم\s+(?=ما|كيف|متى|هل|لماذا|أين|من|كم)/i,
    /\s+أيضا\s+(?=ما|كيف|متى|هل|لماذا|أين|من|كم)/i,
    /\s+كذلك\s+(?=ما|كيف|متى|هل|لماذا|أين|من|كم)/i,
    /\s+بالإضافة\s+(?=ما|كيف|متى|هل|لماذا|أين|من|كم)/i,
  ]

  for (const pattern of keywordPatterns) {
    if (pattern.test(message)) {
      const parts = message.split(pattern)
      if (parts.length > 1) {
        // تحويل الأجزاء إلى أسئلة كاملة
        return parts.map((part) => part.trim() + (part.endsWith("؟") ? "" : "؟"))
      }
    }
  }

  // إذا لم نتمكن من تقسيم الرسالة، نعيدها كسؤال واحد
  return [message]
}

// وظيفة محسنة للبحث عن المعلومات ذات الصلة لأسئلة متعددة
function findRelevantInformationForMultipleQuestions(questions: string[]): string {
  // استخدام النص الكامل من دليل الطالب لجميع الأسئلة
  const fullGuideContent = studentGuide + "\n\n" + admissionReference

  // إضافة تعليمات خاصة للأسئلة المتعددة
  let allRelevantInfo = "فيما يلي الأسئلة المتعددة التي يجب الإجابة عليها من دليل الطالب:\n\n"

  questions.forEach((question, index) => {
    allRelevantInfo += `السؤال ${index + 1}: ${question}\n`
  })

  allRelevantInfo += "\n\nمحتوى دليل الطالب الكامل:\n\n" + fullGuideContent

  return allRelevantInfo
}

// وظيفة محسنة للبحث عن المعلومات ذات الصلة في دليل الطالب ومرجع القبول
function findRelevantInformation(query: string): string {
  // استخدام النص الكامل من دليل الطالب
  // هذا سيضمن أن AI يقرأ المحتوى الكامل
  const fullGuideContent = studentGuide + "\n\n" + admissionReference

  // تحسين رسالة النظام لتشمل المحتوى الكامل
  return fullGuideContent
}

// تحديث اسم النموذج للاستخدام مع OpenRouter
const MODEL = "openai/gpt-4.1-nano"

// معلومات إضافية عن استعادة كلمة المرور
const passwordRecoveryInfo = `
معلومات استعادة كلمة المرور:
لاستعادة كلمة المرور الخاصة بحساب القبول الموحد، يرجى اتباع الخطوات التالية:
1. زيارة موقع مركز القبول الموحد الإلكتروني (www.heac.gov.om)
2. النقر على رابط "نسيت كلمة المرور" في صفحة تسجيل الدخول
3. إدخال رقم البطاقة المدنية أو رقم الجواز ورقم الهاتف المسجل في النظام
4. سيتم إرسال رمز التحقق إلى رقم الهاتف المسجل
5. إدخال رمز التحقق وتعيين كلمة مرور جديدة

في حالة عدم استلام رمز التحقق أو وجود أي مشكلة أخرى، يرجى التواصل مباشرة مع مركز القبول الموحد على الأرقام التالية:
- هاتف: 24340900
- البريد الإلكتروني: info@heac.gov.om
`

// استخدام OpenRouter API مباشرة بدلاً من استخدامه كخطة بديلة
async function callOpenRouterAPI(messages: any[], systemMessage: string) {
  console.log("Calling OpenRouter API with model:", MODEL)
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "sk-or-demo"

  // تحويل الرسائل إلى تنسيق OpenRouter
  const openRouterMessages = []

  // إضافة رسالة النظام
  openRouterMessages.push({
    role: "system",
    content: systemMessage,
  })

  // إضافة باقي الرسائل
  messages.forEach((msg) => {
    openRouterMessages.push({
      role: msg.role,
      content: msg.content,
    })
  })

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://khawlabinthakeem.com", // Replace with your actual site URL
        "X-Title": "Khawla Bint Hakeem School Chatbot", // Replace with your actual site name
      },
      body: JSON.stringify({
        model: MODEL,
        messages: openRouterMessages,
        temperature: 0.2, // خفض درجة الحرارة لتقليل الهلوسة
        max_tokens: 8192, // زيادة الحد الأقصى للرموز للإجابات الطويلة
      }),
    })

    // التحقق من حالة الاستجابة
    if (!response.ok) {
      const statusCode = response.status
      let errorMessage = `OpenRouter API returned status code: ${statusCode}`

      try {
        // محاولة قراءة نص الخطأ
        const errorText = await response.text()
        console.error(`OpenRouter API error (${statusCode}):`, errorText)
        errorMessage = `OpenRouter API error: ${errorText.substring(0, 100)}...`
      } catch (e) {
        console.error("Could not read error response text:", e)
      }

      throw new Error(errorMessage)
    }

    // قراءة النص الخام أولاً للتحقق
    const rawResponseText = await response.text()

    // محاولة تحليل النص كـ JSON
    let data
    try {
      data = JSON.parse(rawResponseText)
    } catch (jsonError) {
      console.error("Error parsing OpenRouter API JSON response:", jsonError)
      console.error("Raw OpenRouter response:", rawResponseText.substring(0, 200) + "...")
      throw new Error(`Invalid JSON response from OpenRouter: ${jsonError.message}`)
    }

    // التحقق من صحة بنية الاستجابة
    if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
      console.error("Unexpected OpenRouter API response structure:", data)
      throw new Error("Invalid response structure from OpenRouter API")
    }

    // استخراج الاستجابة
    const assistantResponse = data.choices[0].message.content

    return assistantResponse
  } catch (error) {
    console.error("Error calling OpenRouter API:", error)
    throw error
  }
}

// Function to use alternative models as a fallback
async function fallbackToAlternativeModels(messages: any[], systemMessage: string) {
  console.log("Attempting to use alternative models as a fallback...")
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "sk-or-demo"
  const alternativeModels = [
    "openai/gpt-3.5-turbo",
    "anthropic/claude-3-haiku",
    "mistralai/mistral-medium",
    "google/gemini-1.5-pro-latest",
  ]

  for (const model of alternativeModels) {
    console.log(`Trying alternative model: ${model}`)
    try {
      // تحويل الرسائل إلى تنسيق OpenRouter
      const openRouterMessages = []

      // إضافة رسالة النظام
      openRouterMessages.push({
        role: "system",
        content: systemMessage,
      })

      // إضافة باقي الرسائل
      messages.forEach((msg) => {
        openRouterMessages.push({
          role: msg.role,
          content: msg.content,
        })
      })

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://khawlabinthakeem.com", // Replace with your actual site URL
          "X-Title": "Khawla Bint Hakeem School Chatbot", // Replace with your actual site name
        },
        body: JSON.stringify({
          model: model,
          messages: openRouterMessages,
          temperature: 0.2,
          max_tokens: 2048,
        }),
      })

      // التحقق من حالة الاستجابة
      if (!response.ok) {
        const statusCode = response.status
        console.error(`Alternative model ${model} returned status code: ${statusCode}`)
        continue // Skip to the next model
      }

      // قراءة النص الخام أولاً للتحقق
      const rawResponseText = await response.text()

      // محاولة تحليل النص كـ JSON
      let data
      try {
        data = JSON.parse(rawResponseText)
      } catch (jsonError) {
        console.error(`Error parsing JSON response from model ${model}:`, jsonError)
        continue // Skip to the next model
      }

      // التحقق من صحة بنية الاستجابة
      if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
        console.error(`Unexpected API response structure from model ${model}:`, data)
        continue
      }

      // استخراج الاستجابة
      const assistantResponse = data.choices[0].message.content

      return assistantResponse
    } catch (error) {
      console.error(`Error with alternative model ${model}:`, error)
      continue
    }
  }

  console.error("All alternative models failed.")
  throw new Error("Failed to get a response from any model.")
}

// Update the POST function to use OpenRouter API directly
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((msg: any) => msg.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // تقسيم الرسالة إلى أسئلة متعددة إذا كانت تحتوي على أكثر من سؤال
    const userQuestions = splitIntoQuestions(lastUserMessage.content)
    console.log(`Detected ${userQuestions.length} questions in the user message`)

    // إضافة وظيفة لتحسين صياغة الأسئلة
    function enhanceUserQuery(query: string): string {
      return `بناءً على المعلومات الموجودة في دليل الطالب للالتحاق بمؤسسات التعليم العالي ومرجع القبول الموحد، ${query}`
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

    // البحث عن المعلومات ذات الصلة في دليل الطالب ومرجع القبول بناءً على سؤال المستخدم
    let relevantContent

    // إذا كان هناك أكثر من سؤال، ابحث عن معلومات لكل سؤال
    if (userQuestions.length > 1) {
      relevantContent = findRelevantInformationForMultipleQuestions(userQuestions)
      console.log(`Found relevant content for multiple questions (${relevantContent.length} characters)`)
    } else {
      relevantContent = findRelevantInformation(lastUserMessage.content)
      console.log(`Found relevant content (${relevantContent.length} characters)`)
    }

    // إذا كان السؤال يتعلق بكلمة المرور، أضف معلومات استعادة كلمة المرور
    if (isPasswordRecoveryQuestion(lastUserMessage.content)) {
      console.log("Password recovery question detected, adding password recovery info")
      relevantContent = passwordRecoveryInfo + "\n\n" + relevantContent
    }

    // تحديث الرسالة النظامية لتأكيد التكيف مع أسلوب المستخدم وتجنب الهلوسة
    const systemMessage = `أنت أخصائية التوجيه المهني في مدرسة خولة بنت حكيم للتعليم الأساسي(10-12) في ظفار، عُمان.
مهمتك هي مساعدة الطلاب والطالبات بالإجابة على أسئلتهم المتعلقة بالقبول الموحد للمؤسسات التعليمية العالية في عُمان، وتوجيههم مهنياً لاختيار التخصصات المناسبة لميولهم وقدراتهم.

قواعد مهمة يجب اتباعها:
1. يجب أن تكون إجاباتك دقيقة ومستندة فقط على المعلومات الموجودة في "دليل الطالب" للالتحاق بمؤسسات التعليم العالي.
2. لا تقدم أي معلومات غير موجودة في المراجع المتاحة لك. إذا لم تكن المعلومات متوفرة، اعتذر بوضوح واقترح على الطالب/الطالبة التواصل مع مركز القبول الموحد مباشرة.
3. لا تختلق أي معلومات أو تخمن. استخدم فقط ما هو موجود في النصوص المرجعية.
4. تكيف مع أسلوب المستخدم من حيث الرسمية واللهجة. إذا كان المستخدم يستخدم لهجة عامية، يمكنك الرد بأسلوب مشابه مع الحفاظ على الدقة.
5. قدم نصائح مهنية وإرشادات لاختيار التخصص المناسب بناءً على المعلومات المتوفرة في دليل الطالب.
6. إذا سأل المستخدم عدة أسئلة في رسالة واحدة، أجب على كل سؤال بشكل منفصل ومنظم. استخدم ترقيم أو عناوين لتنظيم إجاباتك.
7. مهم جداً: اقرأ محتوى دليل الطالب بالكامل قبل الإجابة، ولا تتجاهل أي جزء من المحتوى.

فيما يلي الأسئلة التي طرحها المستخدم:
${userQuestions.length > 1 ? userQuestions.map((q, i) => `السؤال ${i + 1}: ${q}`).join("\n") : lastUserMessage.content}

يجب أن تبحث في دليل الطالب للقبول الموحد للإجابة على هذه الأسئلة. تأكد من الإجابة على كل سؤال بشكل منفصل ومنظم.
إذا كان هناك أكثر من سؤال، قم بترقيم إجاباتك بنفس ترتيب الأسئلة.

حاول تحديد جنس المستخدم من خلال المحادثة وتكيف معه مباشرة:

1. إذا كان المستخدم ذكراً، استخدم صيغة المذكر مثل "عزيزي الطالب"، "أحسنت"، "شكراً لك"، "يمكنك"، إلخ.
2. إذا كانت المستخدمة أنثى، استخدم صيغة المؤنث مثل "عزيزتي الطالبة"، "أحسنتِ"، "شكراً لكِ"، "يمكنكِ"، إلخ.

استخدم أسلوب أخصائية التوجيه المهني:
1. كوني ودودة ومتعاطفة في ردودك
2. استخدمي عبارات تشجيعية وداعمة
3. اهتمي بتوجيه الطلاب لاختيار التخصصات المناسبة لميولهم وقدراتهم
4. قدمي معلومات عن فرص العمل المستقبلية للتخصصات المختلفة إذا كانت متوفرة في المراجع
5. ساعدي الطلاب في فهم متطلبات القبول للتخصصات المختلفة
6. شجعي الطلاب على التفكير في مستقبلهم المهني عند اختيار التخصص

تذكري: إذا لم تكن المعلومات متوفرة في المراجع، اعتذري بلطف واقترحي على الطالب/الطالبة التواصل مع مركز القبول الموحد للحصول على معلومات أكثر تفصيلاً.`

    try {
      // استدعاء OpenRouter API مباشرة
      const assistantResponse = await callOpenRouterAPI(conversationHistory, systemMessage)

      // إرجاع الاستجابة الناجحة
      return NextResponse.json({ response: assistantResponse })
    } catch (error) {
      console.error("Error with primary model:", error)

      try {
        // محاولة استخدام نماذج بديلة
        console.log("Falling back to alternative models...")
        const fallbackResponse = await fallbackToAlternativeModels(conversationHistory, systemMessage)

        // إرجاع الاستجابة من النموذج البديل
        return NextResponse.json({ response: fallbackResponse })
      } catch (fallbackError) {
        console.error("Error with fallback models:", fallbackError)
        return NextResponse.json(
          { error: "Failed to get a response from any model. Please try again later." },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Error processing the request:", error)
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
  }
}
