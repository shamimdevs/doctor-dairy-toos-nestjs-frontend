import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";

interface TextareaProps<T extends FieldValues> {
  label: string;
  text: Path<T>;
  placeholder?: string;
  register: UseFormRegisterReturn;
  errors?: FieldErrors<T>;
  required?: boolean;
  className?: string;
}

const Textarea = <T extends FieldValues>({
  label,
  text,
  placeholder,
  register,
  errors,
  required = true,
  className = "",
}: TextareaProps<T>) => {
  const errorMessage = errors?.[text]?.message as string | undefined;

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Textarea */}
      <textarea
        rows={5}
        placeholder={placeholder}
        aria-invalid={!!errorMessage}
        {...register}
        className={`w-full px-3 py-2 rounded-md border resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 ${"bg-white border-gray-300 text-gray-900 placeholder-gray-400"}`}
      />

      {/* Error */}
      {errorMessage && (
        <p role="alert" className="text-red-500 text-xs mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Textarea;
