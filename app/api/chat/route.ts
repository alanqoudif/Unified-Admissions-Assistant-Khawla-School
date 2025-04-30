import { NextRequest, NextResponse } from "next/server";
import { studentGuideContent } from "@/data/student-guide";
import fs from 'fs';
import path from 'path';

// مفتاح API الخاص بـ OpenRouter
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";

// قائمة النماذج المفضلة للاستخدام
const PREFERRED_MODELS = [
  "anthropic/claude-3-opus", // استخدام نموذج أكثر قوة للحصول على نتائج أفضل
  "anthropic/claude-3-sonnet",
  "openai/gpt-4o",
  "google/gemini-1.5-pro",
  "meta-llama/llama-3-70b-instruct",
];

// الحد الأقصى لحجم المحتوى المرسل - تم تقليله لتجنب تجاوز حدود الرموز
const MAX_CONTENT_LENGTH = 3000;

// مسار ملف دليل الطالب
const GUIDE_FILE_PATH = path.join(process.cwd(), "data", "student-guide.ts");

// الحد الأقصى لعدد الرموز المطلوبة في الاستجابة
const MAX_OUTPUT_TOKENS = 300;

export async function POST(req: NextRequest) {
  try {
    // استخراج الرسائل من الطلب
    const { messages } = await req.json();

    // الحصول على آخر رسالة من المستخدم
    const lastUserMessage = messages.filter((msg: any) => msg.role === "user").pop();

    if (!lastUserMessage) {
      return NextResponse.json({ error: "لم يتم العثور على رسالة من المستخدم" }, { status: 400 });
    }

    console.log("Processing user message:", lastUserMessage.content);
    try {
      // وظيفة لقراءة ملف دليل الطالب مباشرة
      function getGuideFileContent(): string {
        try {
          // قراءة محتوى ملف دليل الطالب
          const fileContent = fs.readFileSync(GUIDE_FILE_PATH, 'utf8');
          
          // استخراج محتوى المتغير studentGuideContent من الملف
          const match = fileContent.match(/export const studentGuideContent = `([\s\S]*?)`/m);
          if (match && match[1]) {
            return match[1];
          }
          
          // إذا لم يتم العثور على المتغير، استخدم المحتوى المستورد
          return studentGuideContent;
        } catch (error) {
          console.error('Error reading guide file:', error);
          // في حالة الخطأ، استخدم المحتوى المستورد
          return studentGuideContent;
        }
      }
      
      // وظيفة للحصول على مقتطفات من دليل الطالب
      function getGuideExcerpts(fullContent: string, maxLength: number = MAX_CONTENT_LENGTH): string {
        // تقسيم المحتوى إلى أقسام بناءً على العناوين
        const sections = fullContent.split(/#{1,3}\s+[^\n]+/g);
        
        // اختيار بعض الأقسام المهمة
        const importantSections = sections.filter(section => 
          section.includes('القبول الموحد') || 
          section.includes('التسجيل') || 
          section.includes('البرامج') ||
          section.includes('المؤسسات')
        );
        
        // إذا لم يتم العثور على أقسام مهمة، استخدم الأقسام الأولى
        const sectionsToUse = importantSections.length > 0 ? importantSections : sections.slice(0, 3);
        
        // دمج الأقسام وتقليصها للحجم المطلوب
        let combined = sectionsToUse.join('\n\n');
        if (combined.length > maxLength) {
          combined = combined.substring(0, maxLength);
        }
        
        return combined;
      }
      
      // قراءة محتوى ملف دليل الطالب مباشرة
      const fullGuideContent = getGuideFileContent();
      console.log(`Read full guide content (${fullGuideContent.length} characters)`);

      // البحث عن المعلومات ذات الصلة بالسؤال
      function findRelevantInfo(query: string, content: string): string {
        // تقسيم المحتوى إلى فقرات
        const paragraphs = content.split(/\n\n+/);
        
        // تحويل الاستعلام إلى أحرف صغيرة
        const lowerQuery = query.toLowerCase();
        
        // البحث عن الكلمات الرئيسية في الاستعلام
        const keywords = lowerQuery.split(/\s+/).filter(word => word.length > 2);
        
        // تصنيف الفقرات حسب عدد الكلمات الرئيسية التي تحتوي عليها
        const rankedParagraphs = paragraphs
          .map(paragraph => {
            const lowerParagraph = paragraph.toLowerCase();
            let score = 0;
            
            for (const keyword of keywords) {
              if (lowerParagraph.includes(keyword)) {
                score += 1;
              }
            }
            
            return { paragraph, score };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score);
        
        // اختيار الفقرات الأكثر صلة
        let totalLength = 0;
        const selectedParagraphs = [];
        
        for (const item of rankedParagraphs) {
          if (totalLength + item.paragraph.length <= MAX_CONTENT_LENGTH) {
            selectedParagraphs.push(item.paragraph);
            totalLength += item.paragraph.length;
          } else {
            break;
          }
        }
        
        // إذا لم يتم العثور على أي فقرات ذات صلة
        if (selectedParagraphs.length === 0) {
          return "دليل الطالب للقبول الموحد يحتوي على معلومات حول التسجيل والقبول في مؤسسات التعليم العالي في سلطنة عُمان.";
        }
        
        return selectedParagraphs.join("\n\n");
      }
      
      // البحث عن المعلومات ذات الصلة بالسؤال
      const relevantContent = findRelevantInfo(lastUserMessage.content, fullGuideContent);
      console.log(`Found relevant content (${relevantContent.length} characters)`);
      
      // إنشاء رسالة النظام مع المحتوى ذي الصلة
      const systemMessage = {
        role: "system",
        content: `أنت مساعد القبول الموحد في مدرسة خولة. مهمتك الإجابة على أسئلة الطلاب حول القبول الموحد في سلطنة عُمان. استخدم فقط المعلومات الموجودة في دليل الطالب ولا تقم بتقديم معلومات من خارجه. استخدم هذه المعلومات ذات الصلة:

${relevantContent}`,
      };

      // إعداد الرسائل للطلب
      const apiMessages = [systemMessage, ...messages];

      // إرسال الطلب إلى OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://khawla-school.com",
          "X-Title": "Khawla School Admissions Assistant",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku", // استخدام نموذج أقل تكلفة لتوفير الرصيد
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: MAX_OUTPUT_TOKENS, // تقليل عدد الرموز المطلوبة في الاستجابة
          stream: false, // تعطيل الاستجابة المتدفقة للتبسيط
          transforms: ["middle-out"], // استخدام تحويل middle-out لضغط المحتوى تلقائيًا
        }),
      });

      // التحقق من استجابة API
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error: ${response.status}`, errorText);
        return NextResponse.json(
          { error: "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى." },
          { status: response.status }
        );
      }

      // معالجة الاستجابة
      const data = await response.json();
      
      // التحقق من صحة بنية الاستجابة
      if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
        console.error(`Unexpected API response structure:`, data);
        return NextResponse.json(
          { error: "حدث خطأ في استجابة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى." },
          { status: 500 }
        );
      }
      
      // استخراج الاستجابة
      const assistantResponse = data.choices[0].message.content;
      return NextResponse.json({ response: assistantResponse });

    } catch (error) {
      console.error("Error processing content:", error);
      return NextResponse.json(
        { error: "حدث خطأ أثناء معالجة المحتوى. يرجى المحاولة مرة أخرى." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}
