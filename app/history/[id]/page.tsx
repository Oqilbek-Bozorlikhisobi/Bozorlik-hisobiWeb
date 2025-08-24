"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/service/api";
import { Check } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Page = () => {
  // mock state (siz Zustand yoki API dan olasiz)
  const [shoppingHistory, setShoppingHistory] = useState<any>([]);
  const router = useRouter();
  const { id } = useParams();
  const getData = async () => {
    try {
      const response = await api.get(`history/${id}`);
      setShoppingHistory(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);
  const { t, i18n } = useTranslation("common");
  return (
    <div className="max-w-7xl mx-auto p-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("shopping_history")}
          </h2>
          <p className="text-gray-600">{t("shopping_history_desc")}i</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
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
            <p className="text-gray-600 mb-4">{t("finish_first_shopping")}</p>
            <Button className="bg-[#09bcbf]" onClick={() => router.push("/")}>
              {t("start_shopping")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                {/* <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-green-900">
                      {list?.product
                        ? i18n.language == "uz"
                          ? list?.product?.titleUz
                          : i18n.language == "ru"
                          ? list?.product?.titleRu
                          : list?.product?.titleEn
                        : list?.productName}
                    </h3>
                    <p className="text-sm text-green-700">
                      {t("completed")}:{" "}
                      {list.createdAt
                        ? (() => {
                            const d = new Date(list.createdAt);
                            const month = String(d.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const day = String(d.getDate()).padStart(2, "0");
                            const year = d.getFullYear();
                            const hour = String(d.getHours()).padStart(2, "0");
                            const minute = String(d.getMinutes()).padStart(
                              2,
                              "0"
                            );
                            return `${month}.${day}.${year} ${hour}:${minute}`;
                          })()
                        : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-900">
                      {
                        list?.price * list?.quantity
                      }
                      {t("currency")}
                    </p>
                    <p className="text-sm text-green-700">
                      {t("products_count", { count: list?.quantity })}
                    </p>
                  </div>
                </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {shoppingHistory?.marketLists?.map((list: any) => (
                    <div
                      key={list.id}
                      className="flex items-center space-x-3 bg-white p-3 rounded-lg"
                    >
                      {list.product ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xl">📦</span>
                        </div>
                      ) : (
                        <Image
                          src={list?.product?.images || "/placeholder.svg"}
                          alt={list?.product
                            ? i18n.language == "uz"
                              ? list?.product?.titleUz
                              : i18n.language == "ru"
                              ? list?.product?.titleRu
                              : list?.product?.titleEn
                            : list?.productName}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                        {list?.product
                        ? i18n.language == "uz"
                          ? list?.product?.titleUz
                          : i18n.language == "ru"
                          ? list?.product?.titleRu
                          : list?.product?.titleEn
                        : list?.productName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {list.product
                            ? `${
                                list.quantity
                              } dona - ${list?.price * list?.quantity} so'm`
                            : `${list.quantity} kg - ${list?.price * list?.quantity} so'm`}
                        </p>
                      </div>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
};

export default Page;
