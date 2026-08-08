/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useForgetPasswordMutation,
  useForgetPasswordResendOtpMutation,
  useResetPasswordMutation,
} from "@/src/redux/api/authApi";
import { ApiError } from "@/src/types/authType";
import OtpInput from "../Otp/OtpInput";

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_LENGTH = 6;

type EmailFormValues = {
  email: string;
};

type NewPasswordFormValues = {
  new_password: string;
  confirm_password: string;
};

const ForgetPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const [forgetPassword, { isLoading: isSendingEmail }] =
    useForgetPasswordMutation();
  const [resendOtp, { isLoading: isResending }] =
    useForgetPasswordResendOtpMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const emailForm = useForm<EmailFormValues>();
  const passwordForm = useForm<NewPasswordFormValues>();
  const newPasswordValue = passwordForm.watch("new_password");

  useEffect(() => {
    if (step !== "reset" || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, secondsLeft]);

  const onSubmitEmail: SubmitHandler<EmailFormValues> = async (data) => {
    try {
      await forgetPassword({ email: data.email.trim() }).unwrap();
      setEmail(data.email.trim());
      setStep("reset");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      toast.success(
        "If an account exists for this email, a reset code has been sent.",
      );
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(
        error?.data?.message || error?.message || "Something went wrong.",
      );
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;

    try {
      await resendOtp({ email }).unwrap();
      toast.success("A new code has been sent to your email.");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtpCode("");
      setOtpError(false);
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(
        error?.data?.message || error?.message || "Failed to resend code.",
      );
    }
  };

  const onSubmitReset: SubmitHandler<NewPasswordFormValues> = async (data) => {
    if (otpCode.length !== OTP_LENGTH) {
      setOtpError(true);
      toast.error("Please enter the 6-digit code.");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        otp_code: otpCode,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      }).unwrap();

      toast.success(
        res?.data?.message ||
          "Password reset successfully. Please sign in with your new password.",
      );
      router.push("/login");
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(
        error?.data?.message || error?.message || "Invalid or expired code.",
      );
      setOtpError(true);
      setOtpCode("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Back to Sign in</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 text-emerald-600">
          <ShieldCheck className="h-10 w-10" />
          <span className="text-3xl font-extrabold tracking-tight text-slate-950">
            Doctor Dairy Tools<span className="text-emerald-500">.</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-800">
          {step === "email"
            ? "Reset your password"
            : "Enter code & new password"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          {step === "email"
            ? "We'll email you a 6-digit code to reset your password."
            : `Code sent to ${email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 sm:rounded-xl sm:px-10">
          {step === "email" ? (
            <form
              className="space-y-6"
              onSubmit={emailForm.handleSubmit(onSubmitEmail)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...emailForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    autoComplete="email"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="name@example.com"
                    disabled={isSendingEmail}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingEmail}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSendingEmail ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    Send reset code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form
              className="space-y-6"
              onSubmit={passwordForm.handleSubmit(onSubmitReset)}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 text-center mb-3">
                  Enter 6-digit code
                </label>
                <OtpInput
                  length={OTP_LENGTH}
                  value={otpCode}
                  onChange={(code) => {
                    setOtpCode(code);
                    setOtpError(false);
                  }}
                  disabled={isResetting}
                  error={otpError}
                  variant="light"
                />
                <p className="mt-3 text-center text-sm text-slate-500">
                  {secondsLeft > 0 ? (
                    <span className="text-slate-400">
                      Resend in {Math.floor(secondsLeft / 60)}:
                      {(secondsLeft % 60).toString().padStart(2, "0")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="font-medium text-emerald-600 hover:text-emerald-500 transition disabled:opacity-50"
                    >
                      {isResending ? "Resending..." : "Resend code"}
                    </button>
                  )}
                </p>
              </div>

              <div>
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-slate-700"
                >
                  New password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="new_password"
                    type={showPassword ? "text" : "password"}
                    {...passwordForm.register("new_password", {
                      required: "New password is required",
                      minLength: { value: 8, message: "Minimum 8 characters" },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                        message:
                          "Must include upper, lower, number, and special character",
                      },
                    })}
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    disabled={isResetting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {passwordForm.formState.errors.new_password && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm new password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...passwordForm.register("confirm_password", {
                      required: "Please confirm your new password",
                      validate: (val) =>
                        val === newPasswordValue || "Passwords do not match",
                    })}
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    disabled={isResetting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {passwordForm.formState.errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isResetting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
