"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Sparkles, HelpCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { WelcomeDialog } from "@/components/welcome-dialog"

type Message = {
  role: "user" | "assistant" | "error"
  content: string
  id?: number
}

// إضافة مجموعة متنوعة من رسائل التحميل محايدة الجنس
const LOADING_MESSAGES = [
  "جاري البحث في دليل الطالب للإجابة على سؤالك...",
  "لحظة من فضلك، أنا أفكر في إجابة مناسبة...",
  "جاري البحث في دليل القبول الموحد...",
  "أنا أتصفح دليل الطالب للعثور على المعلومات المناسبة...",
  "دعني أفكر قليلاً في سؤالك...",
  "أنا أراجع المعلومات في دليل الطالب...",
  "جاري تحليل سؤالك للعثور على أفضل إجابة...",
  "لحظة واحدة، أبحث عن المعلومات الدقيقة لك...",
]

// أضف هذا المتغير بعد تعريف المتغيرات الأخرى
const welcomeMessage =
  "أعزائي الطلبه، مرحباً بكم! أنا مساعد القبول الموحد، وأنا هنا لمساعدتكم في كل ما يتعلق بدليل القبول الموحد لمؤسسات التعليم العالي. كيف يمكنني مساعدتكم اليوم؟"

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "مرحباً بك! أنا مساعد القبول الموحد، وأنا هنا لمساعدتك في كل ما يتعلق بدليل القبول الموحد لمؤسسات التعليم العالي. كيف يمكنني مساعدتك اليوم؟",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [avatarError, setAvatarError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showWelcomeAgain, setShowWelcomeAgain] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const [lastUserMessage, setLastUserMessage] = useState<string>("")
  const [isRetrying, setIsRetrying] = useState(false)
  const [silentRetry, setSilentRetry] = useState(false)
  const [guideContent, setGuideContent] = useState<string>("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // التركيز على حقل الإدخال عند تحميل الصفحة
  useEffect(() => {
    // إضافة رسالة الترحيب الافتراضية عند تحميل الصفحة
    setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        content: welcomeMessage,
      },
    ])

    // باقي الكود يبقى كما هو
    const fetchGuideContent = async () => {
      try {
        const response = await fetch("/api/guide-content")
        if (!response.ok) {
          throw new Error("Failed to fetch guide content")
        }
        const data = await response.json()
        setGuideContent(data.content)
      } catch (error) {
        console.error("Error fetching guide content:", error)
      }
    }

    fetchGuideContent()
  }, [])

  const getRandomLoadingMessage = () => {
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length)
    return LOADING_MESSAGES[randomIndex]
  }

  const handleSubmit = async (e: React.FormEvent, retryMessage?: string) => {
    e.preventDefault()

    // استخدم الرسالة المعاد محاولتها أو الإدخال الجديد
    const messageContent = retryMessage || input

    if (!messageContent.trim()) return

    // إذا لم تكن هذه محاولة إعادة، احفظ الرسالة الأخيرة للمستخدم
    if (!retryMessage) {
      setLastUserMessage(messageContent)
    }

    const userMessage: Message = {
      role: "user",
      content: messageContent,
    }

    // إذا لم تكن هذه محاولة إعادة، أضف رسالة المستخدم إلى المحادثة
    if (!retryMessage) {
      setMessages((prev) => [...prev, userMessage])
      setInput("")
    }

    setIsLoading(true)
    setIsRetrying(!!retryMessage)

    // إنشاء معرف فريد لرسالة التحميل
    const loadingMessageId = Date.now()

    // إضافة رسالة التحميل فقط إذا لم تكن محاولة صامتة
    if (!silentRetry) {
      setMessages((prev) => [...prev, { role: "assistant", content: getRandomLoadingMessage(), id: loadingMessageId }])
    }

    try {
      console.log("Sending request to chat API...")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages.filter((msg) => msg.role !== "error"), userMessage],
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`)
      }

      // إزالة رسالة التحميل وإضافة الرد
      setMessages((prev) => {
        // إذا كانت محاولة صامتة، استبدل آخر رسالة خطأ بالرد
        if (silentRetry) {
          const newMessages = [...prev]
          // البحث عن آخر رسالة خطأ واستبدالها
          for (let i = newMessages.length - 1; i >= 0; i--) {
            if (newMessages[i].role === "error") {
              newMessages[i] = {
                role: "assistant",
                content: data.response,
              }
              return newMessages
            }
          }
          // إذا لم نجد رسالة خطأ، أضف الرد كالمعتاد
          return [...newMessages, { role: "assistant", content: data.response }]
        } else {
          // إزالة رسالة التحميل وإضافة الرد
          return prev
            .filter((msg) => msg.id !== loadingMessageId)
            .concat({
              role: "assistant",
              content: data.response,
            })
        }
      })

      // إعادة تعيين عداد المحاولات عند النجاح
      setRetryCount(0)
      setIsRetrying(false)
      setSilentRetry(false)
    } catch (error) {
      console.error("Error:", error)

      // إذا كانت محاولة صامتة، لا تغير الرسائل
      if (!silentRetry) {
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== loadingMessageId)
            .concat({
              role: "error",
              content: "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
            }),
        )
      }

      // زيادة عداد المحاولات
      setRetryCount((prev) => prev + 1)

      // إذا لم نصل إلى الحد الأقصى للمحاولات، حاول مرة أخرى تلقائيًا بعد ثانيتين
      if (retryCount < maxRetries - 1) {
        setTimeout(() => {
          setSilentRetry(true) // تعيين المحاولة التالية كمحاولة صامتة
          handleSubmit(e, messageContent)
        }, 1500)
      } else {
        setIsRetrying(false)
        setSilentRetry(false)
      }
    } finally {
      setIsLoading(false)
      // التركيز على حقل الإدخال بعد الإرسال
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  // وظيفة لإعادة المحاولة مع آخر رسالة للمستخدم
  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault()
    if (lastUserMessage && !isLoading && !isRetrying) {
      setRetryCount(0) // إعادة تعيين عداد المحاولات عند الضغط على زر إعادة المحاولة يدويًا
      setSilentRetry(false) // تأكد من أن المحاولة اليدوية ليست صامتة
      handleSubmit(e as unknown as React.FormEvent, lastUserMessage)
    }
  }

  // تحديث وظيفة resetWelcomeDialog لتكون أكثر وضوحًا
  const resetWelcomeDialog = () => {
    // إزالة علامة "hasSeenWelcome" من التخزين المحلي
    // هذا سيجعل البطاقة المنبثقة تظهر مرة أخرى في المرة القادمة
    localStorage.removeItem("hasSeenWelcome")
    // تحديث حالة لإعادة تحميل مكون WelcomeDialog
    setShowWelcomeAgain(!showWelcomeAgain)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50">
      <WelcomeDialog key={showWelcomeAgain ? "show" : "hide"} />

      <header className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white py-3 px-3 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white/20">
              <AvatarImage src="/school-logo.png" alt="شعار مدرسة خولة بنت حكيم للتعليم الأساسي(10-12)" />
              <AvatarFallback className="bg-purple-700">أ</AvatarFallback>
            </Avatar>
            <h1 className="text-lg md:text-xl font-bold">
              Admission
              <br />
              المساعد الذكي للقبول الموحد
            </h1>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={resetWelcomeDialog}
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">المساعدة</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-2 md:p-6 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-purple-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="py-2 px-3 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="text-center text-purple-800 flex items-center justify-center gap-1 text-sm md:text-base">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>دليل القبول الموحد لمؤسسات التعليم العالي</span>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-18rem)]">
              <div className="p-3 space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start gap-2 max-w-[90%] md:max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        className={`h-7 w-7 md:h-8 md:w-8 ${
                          message.role === "assistant"
                            ? "bg-purple-600"
                            : message.role === "error"
                              ? "bg-red-600"
                              : "bg-slate-600"
                        } ring-2 ${
                          message.role === "assistant"
                            ? "ring-purple-200"
                            : message.role === "error"
                              ? "ring-red-200"
                              : "ring-blue-100"
                        }`}
                      >
                        <AvatarFallback className="text-xs md:text-sm">
                          {message.role === "assistant" ? "أ" : message.role === "error" ? "!" : "م"}
                        </AvatarFallback>
                        {message.role === "assistant" && !avatarError && (
                          <AvatarImage
                            src="/school-logo.png"
                            alt="مساعد القبول الموحد"
                            onError={() => setAvatarError(true)}
                          />
                        )}
                        {message.role === "error" && <AlertCircle className="h-4 w-4 text-white" />}
                      </Avatar>
                      <div
                        className={`p-2 md:p-3 rounded-2xl shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-100 to-blue-50 text-slate-800"
                            : message.role === "error"
                              ? "bg-gradient-to-r from-red-100 to-red-50 text-slate-800"
                              : "bg-gradient-to-r from-purple-100 to-purple-50 text-slate-800"
                        }`}
                        style={{ direction: "rtl" }}
                      >
                        {message.id ? (
                          <div className="flex items-center">
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content} <span className="inline-block animate-pulse">...</span>
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.role === "error" && lastUserMessage && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs bg-white/50 hover:bg-white"
                                onClick={handleRetry}
                                disabled={isLoading || retryCount >= maxRetries || isRetrying}
                              >
                                <RefreshCw className={`h-3 w-3 ml-1 ${isRetrying ? "animate-spin" : ""}`} />
                                {isRetrying ? "جاري المحاولة..." : "إعادة المحاولة"}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 text-right h-10 md:h-12 text-sm md:text-base border-purple-200 focus-visible:ring-purple-400"
                disabled={isLoading || retryCount >= maxRetries || isRetrying}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim() || retryCount >= maxRetries || isRetrying}
                className="h-10 md:h-12 px-3 md:px-4 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading || isRetrying ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : isMobile ? (
                  <Send className="h-5 w-5" />
                ) : (
                  <>
                    <Send className="h-5 w-5 ml-2" />
                    <span>إرسال</span>
                  </>
                )}
              </Button>
            </form>
            {retryCount >= maxRetries && !isRetrying && !silentRetry && (
              <div className="mt-2 text-center text-red-600 text-sm">
                عذراً، لم نتمكن من معالجة طلبك في الوقت الحالي. يرجى المحاولة لاحقاً.
              </div>
            )}
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-gradient-to-r from-purple-100 to-indigo-50 text-slate-700 py-3 px-3 text-center text-xs border-t">
        <div className="container mx-auto">
          <div className="mb-2">
            <p className="font-bold mb-1 text-purple-900">مدرسة خولة بنت حكيم للتعليم الأساسي(10-12)</p>
            <Separator className="my-1 bg-purple-300 mx-auto w-16" />
            <p className="font-bold text-purple-800 mb-1">أخصائيات التوجيه المهني:</p>
            <div className="flex flex-wrap justify-center gap-x-4 text-slate-700">
              <p>إيمان سعيد البهانتة</p>
              <p>فاطمة علي بيت سعيد</p>
              <p>طفول بخيت فيطون</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <a
              href="https://x.com/khwlaschool"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-800 hover:text-purple-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              <span>@khwlaschool</span>
            </a>
          </div>
          <p>© {new Date().getFullYear()} مدرسة خولة بنت حكيم للتعليم الأساسي(10-12) - جميع الحقوق محفوظة</p>
          <p className="mt-1 text-purple-800 text-xs">مشغل بواسطة "نقطة"</p>
        </div>
      </footer>
    </div>
  )
}
