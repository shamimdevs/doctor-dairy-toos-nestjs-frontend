"use client";

import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileDown,
  Search,
  Trash2,
} from "lucide-react";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  type IOrder,
  type IUpdateOrderDto,
} from "@/src/redux/api/orderApi";
import { useDebounce } from "@/src/hooks/useDebounce";
import { ApiError } from "@/src/types/authType";
import Pagination from "@/src/utils/Pagination";
import { downloadOrderInvoicePDF, downloadOrdersReportPDF } from "@/src/utils/orderPdf";

const LIMIT = 10;

const ORDER_STATUSES: NonNullable<IUpdateOrderDto["order_status"]>[] = [
  "pending",
  "processing",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: NonNullable<IUpdateOrderDto["payment_status"]>[] = [
  "pending",
  "paid",
  "failed",
];

// Order status is genuine application state, so it uses the same reserved
// status palette as the dashboard overview's OrderStatusChart.
const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_BADGE: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

const AllOrders: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const orders: IOrder[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    const nested = (data as { data?: IOrder[] } | undefined)?.data;
    return Array.isArray(nested) ? nested : [];
  }, [data]);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const debouncedSearch = useDebounce(searchValue, 400) as string;

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter) {
      result = result.filter((o) => o.order_status === statusFilter);
    }

    if (debouncedSearch.trim()) {
      const term = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(term) ||
          o.customer_name?.toLowerCase().includes(term) ||
          o.phone?.toLowerCase().includes(term),
      );
    }

    return result;
  }, [orders, statusFilter, debouncedSearch]);

  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / LIMIT));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (
    order: IOrder,
    status: NonNullable<IUpdateOrderDto["order_status"]>,
  ) => {
    try {
      await updateOrder({ id: order.id, data: { order_status: status } }).unwrap();
      toast.success(`Order ${order.order_number} marked as ${status}`);
    } catch (err) {
      const apiError = err as ApiError;
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: apiError.data?.message || apiError.message || "Could not update order status.",
      });
    }
  };

  const handlePaymentStatusChange = async (
    order: IOrder,
    status: NonNullable<IUpdateOrderDto["payment_status"]>,
  ) => {
    try {
      await updateOrder({ id: order.id, data: { payment_status: status } }).unwrap();
      toast.success(`Payment status updated for ${order.order_number}`);
    } catch (err) {
      const apiError = err as ApiError;
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: apiError.data?.message || apiError.message || "Could not update payment status.",
      });
    }
  };

  const handleDelete = async (order: IOrder) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete order ${order.order_number}? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteOrder(order.id).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Order ${order.order_number} has been deleted.`,
        timer: 1000,
        showConfirmButton: false,
      });
      refetch();
    } catch (err) {
      const apiError = err as ApiError;
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: apiError.data?.message || apiError.message || "Delete failed",
      });
    }
  };

  const handleDownloadInvoice = async (order: IOrder) => {
    setDownloadingId(order.id);
    try {
      await downloadOrderInvoicePDF(order);
    } catch {
      toast.error("Failed to generate invoice PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExportAll = async () => {
    if (filteredOrders.length === 0) {
      toast.info("No orders to export.");
      return;
    }
    setIsExporting(true);
    try {
      await downloadOrdersReportPDF(filteredOrders);
    } catch {
      toast.error("Failed to generate report PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        {[...Array(LIMIT)].map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Manage customer orders and payments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search order, customer, phone..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full sm:w-64 rounded-lg border border-gray-300 pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600 capitalize"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-60 px-4 py-2 text-white text-sm font-semibold transition"
          >
            <FileDown size={16} />
            {isExporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 w-8"></th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">Payment</th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => {
                const isExpanded = expandedId === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          className="cursor-pointer text-gray-400 hover:text-emerald-600"
                          title={isExpanded ? "Collapse" : "View items"}
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-gray-800">{order.order_number}</td>
                      <td className="px-5 py-3 text-sm">
                        <p className="font-medium text-gray-800">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            handleStatusChange(
                              order,
                              e.target.value as NonNullable<IUpdateOrderDto["order_status"]>,
                            )
                          }
                          className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-bold capitalize outline-none ${
                            STATUS_BADGE[order.order_status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <select
                          value={order.payment_status}
                          onChange={(e) =>
                            handlePaymentStatusChange(
                              order,
                              e.target.value as NonNullable<IUpdateOrderDto["payment_status"]>,
                            )
                          }
                          className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-bold capitalize outline-none ${
                            PAYMENT_BADGE[order.payment_status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-extrabold text-emerald-600 whitespace-nowrap">
                        ৳{Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={downloadingId === order.id}
                            className="cursor-pointer rounded-lg p-2 text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                            title="Download Invoice PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(order)}
                            className="cursor-pointer rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="border-t border-gray-100 bg-gray-50/60">
                        <td colSpan={8} className="px-5 py-4">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                                Items ({order.items?.length || 0})
                              </h4>
                              <div className="space-y-1.5">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-700">
                                      {item.product_name} &times; {item.quantity}
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                      ৳{item.total_price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-sm">
                                <div className="flex justify-between text-gray-500">
                                  <span>Subtotal</span>
                                  <span>৳{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                  <span>Delivery</span>
                                  <span>৳{order.delivery_charge}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                                Shipping &amp; Notes
                              </h4>
                              <p className="text-sm text-gray-700">{order.address}</p>
                              {order.notes && (
                                <p className="mt-2 text-sm italic text-gray-500">&quot;{order.notes}&quot;</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalResults={totalItems}
          limit={LIMIT}
        />
      )}
    </div>
  );
};

export default AllOrders;
