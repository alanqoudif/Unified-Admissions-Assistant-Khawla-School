import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

// إصلاح مشكلة مسارات الملفات في pdf-parse
const pdfParseWithCorrectPaths = async (dataBuffer: Buffer, options?: any) => {
  try {
    return await pdfParse(dataBuffer, options);
  } catch (error: any) {
    // إذا كان الخطأ متعلقًا بمسار ملف، نحاول إصلاحه
    if (error.code === 'ENOENT' && error.path && error.path.startsWith('./test/data/')) {
      console.error('PDF-parse path error:', error.message);
      // نقوم بإعادة تعريف المسار لاستخدام مسار مؤقت بدلاً من المسار الافتراضي
      const tempDir = path.join(process.cwd(), 'temp');
      
      // إنشاء مجلد مؤقت إذا لم يكن موجودًا
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // إنشاء ملف فارغ في المسار المؤقت
      const tempFilePath = path.join(tempDir, path.basename(error.path));
      fs.writeFileSync(tempFilePath, '');
      
      // إعادة المحاولة
      return await pdfParse(dataBuffer, options);
    }
    throw error;
  }
};

// وظيفة لقراءة ملف PDF وتحويله إلى نص
export async function parsePdfFile(filePath: string): Promise<string> {
  try {
    console.log(`Parsing PDF file: ${filePath}`);
    // التحقق من وجود الملف
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file does not exist: ${filePath}`);
      throw new Error(`ملف PDF غير موجود: ${filePath}`);
    }
    
    // قراءة ملف PDF كـ buffer
    const dataBuffer = fs.readFileSync(filePath);
    console.log(`PDF file size: ${dataBuffer.length} bytes`);
    
    // استخدام pdf-parse لاستخراج النص من ملف PDF
    const data = await pdfParseWithCorrectPaths(dataBuffer, {
      // إضافة خيارات إضافية لتحسين استخراج النص
      pagerender: function(pageData: any) {
        return pageData.getTextContent()
          .then(function(textContent: any) {
            let lastY, text = '';
            for (let item of textContent.items) {
              if (lastY == item.transform[5] || !lastY) {
                text += item.str;
              } else {
                text += '\n' + item.str;
              }
              lastY = item.transform[5];
            }
            return text;
          });
      }
    });
    
    console.log(`Extracted ${data.text.length} characters from PDF`);
    
    // إرجاع النص المستخرج
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error('فشل في قراءة ملف PDF');
  }
}

// وظيفة لتقسيم النص إلى أجزاء أصغر
export function splitTextIntoChunks(text: string, maxChunkSize = 8000): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // تقسيم النص إلى فقرات
  const paragraphs = text.split("\n\n");

  for (const paragraph of paragraphs) {
    // إذا كانت إضافة الفقرة الحالية ستتجاوز الحد الأقصى، قم بحفظ الجزء الحالي وابدأ جزءًا جديدًا
    if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      // وإلا، أضف الفقرة إلى الجزء الحالي
      if (currentChunk.length > 0) {
        currentChunk += "\n\n";
      }
      currentChunk += paragraph;
    }
  }

  // إضافة الجزء الأخير إذا لم يكن فارغًا
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// وظيفة للبحث عن المعلومات ذات الصلة في دليل الطالب
export function findRelevantInformation(query: string, guideContent: string): string {
  // تقسيم دليل الطالب إلى أجزاء
  const chunks = splitTextIntoChunks(guideContent);

  // تحويل الاستعلام والأجزاء إلى أحرف صغيرة للمقارنة
  const lowerQuery = query.toLowerCase();

  // البحث عن الكلمات الرئيسية في الاستعلام
  const keywords = lowerQuery.split(/\s+/).filter((word) => word.length > 3);

  // تصنيف الأجزاء حسب عدد الكلمات الرئيسية التي تحتوي عليها
  const rankedChunks = chunks
    .map((chunk) => {
      const lowerChunk = chunk.toLowerCase();
      let score = 0;

      // حساب عدد الكلمات الرئيسية الموجودة في الجزء
      for (const keyword of keywords) {
        if (lowerChunk.includes(keyword)) {
          score += 1;
        }
      }

      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score);

  // اختيار الأجزاء الأكثر صلة (بحد أقصى 3 أجزاء)
  const relevantChunks = rankedChunks.slice(0, 3).map((item) => item.chunk);

  // دمج الأجزاء ذات الصلة
  return relevantChunks.join("\n\n");
}

// وظيفة لتحميل وتحليل ملف PDF دليل الطالب
let pdfContentCache: string | null = null;

export async function getStudentGuideFromPdf(pdfPath: string): Promise<string> {
  // استخدام النص المخزن مؤقتًا إذا كان موجودًا
  if (pdfContentCache) {
    return pdfContentCache;
  }

  try {
    // قراءة وتحليل ملف PDF
    const pdfContent = await parsePdfFile(pdfPath);
    
    // تخزين النص المستخرج مؤقتًا
    pdfContentCache = pdfContent;
    
    return pdfContent;
  } catch (error) {
    console.error('Error getting student guide from PDF:', error);
    throw new Error('فشل في قراءة ملف دليل الطالب');
  }
}
