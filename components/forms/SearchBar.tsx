'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ placeholder = 'Search...', value, onChange }: SearchBarProps) {
  return (
    <Input
      icon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-900 border-zinc-700"
    />
  )
}
