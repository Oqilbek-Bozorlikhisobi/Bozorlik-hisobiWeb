"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type ShoppingItem = {
  id: string;
  product: {
    id: string;
    name: string;
    image?: string;
    unit?: string;
    isExtra?: boolean;
  };
  quantity: number;
  purchased: boolean;
  actualPrice?: number;
};

type ShoppingList = {
  id: string;
  name: string;
  completedAt?: Date;
  items: ShoppingItem[];
};

const Page = () => {
  // mock state (siz Zustand yoki API dan olasiz)
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingList[]>([]);
  const router = useRouter()

  return (
    <div className="max-w-7xl mx-auto p-7">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bozorlik tarixi
          </h2>
          <p className="text-gray-600">Yakunlangan bozorlik ro'yxatlari</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          Yangi bozorlik
        </Button>
      </div>

      {shoppingHistory.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hali tarix yo'q
            </h3>
            <p className="text-gray-600 mb-4">Birinchi bozorlikni yakunlang</p>
            <Button className="bg-[#09bcbf]"
            onClick={() => router.push("/")}>
              Bozorlik boshlash
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {shoppingHistory.map((list) => (
            <Card key={list.id} className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-green-900">
                      {list.name}
                    </h3>
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
                        .reduce(
                          (total, item) => total + (item.actualPrice || 0),
                          0
                        )
                        .toFixed(2)}{" "}
                      so'm
                    </p>
                    <p className="text-sm text-green-700">
                      {list.items.length} ta mahsulot
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 bg-white p-3 rounded-lg"
                    >
                      {"isExtra" in item.product ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xl">📦</span>
                        </div>
                      ) : (
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {"isExtra" in item.product
                            ? `${item.quantity} dona - ${item.actualPrice?.toFixed(
                                2
                              )} so'm`
                            : `${item.quantity} ${item.product.unit} - ${item.actualPrice?.toFixed(
                                2
                              )} so'm`}
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
  );
};

export default Page;
