// src/utils/printDocument.ts
// Shared "print an HTML fragment" helper, used by both order invoices and
// the Reports page so every printable admin document opens the same way.

/**
 * Opens a new tab with the given HTML and triggers the browser print
 * dialog. Must be called synchronously from a user gesture (click handler)
 * so popup blockers don't intercept `window.open`.
 */
export function printHtmlDocument(html: string, title: string) {
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    throw new Error("Pop-up blocked. Please allow pop-ups to print.");
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          @media print {
            @page { margin: 16mm; }
          }
          body { margin: 0; padding: 24px; background: #ffffff; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();

  // Give the new document a moment to lay out before invoking print().
  setTimeout(() => {
    printWindow.print();
  }, 300);
}
