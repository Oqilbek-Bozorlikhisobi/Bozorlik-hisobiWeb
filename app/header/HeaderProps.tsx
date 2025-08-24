"use client"

import { ShoppingCart, User, Home, History, Settings, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { deleteCookie } from "cookies-next"
import { useStore } from "@/store/userStore"
import { useShoppingStore } from "@/store/shoppingStore"
import api from "@/service/api"
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const languages = [
  { code: "uz", label: "Uzb", flag: "🇺🇿" },
  { code: "ru", label: "Рус", flag: "🇷🇺" },
  { code: "en", label: "Eng", flag: "🇬🇧" },
]

export default function Header() {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")

  const currentLang = i18n.language || "uz"
  const { clearUser } = useStore();
  const { shoppingList, setShoppingListAll } =
      useShoppingStore();
const getMarkets = async () => {
    try {
      const response = await api.get("/market");
      setShoppingListAll(response?.data?.data)
      return response.data;
    } catch (error: any) {
      console.error("Marketlarni olishda xatolik:", error);
      throw error;
    }
  };

  useEffect(() => {
    getMarkets()
  }, [])

  const handleBasketClick = () => router.push(`/basket`)
  const handleHistoryClick = () => router.push(`/history`)
  const handleHomeClick = () => router.push(`/`)
  const handleSettingsClick = () => router.push(`/profile`)

  const handleLogout = () => {
    deleteCookie("token")
    router.push("/login")
    clearUser()
  }

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header className="bg-white shadow-sm border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              
              <button onClick={handleSettingsClick} className="flex flex-col cursor-pointer items-center text-gray-600">
              <User className="h-8 w-8 text-blue-600" />
           
          </button>
              <button
                onClick={handleLogout}
                className="text-xl font-semibold cursor-pointer text-gray-900 focus:outline-none"
              >
                {t("logout")}
              </button>
              <p className="text-sm text-gray-500">{t("welcome")}</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Til select faqat desktopda */}
              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border rounded-lg px-2 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-[#09bcbf] hidden md:block"
              >
                {languages.map((lng) => (
                  <option key={lng.code} value={lng.code}>
                    {lng.flag} {lng.label}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleBasketClick}
                className="bg-[#09bcbf] relative cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t("basket")}
                {shoppingList?.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {shoppingList.length}
                  </Badge>
                )}
              </Button>
              <Button className="bg-[#09bcbf] cursor-pointer" onClick={handleHistoryClick}>
                {t("history")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVBAR */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-md">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <button onClick={handleHomeClick} className="flex cursor-pointer flex-col items-center text-gray-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">{t("home")}</span>
          </button>

          {/* LANGUAGE SELECT (Dialog) faqat mobil uchun */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex flex-col items-center cursor-pointer text-gray-600">
                <Languages className="h-6 w-6" />
                <span className="text-xs">{t("language")}</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("choose_language")}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-2 mt-4">
                {languages.map((lng) => (
                  <Button
                    key={lng.code}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleLanguageChange(lng.code)}
                  >
                    <span className="mr-2">{lng.flag}</span>
                    {lng.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Basket */}
          <button onClick={handleBasketClick} className="flex flex-col items-center cursor-pointer text-gray-600 relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs">{t("basket")}</span>
            {shoppingList?.length > 0 && (
              <Badge className="absolute top-0 right-3 h-4 w-4 rounded-full flex items-center justify-center text-[10px]">
                {shoppingList.length}
              </Badge>
            )}
          </button>

          {/* History */}
          <button onClick={handleHistoryClick} className="flex flex-col cursor-pointer items-center text-gray-600">
            <History className="h-6 w-6" />
            <span className="text-xs">{t("history")}</span>
          </button>

          {/* Settings */}
          <button onClick={handleSettingsClick} className="flex flex-col cursor-pointer items-center text-gray-600">
            <Settings className="h-6 w-6" />
            <span className="text-xs">{t("settings")}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
