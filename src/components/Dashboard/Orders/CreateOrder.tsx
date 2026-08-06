"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  PackageSearch,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Loader2,
  Truck,
  Weight,
} from "lucide-react";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import { useDebounce } from "@/src/hooks/useDebounce";
import { ApiError } from "@/src/types/authType";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";
import { useGetProductsInfiniteQuery } from "@/src/redux/api/productsApi";
import { useCreateOrderMutation } from "@/src/redux/api/orderApi";
import type { Product } from "@/src/types/productsType";

const PRODUCTS_LIMIT = 12;
const DEFAULT_ITEM_WEIGHT = 0.15;
const GRID_IMAGE_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

interface OrderCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  weight: number;
}

interface CustomerDetails {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
}

const calculateEstimatedDelivery = (weightKg: number) => {
  const baseWeight = 1;
  const baseFee = 120;
  const extraPerKg = 20;

  if (weightKg <= baseWeight) return baseFee;
  return baseFee + Math.ceil(weightKg - baseWeight) * extraPerKg;
};

// Shows the product thumbnail, falling back to a placeholder icon both when
// there is no image and when the stored URL fails to load (broken/expired
// upload link) so a card never renders visibly empty.
const ProductThumb: React.FC<{
  src?: string;
  alt: string;
  sizes: string;
  iconSize: number;
}> = ({ src, alt, sizes, iconSize }) => {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-300">
        <PackageSearch size={iconSize} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setBroken(true)}
    />
  );
};

