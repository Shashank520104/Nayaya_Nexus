/**
 * Legal Notice & RTI Draft Generator Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const draftForm = document.getElementById('draftForm');
  const draftOutputBox = document.getElementById('draftOutputBox');
  const copyDraftBtn = document.getElementById('copyDraftBtn');
  const downloadDraftBtn = document.getElementById('downloadDraftBtn');
  const printDraftBtn = document.getElementById('printDraftBtn');

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
