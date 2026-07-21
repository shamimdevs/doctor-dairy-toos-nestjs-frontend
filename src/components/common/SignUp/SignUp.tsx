/* eslint-disable react-hooks/incompatible-library */

"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  MapPin,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCreateUserMutation } from "@/src/redux/api/usersApi";
import { storeOTPData } from "@/src/redux/features/otpSlice";
import { ApiError } from "@/src/types/authType";
import VerifyOtp from "../Otp/VerifyOtp";
import CommonModal from "../CommonModal/CommonModal";

interface SignUpFormData {
  name: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  division_id: string | number;
  district_id: string | number;
  upazila_id: string | number;
  address?: string;
}

const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [credential, setCredential] = useState<SignUpFormData | null>(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors },
  } = useForm<SignUpFormData>({});

  const password = watch("password");

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      const payload = {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        password: data.password,
        address: data.address || "",
      };

      const res = await createUser(payload).unwrap();

      if (res?.success) {
        dispatch(storeOTPData(res.data));
        setCredential(data);
        setOtpModalOpen(true);
        reset();
        toast.success(res.message || "Account created successfully!");
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      const message =
        error?.data?.message || error?.message || "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        {/* Back to Home Button */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>

        <ToastContainer theme="light" position="top-right" />

        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          {/* Logo / Brand Name */}
          <div className="flex justify-center items-center gap-2 text-emerald-600">
            <ShieldCheck className="h-10 w-10" />
            <span className="text-3xl font-extrabold tracking-tight text-slate-950">
              Medico<span className="text-emerald-500">.</span>
            </span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-800">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 sm:rounded-xl sm:px-10">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="john@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-slate-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    {...register("mobile", {
                      required: "Mobile number is required",
                      minLength: {
                        value: 11,
                        message: "Enter a valid 11 digit number",
                      },
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "Enter a valid Bangladesh mobile number",
                      },
                    })}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="01712345678"
                    disabled={isLoading}
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Minimum 8 characters",
                      },
                    })}
                    className="block w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) =>
                        val === password || "Passwords do not match",
                    })}
                    className="block w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-slate-700"
                >
                  Detailed Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    {...register("address")}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="House, Road, Area..."
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Create account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Terms & Conditions */}
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <CommonModal active={otpModalOpen} setActive={setOtpModalOpen}>
        <VerifyOtp
          credential={credential}
          onSuccess={() => {
            setOtpModalOpen(false);
            toast.success("Account verified successfully!");
            // Redirect to login after verification
            setTimeout(() => {
              router.push("/login");
            }, 1500);
          }}
        />
      </CommonModal>
    </>
  );
};

export default SignUp;
