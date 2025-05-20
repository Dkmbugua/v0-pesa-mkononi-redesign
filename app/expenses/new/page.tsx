"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Coffee, Bus, Gamepad2, BookOpen, ShoppingBag, School, Home } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

// Define expense categories
const categories = [
  { id: "food", name: "Food", icon: Coffee, color: "#2196F3" },
  { id: "transport", name: "Transport", icon: Bus, color: "#A8D08D" },
  { id: "entertainment", name: "Entertainment", icon: Gamepad2, color: "#FFEB3B" },
  { id: "education", name: "Education", icon: BookOpen, color: "#FF5722" },
  { id: "school", name: "School", icon: School, color: "#673AB7" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "#E91E63" },
  { id: "home", name: "Home", icon: Home, color: "#3F51B5" },
  { id: "cafe", name: "Cafe", icon: Coffee, color: "#FF9800" },
]

// Define income categories
const incomeCategories = [
  { id: "salary", name: "Salary", color: "#4CAF50" },
  { id: "allowance", name: "Allowance", color: "#00BCD4" },
  { id: "gift", name: "Gift", color: "#FFC107" },
  { id: "other", name: "Other", color: "#9E9E9E" },
]

export default function AddExpense() {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [mpesaMessage, setMpesaMessage] = useState("")
  const amountInputRef = useRef<HTMLInputElement>(null)

  // Updated function to extract info from M-Pesa message and auto-select type
  function parseMpesaMessage(message: string) {
    const amountMatch = message.match(/Ksh\s?([\d,]+(\.\d+)?)/i)
    const amountValue = amountMatch ? amountMatch[1].replace(/,/g, "") : ""
    const balanceMatch = message.match(/balance is Ksh\s?([\d,]+(\.\d+)?)/i)
    const balanceValue = balanceMatch ? balanceMatch[1].replace(/,/g, "") : ""
    let detectedType: 'income' | 'expense' = 'expense'
    let category: string | null = null
    if (/received/i.test(message)) detectedType = 'income'
    if (/paid|sent|purchased|bought|buy|withdrawn|withdraw/i.test(message)) detectedType = 'expense'
    // Guess category based on keywords
    if (detectedType === 'expense') {
      if (/food|restaurant|lunch|dinner|meal/i.test(message)) category = "food"
      else if (/bus|matatu|fare|uber|taxi|transport/i.test(message)) category = "transport"
      else if (/movie|game|entertainment|cinema/i.test(message)) category = "entertainment"
      else if (/school|fees|education|book/i.test(message)) category = "education"
      else if (/shopping|supermarket|mall/i.test(message)) category = "shopping"
      else if (/rent|house|home/i.test(message)) category = "home"
      else if (/cafe|coffee|tea/i.test(message)) category = "cafe"
    } else {
      if (/salary|pay|wage/i.test(message)) category = "salary"
      else if (/allowance|stipend/i.test(message)) category = "allowance"
      else if (/gift|present/i.test(message)) category = "gift"
      else category = "other"
    }
    return { amount: amountValue, balance: balanceValue, type: detectedType, category }
  }

  // When the user pastes an M-Pesa message
  function handleMpesaPaste(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const message = e.target.value
    setMpesaMessage(message)
    const { amount: amt, type: detectedType, category } = parseMpesaMessage(message)
    if (amt) setAmount(amt)
    if (detectedType) setType(detectedType)
    if (category) setSelectedCategory(category)
    if (amountInputRef.current) amountInputRef.current.focus()
  }

  // Choose categories based on type
  const currentCategories = type === 'expense' ? categories : incomeCategories

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Expense or Income</h1>
      <Card className="p-6">
        <form className="space-y-6">
          {/* Toggle for Expense/Income */}
          <div className="flex space-x-4 mb-2">
            <button
              type="button"
              className={`px-4 py-2 rounded ${type === 'expense' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${type === 'income' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>
          {/* Paste M-Pesa Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste M-Pesa Message</label>
            <Textarea
              placeholder="Paste your M-Pesa message here..."
              value={mpesaMessage}
              onChange={handleMpesaPaste}
              className="resize-none h-20"
            />
            <p className="text-xs text-gray-500">We'll try to auto-fill the amount, type, and category for you.</p>
          </div>
          {/* Amount Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (KSh)</label>
            <Input
              type="text"
              placeholder="KSh 0.00"
              className="text-lg"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              ref={amountInputRef}
            />
          </div>
          {/* Category Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="grid grid-cols-4 gap-4">
              {currentCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`flex flex-col items-center space-y-1 ${selectedCategory === category.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {/* Only render icon if it exists (expense categories), otherwise show first letter */}
                  {('icon' in category && category.icon) ? (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                      style={{ backgroundColor: category.color }}
                    >
                      {(() => {
                        const Icon = category.icon as React.ElementType;
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                      style={{ backgroundColor: category.color }}
                    >
                      <span className="text-white font-bold text-lg">{category.name[0]}</span>
                    </div>
                  )}
                  <span className="text-xs">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Notes Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea placeholder="Add any details about this transaction..." className="resize-none h-24" />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
            {type === 'expense' ? 'Add Expense' : 'Add Income'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