const CreateOrder = () => {
  const router = useRouter();

  // ---- Category & product browsing state ----
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchValue, 400) as string;

  const { data: categoriesRes, isLoading: isCategoriesLoading } =
    useGetAllProductCategoriesQuery({ limit: 100 });
  const categories = categoriesRes?.data || [];

  // Reset back to page 1 whenever the category or search filter changes, so
  // infinite scroll starts fresh for the new filter. Adjusted during render
  // (React's recommended pattern for resetting state on a prop/derived-value
  // change) rather than in an effect, to avoid an extra render pass.
  const filterKey = `${selectedCategoryId}::${debouncedSearch.trim()}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const {
    data: productsRes,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetProductsInfiniteQuery({
    page,
    limit: PRODUCTS_LIMIT,
    is_active: true,
    ...(selectedCategoryId ? { category_id: selectedCategoryId } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const allProducts: Product[] = productsRes?.data || [];
  const totalPages = productsRes?.meta?.totalPages || 1;
  const hasMore = page < totalPages;

  // Auto-load the next page once the sentinel at the bottom of the grid
  // scrolls into view.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isProductsFetching) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isProductsFetching]);

  // Lets the mobile floating cart bar jump straight to the cart panel,
  // which sits below the product grid in the single-column mobile layout.
  const cartPanelRef = useRef<HTMLDivElement | null>(null);
  const scrollToCart = () => {
    cartPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ---- Local order cart (kept separate from the storefront cart) ----
  const [cart, setCart] = useState<OrderCartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

  const cartQuantityById = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((item) => map.set(item.productId, item.quantity));
    return map;
  }, [cart]);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalWeight = cart.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0,
  );
  const estimatedDelivery = calculateEstimatedDelivery(totalWeight);
  const estimatedTotal = subtotal + estimatedDelivery;

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.thumbnail,
          weight: product.weight || DEFAULT_ITEM_WEIGHT,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setFormError("Add at least one product to the order.");
      return;
    }
    if (
      !customer.fullName.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      setFormError("Customer name, phone and address are required.");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(customer.phone.trim())) {
      setFormError("Enter a valid Bangladeshi mobile number.");
      return;
    }

    setFormError(null);

    try {
      const response = await createOrder({
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        notes: customer.notes.trim() || undefined,
        items: cart.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight,
          image: item.image,
        })),
      }).unwrap();

      const orderNumber = response?.data?.order_number || "Order";
      toast.success(`${orderNumber} created successfully!`);

      setCart([]);
      setCustomer({ fullName: "", phone: "", address: "", notes: "" });
      router.push("/dashboard/orders/all-orders");
    } catch (err) {
      const error = err as ApiError;
      Swal.fire({
        title: "Order Creation Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div
      className={`rounded-lg border bg-white border-gray-200 overflow-hidden p-3 sm:p-6 ${
        cart.length > 0 ? "pb-24 lg:pb-6" : ""
      }`}
    >
      <PageHeader
        title="Create Order"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Orders", link: "/dashboard/orders/all-orders" },
          { title: "Create Order" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* ---------------- Left: Categories + Products ---------------- */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category row */}
          <div className="rounded-xl border border-gray-200 p-3 sm:p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Select Category
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => handleCategoryClick("")}
                className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  selectedCategoryId === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Products
              </button>
              {isCategoriesLoading ? (
                <span className="text-sm text-gray-400 px-2">
                  Loading categories...
                </span>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                      selectedCategoryId === cat.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Product search + grid */}
          <div className="rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {isProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(PRODUCTS_LIMIT)].map((_, i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : allProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <PackageSearch size={40} className="mb-3" />
                <p className="text-sm">No products found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {allProducts.map((product) => {
                    const qtyInCart = cartQuantityById.get(product.id) || 0;

                    return (
                      <div
                        key={product.id}
                        className="rounded-lg border border-gray-200 p-2.5 sm:p-3 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col"
                      >
                        <div className="relative h-20 sm:h-24 w-full rounded-md bg-gray-50 overflow-hidden mb-2">
                          <ProductThumb
                            src={product.thumbnail}
                            alt={product.name}
                            sizes={GRID_IMAGE_SIZES}
                            iconSize={24}
                          />
                        </div>

                        <p
                          className="text-xs sm:text-sm font-semibold text-gray-800 wrap-break-word"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        <p className="text-sm font-bold text-blue-600 mt-1">
                          ৳{product.price}
                        </p>

                        {qtyInCart > 0 ? (
                          <div className="mt-2 flex items-center justify-between rounded-md border border-gray-200 overflow-hidden">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(product.id, qtyInCart - 1)
                              }
                              className="cursor-pointer px-3 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold text-gray-800">
                              {qtyInCart}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="cursor-pointer px-3 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="cursor-pointer mt-2 flex items-center justify-center gap-1.5 rounded-md bg-blue-50 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 active:bg-blue-200 transition"
                          >
                            <Plus size={14} />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Infinite scroll sentinel + status */}
                <div ref={sentinelRef} className="h-1" />
                {isProductsFetching && (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    Loading more products...
                  </div>
                )}
                {!hasMore && !isProductsFetching && (
                  <p className="py-4 text-center text-xs text-gray-400">
                    You&apos;ve reached the end of the list.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* ---------------- Right: Cart + Customer + Submit ---------------- */}
        <div className="lg:col-span-1">
          <div
            ref={cartPanelRef}
            className="rounded-xl border border-gray-200 p-3 sm:p-4 lg:sticky lg:top-6 space-y-5 scroll-mt-4"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <ShoppingCart size={16} className="text-blue-600" />
                Cart Items ({totalQuantity})
              </h2>

              {cart.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
                  No items added yet.
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white border border-gray-200">
                        <ProductThumb
                          src={item.image}
                          alt={item.name}
                          sizes="40px"
                          iconSize={16}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                            className="cursor-pointer rounded border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="min-w-4 text-center text-xs font-bold text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1,
                              )
                            }
                            className="cursor-pointer rounded border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-gray-800">
                          ৳{item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="cursor-pointer mt-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cash on Delivery / weight-based delivery charge breakdown */}
            <div className="rounded-xl border-2 border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-1 flex items-center gap-2">
                <Truck size={16} className="text-blue-600" />
                <p className="text-sm font-bold text-gray-800">
                  Cash on Delivery
                </p>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                Customer pays cash upon delivery
              </p>

              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  COD
                </span>
                <span className="text-lg font-extrabold text-blue-600">
                  ৳{cart.length ? estimatedDelivery : 0}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-100 bg-white/70 p-2 text-xs text-gray-700">
                <span className="flex items-center gap-1">
                  <Weight size={12} className="text-blue-600" />
                  Total weight: {totalWeight.toFixed(2)} kg
                </span>
                <span className="text-gray-300">|</span>
                <span>
                  {totalWeight <= 1
                    ? "Base delivery (1kg)"
                    : `Base (1kg) + ${(totalWeight - 1).toFixed(2)}kg extra`}
                </span>
                <span className="text-gray-300">|</span>
                <span className="font-bold text-blue-600">
                  ৳120 + {Math.max(0, Math.ceil(totalWeight - 1))} × ৳20
                </span>
              </div>

              <p className="mt-2 text-[11px] text-gray-400">
                * Delivery charge: ৳120 for the first 1kg, ৳20 for each
                additional kg. Final charge is confirmed by the server.
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-700">
                  ৳{subtotal}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Est. Delivery</span>
                <span className="font-semibold text-gray-700">
                  ৳{cart.length ? estimatedDelivery : 0}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-blue-600">
                  ৳{cart.length ? estimatedTotal : 0}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Final delivery charge is calculated by the server on submit.
              </p>
            </div>

            {/* Customer details */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Customer Details
              </h2>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <User size={13} /> Full Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                  placeholder="e.g. Md. Karim Rahman"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <Phone size={13} /> Phone{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  placeholder="e.g. 01712345678"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <MapPin size={13} /> Address{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  rows={2}
                  placeholder="Delivery address"
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <MessageSquare size={13} /> Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={customer.notes}
                  onChange={handleCustomerChange}
                  rows={2}
                  placeholder="Any special instructions"
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            {formError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {formError}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-linear-to-r from-blue-500 to-blue-600 py-3 text-sm font-bold text-white transition-colors hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Create Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only floating cart summary — the cart panel sits below the
          product grid on small screens, so this keeps the running total
          reachable without scrolling all the way down. */}
      {cart.length > 0 && (
        <button
          onClick={scrollToCart}
          className="lg:hidden fixed inset-x-3 bottom-3 z-30 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-4 py-3 text-white shadow-lg shadow-blue-900/20 active:from-blue-600 active:to-blue-700"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingCart size={16} />
            {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
          </span>
          <span className="text-sm font-extrabold">
            ৳{estimatedTotal} &middot; View Cart
          </span>
        </button>
      )}
    </div>
  );
};

export default CreateOrder;
