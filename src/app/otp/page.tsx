"use client";

import {
  ShieldCheck,
  Mail,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const OtpPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 text-emerald-600">
          <ShieldCheck className="h-10 w-10" />
          <span className="text-3xl font-extrabold tracking-tight text-slate-950">
            Medico<span className="text-emerald-500">.</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-800">
          Verify Your Identity
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="text-center text-sm font-medium text-emerald-600">
          +880 1XXX-XXXXXX
        </p>
        <p className="text-center text-xs text-slate-400 mt-1">
          or johndoe@email.com
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg border border-slate-200/80 sm:rounded-2xl sm:px-10 backdrop-blur-sm">
          <form className="space-y-6">
            {/* OTP Input Fields */}
            <div>
              <label className="block text-sm font-medium text-slate-700 text-center mb-4">
                Enter 6-digit code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-semibold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50/50 hover:border-emerald-300"
                    placeholder="•"
                  />
                ))}
              </div>

              {/* Hint Text */}
              <p className="mt-3 text-center text-xs text-slate-400">
                Enter the 6-digit code sent to your device
              </p>

              {/* Error Message (Hidden by default - shown for design demo) */}
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 py-2 px-4 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>Invalid OTP. Please try again.</span>
              </div>

              {/* Success Message (Hidden by default - shown for design demo) */}
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-600 bg-emerald-50 py-2 px-4 rounded-lg animate-pulse">
                <CheckCircle className="h-4 w-4" />
                <span>OTP verified successfully! Redirecting...</span>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200">
              Verify OTP
            </button>

            {/* Resend Section */}
            <div className="text-center pt-2">
              <p className="text-sm text-slate-500">
                Didn&apos;t receive the code?{" "}
                <button className="font-medium text-emerald-600 hover:text-emerald-500 transition-all duration-200">
                  Resend OTP
                </button>
              </p>
              <button className="mt-2 text-xs text-emerald-600 hover:text-emerald-500 transition-colors flex items-center justify-center gap-1 mx-auto">
                <Smartphone className="h-3 w-3" />
                Change delivery method
              </button>
            </div>
          </form>

          {/* Delivery Info */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Mail className="h-3 w-3" />
              <span>Code sent via email & SMS</span>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-4 text-center">
            <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Need help? Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          Secured by end-to-end encryption
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
