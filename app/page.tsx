"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Check, Edit3, Trash2, User } from "lucide-react"
import Image from "next/image"

// Types
interface Product {
  id: string
  name: string
  category: string
  image: string
  unit: string
}

interface ShoppingItem {
  id: string
  product: Product
  quantity: number
  purchased: boolean
  actualPrice?: number
}

interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  createdAt: Date
  completedAt?: Date
}

// Sample products data in Uzbek
const products: Product[] = [
  // Sabzavotlar (Vegetables)
  {
    id: "v1",
    name: "Pomidor",
    category: "sabzavotlar",
    image: "/images/pomidor.png",
    unit: "kg",
  },
  {
    id: "v2",
    name: "Sabzi",
    category: "sabzavotlar",
    image: "/images/sabzi.png",
    unit: "kg",
  },
  {
    id: "v3",
    name: "Piyoz",
    category: "sabzavotlar",
    image: "/images/piyoz.png",
    unit: "kg",
  },
  {
    id: "v4",
    name: "Kartoshka",
    category: "sabzavotlar",
    image: "/images/kartoshka.png",
    unit: "kg",
  },
  {
    id: "v5",
    name: "Bodring",
    category: "sabzavotlar",
    image: "/images/bodring.png",
    unit: "kg",
  },
  {
    id: "v6",
    name: "Qalampir",
    category: "sabzavotlar",
    image: "/images/qalampir.png",
    unit: "kg",
  },

  // Mevalar (Fruits)
  {
    id: "f1",
    name: "Olma",
    category: "mevalar",
    image: "/images/olma.png",
    unit: "kg",
  },
  {
    id: "f2",
    name: "Banan",
    category: "mevalar",
    image: "/images/banan.png",
    unit: "kg",
  },
  {
    id: "f3",
    name: "Apelsin",
    category: "mevalar",
    image: "/images/apelsin.png",
    unit: "kg",
  },
  {
    id: "f4",
    name: "Uzum",
    category: "mevalar",
    image: "/images/uzum.png",
    unit: "kg",
  },
  {
    id: "f5",
    name: "Qulupnay",
    category: "mevalar",
    image: "/images/qulupnay.png",
    unit: "kg",
  },

  // Ichimliklar (Drinks)
  {
    id: "d1",
    name: "Suv",
    category: "ichimliklar",
    image: "/images/suv.png",
    unit: "shisha",
  },
  {
    id: "d2",
    name: "Apelsin sharbati",
    category: "ichimliklar",
    image: "/images/apelsin-sharbati.png",
    unit: "shisha",
  },
  {
    id: "d3",
    name: "Sut",
    category: "ichimliklar",
    image: "/images/sut.png",
    unit: "litr",
  },
  {
    id: "d4",
    name: "Qahva",
    category: "ichimliklar",
    image: "/images/qahva.png",
    unit: "paket",
  },
  {
    id: "d5",
    name: "Choy",
    category: "ichimliklar",
    image: "/images/choy.png",
    unit: "paket",
  },

  // Yog' mahsulotlari (Oil Products)
  {
    id: "o1",
    name: "Zaytun yog'i",
    category: "yog-mahsulotlari",
    image: "/images/zaytun-yogi.png",
    unit: "shisha",
  },
  {
    id: "o2",
    name: "Kungaboqar yog'i",
    category: "yog-mahsulotlari",
    image: "/images/kungaboqar-yogi.png",
    unit: "shisha",
  },
  {
    id: "o3",
    name: "Sariyog'",
    category: "yog-mahsulotlari",
    image: "/images/sariyog.png",
    unit: "paket",
  },
  {
    id: "o4",
    name: "Margarin",
    category: "yog-mahsulotlari",
    image: "/images/margarin.png",
    unit: "paket",
  },
]

const categories = [
  { id: "sabzavotlar", name: "Sabzavotlar", icon: "🥕", description: "Sog'lom ovqatlar uchun yangi sabzavotlar" },
  { id: "mevalar", name: "Mevalar", icon: "🍎", description: "Shirin va foydali mevalar" },
  { id: "ichimliklar", name: "Ichimliklar", icon: "🥤", description: "Ichimliklar va tetiklantiruvchi mahsulotlar" },
  { id: "yog-mahsulotlari", name: "Yog' mahsulotlari", icon: "🫒", description: "Pishirish uchun yog'lar va sariyog'" },
]

