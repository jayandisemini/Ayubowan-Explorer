import jsPDF from "jspdf";

export type BookingReceiptOptions = {
  bookingId: string;
  itemTitle: string;
  travelerName: string;
  email: string;
  travelDate: string;
  guests: number;
  paymentMethod: "stripe" | "payhere";
  amountUSD: number;
  transactionRef: string;
};

export function exportBookingReceiptPDF(opts: BookingReceiptOptions) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;

  // Header band
  doc.setFillColor(15, 23, 30);
  doc.rect(0, 0, W, 120, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("AYUBOWAN TRAVELS · SRI LANKA", margin, 42);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Official Payment Receipt", margin, 75);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`Receipt Ref: ${opts.transactionRef}`, margin, 96);
  doc.text(`Issued: ${new Date().toLocaleDateString()}`, W - margin - 120, 96);

  let y = 160;

  // Status Badge
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(margin, y, 110, 24, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PAID & CONFIRMED", margin + 8, y + 16);

  y += 50;

  // Table header
  doc.setFillColor(245, 247, 250);
  doc.rect(margin, y, W - margin * 2, 28, "F");
  doc.setTextColor(100, 110, 120);
  doc.setFontSize(10);
  doc.text("BOOKING DETAILS", margin + 12, y + 18);
  doc.text("VALUE", W - margin - 100, y + 18);

  y += 40;

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(label, margin + 12, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(value, W - margin - 180, y, { maxWidth: 170 });

    doc.setDrawColor(240, 240, 240);
    doc.line(margin, y + 8, W - margin, y + 8);
    y += 28;
  };

  row("Item / Package", opts.itemTitle);
  row("Booking ID", opts.bookingId);
  row("Traveler Name", opts.travelerName);
  row("Email Address", opts.email);
  row("Travel Date", opts.travelDate);
  row("Guests", `${opts.guests} Person(s)`);
  row("Payment Gateway", opts.paymentMethod === "stripe" ? "Stripe (Visa / Mastercard)" : "PayHere Sri Lanka (LKR Card / Online Banking)");
  row("Transaction Ref", opts.transactionRef);

  y += 10;
  // Total line
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, W - margin * 2, 50, 6, 6, "F");
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(margin, y, W - margin * 2, 50, 6, 6, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 30);
  doc.text("Total Paid Amount", margin + 20, y + 30);

  doc.setFontSize(18);
  doc.setTextColor(180, 140, 20);
  doc.text(`$${opts.amountUSD.toLocaleString()} USD`, W - margin - 150, y + 32);

  // Footer
  y += 100;
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.setFont("helvetica", "normal");
  doc.text("Ayubowan Travels Sri Lanka · Registration #LK-8941-TOUR", W / 2, y, { align: "center" });
  doc.text("Support: hello@ayubowantravels.lk · Emergency +94 77 123 4567", W / 2, y + 16, { align: "center" });

  doc.save(`receipt-${opts.bookingId.slice(0, 8)}.pdf`);
}
