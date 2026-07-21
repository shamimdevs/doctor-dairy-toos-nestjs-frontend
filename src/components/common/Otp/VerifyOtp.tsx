"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { ApiError, OtpData, VerifyOtpRequest } from "@/src/types/authType";
import { removeOtpData } from "@/src/redux/features/otpSlice";
import { storeUser } from "@/src/redux/features/auth/authSlice";
// import ResendOTP from "./ResendOTP";
import { useVerifyOTPMutation } from "@/src/redux/api/authApi";
import { useRouter } from "next/navigation";

type LoginFormValues = {
  email: string;
  password: string;
};

interface VerifyOtpForm {
  otp_code: string;
}

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

const VerifyOtp: React.FC<Props> = ({ credential, onSuccess }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { otpData } = useSelector((state: RootState) => state.otp);

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyOtpForm>();

  const displayEmail = credential?.email || "";

  const onSubmit: SubmitHandler<VerifyOtpForm> = async (data) => {
    if (!otpData?.id) {
      toast.error("OTP session expired");
      return;
    }

    try {
      // ✅ Payload matches VerifyOtpRequest interface exactly
      const payload: VerifyOtpRequest = {
        user_id: otpData.id,
        otp_code: data.otp_code,
      };

      const res = await verifyOTP(payload).unwrap();

      if (res.success) {
        toast.success("OTP verified successfully");
        dispatch(removeOtpData());
        reset();
        dispatch(storeUser(res?.data?.user));
        if (onSuccess) onSuccess();
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      const message =
        error?.data?.message || error?.message || "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <div className="p-4 md:min-w-100">
      <h3 className="text-xl font-bold text-white mb-2">Verify OTP</h3>
      <p className="text-gray-400 mb-6 text-sm">
        Sent to: <span className="text-blue-400">{displayEmail}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("otp_code", {
              required: "OTP is required",
              pattern: {
                value: /^\d{6}$/,
                message: "Must be a 6-digit number",
              },
            })}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 6-digit OTP"
          />
          {errors.otp_code && (
            <p className="text-xs text-red-400 mt-1">
              {errors.otp_code.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          {isLoading ? <Loader /> : "Confirm Verification"}
        </button>
      </form>

      <div className="mt-6">
        {/* <ResendOTP
          email={displayEmail}
          added_by={otpData?.added_by || ""}
          otpData={otpData}
        /> */}
      </div>
    </div>
  );
};

export default VerifyOtp;
