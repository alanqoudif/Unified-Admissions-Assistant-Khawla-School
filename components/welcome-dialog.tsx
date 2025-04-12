"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Search, Sparkles, BookOpen, GraduationCap, School } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    // التحقق مما إذا كان المستخدم قد رأى الصفحة المنبثقة من قبل
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
    if (!hasSeenWelcome) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    // تخزين أن المستخدم قد رأى الصفحة المنبثقة
    localStorage.setItem("hasSeenWelcome", "true")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-white to-purple-50"
        dir="rtl"
      >
        <DialogHeader className="p-4 pb-2 bg-gradient-to-r from-purple-100 to-indigo-50">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-purple-800 flex items-center justify-center gap-2">
            <School className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <span>مرحباً بك في مساعد القبول الموحد</span>
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 text-sm sm:text-base">
            دليلك الذكي للإجابة على جميع استفساراتك حول القبول الموحد
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="features">المميزات</TabsTrigger>
            <TabsTrigger value="howto">طريقة الاستخدام</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3">
              <Card>
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-purple-700">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>محادثة ذكية</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-3">
                  <p className="text-xs sm:text-sm text-slate-600">
                    تفاعل مع مساعد ذكي يجيب على جميع أسئلتك حول القبول الموحد بدقة وسرعة.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-purple-700">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>معلومات شاملة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-3">
                  <p className="text-xs sm:text-sm text-slate-600">
                    احصل على معلومات دقيقة من دليل القبول الموحد الرسمي لمؤسسات التعليم العالي.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-purple-700">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>دليل متكامل</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-3">
                  <p className="text-xs sm:text-sm text-slate-600">
                    يغطي جميع جوانب القبول الموحد من التخصصات والشروط إلى إجراءات التسجيل والمفاضلة.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-purple-700">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>توجيه مهني</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-3">
                  <p className="text-xs sm:text-sm text-slate-600">
                    مصمم من قبل أخصائيات التوجيه المهني لمساعدتك في اتخاذ القرارات المناسبة لمستقبلك الأكاديمي.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="howto" className="p-3 sm:p-4">
            <Card>
              <CardHeader className="py-3 px-3">
                <CardTitle className="text-lg sm:text-xl text-purple-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>كيفية استخدام المساعد</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  استفد من مساعد القبول الموحد بأقصى درجة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 py-1 px-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-purple-700">1. اطرح سؤالك</h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    اكتب سؤالك في حقل الإدخال أسفل الشاشة واضغط على زر "إرسال".
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-purple-700">2. أسئلة مقترحة</h3>
                  <p className="text-xs sm:text-sm text-slate-600">يمكنك سؤال المساعد عن:</p>
                  <ul className="text-xs sm:text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>شروط القبول في تخصص معين</li>
                    <li>المؤسسات التي تقدم تخصصًا محددًا</li>
                    <li>مواعيد التسجيل والقبول</li>
                    <li>كيفية حساب النسبة الموزونة</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-purple-700">3. متابعة المحادثة</h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    يمكنك متابعة المحادثة وطرح أسئلة إضافية للحصول على مزيد من التفاصيل.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
          <Button onClick={handleClose} className="w-full bg-purple-600 hover:bg-purple-700">
            ابدأ الاستخدام الآن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
