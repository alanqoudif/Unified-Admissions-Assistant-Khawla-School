"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Sparkles, HelpCircle } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { WelcomeDialog } from "@/components/welcome-dialog"

type Message = {
  role: "user" | "assistant"
  content: string
  id?: number
}

// إضافة مجموعة متنوعة من رسائل التحميل
const LOADING_MESSAGES = [
  "أنا أبحث في دليل الطالب للإجابة على سؤالكِ...",
  "لحظة من فضلكِ، أنا أفكر في إجابة مناسبة...",
  "جاري البحث في دليل القبول الموحد...",
  "أنا أتصفح دليل الطالب للعثور على المعلومات المناسبة...",
  "دعيني أفكر قليلاً في سؤالكِ...",
  "أنا أراجع المعلومات في دليل الطالب...",
  "جاري تحليل سؤالكِ للعثور على أفضل إجابة...",
  "لحظة واحدة، أبحث عن المعلومات الدقيقة لكِ...",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "مرحباً بكِ يا طالبتي العزيزة! أنا أخصائية التوجيه المهني، وأنا هنا لمساعدتكِ في كل ما يتعلق بدليل القبول الموحد. كيف يمكنني مساعدتكِ اليوم؟",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [avatarError, setAvatarError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showWelcomeAgain, setShowWelcomeAgain] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // التركيز على حقل الإدخال عند تحميل الصفحة
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const getRandomLoadingMessage = () => {
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length)
    return LOADING_MESSAGES[randomIndex]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const loadingMessageId = Date.now()
    setMessages((prev) => [...prev, { role: "assistant", content: getRandomLoadingMessage(), id: loadingMessageId }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في الاتصال")
      }

      const data = await response.json()

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessageId)
          .concat({
            role: "assistant",
            content: data.response,
          }),
      )
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessageId)
          .concat({
            role: "assistant",
            content: "عذراً يا طالبتي العزيزة، حدث خطأ في معالجة طلبكِ. يرجى المحاولة مرة أخرى.",
          }),
      )
    } finally {
      setIsLoading(false)
      // التركيز على حقل الإدخال بعد الإرسال
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const resetWelcomeDialog = () => {
    localStorage.removeItem("hasSeenWelcome")
    setShowWelcomeAgain(!showWelcomeAgain)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50">
      <WelcomeDialog key={showWelcomeAgain ? "show" : "hide"} />

      <header className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white py-3 px-3 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white/20">
              <AvatarImage src="/school-logo.png" alt="شعار مدرسة خولة بنت حكيم" />
              <AvatarFallback className="bg-purple-700">أ</AvatarFallback>
            </Avatar>
            <h1 className="text-lg md:text-xl font-bold">مساعد القبول الموحد</h1>
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
                        className={`h-7 w-7 md:h-8 md:w-8 ${message.role === "assistant" ? "bg-purple-600" : "bg-slate-600"} ring-2 ${message.role === "assistant" ? "ring-purple-200" : "ring-blue-100"}`}
                      >
                        <AvatarFallback className="text-xs md:text-sm">
                          {message.role === "assistant" ? "أ" : "أ"}
                        </AvatarFallback>
                        {message.role === "assistant" && !avatarError && (
                          <AvatarImage
                            src="/school-logo.png"
                            alt="أخصائية التوجيه المهني"
                            onError={() => setAvatarError(true)}
                          />
                        )}
                      </Avatar>
                      <div
                        className={`p-2 md:p-3 rounded-2xl shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-100 to-blue-50 text-slate-800"
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
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                placeholder="اكتبي سؤالكِ هنا..."
                className="flex-1 text-right h-10 md:h-12 text-sm md:text-base border-purple-200 focus-visible:ring-purple-400"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 md:h-12 px-3 md:px-4 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
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
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-gradient-to-r from-purple-100 to-indigo-50 text-slate-600 py-3 px-3 text-center text-xs border-t">
        <div className="container mx-auto">
          <div className="mb-2">
            <p className="font-bold mb-1 text-purple-800">مدرسة خولة بنت حكيم</p>
            <Separator className="my-1 bg-purple-200 mx-auto w-16" />
            <p className="font-bold text-purple-700 mb-1">أخصائيات التوجيه المهني:</p>
            <div className="flex flex-wrap justify-center gap-x-4 text-slate-700">
              <p>إيمان سعيد البهانتة</p>
              <p>فاطمة علي بيت سعيد</p>
              <p>طفول بخيت فيطون</p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} مدرسة خولة بنت حكيم - جميع الحقوق محفوظة</p>
          <p className="mt-1 text-purple-600 text-xs">مشغل بواسطة "نقطة"</p>
        </div>
      </footer>
    </div>
  )
}
