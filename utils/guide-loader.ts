import fs from "fs"
import path from "path"

// وظيفة لتحميل محتوى دليل الطالب من ملف خارجي
export async function loadGuideContent() {
  try {
    // هذا المسار سيعمل في بيئة الإنتاج على الخادم
    const filePath = path.join(process.cwd(), "data", "guide-content.txt")

    // التحقق من وجود الملف
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8")
      return content
    }

    // إذا لم يكن الملف موجودًا، استخدم المحتوى الافتراضي
    return "محتوى دليل الطالب غير متوفر حاليًا."
  } catch (error) {
    console.error("Error loading guide content:", error)
    return "حدث خطأ أثناء تحميل محتوى دليل الطالب."
  }
}

// وظيفة لحفظ محتوى دليل الطالب في ملف خارجي
export async function saveGuideContent(content: string) {
  try {
    const dirPath = path.join(process.cwd(), "data")
    const filePath = path.join(dirPath, "guide-content.txt")

    // التأكد من وجود المجلد
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // حفظ المحتوى في الملف
    fs.writeFileSync(filePath, content, "utf8")
    return true
  } catch (error) {
    console.error("Error saving guide content:", error)
    return false
  }
}
