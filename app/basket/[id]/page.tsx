"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Check, Edit3, ShoppingCart, Trash2, User } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import api from "@/service/api";
import useApiMutation from "@/hooks/useMutation";
import { toast } from "react-toastify";
import { useFetch } from "@/hooks/useFetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { showExtraProductDialog, setShowExtraProductDialog, removeShoppingItem } =
    useShoppingStore();
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEndMarket, setShowEndMarket] = useState(false);
  const [extraProductName, setExtraProductName] = useState("");
  const [extraProductQuantity, setExtraProductQuantity] = useState(""); // New state variable for extra product quantity
  const [price, setPrice] = useState("");
  const [sharePhoneNumber, setSharePhoneNumber] = useState("");
  const { t, i18n } = useTranslation("common");
  const [list, setList] = useState<any>(null);
  const [productId, setProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [location, setLocation] = useState<string>("")
  const [unit, setUnit] = useState<string>("")
  
    const { data: units } = useFetch<any>({
      key: ["unit",],
      url: "/unit",
    });

  const addList = (item: any) => {
    setList((prev: any) => ({
      ...prev,
      marketLists: [
        ...prev?.marketLists,
        item, // agar item object bo‘lsa
      ],
    }));
  };

  const removeList = (id: any) => {
    setList((prev: any) => ({
      ...prev,
      marketLists: prev?.marketLists.filter((item: any) => item.id !== id),
    }));
  };

  const setBuyingTrue = (id: any, price: string) => {
    setList((prev: any) => ({
      ...prev,
      marketLists: prev?.marketLists.map((item: any) =>
        item.id === id ? { ...item, isBuying: true, price: price } : item
      ),
    }));
  };

  const getData = async () => {
    try {
      const response = await api.get(`market/${id}`);
      setList(response.data.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 5000); // 5 soniyada bir marta zapros
    // komponent unmount bo‘lganda intervalni tozalash kerak
    return () => clearInterval(interval);
  }, [id]);

  const handleShareList = () => {
    setShowShareDialog(true);
  };
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) {
      return `+${digits}`;
    } else if (digits.length <= 5) {
      return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    } else if (digits.length <= 10) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
        5,
        8
      )} ${digits.slice(8)}`;
    } else {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
        5,
        8
      )} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
    }
  };

  const { mutate: sendList, isLoading: sendListLoading } = useApiMutation({
    url: "market/add/user",
    method: "PATCH",

    onSuccess: () => {
    toast.success("Yangi foydalanuvchi qo'shildi");
    setSharePhoneNumber("")
    setShowShareDialog(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const sendShareList = () => {
    const data = {
        phoneNumber: sharePhoneNumber.replace(/\s/g, ""),
        marketId: id
    }
    sendList(data)
  }

  const getPurchasedCount = () => {
    if (!list) return 0;
    return list?.marketLists?.filter((item: any) => item.isBuying).length;
  };

  const handleMarkAsPurchased = (item: any) => {
    setSelectedProduct(item);
    setShowPriceDialog(true);
  };

  const { mutate: addProductExtra, isLoading: extraLoading } = useApiMutation({
    url: "market-list",
    method: "POST",
    onSuccess: (data) => {
      addList(data?.data);
      toast.success("Mahsulot qo'shildi");
      setShowExtraProductDialog(false);
      setExtraProductName("");
      setExtraProductQuantity("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: deleteProduct } = useApiMutation({
    url: "market-list",
    method: "DELETE",
    onSuccess: () => {
      removeList(productId);
      toast.success("Mahsulot o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: buyProduct, isLoading: buyLoading } = useApiMutation({
    url: `market-list/check-is-buying/${selectedProduct?.id}`,
    method: "PATCH",
    onSuccess: () => {
      setBuyingTrue(selectedProduct?.id, price);
      setShowPriceDialog(false);
      setPrice("");
      toast.success("Mahsulot sotib olindi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
  const handleRemove = (id: string) => {
    deleteProduct({ id: id });
    setProductId(id);
  };

  const handleShowEndMarket = () =>{
    setShowEndMarket(true)
  }
  const handleAddExtraProduct = () => {
    const data = {
      marketId: id,
      quantity: extraProductQuantity,
      productName: extraProductName,
      unidId: unit
    };

    addProductExtra(data);
  };
  const handleSavePrice = () => {
    const data = {
      price,
    };
    buyProduct(data);
  };
  const { mutate: endMarket, isLoading: endLoading } = useApiMutation({
    url: `history`,
    method: "POST",
    onSuccess: () => {
        setShowEndMarket(false)
        removeShoppingItem(id)
        router.push("/basket")
      toast.success("Bozorlik istoriyaga qo'shildi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
  const { mutate: saveLocation, isLoading: locationLoading } = useApiMutation({
    url: `market/${id}`,
    method: "PATCH",
    onSuccess: () => {
      setLocation("");
      const data = {
        marketId: id
      }
      endMarket(data)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  

  const handleSaveLocation = () => {
    const data = {
      location,
    };
    saveLocation(data);
  };

  const handlePhoneNumberChange = (phone: string) => {
    const formatted = formatPhoneNumber(phone)
    setSharePhoneNumber(formatted);
  };

  return (
    <div className=" max-w-7xl mx-auto p-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("basket1.title")}
          </h2>
          <p className="text-gray-600">{t("basket1.subtitle")}</p>
        </div>
        <Button variant="outline" className="cursor-pointer" onClick={() => router.push("/")}>
          {t("basket1.addMore")}
        </Button>
      </div>

      {!list || list?.marketLists?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("basket_empty")}
            </h3>
            <p className="text-gray-600 mb-4">{t("basket_empty_desc")}</p>
            <Button className="bg-[#09bcbf] cursor-pointer" onClick={() => router.push("/")}>
              {t("view_products")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {list?.marketLists?.map((item: any) => (
            <Card
              key={item.id}
              className={item.purchased ? "bg-green-50 border-green-200" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {!item?.product ? (
                      <div className="w-15 h-15 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                    ) : (
                      <img
                        src={item?.product?.images || "/placeholder.svg"}
                        alt={item?.product?.nameEn}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                    )}
                    <div>
                      <h3
                        className={`font-semibold ${
                          item?.isBuying ? "line-through text-green-700" : ""
                        }`}
                      >
                        {item?.product
                          ? i18n?.language == "uz"
                            ? item?.product?.titleUz
                            : i18n?.language == "ru"
                            ? item?.product?.titleRu
                            : item?.product?.titleEn
                          : item?.productName}
                      </h3>
                      
                      <p className="text-sm text-gray-600">
                        {item.product
                          ? `${item?.quantity} ${item?.unit?.name}`
                          : `${item?.quantity} ${item?.unit?.name}`}
                      </p>
                      {item?.isBuying && item?.price && (
                        <p className="text-sm font-semibold text-green-700">
                          {t("paid")}: {item?.price * item?.quantity}{" "}
                          {t("currency")}
                        </p>
                      )}
                      {item?.user && (
                        <p className="text-sm text-gray-500">
                          👤 {item.user.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.isBuying ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        {t("received")}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsPurchased(item)}
                        className="bg-[#ff3131] cursor-pointer hover:bg-[#09bcbf]"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        {t("buy")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(item?.id)}
                      className="cursor-pointer"
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
              className="w-full py-3 text-lg bg-[#09bcbf] text-white font-semibold cursor-pointer"
            >
              {t("add_product")}
            </Button>
          </div>

          <div className="mt-4 mb-4">
            <Button
              onClick={handleShareList}
              className="w-full py-3 text-lg bg-[#dc983d] text-white font-semibold cursor-pointer"
            >
              {t("share_list")}
            </Button>
          </div>

          {/* <Separator /> */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {t("purchase_summary")}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {t("purchased_from_total", {
                      total: list?.marketLists?.length,
                      purchased: getPurchasedCount(),
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">
                    {list?.marketLists?.reduce(
                      (total: number, item: any) =>
                        total + (item.price * item?.quantity || 0),
                      0
                    )}{" "}
                    so‘m
                  </p>
                  <p className="text-sm text-blue-700">{t("total_expense")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {list?.marketLists?.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4 text-center">
            <Button
                onClick={() => {
                    if ((list?.marketLists?.length - getPurchasedCount()) === 0) {
                      // Bozorlikni yakunlash funksiyasini shu yerga yozasiz
                      handleShowEndMarket()
                    }
                  }}
              className={`w-full py-3 text-lg ${
                (list?.marketLists?.length - getPurchasedCount()) == 0
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              size="lg"
            >
              Bozorlikni yakunlash    
            </Button>
              <p className="text-sm text-gray-500 mt-2">
                {list?.marketLists?.length - getPurchasedCount()} ta mahsulot qoldi
              </p>
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
            <div className="space-y-2">
              <Label htmlFor="unitId">Birlikni tanlang</Label>
              <Select
                value={unit}
                onValueChange={(value) => setUnit(value)}
                required
              >
                <SelectTrigger id="unitId" className="w-full">
                  <SelectValue placeholder="Birlik tanlang" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {units?.items?.map((item: any) => (
                    <SelectItem key={item?.id} value={item?.id}>
                      {item?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowExtraProductDialog(false)}
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleAddExtraProduct}
              className="cursor-pointer"
              disabled={extraLoading && !extraProductName && !extraProductQuantity}
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
            <DialogDescription>Sotib olingan narxni kiriting</DialogDescription>
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
                <h3 className="font-semibold">
                  {selectedProduct?.product
                    ? i18n?.language == "uz"
                      ? selectedProduct?.product?.titleUz
                      : i18n?.language == "ru"
                      ? selectedProduct?.product?.titleRu
                      : selectedProduct?.product?.titleEn
                    : selectedProduct?.productName}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedProduct?.quantity} kg
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">To'langan narxi (so'm)</Label>
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
            <Button onClick={handleSavePrice} className="cursor-pointer" disabled={!price}>
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
            {/* {[].length > 0 && (
              <div className="space-y-2">
                <Label>Topilgan foydalanuvchilar:</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {[].map((user: any) => (
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
            )} */}
          </div>
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" disabled={sendListLoading} onClick={() => sendShareList()}>
              Ulashish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showEndMarket} onOpenChange={setShowEndMarket}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bozorlikni yakunlash</DialogTitle>
            <DialogDescription>Bozor nomini yozing va bozorlikni yakunlang</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Bozor nomi</Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="masalan, Chorsu"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveLocation} className="cursor-pointer" disabled={!location && locationLoading && endLoading }>
              Yakunlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default page;
