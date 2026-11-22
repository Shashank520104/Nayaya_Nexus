/**
 * Legal Notice & RTI Draft Generator Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const draftForm = document.getElementById('draftForm');
  const draftOutputBox = document.getElementById('draftOutputBox');
  const copyDraftBtn = document.getElementById('copyDraftBtn');
  const downloadDraftBtn = document.getElementById('downloadDraftBtn');
  const printDraftBtn = document.getElementById('printDraftBtn');
  const fillSampleDataBtn = document.getElementById('fillSampleDataBtn');

  // Sample Data Preset Populator
  if (fillSampleDataBtn && draftForm) {
    fillSampleDataBtn.addEventListener('click', () => {
      const draftType = draftForm.getAttribute('data-type');
      
      const samplePresets = {
        'rti-application': {
          applicantName: 'Ramesh Kumar Verma',
          applicantAddress: 'Plot No. 42, Kalyan Vihar, Civil Lines, Jaipur, Rajasthan - 302006',
          applicantPhone: '9829012345',
          applicantEmail: 'ramesh.verma@example.com',
          pioDesignation: 'The Public Information Officer (PIO)',
          publicAuthority: 'Jaipur Municipal Corporation (Greater)',
          officeAddress: 'Pandit Deendayal Upadhyay Bhawan, Lal Kothi, Jaipur',
          subjectMatter: 'Status of Road Construction and Budget Expenditure in Ward No. 12',
          particularsOfInfo: '1. Certified copy of the work order and tender agreement sanctioned for road construction in Ward 12.\n2. Total funds disbursed to the contractor till date.\n3. Detailed inspection report submitted by the Junior Engineer regarding road quality.',
          periodOfInfo: '1st April 2024 to 31st March 2025',
          bplStatus: 'no'
        },
        'consumer-notice': {
          senderName: 'Priya Sharma',
          senderAddress: 'Flat 304, Green Heights, Sector 62, Noida, UP - 201309',
          opponentName: 'Apex Electronics Retailers Pvt. Ltd.',
          opponentEmail: 'grievance@apexelectronics.in',
          opponentAddress: 'DLF Cyber City, Tower B, Gurugram, Haryana - 122002',
          productName: 'Smart LED TV 55-inch Ultra HD',
          orderOrInvoiceNumber: 'INV-2026-98431',
          orderDate: '2026-11-05',
          demandAmount: '45999',
          defectDescription: 'The delivered television unit suffered complete screen flicker and display failure within 7 days of installation. Despite lodging 3 service tickets (Ticket #88412) under valid warranty, your technician refused replacement and the customer support closed the grievance without refund.',
          compensationAmount: '15000',
          deadlineDays: '15'
        },
        'police-complaint': {
          complainantName: 'Ajay Pratap Singh',
          parentOrSpouseName: 'S/o Shri Vikram Singh',
          complainantPhone: '9811223344',
          complainantAddress: 'House No. 12B, Rajendra Nagar, Sector 3, Ghaziabad, UP',
          policeStationName: 'Indirapuram Police Station',
          policeStationAddress: 'Ghaziabad, Uttar Pradesh',
          dateOfIncident: '21st November 2026 at approximately 08:30 PM',
          placeOfIncident: 'Outside Shipra Mall Market Gate No. 2, Indirapuram',
          suspectDetails: 'Two unidentified young men on a black motorcycle without rear number plate, wearing dark helmets',
          incidentSummary: 'While returning from the market, the two accused on the black motorcycle snatched complainant\'s mobile phone (Samsung Galaxy S23) and brown leather wallet containing ₹4,500 cash and Aadhaar card, and fled towards NH-24. Eyewitnesses at the scene can corroborate.'
        },
        'cheque-bounce-notice': {
          payeeName: 'Mukesh Chand Gupta',
          payeeAddress: 'Shop No. 15, Grain Market, Naya Bazar, Delhi - 110006',
          drawerName: 'Vikas Mehra',
          drawerAddress: 'B-48, Ashok Vihar Phase-1, Delhi - 110052',
          chequeNumber: '004921',
          chequeAmount: '250000',
          chequeDate: '2026-10-15',
          bankName: 'Punjab National Bank, Chandni Chowk Branch',
          dishonourDate: '2026-11-02',
          dishonourReason: 'Funds Insufficient'
        }
      };

      const preset = samplePresets[draftType];
      if (!preset) return;

      Object.entries(preset).forEach(([key, val]) => {
        const input = draftForm.elements[key];
        if (input) {
          input.value = val;
        }
      });

      // Automatically trigger draft generation
      draftForm.dispatchEvent(new Event('submit'));
    });
  }

  if (draftForm && draftOutputBox) {
    draftForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const draftType = draftForm.getAttribute('data-type');
      const formData = new FormData(draftForm);
      const formPayload = {};

      formData.forEach((value, key) => {
        formPayload[key] = value;
      });

      const generateBtn = document.getElementById('generateDraftBtn');
      if (generateBtn) {
        generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Compiling Draft...</span>';
        generateBtn.disabled = true;
      }

      try {
        const response = await fetch('/api/drafts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftType,
            formData: formPayload
          })
        });

        const data = await response.json();

        if (generateBtn) {
          generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> <span>Update Draft</span>';
          generateBtn.disabled = false;
        }

        if (data.success && data.generatedText) {
          draftOutputBox.textContent = data.generatedText;
          draftOutputBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          alert('Failed to generate draft: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('[Draft Generator Error]', err);
        if (generateBtn) {
          generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> <span>Generate Formal Draft</span>';
          generateBtn.disabled = false;
        }
        alert('Error connecting to draft generator server.');
      }
    });
  }

  // Copy to Clipboard
  if (copyDraftBtn && draftOutputBox) {
    copyDraftBtn.addEventListener('click', () => {
      const text = draftOutputBox.textContent;
      navigator.clipboard.writeText(text);
      copyDraftBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
      setTimeout(() => {
        copyDraftBtn.innerHTML = '<i class="fa-solid fa-copy"></i> <span>Copy</span>';
      }, 2000);
    });
  }

  // Download as .txt file
  if (downloadDraftBtn && draftOutputBox) {
    downloadDraftBtn.addEventListener('click', () => {
      const text = draftOutputBox.textContent;
      const draftType = draftForm ? draftForm.getAttribute('data-type') : 'legal-draft';
      const filename = `NyayaNexus_${draftType}_${Date.now()}.txt`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Print Document
  if (printDraftBtn && draftOutputBox) {
    printDraftBtn.addEventListener('click', () => {
      const printContents = draftOutputBox.textContent;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>NyayaNexus Legal Notice Print</title>
            <style>
              body { font-family: monospace; padding: 2.5rem; line-height: 1.6; font-size: 11pt; white-space: pre-wrap; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    });
  }
});
