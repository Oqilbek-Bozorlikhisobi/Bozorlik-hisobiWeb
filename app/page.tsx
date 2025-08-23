"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShoppingStore } from "@/store/shoppingStore";
import { useFetch } from "@/hooks/useFetch";
import { useTranslation } from "react-i18next";
import useApiMutation from "@/hooks/useMutation";
import { toast } from "react-toastify";
import { useStore } from "@/store/userStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock registered users for demonstration

export default function ShoppingPlatform() {
  const router = useRouter();
  const [listName, setListName] = useState("");
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState<any>(0);
  // const [extraProductName, setExtraProductName] = useState("");
  // const [marketId, setMarketId] = useState<any>(null);
  // const [extraProductQuantity, setExtraProductQuantity] = useState(""); 
  // const [extraProductType, setExtraProductType] = useState(""); 
  const {
    // showExtraProductDialog,
    // setShowExtraProductDialog,
    setShoppingId,
    setShoppingList,
    shoppingList,
  } = useShoppingStore();
  const [search, setSearch] = useState("");
  const { t, i18n } = useTranslation("common");
  const { user } = useStore();

  const { mutate } = useApiMutation({
    url: "market",
    method: "POST",
    onSuccess: (data) => {
      setShoppingId(data?.data?.id);
      setShoppingList(data?.data);
      setShowStartDialog(false);
      setListName("");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { data } = useFetch<any>({
    key: ["category", search],
    url: "/category",
    config: {
      params: {
        search: search || null,
      },
    },
  });

  const { data: bunners } = useFetch<any>({
    key: ["bunner"],
    url: "/bunner",
  });

  const handleCategoryClick = (id: string) => {
    router.push(`/categories/${id}`); // Sahifaga yo‘naltiramiz
  };

  // Auto-rotate banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      //@ts-ignore
      setCurrentBannerIndex( (prevIndex: any) => (prevIndex + 1) % bunners?.total
      );
    }, 4000); // Change banner every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleStartShopping = () => {
    if (listName.trim()) {
      // Create new shopping list
      const newList = {
        name: listName,
        userId: user?.id,
      };

      mutate(newList);
    }
  };

  const getPurchasedCount = () => {
    if (!shoppingList) return 0;
    return shoppingList?.items?.filter((item: any) => item.purchased).length;
  };

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productName: "", productType: "", quantity: "", marketId: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { mutate: addProductExtra, isLoading: extraLoading } = useApiMutation({
    url: "market-list",
    method: "POST",
    onSuccess: () => {
      toast.success("Mahsulot qo'shildi")
      setOpen(false);
      setForm({ productName: "", productType: "", quantity: "", marketId: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const handleSubmit = () => {
    addProductExtra(form)
    
  };

  // const handleAddExtraProduct = () => {
  //   if (extraProductName.trim() && extraProductQuantity && shoppingList) {
  //     const extraProduct = {
  //       id: `extra_${Date.now()}`,
  //       name: extraProductType
  //         ? `${extraProductName.trim()} (${extraProductType})`
  //         : extraProductName.trim(),
  //       price: 0, // Price will be set when marking as purchased
  //       isExtra: true,
  //     };

  //     const newItem = {
  //       id: Date.now().toString(),
  //       product: extraProduct,
  //       quantity: Number.parseFloat(extraProductQuantity),
  //       purchased: false,
  //     };

  //     setShoppingList({
  //       ...shoppingList,
  //       items: [...shoppingList.items, newItem],
  //     });

  //     setShowExtraProductDialog(false);
  //     setExtraProductName("");
  //     setExtraProductQuantity("");
  //     setExtraProductType("");
  //   }
  // };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories View */}
          <div>
            {/* Shopping List Info Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center space-x-4">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {shoppingList?.name || t("title")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {shoppingList
                        ? t("purchased", {
                            purchased: getPurchasedCount(),
                            total: shoppingList?.items?.length,
                          })
                        : t("emptyList")}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowStartDialog(true)}
                  className="bg-[#dd993e] hover:bg-[#09bcbf] text-white"
                >
                  {t("createList")}
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  placeholder={t("searchCategories")}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Promotional Banner Carousel */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentBannerIndex * 100}%)`,
                  }}
                >
                  {bunners?.items.map((banner, index) => (
                    <div
                      key={banner.id}
                      className={`w-full flex-shrink-0 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-6`}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {i18n?.language == "uz"
                              ? banner.nameUz
                              : i18n?.language == "en"
                              ? banner.nameEn
                              : banner.nameRu}
                          </h2>
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="bg-white text-purple-600 text-2xl font-bold px-4 py-2 rounded-lg">
                              {banner.discount}
                            </span>
                            <span className="text-white text-sm">
                              % chegirma
                            </span>
                          </div>
                          <p className="text-white/90 text-sm">
                            {banner.subtitle}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-6">
                          <img
                            src={
                              i18n?.language == "uz"
                                ? banner.imageUz
                                : i18n?.language == "en"
                                ? banner.imageEn
                                : banner.imageRu
                            }
                            alt={banner.imageEn}
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
                  {bunners?.items?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentBannerIndex
                          ? "bg-white w-6"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setCurrentBannerIndex(
                      //@ts-ignore
                      (prev: any) => (prev - 1 + bunners?.total) % bunners?.total
                    )
                  }
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    //@ts-ignore
                    setCurrentBannerIndex((prev) => (prev + 1) % bunners?.total)
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("chooseCategory")}
              </h2>
              <p className="text-gray-600">{t("chooseCategoryDesc")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card
                onClick={() => setOpen(true)}
                className="group cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Plus className="h-10 w-10 text-gray-500 group-hover:text-[#09bcbf] transition-colors" />
                  <p className="mt-2 text-gray-600 font-medium">
                    {" "}
                    {t("others")}
                  </p>
                </CardContent>
              </Card>
              {data?.items?.map((category) => (
                <Card
                  key={category.id}
                  className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent bg-gradient-to-r from-[#09bcbf] to-[#5ce1e6] p-[2px] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="bg-white rounded-2xl h-full flex flex-col">
                    <CardContent className="p-0 text-center flex-1 flex flex-col">
                      {/* Rasm qismi */}
                      <div className="relative w-full h-44 overflow-hidden rounded-t-2xl">
                        <img
                          src={category.image}
                          alt={category.titleUz}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      {/* Text qismi */}
                      <h3 className="text-lg font-semibold px-4 py-3 text-gray-800 group-hover:text-[#09bcbf] transition-colors duration-300">
                        {i18n.language == "uz"
                          ? category?.titleUz
                          : i18n.language == "ru"
                          ? category?.titleRu
                          : category?.titleEn}
                      </h3>
                    </CardContent>
                  </div>
                </Card>
              ))}
              {/* Boshqalar cardi */}

              {/* Modal (Dialog) */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("dialogTitle")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>{t("productName")}</Label>
                      <Input
                        name="productName"
                        placeholder={t("productNamePlaceholder1")}
                        value={form.productName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("productType1")}</Label>
                      <Input
                        name="productType"
                        placeholder={t("productTypePlaceholder1")}
                        value={form.productType}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("quantity1")}</Label>
                      <Input
                        name="quantity"
                        placeholder={t("quantityPlaceholder1")}
                        value={form.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marketId">Bozorlikni tanlang</Label>
                      <Select
                        value={form?.marketId}
                        onValueChange={(value) => setForm({ ...form, marketId: value })}
                      >
                        <SelectTrigger id="marketId" className="w-full">
                          <SelectValue placeholder="Bozorlik tanlang" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {shoppingList?.map((item: any) => (
                            <SelectItem key={item?.id} value={item?.id}>
                              {item?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button disabled={extraLoading} className="bg-[#09bcbf]" onClick={handleSubmit}>
                      {t("addToBasket")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>

        {/* Price Dialog */}

        <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("createShoppingListTitle")}</DialogTitle>
              <DialogDescription>
                {t("createShoppingListDesc")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="listName">{t("shoppingListNameLabel")}</Label>
                <Input
                  id="listName"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder={t("shoppingListNamePlaceholder")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleStartShopping} disabled={!listName.trim()}>
                {t("createListBtn")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}

        {/* Extra Product Dialog */}
        {/* <Dialog
          open={showExtraProductDialog}
          onOpenChange={setShowExtraProductDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("extraProductTitle")}</DialogTitle>
              <DialogDescription>{t("extraProductDesc")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="extraProductName">{t("productName1")}</Label>
                <Input
                  id="extraProductName"
                  value={extraProductName}
                  onChange={(e) => setExtraProductName(e.target.value)}
                  placeholder={t("productNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extraProductType">{t("productType")}</Label>
                <Input
                  id="extraProductType"
                  value={extraProductType}
                  onChange={(e) => setExtraProductType(e.target.value)}
                  placeholder={t("productTypePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extraProductQuantity">{t("quantity")}</Label>
                <Input
                  id="extraProductQuantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={extraProductQuantity}
                  onChange={(e) => setExtraProductQuantity(e.target.value)}
                  placeholder={t("quantityPlaceholder")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowExtraProductDialog(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleAddExtraProduct}
                disabled={!extraProductName.trim() || !extraProductQuantity}
              >
                {t("add")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </>
  );
}
