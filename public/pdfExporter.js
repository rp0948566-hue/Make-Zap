/**
 * MARK ZAP PDF EXPORTER MODULE
 * Uses jsPDF library to generate clean multi-line PDF reports
 */
export function exportLeadsToPDF(leadsList) {
  if (!window.jspdf) {
    alert("jsPDF engine loading... Please try again in a moment!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  // Document Header
  doc.setFillColor(14, 18, 16);
  doc.rect(0, 0, 595, 54, 'F');
  doc.setTextColor(48, 209, 88);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Mark Zap 60 Major Leads Executive Report', 24, 34);

  let yPos = 70;

  leadsList.forEach((lead, idx) => {
    if (yPos > 730) {
      doc.addPage();
      yPos = 40;
    }

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(220, 225, 222);
    doc.roundedRect(24, yPos, 547, 100, 6, 6, 'FD');

    // Business Name
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 17, 17);
    doc.text(`${idx + 1}. ${lead.name}`, 36, yPos + 18);

    // Status Badge
    doc.setFontSize(8.5);
    doc.setTextColor(220, 38, 38);
    doc.text(`❌ No Website`, 550, yPos + 18, { align: 'right' });

    // Category & Location
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`${lead.type} • ${lead.loc}`, 36, yPos + 32);

    // Revenue, Phone, Rating Grid
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(`Revenue: ${lead.rev}  |  Phone: ${lead.phone}  |  Rating: ${lead.rating}`, 36, yPos + 46);

    // Google Maps Link
    doc.setTextColor(10, 132, 255);
    doc.text(`Google Maps: ${lead.gmaps}`, 36, yPos + 58);

    // Why Build Strategy Box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(34, yPos + 66, 527, 24, 4, 4, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text(`Why Build: ${lead.why}`, 42, yPos + 80);

    yPos += 112;
  });

  doc.save('Mark_Zap_60_Major_Leads_Report.pdf');
}
