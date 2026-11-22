/**
 * Draft Model - Legal Notices, RTI Application, and Incident Complaint Templates
 * Model layer in MVC
 */

class DraftModel {
  static getDraftTypes() {
    return [
      {
        id: 'rti-application',
        name: 'RTI Application (Section 6(1) RTI Act 2005)',
        category: 'Governance & Transparency',
        description: 'Formal application to Public Information Officer (PIO) seeking government records, status of applications, road/budget expenditures, or exam marks.',
        requiredFields: ['applicantName', 'applicantAddress', 'pioDesignation', 'publicAuthority', 'particularsOfInfo', 'periodOfInfo', 'bplStatus']
      },
      {
        id: 'consumer-notice',
        name: 'Consumer Legal Demand Notice',
        category: 'Consumer Protection',
        description: 'Pre-litigation demand notice to e-commerce, service provider, or retailer demanding replacement, refund, or damages for defective product / deficient service within 15 days.',
        requiredFields: ['senderName', 'senderAddress', 'opponentName', 'opponentAddress', 'orderOrInvoiceNumber', 'orderDate', 'defectDescription', 'demandAmount', 'deadlineDays']
      },
      {
        id: 'police-complaint',
        name: 'Formal Police Incident Complaint',
        category: 'Criminal Law & Public Order',
        description: 'Written complaint addressed to Station House Officer (SHO) or Superintendent of Police for registration of FIR / Zero FIR in cognizable offenses.',
        requiredFields: ['complainantName', 'complainantPhone', 'complainantAddress', 'policeStationName', 'policeStationAddress', 'dateOfIncident', 'placeOfIncident', 'incidentSummary', 'suspectDetails']
      },
      {
        id: 'cheque-bounce-notice',
        name: 'Cheque Dishonour Notice (Section 138 NI Act)',
        category: 'Commercial & Banking',
        description: 'Mandatory statutory 15-day demand notice sent to drawer within 30 days of receiving bank dishonour memo for cheque returned unpaid.',
        requiredFields: ['payeeName', 'payeeAddress', 'drawerName', 'drawerAddress', 'chequeNumber', 'chequeDate', 'chequeAmount', 'bankName', 'dishonourDate', 'dishonourReason']
      }
    ];
  }

  static getDraftTypeById(id) {
    return this.getDraftTypes().find(t => t.id === id) || null;
  }
}

module.exports = DraftModel;
