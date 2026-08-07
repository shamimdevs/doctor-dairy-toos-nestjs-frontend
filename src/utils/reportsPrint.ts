// src/utils/reportsPrint.ts
// Builds a printable summary of the Reports page — same branded look as the
// order invoice/report documents in orderPdf.ts.

import { printHtmlDocument } from "./printDocument";
import type {
  ICategorySales,
  IInventoryReport,
  ISalesSummary,
  ITopProduct,
} from "@/src/redux/api/reportsApi";

const formatCurrency = (n: number) => `৳${Number(n || 0).toLocaleString()}`;

const formatDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

export interface ReportPrintData {
  summary: ISalesSummary;
  topProducts: ITopProduct[];
  categorySales: ICategorySales[];
  inventory: IInventoryReport;
}

export function printBusinessReport({
  summary,
  topProducts,
  categorySales,
  inventory,
}: ReportPrintData) {
  const rangeLabel =
    formatDate(summary.range.from) && formatDate(summary.range.to)
      ? `${formatDate(summary.range.from)} — ${formatDate(summary.range.to)}`
      : "All time";

  const statusRows = summary.statusBreakdown
    .map(
      (s) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-transform:capitalize;">${s.status}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:right;">${s.count}</td>
        </tr>
      `,
    )
    .join("");

  const paymentRows = summary.paymentBreakdown
    .map(
      (s) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-transform:capitalize;">${s.status}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:right;">${s.count}</td>
        </tr>
      `,
    )
    .join("");

  const topProductRows = topProducts
    .map(
      (p, idx) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${idx + 1}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${p.product_name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:center;">${p.quantity_sold}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:right;">${formatCurrency(p.revenue)}</td>
        </tr>
      `,
    )
    .join("");

  const categoryRows = categorySales
    .map(
      (c) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${c.category_name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:center;">${c.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:right;">${formatCurrency(c.revenue)}</td>
        </tr>
      `,
    )
    .join("");

  const lowStockRows = inventory.lowStock
    .map(
      (p) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${p.name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${p.category_name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:right;">${p.stock}</td>
        </tr>
      `,
    )
    .join("");

  const outOfStockRows = inventory.outOfStock
    .map(
      (p) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${p.name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${p.category_name}</td>
        </tr>
      `,
    )
    .join("");

  const section = (title: string, table: string, rows: string, emptyLabel: string) => `
    <div style="margin-top:20px;">
      <h3 style="font-size:13px;font-weight:bold;color:#111827;margin:0 0 8px;border-bottom:2px solid #10b981;padding-bottom:4px;">${title}</h3>
      ${rows ? table : `<p style="font-size:12px;color:#9ca3af;margin:4px 0;">${emptyLabel}</p>`}
    </div>
  `;

  const html = `
    <div style="font-family:Arial, sans-serif;color:#1a1a1a;">
      <div style="text-align:center;border-bottom:2px solid #10b981;padding-bottom:16px;margin-bottom:12px;">
        <p style="font-size:22px;font-weight:bold;color:#10b981;margin:0;">Doctor Dairy Tools</p>
        <p style="font-size:12px;color:#6b7280;margin:4px 0 0;">Business Report &middot; ${rangeLabel}</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px;">
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px;text-align:center;">
          <p style="font-size:10px;color:#6b7280;margin:0 0 4px;">Total Revenue</p>
          <p style="font-size:16px;font-weight:bold;color:#10b981;margin:0;">${formatCurrency(summary.totalRevenue)}</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px;text-align:center;">
          <p style="font-size:10px;color:#6b7280;margin:0 0 4px;">Total Orders</p>
          <p style="font-size:16px;font-weight:bold;color:#111827;margin:0;">${summary.totalOrders}</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px;text-align:center;">
          <p style="font-size:10px;color:#6b7280;margin:0 0 4px;">Avg Order Value</p>
          <p style="font-size:16px;font-weight:bold;color:#111827;margin:0;">${formatCurrency(summary.avgOrderValue)}</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px;text-align:center;">
          <p style="font-size:10px;color:#6b7280;margin:0 0 4px;">Total Weight</p>
          <p style="font-size:16px;font-weight:bold;color:#111827;margin:0;">${Number(summary.totalWeight || 0).toFixed(2)} kg</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${section(
          "Order Status",
          `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f3f4f6;"><th style="padding:6px 8px;text-align:left;font-size:11px;">Status</th><th style="padding:6px 8px;text-align:right;font-size:11px;">Orders</th></tr></thead><tbody>${statusRows}</tbody></table>`,
          statusRows,
          "No orders in this range.",
        )}
        ${section(
          "Payment Status",
          `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f3f4f6;"><th style="padding:6px 8px;text-align:left;font-size:11px;">Status</th><th style="padding:6px 8px;text-align:right;font-size:11px;">Orders</th></tr></thead><tbody>${paymentRows}</tbody></table>`,
          paymentRows,
          "No orders in this range.",
        )}
      </div>

      ${section(
        `Top Products (${topProducts.length})`,
        `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f3f4f6;"><th style="padding:6px 8px;text-align:left;font-size:11px;">#</th><th style="padding:6px 8px;text-align:left;font-size:11px;">Product</th><th style="padding:6px 8px;text-align:center;font-size:11px;">Qty Sold</th><th style="padding:6px 8px;text-align:right;font-size:11px;">Revenue</th></tr></thead><tbody>${topProductRows}</tbody></table>`,
        topProductRows,
        "No product sales in this range.",
      )}

      ${section(
        "Category Sales",
        `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f3f4f6;"><th style="padding:6px 8px;text-align:left;font-size:11px;">Category</th><th style="padding:6px 8px;text-align:center;font-size:11px;">Units</th><th style="padding:6px 8px;text-align:right;font-size:11px;">Revenue</th></tr></thead><tbody>${categoryRows}</tbody></table>`,
        categoryRows,
        "No category sales in this range.",
      )}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${section(
          `Low Stock (≤ ${inventory.threshold})`,
          `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f3f4f6;"><th style="padding:6px 8px;text-align:left;font-size:11px;">Product</th><th style="padding:6px 8px;text-align:left;font-size:11px;">Category</th><th style="padding:6px 8px;text-align:right;font-size:11px;">Stock</th></tr></thead><tbody>${lowStockRows}</tbody></table>`,
          lowStockRows,
          "No low-stock products.",
        )}
        ${section(
          "Out of Stock",
          `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f3f4f6;"><th style="padding:6px 8px;text-align:left;font-size:11px;">Product</th><th style="padding:6px 8px;text-align:left;font-size:11px;">Category</th></tr></thead><tbody>${outOfStockRows}</tbody></table>`,
          outOfStockRows,
          "No out-of-stock products.",
        )}
      </div>

      <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af;text-align:center;">
        Generated ${new Date().toLocaleString("en-US")}
      </div>
    </div>
  `;

  printHtmlDocument(html, `Business Report - ${rangeLabel}`);
}
