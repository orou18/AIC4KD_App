import PDFDocument from 'pdfkit';
import { type PatientWithDetails } from "@shared/schema";

export async function generatePatientPDF(patient: PatientWithDetails): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(24)
         .fillColor('#0066CC')
         .text('AI4CKD Medical Report', { align: 'center' });
      
      doc.fontSize(12)
         .fillColor('#666666')
         .text('Chronic Kidney Disease Management Platform', { align: 'center' });
      
      doc.moveDown(2);

      // Add horizontal line
      doc.strokeColor('#0066CC')
         .lineWidth(2)
         .moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();
      
      doc.moveDown(1);

      // Patient Information Section
      doc.fontSize(16)
         .fillColor('#000000')
         .text('Patient Information');
      
      doc.moveDown(0.5);
      
      doc.fontSize(11)
         .fillColor('#000000');

      const leftColumn = 50;
      const rightColumn = 300;
      let currentY = doc.y;

      // Left column
      doc.text(`Name: ${patient.fullName}`, leftColumn, currentY);
      doc.text(`Patient ID: ${patient.patientId}`, leftColumn, currentY + 20);
      doc.text(`Age: ${patient.age} years`, leftColumn, currentY + 40);

      // Right column
      doc.text(`CKD Stage: ${patient.ckdStage}`, rightColumn, currentY);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, rightColumn, currentY + 20);
      doc.text(`Generated: ${new Date().toLocaleString()}`, rightColumn, currentY + 40);

      doc.y = currentY + 70;
      doc.moveDown(1);

      // Medical History Section
      if (patient.medicalHistory) {
        doc.fontSize(16)
           .fillColor('#000000')
           .text('Medical History');
        
        doc.moveDown(0.5);
        
        doc.fontSize(11)
           .text(patient.medicalHistory, { width: 500, align: 'justify' });
        
        doc.moveDown(1);
      }

      // Recent Clinical Data Section
      if (patient.consultations && patient.consultations.length > 0) {
        doc.fontSize(16)
           .fillColor('#000000')
           .text('Recent Clinical Data');
        
        doc.moveDown(0.5);

        // Table headers
        const tableTop = doc.y;
        const tableLeft = 50;
        const col1 = tableLeft;
        const col2 = tableLeft + 120;
        const col3 = tableLeft + 220;
        const col4 = tableLeft + 350;
        const rowHeight = 25;

        // Header row
        doc.rect(tableLeft, tableTop, 500, rowHeight)
           .fillAndStroke('#f0f0f0', '#cccccc');
        
        doc.fillColor('#000000')
           .fontSize(10)
           .text('Parameter', col1 + 5, tableTop + 8)
           .text('Value', col2 + 5, tableTop + 8)
           .text('Normal Range', col3 + 5, tableTop + 8)
           .text('Status', col4 + 5, tableTop + 8);

        let rowY = tableTop + rowHeight;
        const latestConsultation = patient.consultations[0];

        // Creatinine row
        if (latestConsultation.creatinine) {
          const creatinineValue = parseFloat(latestConsultation.creatinine);
          const status = creatinineValue > 3.0 ? 'Critical' : creatinineValue > 2.0 ? 'Elevated' : 'Normal';
          const statusColor = creatinineValue > 3.0 ? '#DC3545' : creatinineValue > 2.0 ? '#FFC107' : '#28A745';

          doc.rect(tableLeft, rowY, 500, rowHeight)
             .stroke('#cccccc');
          
          doc.fillColor('#000000')
             .text('Creatinine', col1 + 5, rowY + 8)
             .text(`${latestConsultation.creatinine} mg/dL`, col2 + 5, rowY + 8)
             .text('0.6-1.2 mg/dL', col3 + 5, rowY + 8);
          
          doc.fillColor(statusColor)
             .text(status, col4 + 5, rowY + 8);
          
          rowY += rowHeight;
        }

        // eGFR row
        if (latestConsultation.egfr) {
          const status = latestConsultation.egfr < 30 ? 'Low' : latestConsultation.egfr < 60 ? 'Reduced' : 'Normal';
          const statusColor = latestConsultation.egfr < 30 ? '#DC3545' : latestConsultation.egfr < 60 ? '#FFC107' : '#28A745';

          doc.rect(tableLeft, rowY, 500, rowHeight)
             .stroke('#cccccc');
          
          doc.fillColor('#000000')
             .text('eGFR', col1 + 5, rowY + 8)
             .text(`${latestConsultation.egfr} mL/min/1.73m²`, col2 + 5, rowY + 8)
             .text('>60 mL/min/1.73m²', col3 + 5, rowY + 8);
          
          doc.fillColor(statusColor)
             .text(status, col4 + 5, rowY + 8);
          
          rowY += rowHeight;
        }

        // Blood Pressure row
        if (latestConsultation.systolic && latestConsultation.diastolic) {
          const systolic = latestConsultation.systolic;
          const diastolic = latestConsultation.diastolic;
          const status = (systolic >= 180 || diastolic >= 110) ? 'Critical' : 
                        (systolic >= 140 || diastolic >= 90) ? 'Elevated' : 'Normal';
          const statusColor = (systolic >= 180 || diastolic >= 110) ? '#DC3545' : 
                             (systolic >= 140 || diastolic >= 90) ? '#FFC107' : '#28A745';

          doc.rect(tableLeft, rowY, 500, rowHeight)
             .stroke('#cccccc');
          
          doc.fillColor('#000000')
             .text('Blood Pressure', col1 + 5, rowY + 8)
             .text(`${systolic}/${diastolic} mmHg`, col2 + 5, rowY + 8)
             .text('<120/80 mmHg', col3 + 5, rowY + 8);
          
          doc.fillColor(statusColor)
             .text(status, col4 + 5, rowY + 8);
          
          rowY += rowHeight;
        }

        doc.y = rowY + 20;
      }

      // Active Alerts Section
      if (patient.alerts && patient.alerts.length > 0) {
        doc.fontSize(16)
           .fillColor('#000000')
           .text('Active Alerts');
        
        doc.moveDown(0.5);

        patient.alerts.forEach((alert, index) => {
          const alertColor = alert.severity === 'critical' ? '#DC3545' : '#FFC107';
          const alertIcon = alert.severity === 'critical' ? '●' : '▲';
          
          doc.fontSize(10)
             .fillColor(alertColor)
             .text(alertIcon, 50, doc.y, { continued: true })
             .fillColor('#000000')
             .text(` ${alert.message}`, { width: 480 });
          
          doc.moveDown(0.3);
        });

        doc.moveDown(1);
      }

      // Clinical Notes Section
      if (patient.consultations && patient.consultations[0]?.clinicalNotes) {
        doc.fontSize(16)
           .fillColor('#000000')
           .text('Clinical Notes');
        
        doc.moveDown(0.5);
        
        doc.fontSize(11)
           .text(patient.consultations[0].clinicalNotes, { width: 500, align: 'justify' });
        
        doc.moveDown(2);
      }

      // Footer
      doc.fontSize(9)
         .fillColor('#666666')
         .text('Generated by AI4CKD Platform', { align: 'center' })
         .text('This report is confidential and intended for medical professionals only.', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
