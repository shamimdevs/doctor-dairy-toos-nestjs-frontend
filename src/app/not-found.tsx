import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        404 - Page Not Found
      </h1>

      <p className="mt-4 text-base text-gray-600 max-w-md">
        Sorry, we couldn’t find the page you’re looking for. It might have been
        moved or deleted.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
