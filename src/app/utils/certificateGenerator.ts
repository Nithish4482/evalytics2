import jsPDF from 'jspdf';
import { Participant, Event, Evaluation } from '../lib/storage';

export const generateCertificate = (
  participant: Participant,
  event: Event,
  evaluation: Evaluation
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Border
  doc.setLineWidth(3);
  doc.setDrawColor(37, 99, 235); // Blue
  doc.rect(10, 10, width - 20, height - 20);

  doc.setLineWidth(1);
  doc.setDrawColor(37, 99, 235);
  doc.rect(15, 15, width - 30, height - 30);

  // Header
  doc.setFontSize(40);
  doc.setTextColor(37, 99, 235);
  doc.text('CERTIFICATE', width / 2, 40, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('OF ACHIEVEMENT', width / 2, 50, { align: 'center' });

  // Decorative line
  doc.setLineWidth(0.5);
  doc.setDrawColor(37, 99, 235);
  doc.line(width / 2 - 40, 55, width / 2 + 40, 55);

  // Body text
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('This is to certify that', width / 2, 75, { align: 'center' });

  // Participant name
  doc.setFontSize(32);
  doc.setTextColor(37, 99, 235);
  doc.text(participant.name, width / 2, 90, { align: 'center' });

  // Achievement text
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('has successfully participated in', width / 2, 105, { align: 'center' });

  // Event name
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text(event.name, width / 2, 118, { align: 'center' });

  // Performance details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('and achieved a performance level of', width / 2, 130, { align: 'center' });

  // Performance badge
  const performanceText = {
    green: 'EXCELLENT',
    yellow: 'GOOD',
    orange: 'AVERAGE',
    red: 'PARTICIPANT'
  }[evaluation.performanceLevel];

  const performanceColor = {
    green: [34, 197, 94],
    yellow: [234, 179, 8],
    orange: [249, 115, 22],
    red: [239, 68, 68]
  }[evaluation.performanceLevel];

  doc.setFontSize(28);
  doc.setTextColor(...performanceColor);
  doc.text(performanceText, width / 2, 145, { align: 'center' });

  // Score
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Score: ${evaluation.totalScore.toFixed(1)}/100`, width / 2, 158, { align: 'center' });

  // Date
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const date = new Date(evaluation.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Date: ${date}`, width / 2, 175, { align: 'center' });

  // Footer branding
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text('EVALYTICS', 25, height - 20);
  doc.setTextColor(100, 100, 100);
  doc.text('Smart Event Evaluation System', 25, height - 15);

  // Signature area (right side)
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.line(width - 80, height - 25, width - 30, height - 25);
  doc.text('Authorized Signature', width - 55, height - 20, { align: 'center' });

  // Save
  doc.save(`${participant.name.replace(/\s+/g, '_')}_Certificate.pdf`);
};
