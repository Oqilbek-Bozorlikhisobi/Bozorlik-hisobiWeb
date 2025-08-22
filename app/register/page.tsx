"use client";

import type React from "react";

import { useRef, useState } from "react";
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
import { Loader2, UserPlus, Lock, Phone, User } from "lucide-react";
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

export default function RegisterForm() {
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
 const {setUser} = useStore()

  const { mutate, isLoading } = useApiMutation({
    url: "/auth/register/user",
    method: "POST",
    onSuccess: (data) => {
      toast.info("Telfon nomeringizga kelgan kodni kiriting");
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
      console.log(data);
      setUser(data?.access_token, data?.refresh_token, data?.user)
      
      toast.success("Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi ✅");
      router.push("/");
      setCookie("token", data.access_token); // cookie'ga yozamiz
      router.push("/")
    },
    onError: (error: any) => {
      toast.error(error.message || "Kod noto‘g‘ri");
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Parollar mos kelmaydi");
      return;
    }

    if (formData.password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
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
      toast.error("4 xonali kodni kiriting");
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
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Ro'yxatdan o'tish
          </CardTitle>
          <CardDescription className="text-gray-600">
            Yangi hisob yarating va bozorlik qilishni boshlang
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
                To'liq ism
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ismingizni kiriting"
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
                Telefon raqami
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+998 90 123 45 67"
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
                Viloyat
              </Label>
              <div className="relative">
                <select
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="" disabled>
                    Viloyatni tanlang
                  </option>
                  {regions?.map((item: string, i: number) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Jins tanlash */}
            <div className="space-y-2">
              <Label
                htmlFor="gender"
                className="text-sm font-medium text-gray-700"
              >
                Jins
              </Label>
              <div className="relative">
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="" disabled>
                    Jinsni tanlang
                  </option>
                  <option value="Erkak">Erkak</option>
                  <option value="Ayol">Ayol</option>
                </select>
              </div>
            </div>

            {/* Parol */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Parol
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
                  placeholder="Kamida 6 ta belgi"
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
                Parolni tasdiqlang
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
                  placeholder="Parolni qayta kiriting"
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
                  Ro'yxatdan o'tilmoqda...
                </>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">yoki</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 font-medium py-2.5 rounded-lg transition-all duration-200 bg-transparent"
            >
              Tizimga kirish
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Ro'yxatdan o'tib, siz{" "}
              <a href="#" className="text-green-600 hover:underline">
                Foydalanish shartlari
              </a>{" "}
              va{" "}
              <a href="#" className="text-green-600 hover:underline">
                Maxfiylik siyosati
              </a>
              ga rozilik bildirasiz.
            </p>
          </div>
        </CardContent>
      </Card>
      <Dialog open={verify} onOpenChange={setVerify}>
        <DialogContent className="fixed top-1/2 left-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Telefon raqamni tasdiqlash
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              SMS orqali yuborilgan 4 xonali kodni kiriting
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

          <Button
            onClick={handleVerify}
            disabled={otpLoading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
          >
            {otpLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              "Tasdiqlash"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
