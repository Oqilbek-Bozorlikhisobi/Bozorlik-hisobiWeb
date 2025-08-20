"use client"

import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

const languages = [
  { code: "uz", label: "O‘zbekcha", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
]

export default function Header({ shoppingList }: any) {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")
  const currentLang = i18n.language || "uz"

  const handleBasketClick = () => {
    router.push(`/basket`)
  }

  const handleHistoryClick = () => {
    router.push(`/history`)
  }

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Chap tomondagi user logosi */}
          <div className="flex items-center space-x-4">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Tog'ga</h1>
              <p className="text-sm text-gray-500">{t("welcome")}</p>
            </div>
          </div>

          {/* O'ng tomondagi tugmalar */}
          <div className="flex items-center space-x-4">
            {/* Til select */}
            <select
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border rounded-lg px-2 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-[#09bcbf]"
            >
              {languages.map((lng) => (
                <option key={lng.code} value={lng.code}>
                  {lng.flag} {lng.label}
                </option>
              ))}
            </select>

            {/* Savat tugmasi */}
            <Button onClick={handleBasketClick} className="bg-[#09bcbf] relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t("basket")}
              {shoppingList && shoppingList.items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {shoppingList.items.length}
                </Badge>
              )}
            </Button>

            {/* Tarix tugmasi */}
            <Button className="bg-[#09bcbf]" onClick={handleHistoryClick}>
              {t("history")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
