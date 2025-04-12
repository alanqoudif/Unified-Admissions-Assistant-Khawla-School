"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function AdminPage() {
  const [guideContent, setGuideContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // استرجاع المحتوى المخزن عند تحميل الصفحة
  useEffect(() => {
    // محاولة استرجاع المحتوى من التخزين المحلي
    const savedContent = localStorage.getItem("studentGuideContent")
    if (savedContent) {
      setGuideContent(savedContent)
    }
  }, [])

  const handleSave = () => {
    if (!guideContent.trim()) {
      toast({
        title: "خطأ",
        description: "لا يمكن حفظ محتوى فارغ",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // حفظ المحتوى في التخزين المحلي
      localStorage.setItem("studentGuideContent", guideContent)

      // يمكن إضافة API لحفظ المحتوى على الخادم هنا

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ محتوى دليل الطالب بنجاح",
      })
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المحتوى",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-right">إدارة محتوى دليل الطالب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">
                قم بنسخ النص الكامل لدليل الطالب للقبول الموحد ولصقه هنا. سيتم استخدام هذا المحتوى كمصدر للذكاء
                الاصطناعي.
              </p>
            </div>

            <Textarea
              dir="rtl"
              value={guideContent}
              onChange={(e) => setGuideContent(e.target.value)}
              placeholder="انسخ النص الكامل لدليل الطالب هنا..."
              className="min-h-[500px] text-right"
            />

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "جاري الحفظ..." : "حفظ المحتوى"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
