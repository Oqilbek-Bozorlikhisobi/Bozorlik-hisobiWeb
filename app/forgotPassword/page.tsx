"use client";

import type React from "react";
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
import { Loader2, Phone, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import useApiMutation from "@/hooks/useMutation";
import { toast } from "react-toastify";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";

export default function ForgotPasswordForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [dataResponse, setDataResponse] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minut = 120 sekund
  const [canResend, setCanResend] = useState(false);
  const [verify, setVerify] = useState<boolean>(false);
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate, isLoading } = useApiMutation({
    url: "/auth/forgot/password",
    method: "POST",
    onSuccess: (data) => {
      toast.info("Telfon nomeringizga kelgan kodni kiriting");
      setVerify(true);
      setDataResponse(data);
      //   router.push("/login")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: otpMutate, isLoading: otpLoading } = useApiMutation({
    url: "/auth/forget/password/verify-otp",
    method: "PATCH",
    onSuccess: (data) => {
      toast.success("Parol muvaffaqiyatli o'zgartirildi");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Kod noto‘g‘ri");
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
    url: "/auth/sendotp/again",
    method: "POST",
    onSuccess: () => {
      toast.success("Yangi kod yuborildi ✅");
      setTimeLeft(120); // vaqtni qaytadan 2 minutga o‘rnatamiz
      setCanResend(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const handleVerify = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 4) {
      toast.error("4 xonali kodni kiriting");
      return;
    }
    const data = {
      verification_key: dataResponse?.details,
      phoneNumber: phoneNumber.replace(/\s/g, ""),
      otp: enteredCode,
    };

    otpMutate(data);
  };

  const handleResend = () => {
    resendMutate({
      phoneNumber: phoneNumber.replace(/\s/g, ""),
    });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const data = {
      phoneNumber: phoneNumber.replace(/\s/g, ""),
      newPassword: newPassword,
    };
    mutate(data);
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return `+${digits}`;
    else if (digits.length <= 5)
      return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    else if (digits.length <= 8)
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    else if (digits.length <= 10)
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
        5,
        8
      )} ${digits.slice(8)}`;
    else
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
        5,
        8
      )} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Parolni tiklash
          </CardTitle>
          <CardDescription className="text-gray-600">
            Yangi parol o'rnating
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
              <Label htmlFor="phoneNumber">Telefon raqami</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+998 90 123 45 67"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Yangi parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yangi parol kiriting"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !phoneNumber || !newPassword}
              className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-medium py-2.5 rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Yuborilmoqda...
                </>
              ) : (
                "Parolni yangilash"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full border-2 cursor-pointer border-gray-400 text-gray-700 hover:bg-gray-50"
            >
              Kirish sahifasiga qaytish
            </Button>
          </form>
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
          <div className="mt-4 text-center">
            {!canResend ? (
              <p className="text-sm text-gray-500">
                Qolgan vaqt:{" "}
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
                className="w-full cursor-pointer border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                {resendLoading ? "Yuborilmoqda..." : "Yangi kod yuborish"}
              </Button>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={otpLoading}
            className="w-full mt-6 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
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
