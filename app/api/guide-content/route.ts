import { type NextRequest, NextResponse } from "next/server"
import { loadGuideContent, saveGuideContent } from "@/utils/guide-loader"

// API لاسترجاع محتوى دليل الطالب
export async function GET() {
  try {
    const content = await loadGuideContent()
    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error fetching guide content:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء استرجاع محتوى دليل الطالب" }, { status: 500 })
  }
}

// API لحفظ محتوى دليل الطالب
export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "المحتوى غير صالح" }, { status: 400 })
    }

    const success = await saveGuideContent(content)

    if (success) {
      return NextResponse.json({ message: "تم حفظ المحتوى بنجاح" })
    } else {
      return NextResponse.json({ error: "فشل في حفظ المحتوى" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error saving guide content:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ محتوى دليل الطالب" }, { status: 500 })
  }
}
