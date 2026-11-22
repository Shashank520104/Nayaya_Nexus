/**
 * Draft Generator Service
 * Generates formatted legal drafts, notices, and RTI applications
 */

class DraftGeneratorService {
  /**
   * Generate formal draft based on type and input parameters
   */
  static generate(draftTypeId, data) {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    switch (draftTypeId) {
      case 'rti-application':
        return this.formatRTIApplication(data, today);

      case 'consumer-notice':
        return this.formatConsumerNotice(data, today);

      case 'police-complaint':
        return this.formatPoliceComplaint(data, today);

      case 'cheque-bounce-notice':
        return this.formatChequeNotice(data, today);

      default:
        throw new Error(`Unsupported draft type: ${draftTypeId}`);
    }
  }

  static formatRTIApplication(d, dateStr) {
    const isBPL = d.bplStatus === 'yes' || d.bplStatus === true;

    return `FORM 'A'
APPLICATION FOR SEEKING INFORMATION UNDER SECTION 6(1) OF
THE RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer (PIO) / Assistant PIO,
${d.pioDesignation || 'The Public Information Officer'},
${d.publicAuthority || '[Name of Department / Public Authority]'},
${d.officeAddress || '[Office Address / City / State]'}

Date: ${dateStr}

1. FULL NAME OF APPLICANT:
   ${d.applicantName || '[Your Full Name]'}

2. COMPLETE ADDRESS FOR CORRESPONDENCE:
   ${d.applicantAddress || '[Your Residential Address]'}
   Contact No: ${d.applicantPhone || '[Your Contact Number]'}
   Email: ${d.applicantEmail || '[Your Email Address]'}

3. PARTICULARS OF INFORMATION REQUIRED:
   (a) Subject Matter of Information:
       ${d.subjectMatter || 'Seeking official records and status update regarding the matter below.'}
   
   (b) Specific Details of Information Sought:
${d.particularsOfInfo ? d.particularsOfInfo.split('\n').map((line, i) => `       ${i + 1}. ${line}`).join('\n') : '       1. Provide certified copy of the inspection report / file notings.\n       2. State the current status of application / grievance submitted on [Date].\n       3. Name and designation of the officials responsible for the processing.'}

   (c) Period for which information is required:
       ${d.periodOfInfo || 'Current Financial Year / Last 12 months'}

4. APPLICATION FEE DETAILS:
   ${isBPL 
     ? 'The applicant belongs to the Below Poverty Line (BPL) category. BPL Certificate No. ' + (d.bplCertNo || '[Certificate No]') + ' is enclosed herewith. Hence, fee is exempt under Section 7(5).' 
     : 'An application fee of ₹10/- (Rupees Ten only) has been paid via Postal Order / Demand Draft / Online Payment Challan bearing No: ' + (d.feeRefNumber || '[IPO/Challan Reference Number]') + '.'}

5. DECLARATION:
   I hereby state that I am a Citizen of India and the information sought falls within the provisions of Section 2(f) and 2(j) of the RTI Act, 2005.

Yours faithfully,

(Signature / Digital Name)
${d.applicantName || '[Applicant Name]'}
`;
  }

  static formatConsumerNotice(d, dateStr) {
    const deadline = d.deadlineDays || '15';

    return `FORMAL LEGAL DEMAND NOTICE
(UNDER THE CONSUMER PROTECTION ACT, 2019)

WITHOUT PREJUDICE / REGISTERED POST A.D. & EMAIL

Date: ${dateStr}

TO,
${d.opponentName || '[Name of Company / Service Provider / Retailer]'},
Represented by its Managing Director / Grievance Officer,
Address: ${d.opponentAddress || '[Registered Address of Company]'}
Email: ${d.opponentEmail || '[Grievance Email Address]'}

FROM:
${d.senderName || '[Your Full Name]'},
Address: ${d.senderAddress || '[Your Address]'},
Phone: ${d.senderPhone || '[Your Mobile Number]'},
Email: ${d.senderEmail || '[Your Email]'}

SUBJECT: Formal Demand Notice for Deficiency in Service and Supply of Defective Goods regarding Order/Invoice No. ${d.orderOrInvoiceNumber || '[Invoice No]'} - Demand for Full Refund of ₹${d.demandAmount || '[Amount]'} along with Compensation.

Sir/Madam,

Under instructions and on behalf of my client / in my capacity as a bona fide consumer, this notice is hereby served upon you:

1. That I had purchased/availed services regarding: ${d.productName || '[Product/Service Name]'} on ${d.orderDate || '[Purchase Date]'} vide Order/Invoice No. ${d.orderOrInvoiceNumber || '[Order/Invoice ID]'} for a total consideration of ₹${d.demandAmount || '[Amount Paid]'}/-.

2. FACTUAL GRIEVANCE & DEFECT:
${d.defectDescription || '   The delivered product was defective / the contracted service was severely deficient. Despite multiple communications to your customer support, the grievance remains unaddressed.'}

3. That your refusal/failure to rectify the defect or process the legitimate refund constitutes 'Deficiency in Service' and 'Unfair Trade Practice' within the meaning of Sections 2(11) and 2(47) of the Consumer Protection Act, 2019.

4. DEMAND & FINAL CALL:
You are hereby called upon to:
   (a) Refund the entire sum of ₹${d.demandAmount || '[Amount]'} paid by the undersigned;
   (b) Pay a sum of ₹${d.compensationAmount || '10,000'} towards mental harassment, distress, and cost of this notice;
   within a strict period of ${deadline} DAYS from the receipt of this notice.

PLEASE TAKE NOTE that in the event of your failure to comply within the stipulated ${deadline} days, I shall be constrained to initiate legal proceedings against you before the competent District Consumer Disputes Redressal Commission under Section 35 of the Consumer Protection Act, 2019 through the e-Daakhil portal, holding you solely liable for all ensuing costs and punitive damages.

Yours faithfully,

${d.senderName || '[Sender Name]'}
(Consumer)
`;
  }

