"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const [phone, setPhone] = useState("+998 90 123 45 67");
  const [newPhone, setNewPhone] = useState("");
  const [feedback, setFeedback] = useState("");
  const { t } = useTranslation("common");

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Profil Header */}
      <div className="flex items-center gap-4 mb-8 p-4 border rounded-2xl shadow-sm">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
          A
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t("profile.title")}</h2>
          <p className="text-gray-600">
            {t("profile.phone")}: {phone}
          </p>
        </div>
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
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setPhone(newPhone)}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-blue-700"
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
            onClick={() => {
              alert(`${t("profile.alertMessage")} ${feedback}`);
              setFeedback("");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            {t("profile.send")}
          </button>
          <button
            onClick={() => setFeedback("")}
            className="px-4 py-2 bg-[#cf3333] text-white rounded-xl hover:bg-gray-500"
          >
            {t("profile.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
