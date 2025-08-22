"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge, Check, Edit3, ShoppingCart, Trash2, User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShoppingStore } from "@/store/shoppingStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const page = () => {
  const router = useRouter();
  const {
    shoppingList,
    removeShoppingItem,
    showExtraProductDialog,
    setShowExtraProductDialog,
  } = useShoppingStore();
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [extraProductName, setExtraProductName] = useState("")
  const [extraProductQuantity, setExtraProductQuantity] = useState("") // New state variable for extra product quantity
  const [extraProductType, setExtraProductType] = useState("") // New state variable for extra product type
  const [price, setPrice] = useState("")
  const [sharePhoneNumber, setSharePhoneNumber] = useState("")
  const { t, i18n } = useTranslation("common")
  const handleShareList = () => {
    setShowShareDialog(true);
  };

  const getTotalExpense = () => {
    if (!shoppingList) return 0
    return shoppingList.items
      .filter((item: any) => item.purchased && item.actualPrice)
      .reduce((total:any, item: any) => total + (item.actualPrice || 0), 0)
  }

  const getPurchasedCount = () => {
    if (!shoppingList) return 0
    return shoppingList.items.filter((item: any) => item.purchased).length
  }

  const handleMarkAsPurchased = (item: any) => {
    console.log(item);

    setShowPriceDialog(true);
  };

  const handleAddExtraProduct = () => {
    

      setShowExtraProductDialog(false)
      setExtraProductName("")
      setExtraProductQuantity("")
      setExtraProductType("")
  }

  const handleSavePrice = () => {
      setShowPriceDialog(false)
      setPrice("")
  }

  const handlePhoneNumberChange = (phone: string) => {
    setSharePhoneNumber(phone)
  }

  const handleSendToUser = (user: { id: string; name: string; phone: string }) => {
    // Simulate sending the list
    alert(`Ro'yxat ${user.name}ga yuborildi!`)
    setShowShareDialog(false)
    setSharePhoneNumber("")
  }
  return (
    <div className=" max-w-7xl mx-auto p-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("basket1.title")}

          </h2>
          <p className="text-gray-600">
          {t("basket1.subtitle")}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
        {t("basket1.addMore")}
        </Button>
      </div>

      {!shoppingList || shoppingList.items.length === 0 ? (
       <Card>
       <CardContent className="p-8 text-center">
         <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
         <h3 className="text-lg font-semibold text-gray-900 mb-2">
         {t("basket_empty")}
         </h3>
         <p className="text-gray-600 mb-4">
         {t("basket_empty_desc")}
         </p>
         <Button 
           className="bg-[#09bcbf]"
           onClick={() => router.push("/")}>
           {t("view_products")}
         </Button>
       </CardContent>
     </Card>
      ) : (
        <div className="space-y-4">
          {shoppingList.items.map((item: any) => (
  <Card
    key={item.id}
    className={item.purchased ? "bg-green-50 border-green-200" : ""}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {"isExtra" in item.product ? (
            <div className="w-15 h-15 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          ) : (
            <Image
              src={item.product.image || "/placeholder.svg"}
              alt={item.product.name}
              width={60}
              height={60}
              className="rounded-md"
            />
          )}
          <div>
            <h3
              className={`font-semibold ${
                item.purchased ? "line-through text-green-700" : ""
              }`}
            >
              {item.product.name}
            </h3>
            <p className="text-sm text-gray-600">
              {"isExtra" in item.product
                ? `${item.quantity} dona`
                : `${item.quantity} ${item.product.unit}`}
            </p>
            {item.purchased && item.actualPrice && (
              <p className="text-sm font-semibold text-green-700">
               {t("paid")}: {item.actualPrice.toFixed(2)} {t("currency")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {item.purchased ? (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              {t("received")}
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => handleMarkAsPurchased(item)}
              className="bg-[#ff3131] hover:bg-[#09bcbf]"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              {t("buy")}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeShoppingItem(item?.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
))}

<div className="mt-4 mb-4">
  <Button
    onClick={() => setShowExtraProductDialog(true)}
    className="w-full py-3 text-lg bg-[#09bcbf] text-white font-semibold"
  >
    {t("add_product")}
  </Button>
</div>

<div className="mt-4 mb-4">
  <Button
    onClick={handleShareList}
    className="w-full py-3 text-lg bg-[#dc983d] text-white font-semibold"
  >
    {t("share_list")}
  </Button>
</div>

<Separator />
<Card className="bg-blue-50 border-blue-200">
  <CardContent className="p-4">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-blue-900">
          {t("purchase_summary")}
        </h3>
        <p className="text-sm text-blue-700">
          {t("purchased_from_total", {
            purchased: getPurchasedCount(),
            total: shoppingList.items.length
          })}
        </p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-blue-900">
          {getTotalExpense().toFixed(2)} so‘m
        </p>
        <p className="text-sm text-blue-700">{t("total_expense")}</p>
      </div>
    </div>
  </CardContent>
</Card>


        </div>
      )}
      {shoppingList?.items?.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4 text-center">
            <Button
            //   onClick={handleCompleteShopping}
            //   disabled={!isShoppingComplete()}
              className={`w-full py-3 text-lg ${
                false
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              size="lg"
            >
              {false
                ? "Bozorlik yakunlandi"
                : "Barcha mahsulotlarni sotib oling"}
            </Button>
            {!false && (
              <p className="text-sm text-gray-500 mt-2">
                {shoppingList.items.length - getPurchasedCount()} ta mahsulot
                qoldi
              </p>
            )}
          </CardContent>
        </Card>
      )}
      <Dialog
        open={showExtraProductDialog}
        onOpenChange={setShowExtraProductDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qo'shimcha mahsulot qo'shish</DialogTitle>
            <DialogDescription>
              Ro'yxatda yo'q mahsulot nomi va miqdorini kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="extraProductName">Mahsulot nomi</Label>
              <Input
                id="extraProductName"
                value={extraProductName}
                onChange={(e) => setExtraProductName(e.target.value)}
                placeholder="masalan, Tuz, Shakar, Sabun..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extraProductType">
                Mahsulot turi/navi (ixtiyoriy)
              </Label>
              <Input
                id="extraProductType"
                value={extraProductType}
                onChange={(e) => setExtraProductType(e.target.value)}
                placeholder="masalan, Premium, Katta, Kichik, 1kg..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extraProductQuantity">Miqdor</Label>
              <Input
                id="extraProductQuantity"
                type="number"
                step="0.1"
                min="0.1"
                value={extraProductQuantity}
                onChange={(e) => setExtraProductQuantity(e.target.value)}
                placeholder="masalan, 2.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExtraProductDialog(false)}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleAddExtraProduct}
              disabled={!extraProductName.trim() || !extraProductQuantity}
            >
              Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sotib olindi deb belgilash</DialogTitle>
            <DialogDescription>
            Sotib olingan narxni kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {true && (
                <Image
                  src={"/placeholder.svg"}
                  alt={"sd"}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              )}
              <div>
                <h3 className="font-semibold">name</h3>
                <p className="text-sm text-gray-600">
                  10 kg
                </p>
              </div>
            </div>
            <div className="space-y-2">
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
              Sotib olindi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ro'yxatni ulashish</DialogTitle>
            <DialogDescription>
              Ro'yxatni yubormoqchi bo'lgan odamning telefon raqamini kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
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
            {[].length > 0 && (
              <div className="space-y-2">
                <Label>Topilgan foydalanuvchilar:</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {[].map((user:any) => (
                    <div
                      key={user?.id}
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
            {sharePhoneNumber.length >= 8 && [].length === 0 && (
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
  );
};

export default page;
