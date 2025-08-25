"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { useRouter } from "next/navigation";
import { useShoppingStore } from "@/store/shoppingStore";
import { useTranslation } from "react-i18next";
import { ShoppingBasket, Trash2 } from "lucide-react"; // iconlar

const Page = () => {
  const router = useRouter();
  const { shoppingList, setShoppingId } = useShoppingStore();
  const { t } = useTranslation("common");

  const handleBasketClick = (id: string) => {
    setShoppingId(id);
    router.push(`/basket/${id}`);
  };

  const handleDelete = (id: string) => {
    // ❗ Bu yerga o‘chirish funksiyasini yozasiz
    console.log("Ro`yhat o`chirildi:", id);
  };

  return (
    <div className="max-w-7xl mx-auto p-7">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("basket1.title")}
          </h2>
          <p className="text-gray-600">{t("basket1.subtitle")}</p>
        </div>
        <Button
          className="rounded-xl px-5 py-2 text-white cursor-pointer bg-teal-600 hover:bg-teal-700"
          onClick={() => router.push("/")}
        >
          {t("createListBtn")}
        </Button>
      </div>

      {/* Market cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shoppingList?.map((market: any) => (
          <Card
            key={market.id}
            className="relative cursor-pointer rounded-2xl bg-gradient-to-br from-teal-50 to-white 
                       shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            {/* O‘chirish icon tugma */}
            <button
              onClick={() => handleDelete(market?.id)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
            >
              <Trash2 size={18} />
            </button>

            <CardContent
              onClick={() => handleBasketClick(market?.id)}
              className="p-6 flex flex-col items-center text-center"
            >
              <div
                className="w-12 h-12 mb-3 flex items-center justify-center 
                              rounded-full bg-teal-100 text-teal-700"
              >
                <ShoppingBasket size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {market.name}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;


