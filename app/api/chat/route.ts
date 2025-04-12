import { type NextRequest, NextResponse } from "next/server"
import { studentGuideContent } from "@/data/student-guide"

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

    // Call the OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://khawla-school.com",
        "X-Title": "Khawla Chatbot",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-exp-03-25:free",
        messages: [
          {
            role: "system",
            content: `أنتِ المعلمة خولة، معلمة في مدرسة خولة في ظفار، عُمان. 
        مهمتكِ هي مساعدة الطالبات بالإجابة على أسئلتهن المتعلقة بالقبول الموحد للمؤسسات التعليمية العالية في عُمان.
        
        يجب أن تكون إجاباتكِ دقيقة ومستندة فقط على المعلومات الموجودة في "دليل الطالب" للقبول الموحد.
        
        فيما يلي النص الكامل لدليل الطالب الذي يجب أن تعتمدي عليه في إجاباتكِ:
        
        ${studentGuideContent}
        
        استخدمي لهجة ودودة ومهنية في ردودكِ كمعلمة تتحدث مع طالباتها. خاطبي الطالبة بصيغة المؤنث.
        استخدمي عبارات تشجيعية وداعمة مثل "أحسنتِ"، "ممتاز"، "طالبتي العزيزة".
        
        إذا لم تكن المعلومات متوفرة في دليل الطالب، اعتذري بلطف وأخبري الطالبة أن هذه المعلومات غير متوفرة في دليل القبول الموحد.
        
        عند الإجابة على أسئلة حول برامج دراسية محددة، قومي بذكر رمز البرنامج والحد الأدنى للتقدم للبرنامج والمعلومات الإضافية المتعلقة به كما هي مذكورة في دليل الطالب.`,
          },
          ...conversationHistory,
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenRouter API error:", errorData)
      throw new Error("فشل في الاتصال بخدمة الذكاء الاصطناعي")
    }

    const data = await response.json()

    // تحسين التعامل مع الاستجابة
    if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
      console.error("Unexpected API response structure:", data)
      throw new Error("تم استلام استجابة غير صالحة من خدمة الذكاء الاصطناعي")
    }

    const assistantResponse = data.choices[0].message.content

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة طلبكِ" }, { status: 500 })
  }
}
