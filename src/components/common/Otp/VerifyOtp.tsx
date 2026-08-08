"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  ApiError,
  OtpData,
  VerifyOtpRequest,
  UserProfileResponse,
} from "@/src/types/authType";
import { removeOtpData } from "@/src/redux/features/otpSlice";
import { storeUser } from "@/src/redux/features/auth/authSlice";
import {
  useVerifyOTPMutation,
  useResendOTPMutation,
} from "@/src/redux/api/authApi";
import OtpInput from "./OtpInput";

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_LENGTH = 6;

type LoginFormValues = {
  email: string;
  password: string;
};

interface RootState {
  otp: {
    otpData: OtpData | null;
  };
}

interface Props {
  credential: LoginFormValues | null;
  onSuccess?: () => void;
  redirectPath?: string;
}

const VerifyOtp: React.FC<Props> = ({
  credential,
  onSuccess,
  redirectPath,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { otpData } = useSelector((state: RootState) => state.otp);

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const displayEmail = credential?.email || "";

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const submitOtp = async (code: string) => {
    if (!otpData?.id) {
      toast.error("OTP session expired. Please request a new OTP.");
      return;
    }

    if (code.length !== OTP_LENGTH) {
      return;
    }

    try {
      const payload: VerifyOtpRequest = {
        user_id: otpData.id,
        otp_code: code,
      };

      const res = (await verifyOTP(payload).unwrap()) as UserProfileResponse;

      if (res?.success) {
        const user = res?.data?.user;

        toast.success(res?.message || "OTP verified successfully");
        setError(false);

        dispatch(removeOtpData());
        if (user) {
          dispatch(storeUser(user));
        }

        setOtpCode("");

        if (onSuccess) {
          onSuccess();
        }

        if (user?.role === "super_admin") {
          router.push("/dashboard");
        } else {
          router.push(redirectPath || "/");
        }
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const message =
        apiError?.data?.message ||
        apiError?.message ||
        "Invalid or expired OTP.";
      toast.error(message);
      setError(true);
      setOtpCode("");
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending || !displayEmail) return;

    try {
      await resendOTP({ email: displayEmail }).unwrap();
      toast.success("A new OTP has been sent to your email.");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtpCode("");
      setError(false);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(
        apiError?.data?.message ||
          apiError?.message ||
          "Failed to resend OTP.",
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitOtp(otpCode);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="p-4 md:min-w-100">
      <h3 className="text-xl font-bold text-white mb-2">Verify OTP</h3>
      <p className="text-gray-400 mb-6 text-sm">
        Sent to: <span className="text-blue-400">{displayEmail}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <OtpInput
            length={OTP_LENGTH}
            value={otpCode}
            onChange={(code) => {
              setOtpCode(code);
              setError(false);
            }}
            onComplete={(code) => void submitOtp(code)}
            disabled={isLoading}
            error={error}
          />
          {error && (
            <p className="text-xs text-red-400 mt-2 text-center">
              Invalid or expired code. Please try again.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otpCode.length !== OTP_LENGTH}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            "Confirm Verification"
          )}
        </button>

        <div className="text-center pt-1">
          <p className="text-sm text-gray-400">
            Didn&apos;t receive the code?{" "}
            {secondsLeft > 0 ? (
              <span className="text-gray-500">
                Resend in {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-blue-400 hover:text-blue-300 transition disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
