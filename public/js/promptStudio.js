/**
 * Prompt Engineering & Refinement Studio Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const presetButtons = document.querySelectorAll('.btn-preset');
  const rawQueryText = document.getElementById('rawQueryText');
  const rawOutputText = document.getElementById('rawOutputText');
  const rawWeaknessList = document.getElementById('rawWeaknessList');
  const refinedContextText = document.getElementById('refinedContextText');
  const refinedOutputText = document.getElementById('refinedOutputText');
  const refinedImprovementsList = document.getElementById('refinedImprovementsList');
  const customCompareForm = document.getElementById('customCompareForm');
  const customTestInput = document.getElementById('customTestInput');
  const runTestBtn = document.getElementById('runTestBtn');
  const copySystemPromptBtn = document.getElementById('copySystemPromptBtn');
  const systemPromptText = document.getElementById('systemPromptText');

  // Case Study Presets Data
  const presetData = {
    'comp-1': {
      query: 'पुलिस मेरी चोरी की शिकायत दर्ज नहीं कर रही है, कह रहे हैं कि हमारे इलाके का मामला नहीं है। क्या करूँ?',
      rawOutput: 'आप पुलिस स्टेशन के बड़े अफसर से बात कर सकते हैं। अगर वे ना मानें तो वकील करें और कोर्ट जाएं। पुलिस को आपकी रिपोर्ट लिखनी चाहिए।',
      rawWeaknesses: [
        'Lacks statutory citation grounding (fails to mention Zero FIR under Section 173 BNSS / 154 CrPC).',
        'Fails to give actionable 3-step escalation (SP registered post & 175(3) Magistrate remedy).',
        'No Bar Council Rule 36 disclaimer; fails to inform citizen of NALSA 15100 free legal counsel.',
        'High risk of user being turned away repeatedly at police stations.'
      ],
      context: 'Section 173 BNSS (Zero FIR), Section 175(3) BNSS, SP Registered Post Escalation, NALSA Helpline 15100.',
      refinedOutput: `पुलिस का यह कहना कि 'मामला हमारे इलाके का नहीं है', कानूनी तौर पर गलत है। आपके पास निम्नलिखित स्पष्ट अधिकार हैं:

1. जीरो एफआईआर (Zero FIR) का अधिकार:
कानून (BNSS 2023 की धारा 173 / पूर्व CrPC 154) के तहत यदि संज्ञेय अपराध (चोरी/धोखाधड़ी) हुआ है, तो कोई भी पुलिस थाना 'क्षेत्राधिकार न होने' का बहाना बनाकर रिपोर्ट दर्ज करने से मना नहीं कर सकता। वे तुरंत Zero FIR दर्ज करेंगे और बाद में संबंधित थाने को स्थानांतरित करेंगे।

2. यदि थाना प्रभारी फिर भी मना करे (कदम-दर-कदम प्रक्रिया):
- कदम 1: पुलिस अधीक्षक (SP / DCP) को लिखित शिकायत पंजीकृत डाक द्वारा भेजें।
- कदम 2: 112 डायल करें और मौके से कॉल रिकॉर्डिंग या शिकायत संख्या नोट करें।
- कदम 3: यदि SP भी कार्रवाई न करे, तो न्यायिक मजिस्ट्रेट के समक्ष BNSS की धारा 175(3) (पूर्व CrPC 156(3)) के तहत अर्जी लगाएं। मजिस्ट्रेट पुलिस को FIR दर्ज कर जांच का सीधा आदेश दे सकते हैं।

3. मुफ्त कानूनी मदद:
यदि वकील की फीस नहीं दे सकते, तो 15100 डायल करें (राष्ट्रीय कानूनी सेवा प्राधिकरण - NALSA) जहां मुफ्त सरकारी वकील मिलता है।

(सूचनात्मक मार्गदर्शन: यह कानूनी जागरूकता हेतु है, औपचारिक अदालती सलाह नहीं।)`,
      refinedImprovements: [
        'Cites Zero FIR statute; gives sequential 3-step escalation.',
        'Mentions both new BNSS 2023 and historical CrPC sections to prevent citizen confusion.',
        'Includes free legal aid helpline 15100 for underprivileged citizens.',
        'Strict Bar Council Rule 36 disclaimer appended automatically.'
      ]
    },
    'comp-2': {
      query: 'I sent ₹45,000 on a fake job portal via UPI 20 minutes ago. What should I do right now?',
      rawOutput: 'You have been scammed. You should contact the website and ask for a refund, or visit your nearest cyber cell police station tomorrow with documents. You can also file a complaint online.',
      rawWeaknesses: [
        'Extremely dangerous advice: advising user to contact scammer wastes the critical "Golden Hour".',
        'Advising to wait until tomorrow allows stolen funds to be laundered through cash-out chains.',
        'Fails to mention National Cyber Fraud Helpline 1930.',
        'Lacks statutory criminal sections under IT Act 2000 and BNS 2023.'
      ],
      context: 'Golden Hour protocol, Helpline 1930, cybercrime.gov.in, Section 318 BNS (formerly 420 IPC), Section 66D IT Act.',
      refinedOutput: `🚨 CRITICAL: YOU ARE IN THE 'GOLDEN HOUR' (FIRST 2 HOURS). ACT IMMEDIATELY TO FREEZE THE MONEY.

STEP 1: DIAL 1930 IMMEDIATELY (National Cyber Crime Reporting Portal)
- Call 1930 from your phone right now. Select your bank language.
- Give the operator: Transaction ID / UTR Number, Sender Account/UPI, Beneficiary UPI/Account, and Amount (₹45,000).
- The Citizen Financial Cyber Fraud Reporting System will trigger an automated freeze request to the recipient bank/wallet before the scammer withdraws it.

STEP 2: NOTIFY YOUR BANK & UPI APP
- Call your bank's 24x7 emergency fraud helpline and block the UPI ID or transaction.
- Open your UPI app (GPay / PhonePe / Paytm), go to the specific transaction, tap 'Report Fraud / Dispute'.

STEP 3: FILE ONLINE COMPLAINT
- Log in to https://cybercrime.gov.in and register a formal incident under 'Report Cyber Crime'.
- Upload transaction screenshots, job portal URL, and chat logs.
- Relevant Legal Sections: Section 66D of Information Technology Act (Cheating by personation using computer resource) & Section 318 BNS (Cheating).

(Disclaimer: Informational emergency guide. Report directly on official government portal cybercrime.gov.in)`,
      refinedImprovements: [
        'Immediate emergency alert prioritizing 1930 Golden Hour freeze.',
        'Details exact banking parameters required by cyber operators.',
        'Provides statutory criminal backing under IT Act 66D and BNS 318.',
        'Directs directly to legitimate portal cybercrime.gov.in.'
      ]
    }
  };

  // Preset Buttons Clicks
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const compId = btn.getAttribute('data-id');
      const data = presetData[compId];
      if (!data) return;

      rawQueryText.textContent = data.query;
      rawOutputText.textContent = data.rawOutput;
      rawWeaknessList.innerHTML = data.rawWeaknesses.map(w => `<li>${w}</li>`).join('');

      refinedContextText.textContent = data.context;
      refinedOutputText.textContent = data.refinedOutput;
      refinedImprovementsList.innerHTML = data.refinedImprovements.map(i => `<li>${i}</li>`).join('');
    });
  });

  // Custom Test Runner
  if (customCompareForm && customTestInput) {
    customCompareForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = customTestInput.value.trim();
      if (!query) return;

      if (runTestBtn) {
        runTestBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running Comparison...';
        runTestBtn.disabled = true;
      }

      try {
        const response = await fetch('/api/studio/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, language: 'en' })
        });

        const data = await response.json();

        if (runTestBtn) {
          runTestBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Live Comparison';
          runTestBtn.disabled = false;
        }

        if (data.success) {
          rawQueryText.textContent = query;
          rawOutputText.textContent = data.raw.output;
          rawWeaknessList.innerHTML = data.raw.weaknesses.map(w => `<li>${w}</li>`).join('');

          refinedContextText.textContent = `Applied Guardrails: ${data.refined.appliedGuardrails.join(', ')} | Domain: ${data.refined.domain}`;
          refinedOutputText.textContent = data.refined.output;
          refinedImprovementsList.innerHTML = data.refined.improvements.map(i => `<li>${i}</li>`).join('');

          document.getElementById('comparisonDisplayBox').scrollIntoView({ behavior: 'smooth' });
        } else {
          alert('Comparison error: ' + (data.error || 'Failed to execute'));
        }
      } catch (err) {
        console.error('[Prompt Studio Error]', err);
        if (runTestBtn) {
          runTestBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Live Comparison';
          runTestBtn.disabled = false;
        }
        alert('Server connection error while running prompt comparison.');
      }
    });
  }

  // Copy Master System Prompt
  if (copySystemPromptBtn && systemPromptText) {
    copySystemPromptBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(systemPromptText.textContent);
      copySystemPromptBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => {
        copySystemPromptBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Prompt';
      }, 2000);
    });
  }
});
