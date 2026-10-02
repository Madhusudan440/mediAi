import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * MediExplain AI - Doctor Summary PDF Generator using jsPDF & autoTable
 */
export function generateDoctorPdf(docData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Primary Header Banner
  doc.setFillColor(37, 99, 235); // #2563eb Blue
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MediExplain AI — Doctor Summary Report', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 14, 15, { align: 'right' });

  let startY = 32;

  // Metadata Box
  doc.setFillColor(243, 244, 246); // gray-100
  doc.roundedRect(14, startY, pageWidth - 28, 28, 3, 3, 'F');

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Document Type: ${docData.documentType || 'Medical Report'}`, 18, startY + 8);
  doc.text(`Patient Name: ${docData.patientName || 'N/A'}`, 18, startY + 16);
  doc.text(`Doctor: ${docData.doctorName || 'N/A'}`, 18, startY + 24);

  doc.text(`Date of Report: ${docData.date || 'N/A'}`, pageWidth / 2 + 10, startY + 8);
  doc.text(`Hospital/Lab: ${docData.hospitalName || 'N/A'}`, pageWidth / 2 + 10, startY + 16);
  doc.text(`AI Confidence: ${docData.confidenceScore || 90}%`, pageWidth / 2 + 10, startY + 24);

  startY += 34;

  // Overview / Summary Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('1. Executive Overview', 14, startY);
  startY += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  const overviewText = docData.overview || docData.explanations?.simple || 'No summary available.';
  const splitOverview = doc.splitTextToSize(overviewText, pageWidth - 28);
  doc.text(splitOverview, 14, startY);
  startY += splitOverview.length * 4.5 + 4;

  // Test Results Table
  if (docData.tests && docData.tests.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('2. Extracted Lab Test Results', 14, startY);
    startY += 4;

    const testRows = docData.tests.map(t => [
      t.name || 'N/A',
      t.result || 'N/A',
      t.unit || '-',
      t.referenceRange || '-',
      t.status || 'Normal'
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['Test Name', 'Result', 'Unit', 'Reference Range', 'Status']],
      body: testRows,
      theme: 'grid',
      headStyles: { fillStyle: 'F', fillColor: [37, 99, 235], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30, fontStyle: 'bold' },
        2: { cellWidth: 25 },
        3: { cellWidth: 45 },
        4: { cellWidth: 30 }
      },
      didParseCell: function(data) {
        if (data.column.index === 4 && data.cell.section === 'body') {
          const val = data.cell.raw;
          if (val && (val.includes('Outside') || val.includes('Critical') || val.includes('High') || val.includes('Low'))) {
            data.cell.styles.textColor = [220, 38, 38]; // Red
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    startY = doc.lastAutoTable.finalY + 8;
  }

  // Prescribed Medicines Table
  if (docData.medicines && docData.medicines.length > 0) {
    if (startY > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      startY = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('3. Detected Medications', 14, startY);
    startY += 4;

    const medRows = docData.medicines.map(m => [
      m.name || 'N/A',
      m.dosage || 'As directed',
      m.frequency || '-',
      m.duration || '-',
      m.purpose || '-'
    ]);

    autoTable(doc, {
      startY: startY,
      head: [['Medicine Name', 'Dosage', 'Frequency', 'Duration', 'Purpose / Usage']],
      body: medRows,
      theme: 'grid',
      headStyles: { fillStyle: 'F', fillColor: [16, 185, 129], textColor: 255, fontSize: 9 }, // Emerald green
      bodyStyles: { fontSize: 8.5 }
    });

    startY = doc.lastAutoTable.finalY + 8;
  }

  // Doctor Questions
  if (docData.doctorQuestions && docData.doctorQuestions.length > 0) {
    if (startY > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      startY = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('4. Recommended Discussion Questions for Your Doctor', 14, startY);
    startY += 6;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);

    docData.doctorQuestions.slice(0, 5).forEach((q, idx) => {
      doc.text(`[  ] ${idx + 1}. ${q}`, 16, startY);
      startY += 5;
    });

    startY += 4;
  }

  // Disclaimer Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(229, 231, 235);
    doc.line(14, doc.internal.pageSize.getHeight() - 14, pageWidth - 14, doc.internal.pageSize.getHeight() - 14);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text(
      'NOTICE: This document is an AI-generated summary provided for informational access. It does not replace professional medical advice or official laboratory reports.',
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
  }

  // Save PDF file
  const fileName = `MediExplain_Summary_${(docData.documentType || 'Report').replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
}
