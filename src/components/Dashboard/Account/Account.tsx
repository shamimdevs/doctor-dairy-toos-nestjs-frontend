/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/account/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  Edit,
  Calendar,
  ChevronRight,
  Plus,
  Trash2,
  Home,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetMyProfileQuery,
  useSignOutMutation,
  authApi,
} from "@/src/redux/api/authApi";
import { useUpdateMyProfileMutation } from "@/src/redux/api/usersApi";
import { useGetMyOrdersQuery } from "@/src/redux/api/orderApi";
import {
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/src/redux/api/wishlistApi";
import { useAddToCartMutation } from "@/src/redux/api/cartApi";
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetMyAddressesQuery,
  useUpdateAddressMutation,
} from "@/src/redux/api/addressApi";
import { logout as logoutAction } from "@/src/redux/features/auth/authSlice";

// Components
const Sidebar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
}> = ({ activeTab, onTabChange, user }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout, { isLoading: isLoggingOut }] = useSignOutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  // Inside the Sidebar component in account/page.tsx
  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      if (response) {
        dispatch(logoutAction());
        dispatch(authApi.util.resetApiState());
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        toast.success("Successfully logged out!");
        setShowLogoutModal(false);
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as any;
      // Always clear local state even if API fails
      dispatch(logoutAction());
      dispatch(authApi.util.resetApiState());
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      toast.error(error?.data?.message || "Sign out failed", { theme: "dark" });
      setShowLogoutModal(false);
      router.push("/");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
      {/* User Info */}
      <div className="text-center pb-6 border-b border-slate-100">
        <div className="w-20 h-20 rounded-full bg-emerald-100 mx-auto mb-3 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || "User"}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-emerald-600">
              {user?.name?.charAt(0) || "U"}
            </span>
          )}
        </div>
        <h3 className="font-bold text-slate-900">{user?.name || "User"}</h3>
        <p className="text-xs text-slate-500">{user?.email || ""}</p>
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} className={isActive ? "text-emerald-600" : ""} />
              {item.label}
              {isActive && (
                <ChevronRight size={16} className="ml-auto text-emerald-600" />
              )}
            </button>
          );
        })}

        {/* Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold text-red-500 hover:bg-red-50 mt-4 pt-4 border-t border-slate-100 disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </button>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingOut && <Loader2 size={18} className="animate-spin" />}
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Tab
const ProfileTab: React.FC<{ user: any; refetch: () => void }> = ({
  user,
  refetch,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.mobile || user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        mobile: formData.phone,
        email: formData.email,
      }).unwrap();
      setIsEditing(false);
      refetch();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
        >
          <Edit size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Calendar size={20} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">Member since</p>
          <p className="text-sm text-slate-600">
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
            />
          ) : (
            <p className="text-sm text-slate-600">{user?.name || "N/A"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
            />
          ) : (
            <p className="text-sm text-slate-600">
              {user?.mobile || user?.phone || "N/A"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
            />
          ) : (
            <p className="text-sm text-slate-600">{user?.email || "N/A"}</p>
          )}
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

// Orders Tab
const OrdersTab: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const { data, isLoading, refetch } = useGetMyOrdersQuery({});

  const orders = data?.data || [];

  // Fix: Use proper type assertion for filter
  const filteredOrders = orders.filter((order: any) =>
    filter === "all" ? true : order.order_status === filter,
  );

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o: any) => o.order_status === "pending").length,
    confirmed: orders.filter((o: any) => o.order_status === "confirmed").length,
    processing: orders.filter((o: any) => o.order_status === "processing")
      .length,
    shipped: orders.filter((o: any) => o.order_status === "shipped").length,
    delivered: orders.filter((o: any) => o.order_status === "delivered").length,
    cancelled: orders.filter((o: any) => o.order_status === "cancelled").length,
  };

  const statusFilters = [
    { id: "all", label: "All Orders", count: statusCounts.all },
    { id: "pending", label: "Pending", count: statusCounts.pending },
    { id: "confirmed", label: "Confirmed", count: statusCounts.confirmed },
    { id: "processing", label: "Processing", count: statusCounts.processing },
    { id: "shipped", label: "Shipped", count: statusCounts.shipped },
    { id: "delivered", label: "Delivered", count: statusCounts.delivered },
    { id: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-amber-500" />;
      case "confirmed":
        return <CheckCircle size={16} className="text-blue-500" />;
      case "processing":
        return <AlertCircle size={16} className="text-purple-500" />;
      case "shipped":
        return <Truck size={16} className="text-emerald-500" />;
      case "delivered":
        return <CheckCircle size={16} className="text-green-500" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-emerald-100 text-emerald-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">My Orders</h2>
        <button
          onClick={() => refetch()}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          Refresh
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button
            key={status.id}
            onClick={() => setFilter(status.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === status.id
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {status.label}
            <span className="ml-1 text-xs opacity-80">({status.count})</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-sm text-slate-500 font-semibold">
            {orders.length === 0
              ? "No orders yet"
              : "No orders found with this status"}
          </p>
          {orders.length === 0 && (
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => {
            const firstItem = order.items?.[0];
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    {firstItem?.product_name ? (
                      <div className="flex items-center justify-center w-full h-full bg-emerald-50 text-emerald-600 font-bold text-xs">
                        {firstItem.quantity}x
                      </div>
                    ) : (
                      <Package size={32} className="text-slate-300 m-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        #{order.order_number}
                      </p>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(
                          order.order_status,
                        )}`}
                      >
                        {getStatusIcon(order.order_status)}
                        {order.order_status.charAt(0).toUpperCase() +
                          order.order_status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {order.items?.length || 0} items •{" "}
                      {order.placed_at
                        ? new Date(order.placed_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </p>
                    <p className="text-sm font-bold text-emerald-600">
                      ৳{Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Wishlist Tab
const WishlistTab: React.FC = () => {
  const { data, isLoading, refetch } = useGetMyWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const wishlistItems = data?.data || [];

  const handleRemove = async (id: string) => {
    try {
      await removeFromWishlist(id).unwrap();
      refetch();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({ product_id: productId, quantity: 1 }).unwrap();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">Wishlist</h2>
        <button
          onClick={() => refetch()}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          Refresh
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <Heart size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-sm text-slate-500 font-semibold">
            Your wishlist is empty
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item: any) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="relative aspect-square bg-slate-50">
                {item.product.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Package size={48} className="text-slate-300" />
                  </div>
                )}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {item.product.name}
                </p>
                <p className="text-sm font-extrabold text-emerald-600">
                  ৳{Number(item.product.price).toFixed(2)}
                </p>
                <button
                  onClick={() => handleAddToCart(item.product.id)}
                  className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-lg transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Addresses Tab
const AddressesTab: React.FC = () => {
  const { data, isLoading, refetch } = useGetMyAddressesQuery();
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address: "",
    area: "",
    city: "",
    state: "",
    zip: "",
    country: "Bangladesh",
    is_default: false,
  });

  const addresses = data?.data || [];

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id).unwrap();
      refetch();
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updateAddress({ id, data: { is_default: true } }).unwrap();
      refetch();
      toast.success("Default address updated!");
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ Use as any to bypass the type check
      await createAddress(newAddress as any).unwrap();
      refetch();
      setShowAddForm(false);
      setNewAddress({
        full_name: "",
        phone: "",
        address: "",
        area: "",
        city: "",
        state: "",
        zip: "",
        country: "Bangladesh",
        is_default: false,
      });
      toast.success("Address added successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add address");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">Addresses</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-sm text-slate-500 font-semibold">
            No addresses found. Add a new one below.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address: any) => (
            <div
              key={address.id}
              className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                address.is_default
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Home size={18} className="text-emerald-600" />
                  <p className="font-bold text-slate-800">
                    {address.full_name || "Address"}
                  </p>
                  {address.is_default && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <CheckCircle size={16} className="text-slate-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">{address.phone}</p>
              <p className="text-sm text-slate-500 mt-1">
                {address.address}
                {address.area && `, ${address.area}`}
                {address.city && `, ${address.city}`}
                {address.state && `, ${address.state}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4">Add New Address</h3>
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.full_name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, full_name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                required
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
                placeholder="House #123, Road #45"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Area
                </label>
                <input
                  type="text"
                  value={newAddress.area}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, area: e.target.value })
                  }
                  placeholder="Bashundhara R/A"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  placeholder="Dhaka"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  placeholder="Dhaka"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                  placeholder="1000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newAddress.is_default}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      is_default: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-bold text-slate-700">
                  Set as default address
                </span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Main Account Page
export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: profileData, isLoading, refetch } = useGetMyProfileQuery();

  const user = profileData?.data?.user;

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} refetch={refetch} />;
      case "orders":
        return <OrdersTab />;
      case "wishlist":
        return <WishlistTab />;
      case "addresses":
        return <AddressesTab />;

      default:
        return <ProfileTab user={user} refetch={refetch} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              user={user}
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
