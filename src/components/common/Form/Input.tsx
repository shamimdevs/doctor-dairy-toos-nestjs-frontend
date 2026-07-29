import { useState } from "react";
import type { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  label: string;
  type?: "text" | "password" | "number";
  text: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  errors?: FieldErrors;
  required?: boolean;
  readOnly?: boolean; // ✅ added
}

const Input = ({
  label,
  type = "text",
  text,
  placeholder,
  register,
  errors,
  required = true,
  readOnly = false, // ✅ default false
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      {/* Label */}
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Input */}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readOnly} // ✅ applied
          {...register}
          className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-400 ${"bg-white border-gray-300 text-gray-900"} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`} // ✅ UI feedback
        />

        {/* Password toggle */}
        {type === "password" && !readOnly && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>

      {/* Error */}
      {errors?.[text] && (
        <p className="text-red-500 text-xs mt-1">
          {errors[text]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;
