import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock } from "lucide-react"

type MessageQuotaProps = {
  remaining: number
  total: number
  resetTimeInMinutes: number
}

export function MessageQuota({ remaining, total, resetTimeInMinutes }: MessageQuotaProps) {
  // تحديد لون الشارة بناءً على عدد الرسائل المتبقية
  const getVariant = () => {
    const percentage = (remaining / total) * 100
    if (percentage <= 10) return "danger"
    if (percentage <= 30) return "warning"
    return "success"
  }

  // تحديد ما إذا كان يجب عرض تحذير
  const showWarning = remaining <= 5

  return (
    <div className="flex flex-col items-center">
      <Badge variant={getVariant()} className="mb-1 px-3 py-1 text-xs">
        <span className="ml-1">الرسائل المتبقية:</span> {remaining} / {total}
        <span className="mr-1 text-xs opacity-80"> (تتجدد بعد ساعة)</span>
      </Badge>

      {showWarning && (
        <div className="flex items-center text-xs text-red-500 mt-1 gap-1 bg-red-50 px-2 py-1 rounded-md">
          <AlertCircle className="h-3 w-3" />
          {remaining === 0 ? (
            <span>لقد نفد رصيدك من الأسئلة. سيتجدد الرصيد بعد {resetTimeInMinutes} دقيقة.</span>
          ) : (
            <span>
              تنبيه: لديك {remaining} {remaining === 1 ? "سؤال" : "أسئلة"} متبقية فقط! سيتجدد رصيدك بعد ساعة من آخر
              سؤال.
            </span>
          )}
          <Clock className="h-3 w-3" />
        </div>
      )}
    </div>
  )
}
