"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useShoppingStore } from "@/store/shoppingStore";
import { useFetch } from "@/hooks/useFetch";
import api from "@/service/api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  unit?: string;
  categoryId: string;
};

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState("");
  const [productType, setProductType] = useState("");
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<any>(null);
  const { shoppingList, setShoppingList, shoppingId } = useShoppingStore();
  const { i18n } = useTranslation();

  const getData = async () => {
    try {
      const response = await api.get(`category/${id}`);
      setCategory(response.data.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const { data } = useFetch<any>({
    key: ["products", search, id],
    url: "/products",
    config: {
      params: {
        search: search || null,
        categoryId: id || null,
      },
    },
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity("");
    setProductType(""); // Reset product type
    setShowQuantityDialog(true);
  };

  const handleAddToBasket = () => {
    if (selectedProduct && quantity && shoppingList) {
      const newItem = {
        id: Date.now().toString(),
        product: {
          ...selectedProduct,
          name: productType
            ? `${selectedProduct.name} (${productType})`
            : selectedProduct.name,
        },
        quantity: Number.parseFloat(quantity),
        purchased: false,
      };

      setShoppingList(newItem);

      setShowQuantityDialog(false);
      setSelectedProduct(null);
      setQuantity("");
      setProductType(""); // Reset product type
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-7">
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
            placeholder="Mahsulotlar izlash"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {i18n?.language == "uz"
              ? category?.titleUz
              : i18n?.language == "ru"
              ? category?.titleRu
              : category?.titleEn}
          </h2>
          <p className="text-gray-600">
            Bozorlik ro'yxatingizga qo'shish uchun mahsulotni bosing
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          Turkumlarga qaytish
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.items.map((product: any) => (
          <Card
            key={product.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleProductSelect(product)}
          >
            <CardContent className="p-4">
              <Image
                src={product.images || "/placeholder.svg"}
                alt={product.titleUz}
                width={150}
                height={150}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-center">
                {i18n?.language == "uz"
                  ? product?.titleUz
                  : i18n?.language == "ru"
                  ? product?.titleRu
                  : product?.titleEn}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                har {product.unit || "dona"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.name}ni savatga qo'shish
            </DialogTitle>
            <DialogDescription>
              Sotib olmoqchi bo'lgan miqdorni kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
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
                <p className="text-sm text-gray-600">
                  har {selectedProduct?.unit}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">
                Mahsulot turi/navi (ixtiyoriy)
              </Label>
              <Input
                id="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="masalan, Premium, Organik, 1L, 500ml..."
              />
            </div>
            <div className="space-y-2">
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
    </div>
  );
};

export default CategoryPage;
