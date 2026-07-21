"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { ChevronDown, X } from "lucide-react";

// Option type for select
export interface SelectOption {
  id: string | number;
  name: string;
}

interface SelectAndSearchProps<TForm extends FieldValues> {
  label?: string;
  options: SelectOption[];
  name: Path<TForm>;
  displayName?: Path<TForm>;
  setValue: UseFormSetValue<TForm>;
  errors?: FieldErrors<TForm>;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  disabled?: boolean;
}

const SelectAndSearch = <TForm extends FieldValues>({
  label,
  options,
  name,
  displayName,
  setValue,
  errors,
  placeholder = "Select option",
  required = true,
  value,
  disabled = false,
}: SelectAndSearchProps<TForm>) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute selected option safely
  const selected = useMemo(
    () => options?.find((opt) => String(opt.id) === String(value)) ?? null,
    [value, options],
  );

  const [search, setSearch] = useState(selected?.name ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(selected?.name ?? "");
  }, [selected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption | null) => {
    if (disabled) return;

    if (option) {
      setValue(name, option.id as TForm[typeof name], {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (displayName) {
        setValue(displayName, option.name as TForm[typeof displayName], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      setSearch(option.name);
    } else {
      setValue(name, "" as TForm[typeof name], {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (displayName) {
        setValue(displayName, "" as TForm[typeof displayName], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      setSearch("");
    }
    setOpen(false);
  };

  const handleFocus = () => {
    if (!disabled) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  return (
    <div ref={wrapperRef} className="w-full relative z-50">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex items-center px-3 py-2.5 rounded-md border bg-gray-900/20 border-gray-700/50 transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${errors?.[name] ? "border-red-500" : ""}`}
        onClick={handleFocus}
      >
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            if (!disabled) {
              setSearch(e.target.value);
              if (!open) setOpen(true);
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm w-full"
          autoComplete="off"
          disabled={disabled}
          readOnly={disabled}
        />

        {!disabled && selected && (
          <X
            size={16}
            className="mr-2 opacity-60 hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(null);
            }}
          />
        )}

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${disabled ? "opacity-50" : ""}`}
        />
      </div>

      {open && !disabled && (
        <div
          className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-md border shadow-xl bg-gray-950 border-[#26272F]"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#4B5563 #1F2937" }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-linear-to-r from-blue-600 to-cyan-500 hover:text-white ${
                  option.id === value
                    ? "bg-blue-500 text-white"
                    : "text-gray-300"
                }`}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm opacity-60 text-center">
              No options found
            </div>
          )}
        </div>
      )}

      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default SelectAndSearch;
