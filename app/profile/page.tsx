"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/userStore";
import useApiMutation from "@/hooks/useMutation";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState("");
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clearUser, user, setUserChange } = useStore();
  const [verify, setVerify] = useState<boolean>(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minut = 120 sekund
  const [canResend, setCanResend] = useState(false);
  const [dataResponse, setDataResponse] = useState<any>(null);

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
    clearUser();
  };
  const { mutate, isLoading } = useApiMutation({
    url: `/user/change/phone-number/${user?.id}`,
    method: "POST",
    onSuccess: (data) => {
      toast.info(t("register.otpSent"));
      setVerify(true);
      setDataResponse(data?.data);
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
  const { mutate: otpMutate, isLoading: otpLoading } = useApiMutation({
    url: `/user/verify/phone-number/${user?.id}`,
    method: "PATCH",
    onSuccess: (data) => {
      setPhone("");
      toast.success(t("Telfon nomeringiz almashtirildi"));
      setVerify(false);
      setUserChange(data?.data);
      setCode(["", "", "", ""]);
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
    url: `/user/send-otp-again/phone-number/${user?.id}`,
    method: "POST",
    onSuccess: (data) => {
      toast.success(t("register.newCodeSent"));
      setTimeLeft(120); // vaqtni qaytadan 2 minutga o‘rnatamiz
      setCanResend(false);
      setDataResponse(data?.data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("register.errorOccurred"));
    },
  });

  useEffect(() => {
    if (!verify) {
      setCode(["", "", "", ""]);
    }
  }, [verify]);

  const handleResend = () => {
    resendMutate({
      phoneNumber: phone.replace(/\s/g, ""),
      // verification_key: dataResponse?.details,
    });
  };

  const { mutate: sendFeedback, isLoading: feedbackLoading } = useApiMutation({
    url: "feedback",
    method: "POST",
    onSuccess: () => {
      toast.success("Tablab va takliflaringiz yuborildi!");
      setFeedback("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const handleSendFeedback = () => {
    const data = {
      text: feedback,
    };
    sendFeedback(data);
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
    setPhone(formatted);
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

  const handeChangeNumber = () => {
    const data = {
      phoneNumber: phone?.replace(/\s/g, ""),
    };
    mutate(data);
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 4) {
      toast.error(t("register.errorCodeLength1"));
      return;
    }
    const data = {
      verification_key: dataResponse?.details,
      phoneNumber: phone.replace(/\s/g, ""),
      otp: enteredCode,
    };

    otpMutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between mb-3">
      <button
          onClick={() => {router.push("/")}}
          className="px-4 py-2 cursor-pointer  bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          Orqaga
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-xl cursor-pointer hover:bg-gray-500"
        >
          Chiqish
        </button>
      </div>
      {/* Profil Header */}
      <div className="flex items-center justify-between gap-4 mb-8 p-4 border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
            A
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
            <p className="text-gray-600">
              {t("profile.phone")}: {user?.phoneNumber}
            </p>
          </div>
        </div>

        {/* Logout button tepada */}
      </div>

      {/* Telefon raqamni almashtirish */}
      <div className="mb-8 p-4 border rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3">
          {t("profile.changePhone")}
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="+998 ..."
            value={phone}
            onChange={handlePhoneChange}
            className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handeChangeNumber}
            disabled={isLoading}
            className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-xl hover:bg-blue-700"
          >
            {t("profile.save")}
          </button>
        </div>
      </div>

      {/* Talab va takliflar */}
      <div className="p-4 border rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3">
          {t("profile.feedbackTitle")}
        </h3>
        <textarea
          placeholder={t("profile.feedbackPlaceholder") as string}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full min-h-[100px] px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSendFeedback}
            disabled={feedbackLoading}
            className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            {t("profile.send")}
          </button>
          <button
            onClick={() => setFeedback("")}
            className="px-4 py-2 cursor-pointer bg-[#cf3333] text-white rounded-xl hover:bg-gray-500"
          >
            {t("profile.cancel")}
          </button>
        </div>
      </div>
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
                className="w-full cursor-pointer border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                {resendLoading ? t("register.resending") : t("register.resend")}
              </Button>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={otpLoading}
            className="w-full cursor-pointer mt-6 bg-green-600 hover:bg-green-700 text-white"
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
