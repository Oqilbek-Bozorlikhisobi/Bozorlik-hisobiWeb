"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React  from "react";
import { useRouter } from "next/navigation";
import { useShoppingStore } from "@/store/shoppingStore";
import { useTranslation } from "react-i18next";

const page = () => {
  const router = useRouter();
  const {
    shoppingList,
    setShoppingId
  } = useShoppingStore();

  const { t, i18n } = useTranslation("common")

  const handleBasketClick = (id: string) => {
    setShoppingId(id)
    router.push(`/basket/${id}`); // Sahifaga yo‘naltiramiz
  };

  return (
    <div className="max-w-7xl mx-auto p-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("basket1.title")}
          </h2>
          <p className="text-gray-600">{t("basket1.subtitle")}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          Bozorlik yaratish
        </Button>
      </div>

      {/* Market cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {shoppingList?.map((market: any) => (
          <Card onClick={() => handleBasketClick(market?.id)} key={market.id} className="shadow-md hover:shadow-lg transition cursor-pointer">
            <CardContent className="p-5">
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

export default page;