const banners = [
  {
    id: 1,
    title: "Maktab bozori",
    discount: "15",
    subtitle: "Uzum Karta bilan foydalirog",
    bgColor: "from-purple-600 via-purple-500 to-pink-500",
    image: "/placeholder.svg?height=120&width=120&text=Happy+Girl",
  },
  {
    id: 2,
    title: "Yoz chegirmalari",
    discount: "25",
    subtitle: "Barcha mevalar uchun",
    bgColor: "from-orange-500 via-red-500 to-pink-500",
    image: "/placeholder.svg?height=120&width=120&text=Summer+Sale",
  },
  {
    id: 3,
    title: "Yangi mahsulotlar",
    discount: "10",
    subtitle: "Birinchi xaridingizda",
    bgColor: "from-green-500 via-blue-500 to-purple-500",
    image: "/placeholder.svg?height=120&width=120&text=New+Products",
  },
  {
    id: 4,
    title: "Hafta soni takliflar",
    discount: "30",
    subtitle: "Tanlangan mahsulotlarda",
    bgColor: "from-blue-600 via-indigo-500 to-purple-600",
    image: "/placeholder.svg?height=120&width=120&text=Weekly+Deal",
  },
]

// Mock registered users for demonstration
const registeredUsers = [
  { id: "1", name: "Aziz Karimov", phone: "+998901234567" },
  { id: "2", name: "Malika Tosheva", phone: "+998907654321" },
  { id: "3", name: "Bobur Aliyev", phone: "+998909876543" },
  { id: "4", name: "Nigora Rahimova", phone: "+998905555555" },
]

