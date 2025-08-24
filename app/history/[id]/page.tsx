"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useApiMutation from "@/hooks/useMutation";
import api from "@/service/api";
import { useShoppingStore } from "@/store/shoppingStore";
import { useStore } from "@/store/userStore";
import { ShoppingCart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

const Page = () => {
  const [shoppingHistory, setShoppingHistory] = useState<any>([]);
  const router = useRouter();
  const { id } = useParams();
  const { t, i18n } = useTranslation("common");
  const { user } = useStore();
  const { setShoppingList } = useShoppingStore();
  const checkRef = useRef<HTMLDivElement>(null);
  const [showCheck, setShowCheck] = useState(false);

  const handleDownload = async () => {
    if (!checkRef.current) return;

    const node = checkRef.current;

    // (ixtiyoriy) OKLCH muammolarini chetlash: computed style -> inline rgb()
    const normalizeColors = (el: HTMLElement) => {
      const stack: HTMLElement[] = [el];
      while (stack.length) {
        const e = stack.pop()!;
        const cs = getComputedStyle(e);
        // computedStyle odatda rgb(...) qaytaradi
        if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)") {
          e.style.backgroundColor = cs.backgroundColor;
        }
        if (cs.color) e.style.color = cs.color;
        Array.from(e.children).forEach((c) => stack.push(c as HTMLElement));
      }
    };
    normalizeColors(node);

    // Rasmga aylantirish (PNG)
    const scale = 2; // sifat (retina)
    const width = node.scrollWidth;
    const height = node.scrollHeight;

    try {
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: scale,
        width,
        height,
        // CORS bilan muammo bo‘lsa shu placeholder qo‘l keladi
        imagePlaceholder:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAt8B6Qh0OikAAAAASUVORK5CYII=",
        // Tashqi <img> lar uchun crossOrigin
        // (agar server CORS header yuborsa)
        // NOTE: html-to-image o‘zi handle qiladi, lekin quyidagisi ham foydali:
        // style: { } ni minimal qoldirdik
      });

      // PNG -> A4 PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      //@ts-ignore
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res) => (img.onload = res as any));

      const imgW = img.width;
      const imgH = img.height;
      const pdfH = (imgH * pdfW) / imgW;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfW, pdfH);
      pdf.save("market-check.pdf");
    } catch (err) {
      console.error(err);
      toast.error("Rasm/PDF yaratishda xatolik yuz berdi");
    }
  };

  const handleShowCheck = () => {
    setShowCheck(true);
  };

  const getData = async () => {
    try {
      const response = await api.get(`history/${id}`);
      setShoppingHistory(response.data.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  const { mutate, isLoading } = useApiMutation({
    url: "market/create-by-history-id",
    method: "POST",

    onSuccess: (data) => {
      setShoppingList(data?.data);
      toast.success("Bozorlikka qo'shildi");
      router.push("/basket");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const addAllToBasket = () => {
    if (!shoppingHistory?.marketLists) return;
    const data = {
      historyId: id,
      userId: user?.id,
    };
    mutate(data);
  };

  useEffect(() => {
    getData();
  }, [id]);

  const totalQuantity = shoppingHistory?.marketLists?.reduce(
    (acc: any, p: any) => acc + p.quantity,
    0
  );
  const totalPrice = shoppingHistory?.marketLists?.reduce(
    (acc: any, p: any) => acc + p.price * p.quantity,
    0
  );

  return (
    <>
      <div className="max-w-7xl mx-auto p-7">
        <div className="mb-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="flex lg:block items-center flex-col mb-3 lg:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("shopping_history")}
            </h2>
            <p className="text-gray-600">{t("shopping_history_desc")}</p>
          </div>

          <div className=" flex flex-col sm:flex-row items-center gap-3">
            {/* Hamma mahsulotlarni qo‘shish tugmasi tepada */}
            {shoppingHistory?.marketLists?.length > 0 && (
              <Button
                className="bg-[#09bcbf] cursor-pointer w-full sm:w-auto flex items-center gap-2"
                onClick={addAllToBasket}
              >
                <ShoppingCart className="w-5 h-5" />
                {t("add_all_to_basket")}
              </Button>
            )}
            <Button
              onClick={handleShowCheck}
              className="bg-[#16A34A] w-full sm:w-auto cursor-pointer flex items-center gap-2"
            >
              Check PDF yuklab olish
            </Button>

            <Button variant="outline" className="w-full sm:w-auto cursor-pointer" onClick={() => router.push("/")}>
              {t("new_shopping")}
            </Button>
          </div>
        </div>

        {shoppingHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("no_history")}
              </h3>
              <p className="text-gray-600 mb-4">{t("finish_first_shopping")}</p>
              <Button className="bg-[#09bcbf] cursor-pointer" onClick={() => router.push("/")}>
                {t("start_shopping")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {shoppingHistory?.marketLists?.map((list: any) => (
                    <div
                      key={list.id}
                      className="flex items-center space-x-3 bg-white p-3 rounded-lg"
                    >
                      {!list.product ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xl">📦</span>
                        </div>
                      ) : (
                        <img
                          src={list?.product?.images || "/placeholder.svg"}
                          alt={
                            list?.product
                              ? i18n.language == "uz"
                                ? list?.product?.titleUz
                                : i18n.language == "ru"
                                ? list?.product?.titleRu
                                : list?.product?.titleEn
                              : list?.productName
                          }
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      )}
                      <div>
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
                            ? `${list.quantity} dona - ${
                                list?.price * list?.quantity
                              } so'm`
                            : `${list.quantity} kg - ${
                                list?.price * list?.quantity
                              } so'm`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={showCheck} onOpenChange={setShowCheck}>
        <DialogContent className="w-[360px] px-1 py-4">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem", // gap-4 = 16px = 1rem
              padding: "24px 24px 0 24px", // p-6 = 24px = 1.5rem
            }}
          >
            {/* Check (UI’da yashirin) */}
            <div
              ref={checkRef}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                maxWidth: "350px",
                width: "100%",
                borderRadius: "0.5rem", // rounded-lg = 8px
                padding: "1rem", // p-4 = 16px
                fontSize: "0.875rem", // text-sm = 14px
                fontFamily: "sans-serif",
              }}
            >
              {/* Header */}
              <h1
                style={{
                  textAlign: "center", // text-center
                  fontWeight: "bold", // font-bold
                  fontSize: "1.25rem", // text-xl = 20px
                  marginBottom: "0.5rem", // mb-2 = 8px
                }}
              >
                🛒 Market APP
              </h1>

              <hr
                style={{
                  marginBottom: "0.5rem", // mb-2 = 8px
                }}
              />

              {/* Bozorlik nomi */}
              <p
                style={{
                  textAlign: "center", // text-center
                  fontWeight: 600, // font-semibold
                  marginBottom: "0.5rem", // mb-2 = 8px
                }}
              >
                Bozorlik #1
              </p>

              {/* Products */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.5rem", // space-y-2 = 8px
                }}
              >
                {shoppingHistory?.marketLists?.map((list: any) => (
                  <div
                    key={list.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "4px", // pb-1 = 4px
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // flex
                        alignItems: "center", // items-center
                        gap: "0.5rem", // gap-2 = 8px
                      }}
                    >
                      {!list.product ? (
                        <div
                          style={{
                            backgroundColor: "#e5e7eb",
                            width: "2.5rem", // w-10 = 40px
                            height: "2.5rem", // h-10 = 40px
                            borderRadius: "0.375rem", // rounded-md = 6px
                            display: "flex", // flex
                            alignItems: "center", // items-center
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.25rem", // text-xl = 20px
                            }}
                          >
                            📦
                          </span>
                        </div>
                      ) : (
                        <img
                          src={list?.product?.images || "/placeholder.svg"}
                          alt={
                            list?.product
                              ? i18n.language == "uz"
                                ? list?.product?.titleUz
                                : i18n.language == "ru"
                                ? list?.product?.titleRu
                                : list?.product?.titleEn
                              : list?.productName
                          }
                          width={30}
                          height={30}
                          style={{
                            borderRadius: "0.25rem", // rounded = 4px
                          }}
                        />
                      )}
                      <div>
                        <p
                          style={{
                            fontWeight: 500, // font-medium
                          }}
                        >
                          {list?.product
                            ? i18n.language == "uz"
                              ? list?.product?.titleUz
                              : i18n.language == "ru"
                              ? list?.product?.titleRu
                              : list?.product?.titleEn
                            : list?.productName}
                        </p>
                        <p
                          style={{
                            color: "#6b7280",
                            fontSize: "0.75rem", // text-xs = 12px
                            lineHeight: "1rem",
                          }}
                          className="text-xs"
                        >
                          {list.quantity} dona
                        </p>
                      </div>
                    </div>
                    <p>{list.price * list.quantity} so‘m</p>
                  </div>
                ))}
              </div>

              <hr
                style={{
                  marginTop: "0.5rem", // mt-2 = 8px
                  marginBottom: "0.5rem", // mb-2 = 8px
                }}
              />

              {/* Footer */}
              <div
                style={{
                  display: "flex", // flex
                  justifyContent: "space-between", // justify-between
                  fontWeight: "bold", // font-bold = 700
                }}
              >
                <span>Mahsulotlar soni: {totalQuantity} dona</span>
              </div>
              <div
                style={{
                  display: "flex", // flex
                  justifyContent: "space-between", // justify-between
                  fontWeight: "bold", // font-bold = 700
                }}
              >
                <span>Jami:</span>
                <span>{totalPrice} so‘m</span>
              </div>
            </div>

            {/* Download button */}
          </div>
          <DialogFooter>
            <Button className="w-full cursor-pointer" onClick={handleDownload}>Yuklash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
