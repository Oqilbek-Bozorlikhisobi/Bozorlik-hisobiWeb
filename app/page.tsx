"use client";

import { useState } from "react";
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

import BannerCarousel from "../app/baner/baner";
// Mock registered users for demonstration

export default function ShoppingPlatform() {
  const router = useRouter();
  const [listName, setListName] = useState("");
  const [showStartDialog, setShowStartDialog] = useState(false);
  const {
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


  const handleCategoryClick = (id: string) => {
    router.push(`/categories/${id}`); // Sahifaga yo‘naltiramiz
  };

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
              
            <BannerCarousel />


            {/* Bu  oraliqa  baner chaqiriladi   */}

            <div className="mb-9">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
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

        
      </div>
    </>
  );
}