export default function ShoppingPlatform() {
  const [currentView, setCurrentView] = useState<"categories" | "products" | "basket" | "history">("categories")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)
  const [listName, setListName] = useState("")
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)
  const [showPriceDialog, setShowPriceDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null)
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingList[]>([])
  const [pendingCategory, setPendingCategory] = useState<string>("")
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [sharePhoneNumber, setSharePhoneNumber] = useState("")
  const [foundUsers, setFoundUsers] = useState<Array<{ id: string; name: string; phone: string }>>([])

  // Auto-rotate banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 4000) // Change banner every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const handleStartShopping = () => {
    if (listName.trim()) {
      // Create new shopping list
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: listName,
        items: [],
        createdAt: new Date(),
      }
      setShoppingList(newList)
      setShowStartDialog(false)
      setListName("")

      // If there was a pending category selection, go to products
      if (pendingCategory) {
        setSelectedCategory(pendingCategory)
        setCurrentView("products")
        setPendingCategory("")
      } else {
        setCurrentView("categories")
      }
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    // If no active shopping list, prompt user to create one first
    if (!shoppingList) {
      setPendingCategory(categoryId)
      setShowStartDialog(true)
      return
    }

    // If shopping list exists, proceed normally
    setSelectedCategory(categoryId)
    setCurrentView("products")
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setQuantity("")
    setShowQuantityDialog(true)
  }

  const handleAddToBasket = () => {
    if (selectedProduct && quantity && shoppingList) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        product: selectedProduct,
        quantity: Number.parseFloat(quantity),
        purchased: false,
      }

      setShoppingList({
        ...shoppingList,
        items: [...shoppingList.items, newItem],
      })

      setShowQuantityDialog(false)
      setSelectedProduct(null)
      setQuantity("")
    }
  }

  const handleMarkAsPurchased = (item: ShoppingItem) => {
    setSelectedItem(item)
    setPrice("")
    setShowPriceDialog(true)
  }

  const handleSavePrice = () => {
    if (selectedItem && price && shoppingList) {
      const updatedItems = shoppingList.items.map((item) =>
        item.id === selectedItem.id ? { ...item, purchased: true, actualPrice: Number.parseFloat(price) } : item,
      )

      setShoppingList({
        ...shoppingList,
        items: updatedItems,
      })

      setShowPriceDialog(false)
      setSelectedItem(null)
      setPrice("")
    }
  }

  const handleRemoveItem = (itemId: string) => {
    if (shoppingList) {
      setShoppingList({
        ...shoppingList,
        items: shoppingList.items.filter((item) => item.id !== itemId),
      })
    }
  }

  const handleCompleteShopping = () => {
    if (shoppingList && isShoppingComplete()) {
      const completedList = {
        ...shoppingList,
        completedAt: new Date(),
      }

      setShoppingHistory((prev) => [completedList, ...prev])

      // Reset shopping list to null (clear the header)
      setShoppingList(null)
      setCurrentView("categories")
    }
  }

  const isShoppingComplete = () => {
    if (!shoppingList || shoppingList.items.length === 0) return false
    return shoppingList.items.every((item) => item.purchased)
  }

  const getTotalExpense = () => {
    if (!shoppingList) return 0
    return shoppingList.items
      .filter((item) => item.purchased && item.actualPrice)
      .reduce((total, item) => total + (item.actualPrice || 0), 0)
  }

  const getPurchasedCount = () => {
    if (!shoppingList) return 0
    return shoppingList.items.filter((item) => item.purchased).length
  }

  const handleShareList = () => {
    setShowShareDialog(true)
    setSharePhoneNumber("")
    setFoundUsers([])
  }

  const handlePhoneNumberChange = (phone: string) => {
    setSharePhoneNumber(phone)
    if (phone.length >= 8) {
      // Search for users with matching phone numbers
      const matches = registeredUsers.filter(
        (user) => user.phone.includes(phone) || user.phone.replace(/\D/g, "").includes(phone.replace(/\D/g, "")),
      )
      setFoundUsers(matches)
    } else {
      setFoundUsers([])
    }
  }

  const handleSendToUser = (user: { id: string; name: string; phone: string }) => {
    // Simulate sending the list
    alert(`Ro'yxat ${user.name}ga yuborildi!`)
    setShowShareDialog(false)
    setSharePhoneNumber("")
    setFoundUsers([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Info */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Tog'ga</h1>
                <p className="text-sm text-gray-500">Xush kelibsiz!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={currentView === "basket" ? "default" : "outline"}
                onClick={() => setCurrentView("basket")}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Savat
                {shoppingList && shoppingList.items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {shoppingList.items.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant={currentView === "history" ? "default" : "outline"}
                onClick={() => setCurrentView("history")}
              >
                Tarix
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories View */}
        {currentView === "categories" && (
          <div>
            {/* Shopping List Info Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center space-x-4">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{shoppingList?.name || ""}</h2>
                    <p className="text-sm text-gray-500">
                      {shoppingList
                        ? `${getPurchasedCount()} dan ${shoppingList.items.length} ta mahsulot sotib olindi`
                        : "Faol bozorlik ro'yxati yo'q"}
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowStartDialog(true)} className="bg-green-600 hover:bg-green-700 text-white">
                  🛒 Bozorlik
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mahsulotlar va turkumlar izlash"
                />
              </div>
            </div>

            {/* Promotional Banner Carousel */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                >
                  {banners.map((banner, index) => (
                    <div key={banner.id} className={`w-full flex-shrink-0 bg-gradient-to-r ${banner.bgColor} p-6`}>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white mb-2">{banner.title}</h2>
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="bg-white text-purple-600 text-2xl font-bold px-4 py-2 rounded-lg">
                              {banner.discount}
                            </span>
                            <span className="text-white text-sm">% chegirma</span>
                          </div>
                          <p className="text-white/90 text-sm">{banner.subtitle}</p>
                        </div>
                        <div className="flex-shrink-0 ml-6">
                          <img
                            src={banner.image || "/placeholder.svg"}
                            alt={banner.title}
                            className="h-24 w-24 object-cover rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-white/10 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-16 w-16 bg-white/10 rounded-full"></div>
                    </div>
                  ))}
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentBannerIndex ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Turkum tanlang</h2>
              <p className="text-gray-600">Ro'yxatingizga mahsulot qo'shish uchun turkumni tanlang</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products View */}
        {currentView === "products" && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600">Bozorlik ro'yxatingizga qo'shish uchun mahsulotni bosing</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("categories")}>
                Turkumlarga qaytish
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter((product) => product.category === selectedCategory)
                .map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => handleProductSelect(product)}
                  >
                    <CardContent className="p-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h3 className="font-semibold text-center">{product.name}</h3>
                      <p className="text-sm text-gray-500 text-center">har {product.unit}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Basket View */}
        {currentView === "basket" && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bozorlik savati</h2>
                <p className="text-gray-600">Bozorlik jarayoni va xarajatlaringizni kuzatib boring</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("categories")}>
                Ko'proq mahsulot qo'shish
              </Button>
            </div>

            {!shoppingList || shoppingList.items.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Savatingiz bo'sh</h3>
                  <p className="text-gray-600 mb-4">Bozorlik ro'yxatingizga mahsulot qo'shishni boshlang</p>
                  <Button onClick={() => setCurrentView("categories")}>Turkumlarni ko'rish</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {shoppingList.items.map((item) => (
                  <Card key={item.id} className={item.purchased ? "bg-green-50 border-green-200" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="rounded-md"
                          />
                          <div>
                            <h3 className={`font-semibold ${item.purchased ? "line-through text-green-700" : ""}`}>
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.product.unit}
                            </p>
                            {item.purchased && item.actualPrice && (
                              <p className="text-sm font-semibold text-green-700">
                                To'landi: {item.actualPrice.toFixed(2)} so'm
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.purchased ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Sotib olindi
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsPurchased(item)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Sotib olindi deb belgilash
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="mt-4 mb-4">
                  <Button
                    onClick={handleShareList}
                    variant="outline"
                    className="w-full py-3 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    📤 Ro'yxatni ulashish
                  </Button>
                </div>

                <Separator />

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Bozorlik xulosasi</h3>
                        <p className="text-sm text-blue-700">
                          {getPurchasedCount()} dan {shoppingList.items.length} ta mahsulot sotib olindi
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-900">{getTotalExpense().toFixed(2)} so'm</p>
                        <p className="text-sm text-blue-700">Jami sarflangan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {shoppingList?.items.length > 0 && (
              <Card className="mt-4">
                <CardContent className="p-4 text-center">
                  <Button
                    onClick={handleCompleteShopping}
                    disabled={!isShoppingComplete()}
                    className={`w-full py-3 text-lg ${
                      isShoppingComplete() ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                    size="lg"
                  >
                    {isShoppingComplete() ? "🎉 Bozorlik yakunlandi" : "Barcha mahsulotlarni sotib oling"}
                  </Button>
                  {!isShoppingComplete() && (
                    <p className="text-sm text-gray-500 mt-2">
                      {shoppingList.items.length - getPurchasedCount()} ta mahsulot qoldi
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* History View */}
        {currentView === "history" && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bozorlik tarixi</h2>
                <p className="text-gray-600">Yakunlangan bozorlik ro'yxatlari</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("categories")}>
                Yangi bozorlik
              </Button>
            </div>

            {shoppingHistory.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hali tarix yo'q</h3>
                  <p className="text-gray-600 mb-4">Birinchi bozorlikni yakunlang</p>
                  <Button onClick={() => setCurrentView("categories")}>Bozorlik boshlash</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {shoppingHistory.map((list) => (
                  <Card key={list.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-green-900">{list.name}</h3>
                          <p className="text-sm text-green-700">
                            Yakunlangan:{" "}
                            {list.completedAt?.toLocaleDateString("uz-UZ", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-900">
                            {list.items
                              .filter((item) => item.purchased && item.actualPrice)
                              .reduce((total, item) => total + (item.actualPrice || 0), 0)
                              .toFixed(2)}{" "}
                            so'm
                          </p>
                          <p className="text-sm text-green-700">{list.items.length} ta mahsulot</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {list.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-600">
                                {item.quantity} {item.product.unit} - {item.actualPrice?.toFixed(2)} so'm
                              </p>
                            </div>
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Quantity Dialog */}
      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}ni savatga qo'shish</DialogTitle>
            <DialogDescription>Sotib olmoqchi bo'lgan miqdorni kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedProduct && (
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              )}
              <div>
                <h3 className="font-semibold">{selectedProduct?.name}</h3>
                <p className="text-sm text-gray-600">har {selectedProduct?.unit}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="quantity">Miqdor ({selectedProduct?.unit})</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="masalan, 2.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddToBasket} disabled={!quantity}>
              Savatga qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Dialog */}
      <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sotib olindi deb belgilash</DialogTitle>
            <DialogDescription>Bu mahsulot uchun to'lagan haqiqiy narxni kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedItem && (
                <Image
                  src={selectedItem.product.image || "/placeholder.svg"}
                  alt={selectedItem.product.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              )}
              <div>
                <h3 className="font-semibold">{selectedItem?.product.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedItem?.quantity} {selectedItem?.product.unit}
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="price">To'langan narx (so'm)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="masalan, 15000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSavePrice} disabled={!price}>
              Sotib olindi deb belgilash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bozorlik ro'yxatingizni yarating</DialogTitle>
            <DialogDescription>Boshlash uchun bozorlik ro'yxatingizga nom bering</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="listName">Bozorlik ro'yxati nomi</Label>
              <Input
                id="listName"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="masalan, Haftalik oziq-ovqat, Ziyofat uchun bozorlik..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStartShopping} disabled={!listName.trim()}>
              Ro'yxat yaratish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ro'yxatni ulashish</DialogTitle>
            <DialogDescription>Ro'yxatni yubormoqchi bo'lgan odamning telefon raqamini kiriting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sharePhone">Telefon raqami</Label>
              <Input
                id="sharePhone"
                type="tel"
                value={sharePhoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="mt-1"
              />
            </div>

            {foundUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Topilgan foydalanuvchilar:</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {foundUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleSendToUser(user)}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Yuborish
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sharePhoneNumber.length >= 8 && foundUsers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>Bu raqam bilan ro'yxatdan o'tgan foydalanuvchi topilmadi</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Bekor qilish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
