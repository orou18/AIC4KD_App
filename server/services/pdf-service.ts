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
         .text('Rapport Médical nephrosense IA', { align: 'center' });
      
      doc.fontSize(12)
         .fillColor('#666666')
         .text('Plateforme de gestion des maladies rénales chroniques', { align: 'center' });
      
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
         .text('Informations du patient');
      
      doc.moveDown(0.5);
      
      doc.fontSize(11)
         .fillColor('#000000');

      const leftColumn = 50;
      const rightColumn = 300;
      let currentY = doc.y;

      // Left column
      doc.text(`Nom : ${patient.fullName}`, leftColumn, currentY);
      doc.text(`ID Patient : ${patient.patientId}`, leftColumn, currentY + 20);
      doc.text(`Âge : ${patient.age} ans`, leftColumn, currentY + 40);

      // Right column
      doc.text(`Stade IRC : ${patient.ckdStage}`, rightColumn, currentY);
      doc.text(`Date du rapport : ${new Date().toLocaleDateString('fr-FR')}`, rightColumn, currentY + 20);
      doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}`, rightColumn, currentY + 40);

      doc.y = currentY + 70;
      doc.moveDown(1);

      // Medical History Section
      if (patient.medicalHistory) {
        doc.fontSize(16)
           .fillColor('#000000')
           .text('Antécédents médicaux');
        
        doc.moveDown(0.5);
        
        doc.fontSize(11)
           .text(patient.medicalHistory, { width: 500, align: 'justify' });
        
        doc.moveDown(1);
      }

      // Recent Clinical Data Section
      if (patient.consultations && patient.consultations.length > 0) {
        doc.fontSize(16)
           .fillColor('#000000')
           .text('Données cliniques récentes');
        
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
           .text('Paramètre', col1 + 5, tableTop + 8)
           .text('Valeur', col2 + 5, tableTop + 8)
           .text('Norme', col3 + 5, tableTop + 8)
           .text('Statut', col4 + 5, tableTop + 8);

        let rowY = tableTop + rowHeight;
        const latestConsultation = patient.consultations[0];

        // Creatinine row
        if (latestConsultation.creatinine) {
          const creatinineValue = parseFloat(latestConsultation.creatinine);
          const status = creatinineValue > 3.0 ? 'Critique' : creatinineValue > 2.0 ? 'Élevée' : 'Normale';
          const statusColor = creatinineValue > 3.0 ? '#DC3545' : creatinineValue > 2.0 ? '#FFC107' : '#28A745';

          doc.rect(tableLeft, rowY, 500, rowHeight)
             .stroke('#cccccc');
          
          doc.fillColor('#000000')
             .text('Créatinine', col1 + 5, rowY + 8)
             .text(`${latestConsultation.creatinine} mg/dL`, col2 + 5, rowY + 8)
             .text('0,6-1,2 mg/dL', col3 + 5, rowY + 8);
          
          doc.fillColor(statusColor)
             .text(status, col4 + 5, rowY + 8);
          
          rowY += rowHeight;
        }

        // eGFR row
        if (latestConsultation.egfr) {
          const status = latestConsultation.egfr < 30 ? 'Faible' : latestConsultation.egfr < 60 ? 'Réduite' : 'Normale';
          const statusColor = latestConsultation.egfr < 30 ? '#DC3545' : latestConsultation.egfr < 60 ? '#FFC107' : '#28A745';

          doc.rect(tableLeft, rowY, 500, rowHeight)
             .stroke('#cccccc');
          
          doc.fillColor('#000000')
             .text('DFG (eGFR)', col1 + 5, rowY + 8)
             .text(`${latestConsultation.egfr} mL/min/1,73m²`, col2 + 5, rowY + 8)
             .text('>60 mL/min/1,73m²', col3 + 5, rowY + 8);
          
          doc.fillColor(statusColor)
             .text(status, col4 + 5, rowY + 8);
          
          rowY += rowHeight;
        }

        // Blood Pressure row
        if (latestConsultation.systolic && latestConsultation.diastolic) {
          const systolic = latestConsultation.systolic;
          const diastolic = latestConsultation.diastolic;
          const status = (systolic >= 180 || diastolic >= 110) ? 'Critique' : 
                        (systolic >= 140 || diastolic >= 90) ? 'Élevée' : 'Normale';
          const statusColor = (systolic >= 180 || diastolic >= 110) ? '#DC3545' : 
                             (systolic >= 140 || diastolic >= 90) ? '#FFC107' : '#28A745';

          doc.rect(tableLeft, rowY, 500, rowHeight)
             .stroke('#cccccc');
          
          doc.fillColor('#000000')
             .text('Pression artérielle', col1 + 5, rowY + 8)
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
           .text('Alertes actives');
        
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
           .text('Notes cliniques');
        
        doc.moveDown(0.5);
        
        doc.fontSize(11)
           .text(patient.consultations[0].clinicalNotes, { width: 500, align: 'justify' });
        
        doc.moveDown(2);
      }

      // Footer
      doc.fontSize(9)
         .fillColor('#666666')
         .text('Généré par la plateforme nephrosense IA', { align: 'center' })
         .text('Ce rapport est confidentiel et destiné uniquement aux professionnels de santé.', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
