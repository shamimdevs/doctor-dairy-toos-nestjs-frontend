// src/utils/orderPdf.ts
// PDF export for orders — reuses the same html2canvas + jsPDF approach
// already established in OrderConfirmation.tsx, so invoices generated from
// the customer-facing and admin sides look and behave consistently.

import type { IOrder } from "@/src/redux/api/orderApi";

const formatCurrency = (n: number) => `৳${Number(n || 0).toLocaleString()}`;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Renders an HTML string off-screen, captures it with html2canvas, and
 * saves it as a (possibly multi-page) PDF via jsPDF.
 */
async function renderHtmlToPdf(html: string, filename: string) {
  const html2canvas = (await import("html2canvas")).default;
  const jsPDF = (await import("jspdf")).default;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.padding = "32px";
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/png");

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Downloads a single-order invoice PDF.
 */
export async function downloadOrderInvoicePDF(order: IOrder) {
  const itemRows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;font-size:12px;">${item.product_name}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:right;">${formatCurrency(item.price)}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;font-size:12px;text-align:right;">${formatCurrency(item.total_price)}</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <div style="font-family:Arial, sans-serif;color:#1a1a1a;">
      <div style="text-align:center;border-bottom:2px solid #10b981;padding-bottom:16px;margin-bottom:20px;">
        <p style="font-size:22px;font-weight:bold;color:#10b981;margin:0;">Doctor Dairy Tools</p>
        <p style="font-size:12px;color:#6b7280;margin:4px 0 0;">Invoice</p>
      </div>

      <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
        <div>
          <p style="font-size:11px;color:#6b7280;margin:0 0 4px;">Billed To</p>
          <p style="font-weight:bold;margin:0;">${order.customer_name}</p>
          <p style="font-size:12px;color:#4b5563;margin:2px 0;">${order.phone}</p>
          <p style="font-size:12px;color:#4b5563;margin:2px 0;max-width:240px;">${order.address}</p>
        </div>
        <div style="text-align:right;">
          <p style="font-size:11px;color:#6b7280;margin:0 0 4px;">Invoice</p>
          <p style="font-weight:bold;margin:0;">${order.order_number}</p>
          <p style="font-size:12px;color:#4b5563;margin:2px 0;">${formatDate(order.created_at)}</p>
          <span style="display:inline-block;margin-top:4px;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:bold;background:#fef3c7;color:#92400e;text-transform:capitalize;">${order.payment_status}</span>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px;text-align:left;font-size:12px;">Item</th>
            <th style="padding:8px;text-align:center;font-size:12px;">Qty</th>
            <th style="padding:8px;text-align:right;font-size:12px;">Price</th>
            <th style="padding:8px;text-align:right;font-size:12px;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="width:260px;margin-left:auto;">
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;">
          <span style="color:#6b7280;">Subtotal</span><span>${formatCurrency(order.subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;">
          <span style="color:#6b7280;">Delivery Charge</span><span>${formatCurrency(order.delivery_charge)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;margin-top:4px;border-top:2px solid #10b981;font-size:16px;font-weight:bold;color:#10b981;">
          <span>Total</span><span>${formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;text-align:center;">
        <p style="margin:0;">Status: <strong style="text-transform:capitalize;">${order.order_status}</strong> &middot; Payment: <strong style="text-transform:capitalize;">${order.payment_method}</strong></p>
        <p style="margin:4px 0 0;">Thank you for your business!</p>
      </div>
    </div>
  `;

  await renderHtmlToPdf(html, `Invoice-${order.order_number}.pdf`);
}

/**
 * Downloads a tabular PDF report covering multiple orders (e.g. the
 * current filtered/visible set on the admin Orders page).
 */
export async function downloadOrdersReportPDF(orders: IOrder[]) {
  const rows = orders
    .map(
      (o) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${o.order_number}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${o.customer_name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${o.phone}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;text-transform:capitalize;">${o.order_status}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${formatDate(o.created_at)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;text-align:right;">${formatCurrency(o.total_amount)}</td>
        </tr>
      `,
    )
    .join("");

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0,
  );

  const html = `
    <div style="font-family:Arial, sans-serif;color:#1a1a1a;">
      <div style="border-bottom:2px solid #10b981;padding-bottom:12px;margin-bottom:16px;">
        <p style="font-size:20px;font-weight:bold;color:#10b981;margin:0;">Doctor Dairy Tools &mdash; Orders Report</p>
        <p style="font-size:11px;color:#6b7280;margin:4px 0 0;">
          Generated ${formatDate(new Date().toISOString())} &middot; ${orders.length} orders &middot; Total ${formatCurrency(totalRevenue)}
        </p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:6px 8px;text-align:left;font-size:11px;">Order</th>
            <th style="padding:6px 8px;text-align:left;font-size:11px;">Customer</th>
            <th style="padding:6px 8px;text-align:left;font-size:11px;">Phone</th>
            <th style="padding:6px 8px;text-align:left;font-size:11px;">Status</th>
            <th style="padding:6px 8px;text-align:left;font-size:11px;">Date</th>
            <th style="padding:6px 8px;text-align:right;font-size:11px;">Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  await renderHtmlToPdf(
    html,
    `Orders-Report-${new Date().toISOString().slice(0, 10)}.pdf`,
  );
}
