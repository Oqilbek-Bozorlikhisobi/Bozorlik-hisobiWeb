"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/service/api";
import { ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const Page = () => {
  // mock state (siz Zustand yoki API dan olasiz)
  const [shoppingHistory, setShoppingHistory] = useState<any>([]);
  const router = useRouter()
  const { t, i18n } = useTranslation("common")

  const getData = async () => {
    try {
      const response = await api.get(`history`);
      
      setShoppingHistory(response.data.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleHistoryClick = (id: string) => {
    // setShoppingId(id);
    router.push(`/history/${id}`);
  };
  return (
    <div className="max-w-7xl mx-auto p-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("shopping_history")}
          </h2>
          <p className="text-gray-600">{t("shopping_history_desc")}i</p>
        </div>
        <Button variant="outline" className="cursor-pointer" onClick={() => router.push("/")}>
        {t("new_shopping")}
        </Button>
      </div>

      {shoppingHistory.length === 0 ? (
        <Card>
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("no_history")}
          </h3>
          <p className="text-gray-600 mb-4">
            {t("finish_first_shopping")}
          </p>
          <Button className="bg-[#09bcbf] cursor-pointer" onClick={() => router.push("/")}>
            {t("start_shopping")}
          </Button>
        </CardContent>
      </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shoppingHistory?.map((market: any) => (
          <Card
            onClick={() => handleHistoryClick(market?.id)}
            key={market.id}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-teal-50 to-white 
                       shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center 
                              rounded-full bg-teal-100 text-teal-700">
                <ShoppingBasket size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {market.name}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};

export default Page;
