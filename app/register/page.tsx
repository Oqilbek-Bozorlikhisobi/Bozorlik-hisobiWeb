"use client";

import type React from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import { Loader2, Lock, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import useApiMutation from "@/hooks/useMutation";
import { setCookie } from "cookies-next";
import { useStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import Logo from "../../public/logo.png";

const regions = [
  "Toshkent V",
  "Toshkent Sh",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Namangan",
  "Farg‘ona",
  "Xorazm",
  "Navoiy",
  "Surxondaryo",
  "Qashqadaryo",
  "Sirdaryo",
  "Jizzax",
  "Qoraqalpog‘iston",
];
const languages = [
  { code: "uz", label: "Uzb", flag: "🇺🇿" },
  { code: "ru", label: "Рус", flag: "🇷🇺" },
  { code: "en", label: "Eng", flag: "🇬🇧" },
];

export default function RegisterForm() {
  const { t, i18n } = useTranslation("common");
  const currentLang = i18n.language || "uz";

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [region, setRegion] = useState("");

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    region: "", // yangi qo‘shildi
    gender: "", // yangi qo‘shildi
  });
  const [error, setError] = useState("");
  const [verify, setVerify] = useState<boolean>(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [dataResponse, setDataResponse] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minut = 120 sekund
  const [canResend, setCanResend] = useState(false);
  const { setUser } = useStore();

  const { mutate, isLoading } = useApiMutation({
    url: "/auth/register/user",
    method: "POST",
    onSuccess: (data) => {
      toast.info(t("register.otpSent"));
      setVerify(true);
      setDataResponse(data);
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: otpMutate, isLoading: otpLoading } = useApiMutation({
    url: "/auth/verify/otp",
    method: "POST",
    onSuccess: (data) => {
      setUser(data?.access_token, data?.refresh_token, data?.user);

      toast.success(t("register.successRegister"));
      router.push("/");
      setCookie("token", data.access_token); // cookie'ga yozamiz
    },
    onError: (error: any) => {
      toast.error(error.message || t("register.wrongCode"));
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (verify && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [verify, timeLeft]);

  const { mutate: resendMutate, isLoading: resendLoading } = useApiMutation({
    url: "/auth/sendotp/again/for-register",
    method: "POST",
    onSuccess: () => {
      toast.success(t("register.newCodeSent"));
      setTimeLeft(120); // vaqtni qaytadan 2 minutga o‘rnatamiz
      setCanResend(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("register.errorOccurred"));
    },
  });

  const handleResend = () => {
    resendMutate({
      phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
      verification_key: dataResponse?.details,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("register.errorPasswordMismatch1"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("register.errorPasswordShort1"));
      return;
    }

    const data = {
      fullName: formData.name,
      phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
      password: formData.password,
      region: formData.region, // backendga yuboriladi
      gender: formData.gender, // backendga yuboriladi
      confirmPassword: formData?.confirmPassword,
    };

    mutate(data);
  };

  const handleCodeChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // avtomatik keyingi inputga o'tish
      if (value && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 4) {
      toast.error(t("register.errorCodeLength1"));
      return;
    }
    const data = {
      verification_key: dataResponse?.details,
      phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
      otp: enteredCode,
    };

    otpMutate(data);
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
    setFormData({ ...formData, phoneNumber: formatted });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <select
            value={currentLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border rounded-lg px-2 py-[9px] w-25 text-sm focus:outline-none focus:ring-2 focus:ring-[#09bcbf]"
          >
            {languages.map((lng) => (
              <option key={lng.code} value={lng.code}>
                {lng.flag} {lng.label}
              </option>
            ))}
          </select>

          <div className="mx-auto mb-4 w-23 h-23 bg-green-100 rounded-full flex items-center justify-center">
            <Image src={Logo} alt="Logo" className="w-23 h-23 " />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t("register.title")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t("register.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* To'liq ism */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                {t("register.fullName")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("register.fullNamePlaceholder")}
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Telefon raqami */}
            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700"
              >
                {t("register.phone")}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder={t("register.phonePlaceholder")}
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Viloyat tanlash */}
            <div className="space-y-2">
              <Label
                htmlFor="region"
                className="text-sm font-medium text-gray-700"
              >
                {t("register.region")}
              </Label>
              <div className="relative">
                <select
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  className="border rounded-lg px-2 py-2 w-full"
                >
                  <option value="" disabled>
                    {t("register.regionSelect")}
                  </option>
                  <option value="tashkent">{t("register.tashkent")}</option>
                  <option value="andijan">{t("register.andijan")}</option>
                  <option value="fergana">{t("register.fergana")}</option>
                  <option value="namangan">{t("register.namangan")}</option>
                  <option value="sirdaryo">{t("register.sirdaryo")}</option>
                  <option value="jizzakh">{t("register.jizzakh")}</option>
                  <option value="samarkand">{t("register.samarkand")}</option>
                  <option value="kashkadarya">
                    {t("register.kashkadarya")}
                  </option>
                  <option value="surkhandarya">
                    {t("register.surkhandarya")}
                  </option>
                  <option value="bukhara">{t("register.bukhara")}</option>
                  <option value="navoiy">{t("register.navoiy")}</option>
                  <option value="khorezm">{t("register.khorezm")}</option>
                  <option value="karakalpakstan">
                    {t("register.karakalpakstan")}
                  </option>
                </select>
              </div>
            </div>

            {/* Jins tanlash */}
            <div className="space-y-2">
              <Label
                htmlFor="gender"
                className="text-sm font-medium text-gray-700"
              >
                {t("register.gender")}
              </Label>
              <div className="relative">
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="" disabled>
                    {t("register.genderSelect")}
                  </option>
                  <option value="Erkak">{t("register.male")}</option>
                  <option value="Ayol">{t("register.female")}</option>
                </select>
              </div>
            </div>

            {/* Parol */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                {t("register.password")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder={t("register.passwordPlaceholder")}
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Parolni tasdiqlash */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                {t("register.confirmPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder={t("register.confirmPasswordPlaceholder")}
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.phoneNumber ||
                !formData.password ||
                !formData.confirmPassword ||
                !formData.region ||
                !formData.gender
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("register.submitting")}
                </>
              ) : (
                t("register.submit")
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  {t("register.or")}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 font-medium py-2.5 rounded-lg transition-all duration-200 bg-transparent"
            >
              {t("register.login")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t("register.agreeText", {
                terms: (
                  <a href="#" className="text-green-600 hover:underline">
                    {t("register.terms")}
                  </a>
                ),
                privacy: (
                  <a href="#" className="text-green-600 hover:underline">
                    {t("register.privacy")}
                  </a>
                ),
              })}
            </p>
          </div>
        </CardContent>
      </Card>
      <Dialog open={verify} onOpenChange={setVerify}>
        <DialogContent className="fixed top-1/2 left-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {t("register.verifyTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {t("register.verifyDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between mt-4 space-x-2">
            {code.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={digit}
                maxLength={1}
                onChange={(e) => handleCodeChange(e.target.value, i)}
                className="w-12 h-12 text-center text-lg font-bold border-gray-300 focus:border-green-500"
              />
            ))}
          </div>
          <div className="mt-4 text-center">
            {!canResend ? (
              <p className="text-sm text-gray-500">
                {t("register.timeLeft")}:{" "}
                <span className="font-semibold text-gray-800">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </p>
            ) : (
              <Button
                onClick={handleResend}
                disabled={resendLoading}
                variant="outline"
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                {resendLoading ? t("register.resending") : t("register.resend")}
              </Button>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={otpLoading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
          >
            {otpLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              t("register.verify")
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
