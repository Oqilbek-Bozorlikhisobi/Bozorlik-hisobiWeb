"use client";

import type React from "react";
import Image from "next/image"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import useApiMutation from "@/hooks/useMutation";
import { toast } from "react-toastify";
import { useStore } from "@/store/userStore";
import { setCookie } from "cookies-next";
import Logo from "../../public/logo.png"
import { useTranslation } from "react-i18next"


const languages = [
  { code: "uz", label: "Uzb", flag: "🇺🇿" },
  { code: "ru", label: "Рус", flag: "🇷🇺" },
  { code: "en", label: "Eng", flag: "🇬🇧" },
]


export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useStore();

  const { t, i18n } = useTranslation("common")
  const currentLang = i18n.language || "uz"

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const { mutate, isLoading } = useApiMutation({
    url: "/auth/login/user",
    method: "POST",
    onSuccess: (data) => {
      setCookie("token", data.access_token);
      setUser(data?.access_token, data?.refresh_token, data?.user);
      router.push("/");
      toast.success(t("toast.loginSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = {
      phoneNumber: phoneNumber.replace(/\s/g, ""),
      password: password,
    };
    mutate(data);
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) {
      return `+${digits}`;
    } else if (digits.length <= 5) {
      return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    } else if (digits.length <= 10) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
        5,
        8
      )} ${digits.slice(8)}`;
    } else {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
        5,
        8
      )} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">

          <select
            value={currentLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border w-23 rounded-lg px-2 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-[#09bcbf]"
          >
            {languages.map((lng) => (
              <option key={lng.code} value={lng.code}>
                {lng.flag} {t(`languages.${lng.code}`)}
              </option>
            ))}
          </select>

          <div className="mx-auto mb-4 w-23 h-23  rounded-full flex items-center justify-center">
            <Image src={Logo} alt="Logo" className="w-23 h-23 " />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t("login.title")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t("login.welcome")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700"
              >
                {t("login.phoneLabel")}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder={t("login.phonePlaceholder") || ""}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                {t("login.passwordLabel")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder") || ""}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !phoneNumber || !password}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("login.loading")}
                </>
              ) : (
                t("login.button")
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  {t("login.or")}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/register")}
              className="w-full border-2 cursor-pointer border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 font-medium py-2.5 rounded-lg transition-all duration-200 bg-transparent"
            >
              {t("login.register")}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/forgotPassword")}
                className="text-sm text-blue-600 cursor-pointer hover:underline"
              >
                {t("login.forgotPassword")}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t("login.termsText")}{" "}
              <a href="#" className="text-blue-600 hover:underline">
                {t("login.terms")}
              </a>{" "}
              {t("login.privacy")}{" "}
              <a href="#" className="text-blue-600 hover:underline">
                {t("login.agree")}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
