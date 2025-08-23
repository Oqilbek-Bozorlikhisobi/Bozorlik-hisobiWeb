"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";

export default function BannerCarousel() {
  const { i18n } = useTranslation();

  const { data: bunners } = useFetch<any>({
    key: ["bunner"],
    url: "/bunner",
  });

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!bunners?.items) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bunners.items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bunners?.items]);

  const prevSlide = () => {
    setCurrent(
      (prev) =>
        (prev - 1 + (bunners?.items?.length || 1)) %
        (bunners?.items?.length || 1)
    );
  };

  const nextSlide = () => {
    setCurrent(
      (prev) => (prev + 1) % (bunners?.items?.length || 1)
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      {/* Slaydlar */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {bunners?.items?.map((banner: any) => {
          const image =
            i18n.language === "uz"
              ? banner.imageUz
              : i18n.language === "en"
              ? banner.imageEn
              : banner.imageRu;

          return (
            <div key={banner.id} className="w-full flex-shrink-0">
              <img
                src={image}
                alt="banner"
                className="
                  w-full 
                  h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] 
                  object-cover object-center
                "
              />
            </div>
          );
        })}
      </div>

      {/* Indikatorlar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {bunners?.items?.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Chap tugma */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
      >
        <ChevronLeft size={20} />
      </button>

      {/* O‘ng tugma */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
