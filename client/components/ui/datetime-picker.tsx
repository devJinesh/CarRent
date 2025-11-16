"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  minDate?: Date
  disabled?: boolean
}

export function DateTimePicker({
  date,
  setDate,
  label,
  placeholder = "Select date and time",
  minDate,
  disabled = false,
}: DateTimePickerProps) {
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const formatDisplay = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setDate(new Date(e.target.value))
    } else {
      setDate(undefined)
    }
  }

  const minDateString = minDate ? formatDateTimeLocal(minDate) : undefined

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="datetime-local"
          value={date ? formatDateTimeLocal(date) : ''}
          onChange={handleChange}
          min={minDateString}
          disabled={disabled}
          className="w-full h-12 px-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-background text-foreground font-medium hover:border-primary/50 cursor-pointer"
        />
        {date && (
          <div className="mt-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg">
            <span className="text-sm text-muted-foreground">Selected: </span>
            <span className="text-sm font-bold text-foreground">{formatDisplay(date)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