  static formatPoliceComplaint(d, dateStr) {
    return `FORMAL WRITTEN COMPLAINT FOR REGISTRATION OF FIR / ZERO FIR
(UNDER SECTION 173 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 / SECTION 154 CrPC)

Date: ${dateStr}

To,
The Station House Officer (SHO),
Police Station: ${d.policeStationName || '[Name of Police Station]'},
Address: ${d.policeStationAddress || '[City / District / State]'}

Subject: Written Complaint regarding Cognizable Offense committed on ${d.dateOfIncident || '[Date of Incident]'} for Immediate Registration of FIR / Zero FIR.

Sir/Madam,

I, the undersigned complainant, respectfully state the facts as follows:

1. DETAILS OF THE COMPLAINANT:
   Name: ${d.complainantName || '[Full Name]'}
   Father's/Spouse's Name: ${d.parentOrSpouseName || '[Parent/Spouse Name]'}
   Age: ${d.complainantAge || '[Age]'} Years
   Address: ${d.complainantAddress || '[Complete Address]'}
   Contact Phone: ${d.complainantPhone || '[Phone Number]'}
   Aadhaar / ID No: ${d.idProofNumber || '[ID Proof No]'}

2. DETAILS OF THE INCIDENT:
   - Date and Time of Incident: ${d.dateOfIncident || '[Date & Approx Time]'}
   - Exact Place of Incident: ${d.placeOfIncident || '[Location / Landmark]'}

3. DETAILS OF SUSPECT(S) / ACCUSED (IF KNOWN):
   ${d.suspectDetails || 'Unknown persons / Details as provided: [Name, description, phone numbers or bank accounts used].'}

4. SUMMARY OF EVENTS & OFFENSE COMMITTED:
${d.incidentSummary || '   [Provide chronological statement of what happened, what property/money was stolen or injured, and witnesses present].'}

5. EVIDENCE ENCLOSED:
   - Copy of Bank / UPI Transaction statement / Invoice / Photos (if any).
   - Medico-Legal Certificate (MLC) / Audio-Visual recordings (if applicable).

PRAYER:
In view of the above cognizable offense, it is respectfully prayed that an FIR (or Zero FIR under BNSS Section 173 if beyond territorial jurisdiction) be registered forthwith and necessary criminal investigation be initiated in accordance with the law. A certified copy of the recorded FIR may kindly be delivered to the complainant free of cost.

Yours faithfully,

(Signature)
Name: ${d.complainantName || '[Complainant Name]'}
Phone: ${d.complainantPhone || '[Phone Number]'}
`;
  }

  static formatChequeNotice(d, dateStr) {
    return `LEGAL DEMAND NOTICE UNDER SECTION 138 OF THE
NEGOTIABLE INSTRUMENTS ACT, 1881

REGISTERED POST A.D. & SPEED POST

Date: ${dateStr}

TO,
${d.drawerName || '[Drawer / Accused Name]'},
Address: ${d.drawerAddress || '[Drawer Address]'}

FROM,
${d.payeeName || '[Payee / Complainant Name]'},
Address: ${d.payeeAddress || '[Payee Address]'}

SUBJECT: Statutory Notice of Dishonour of Cheque No. ${d.chequeNumber || '[Cheque No]'} for ₹${d.chequeAmount || '[Amount]'} under Section 138 of Negotiable Instruments Act, 1881.

Sir/Madam,

Under instructions from my client / in my capacity as payee, this statutory notice is hereby served upon you:

1. That in discharge of your legally enforceable debt / liability, you had issued Cheque bearing No. ${d.chequeNumber || '[Cheque No]'}, dated ${d.chequeDate || '[Cheque Date]'}, for a sum of ₹${d.chequeAmount || '[Amount]'}/-, drawn on ${d.bankName || '[Bank Name & Branch]'}.

2. That the said cheque was presented by the undersigned for encashment through bank, but the same was returned dishonoured and unpaid with Bank Return Memo dated ${d.dishonourDate || '[Dishonour Memo Date]'} with the remarks: "${d.dishonourReason || 'Funds Insufficient'}".

3. That you have fraudulently failed to maintain sufficient balance in your bank account, thereby committing an offense punishable under Section 138 of the Negotiable Instruments Act, 1881.

4. YOU ARE HEREBY CALLED UPON to make payment of the said cheque amount of ₹${d.chequeAmount || '[Amount]'}/- within a strict period of 15 (FIFTEEN) DAYS from the receipt of this notice.

PLEASE TAKE NOTE that if you fail to make payment within the statutory 15 days, appropriate criminal proceedings will be instituted against you under Section 138 of the Negotiable Instruments Act, 1881 before the competent Judicial Magistrate, wherein you shall be liable for imprisonment for a term which may extend to 2 years, or with fine up to twice the amount of the cheque, or both.

Yours faithfully,

${d.payeeName || '[Payee Name]'}
`;
  }
}

module.exports = DraftGeneratorService;
