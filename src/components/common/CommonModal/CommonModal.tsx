"use client";
import React from "react";
import { X } from "lucide-react";

type Props = {
  active: boolean;
  setActive: (v: boolean) => void;
  children: React.ReactNode;
};

const CommonModal: React.FC<Props> = ({ active, setActive, children }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={() => setActive(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-linear-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/60">
        <div className="h-1.5 rounded-t-2xl bg-linear-to-r from-[#01dc62] to-[#00af50]" />
        <button
          onClick={() => setActive(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default CommonModal;
