"use client";

import React, { useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  /** "dark" matches the CommonModal OTP screens; "light" matches full light-theme pages (e.g. forget-password). */
  variant?: "dark" | "light";
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  error = false,
  variant = "dark",
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = (code: string) => {
    onChange(code);
    if (code.length === length && onComplete) {
      onComplete(code);
    }
  };

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    emit(next.join("").slice(0, length));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    emit(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold rounded-lg border focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
            variant === "light"
              ? "bg-slate-50/50 text-slate-900 placeholder-slate-300 hover:border-emerald-300"
              : "bg-gray-900 text-white placeholder-gray-600"
          } ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : variant === "light"
                ? "border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                : "border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          }`}
          placeholder="•"
        />
      ))}
    </div>
  );
};

export default OtpInput;
