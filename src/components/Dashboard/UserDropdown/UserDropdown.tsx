"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  authApi,
  useGetMyProfileQuery,
  useSignOutMutation,
} from "@/src/redux/api/authApi";
import { logout, storeUser } from "@/src/redux/features/auth/authSlice";
import { ApiError, LogoutResponse } from "@/src/types/authType";

interface RootState {
  auth: {
    user: {
      email: string;
      role: string;
      name?: string;
    } | null;
  };
}

export const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux Selectors & API Queries
  const { user: userData } = useSelector((state: RootState) => state.auth);
  const { data: myInfo } = useGetMyProfileQuery();
  const [signOut, { isLoading: isLoggingOut }] = useSignOutMutation();

  // Correctly extract the `user` object inside `data` based on UserProfileResponse
  const currentUser = myInfo?.data?.user;

  // Sync profile data with Redux store
  useEffect(() => {
    if (currentUser && !userData) {
      dispatch(storeUser({ email: currentUser.email, role: currentUser.role }));
    }
  }, [currentUser, userData, dispatch]);

  // Logout handler
  const handleLogout = async () => {
    try {
      // Cast or let unwrap infer LogoutResponse
      const response = (await signOut().unwrap()) as LogoutResponse;
      if (response?.success) {
        dispatch(logout());
        dispatch(authApi.util.resetApiState());
        toast.success("Successfully logged out!", { theme: "dark" });
        setShowLogoutModal(false);
        setIsOpen(false);
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.data?.message || "Sign out failed", { theme: "dark" });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Display user's name dynamically with fallback
  const displayName = currentUser?.name || userData?.name || "User Account";

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <div className=" px-3 py-2 text-sm font-medium text-gray-800">
            <h2> {displayName}</h2>
            <h2>{currentUser?.role == "super_admin" ? "Super Admin" : ""}</h2>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Settings
            </Link>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={() => {
                setIsOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Sign Out
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-50"
              >
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
