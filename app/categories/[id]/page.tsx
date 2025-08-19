  "use client";

  import { useEffect, useState } from "react";
  import axios from "axios";
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
    const router = useRouter()
    const id = params?.id as string;
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [quantity, setQuantity] = useState("")
    const [productType, setProductType] = useState("")
    const [showQuantityDialog, setShowQuantityDialog] = useState(false)

    // const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");
    const {shoppingList, setShoppingList} = useShoppingStore()

    const products = [
      // Sabzavotlar (Vegetables)
      {
        id: "v1",
        name: "Pomidor",
        category: "sabzavotlar",
        image: "/images/pomidor.png",
        unit: "kg",
      },
      {
        id: "v2",
        name: "Sabzi",
        category: "sabzavotlar",
        image: "/images/sabzi.png",
        unit: "kg",
      },
      {
        id: "v3",
        name: "Piyoz",
        category: "sabzavotlar",
        image: "/images/piyoz.png",
        unit: "kg",
      },
      {
        id: "v4",
        name: "Kartoshka",
        category: "sabzavotlar",
        image: "/images/kartoshka.png",
        unit: "kg",
      },
      {
        id: "v5",
        name: "Bodring",
        category: "sabzavotlar",
        image: "/images/bodring.png",
        unit: "kg",
      },]

    // useEffect(() => {
    //   if (id) {
    //     // Kategoriyaga tegishli mahsulotlarni olish
    //     axios
    //       .get(`/api/products?categoryId=${id}`)
    //       .then((res) => setProducts(res.data))
    //       .catch((err) => console.error(err));

    //     // Agar kategoriyani ham olish kerak bo‘lsa:
    //     axios
    //       .get(`/api/categories/${id}`)
    //       .then((res) => setCategoryName(res.data.name))
    //       .catch((err) => console.error(err));
    //   }
    // }, [id]);

    const handleProductSelect = (product: Product) => {
      setSelectedProduct(product)
      setQuantity("")
      setProductType("") // Reset product type
      setShowQuantityDialog(true)
    }

    const handleAddToBasket = () => {
      if (selectedProduct && quantity && shoppingList) {
        const newItem = {
          id: Date.now().toString(),
          product: {
            ...selectedProduct,
            name: productType ? `${selectedProduct.name} (${productType})` : selectedProduct.name,
          },
          quantity: Number.parseFloat(quantity),
          purchased: false,
        }

        setShoppingList(newItem);

        setShowQuantityDialog(false)
        setSelectedProduct(null)
        setQuantity("")
        setProductType("") // Reset product type
      }
    }

    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {categoryName}
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
          {products.map((product: any) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleProductSelect(product)}
            >
              <CardContent className="p-4">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-center">{product.name}</h3>
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
              <DialogTitle>{selectedProduct?.name}ni savatga qo'shish</DialogTitle>
              <DialogDescription>Sotib olmoqchi bo'lgan miqdorni kiriting</DialogDescription>
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
                  <p className="text-sm text-gray-600">har {selectedProduct?.unit}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productType">Mahsulot turi/navi (ixtiyoriy)</Label>
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
