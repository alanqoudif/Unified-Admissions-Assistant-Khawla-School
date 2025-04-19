"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface SuggestedQuestionsProps {
  questions: string[]
  onSelectQuestion: (question: string) => void
  className?: string
  title?: string
}

export function SuggestedQuestions({
  questions,
  onSelectQuestion,
  className = "",
  title = "أسئلة مقترحة:",
}: SuggestedQuestionsProps) {
  if (!questions.length) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1 text-xs text-purple-700">
        <HelpCircle className="h-3 w-3" />
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-800"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
