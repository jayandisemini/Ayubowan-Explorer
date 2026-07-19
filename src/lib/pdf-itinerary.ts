import jsPDF from "jspdf";

export type ItineraryDay = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  food: string;
};

export function exportItineraryPDF(opts: {
  destination: string;
  days: number;
  budget: number;
  itinerary: ItineraryDay[];
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 48;

  // Header band
  doc.setFillColor(15, 23, 30);
  doc.rect(0, 0, W, 110, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AYUBOWAN TRAVELS", margin, 45);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(`${opts.destination} Itinerary`, margin, 78);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`${opts.days} days  ·  Budget $${opts.budget}  ·  Curated ${new Date().toLocaleDateString()}`, margin, 96);

  let y = 150;
  doc.setTextColor(30, 30, 30);

  opts.itinerary.forEach((d) => {
    if (y > H - 180) { doc.addPage(); y = margin; }

    // Day badge
    doc.setFillColor(212, 175, 55);
    doc.roundedRect(margin, y - 14, 60, 22, 4, 4, "F");
    doc.setTextColor(15, 23, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`DAY ${d.day}`, margin + 30, y + 1, { align: "center" });

    // Title
    doc.setTextColor(15, 23, 30);
    doc.setFontSize(16);
    doc.text(d.title, margin + 76, y + 2);
    y += 32;

    const section = (label: string, text: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(label.toUpperCase(), margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(text, W - margin * 2);
      doc.text(lines, margin, y + 14);
      y += 14 + lines.length * 14 + 8;
    };

    section("Morning", d.morning);
    section("Afternoon", d.afternoon);
    section("Evening", d.evening);
    section("Must-eat", d.food);

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, W - margin, y);
    y += 24;
  });

  // Footer
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("ayubowantravels.lk  ·  hello@ayubowantravels.lk  ·  +94 11 234 5678", W / 2, H - 24, { align: "center" });
    doc.text(`${i} / ${pages}`, W - margin, H - 24, { align: "right" });
  }

  doc.save(`ayubowan-${opts.destination.toLowerCase().replace(/\s+/g, "-")}-${opts.days}day.pdf`);
}
