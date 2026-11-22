/**
 * Legal Grounding Service
 * Contextual Knowledge Generator for Indian Legal & Governance Queries
 * Powers both local fallback execution and offline accuracy grounding
 */

const LegalModel = require('../models/legalModel');
const SchemeModel = require('../models/schemeModel');

class LegalGroundingService {
  /**
   * Generate highly structured, simplified legal guidance
   */
  static generateLocalResponse({ query, domain, language, citations }) {
    const q = query.toLowerCase();
    const isHindi = language.code === 'hi' || /[\u0900-\u097F]/.test(query);

    let responseMarkdown = '';
    let followUpSuggestions = [];

    switch (domain) {
      case 'CYBER_FRAUD':
        if (isHindi) {
          responseMarkdown = `### 🚨 आपातकालीन साइबर वित्तीय धोखाधड़ी निवारण (Golden Hour)

यदि आपके साथ ऑनलाइन यूपीआई (UPI), बैंक ट्रांसफर या फर्जी वेबसाइट द्वारा धोखाधड़ी हुई है, तो **पहले 2 घंटे सबसे महत्वपूर्ण (Golden Hour) होते हैं**।

---

#### 1. तुरंत कदम (तत्काल कार्रवाई):
* **हेल्पलाइन 1930 डायल करें:** तुरंत 1930 पर कॉल करें। ऑपरेटर को अपना बैंक नाम, UPI ID, ट्रांजैक्शन आईडी (UTR No.), और ट्रांसफर की गई रकम बताएं।
* **बैंक में ट्रांजैक्शन ब्लॉक करवाएं:** अपने बैंक की 24x7 हेल्पलाइन पर कॉल करके संबंधित खाता/कार्ड ब्लॉक कराएं।
* **UPI ऐप पर रिपोर्ट दर्ज करें:** GPay / PhonePe / Paytm ऐप में जाकर उस ट्रांजैक्शन पर 'Report Dispute' दर्ज करें।

#### 2. आधिकारिक साइबर पोर्टल पर शिकायत:
* राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल [cybercrime.gov.in](https://cybercrime.gov.in) पर जाएं।
* बैंक स्टेटमेंट, स्क्रीनशॉट और धोखेबाज का मोबाइल नंबर संलग्न कर शिकायत दर्ज करें।

#### 3. संबंधित कानूनी प्रावधान:
* **भारतीय न्याय संहिता (BNS 2023) की धारा 318:** धोखाधड़ी (पूर्व में IPC धारा 420) – 7 वर्ष तक का कारावास।
* **सूचना प्रौद्योगिकी अधिनियम (IT Act 2000) की धारा 66D:** कंप्यूटर संसाधन का उपयोग करके धोखा देना।

---
> ⚖️ **मुफ्त कानूनी सहायता:** यदि आर्थिक नुकसान बड़ा है या कानूनी मदद चाहिए, तो **NALSA हेल्पलाइन 15100** पर संपर्क करें।
*(अस्वीकरण: यह सूचना जन-जागरूकता हेतु है। कृपया आधिकारिक पोर्टल cybercrime.gov.in पर ही रिपोर्ट दर्ज करें।)*`;
          followUpSuggestions = [
            '1930 हेल्पलाइन पर कॉल करने के बाद क्या प्रक्रिया होती है?',
            'क्या बैंक से रिफंड पाने का कोई कानूनी नियम है?',
            'साइबर सेल में लिखित शिकायत का प्रारूप कैसे बनाएं?'
          ];
        } else {
          responseMarkdown = `### 🚨 Immediate Cyber Financial Fraud Protocol (Golden Hour)

If you have experienced unauthorized UPI transfers, card fraud, or online scams, the **first 2 to 4 hours (Golden Hour)** are critical to freeze the funds before they leave the banking grid.

---

#### Step 1: Immediate Emergency Actions
* **Dial 1930 Immediately:** Call the National Cyber Financial Fraud Helpline (1930). Provide the operator with your Bank Name, Account/UPI ID, Recipient Account/UPI, Transaction UTR/Ref Number, and Amount.
* **Alert Your Bank:** Call your bank's emergency customer service to block debit facilities or request a dispute hold.
* **Dispute on UPI App:** In Google Pay / PhonePe / Paytm, open the transaction details and select 'Report Fraud / Raise Dispute'.

#### Step 2: Register on National Cyber Crime Portal
* Visit the official portal: [cybercrime.gov.in](https://cybercrime.gov.in).
* File a complaint under 'Financial Fraud' and save the generated Complaint Acknowledgement Number for police follow-up.

#### Step 3: Applicable Legal Provisions
* **Section 318, Bharatiya Nyaya Sanhita (BNS 2023):** Cheating and dishonestly inducing delivery of property (formerly Section 420 IPC).
* **Section 66D, Information Technology Act 2000:** Punishment for cheating by personation by using computer resources.

---
> ⚖️ **Free Legal Aid:** For legal guidance or filing court complaints, call the **NALSA Helpline at 15100**.
*(Disclaimer: This is for legal awareness and informational empowerment. Report incidents directly on cybercrime.gov.in)*`;
          followUpSuggestions = [
            'How can I get an official police complaint draft for cyber fraud?',
            'What is the RBI guideline on zero liability for unauthorized electronic transactions?',
            'How do I track the status of my 1930 cyber fraud complaint?'
          ];
        }
        break;

      case 'CRIMINAL_JUSTICE':
        if (isHindi) {
          responseMarkdown = `### 🛡️ पुलिस एफआईआर (FIR) और जीरो एफआईआर (Zero FIR) के अधिकार

यदि कोई पुलिस थाना यह कहकर शिकायत दर्ज करने से मना करता है कि 'यह घटना हमारे इलाके में नहीं हुई है', तो यह **पूरी तरह से गैर-कानूनी है**।

---

#### 1. जीरो एफआईआर (Zero FIR) का वैधानिक अधिकार:
* **BNSS 2023 की धारा 173 (पूर्व CrPC 154):** किसी भी संज्ञेय अपराध (चोरी, मारपीट, डकैती, छेड़छाड़ आदि) में पुलिस को FIR दर्ज करना अनिवार्य है।
* **क्षेत्राधिकार की बाध्यता नहीं:** आप देश के किसी भी पुलिस स्टेशन में Zero FIR दर्ज करा सकते हैं। थाना उस पर शून्य (0) क्रमांक डालकर प्राथमिक कार्रवाई करेगा और फिर संबंधित थाने को स्थानांतरित करेगा।
* **निःशुल्क प्रतिलिपि:** एफआईआर दर्ज होते ही उसकी प्रमाणित प्रति (Certified Copy) पीड़ित को तुरंत और निःशुल्क दी जाएगी।

#### 2. यदि पुलिस थाना फिर भी FIR दर्ज न करे (कदम-दर-कदम समाधान):
1. **पुलिस अधीक्षक (SP / DCP) को शिकायत:** घटना का पूरा ब्योरा लिखकर पंजीकृत डाक (Registered Post) से जिले के SP/DCP को भेजें (BNSS धारा 173(4))।
2. **न्यायिक मजिस्ट्रेट के समक्ष अर्जी:** यदि SP भी कार्रवाई न करे, तो BNSS 2023 की धारा 175(3) (पूर्व CrPC 156(3)) के तहत मजिस्ट्रेट कोर्ट में अर्जी लगाएं। मजिस्ट्रेट पुलिस को FIR दर्ज करने का सीधा न्यायिक आदेश देते हैं।
3. **112 पर कॉल:** थाने में विवाद की स्थिति में तुरंत 112 डायल कर मौके से शिकायत दर्ज कराएं।

---
> ⚖️ **मुफ्त कानूनी सहायता:** यदि आपके पास वकील नहीं है, तो **15100 (NALSA)** पर कॉल करके जिला विधिक सेवा प्राधिकरण (DLSA) से मुफ्त वकील प्राप्त कर सकते हैं।
*(अस्वीकरण: यह सामग्री विधिक जागरूकता हेतु तैयार की गई है। विशिष्ट न्यायिक वाद हेतु अधिकृत अधिवक्ता से परामर्श करें।)*`;
          followUpSuggestions = [
            'थाना प्रभारी (SHO) को दी जाने वाली लिखित शिकायत का प्रारूप दिखाएं',
            'संज्ञेय (Cognizable) और असंज्ञेय (Non-cognizable) अपराध में क्या अंतर है?',
            'गिरफ्तारी के समय नागरिकों के क्या-क्या अधिकार होते हैं?'
          ];
        } else {
          responseMarkdown = `### 🛡️ Citizen Rights Regarding FIR & Zero FIR Registration

If local police refuse to register an FIR claiming that the incident did not take place in their jurisdiction, **they are violating statutory criminal law**.

---

#### 1. Statutory Right to Zero FIR
* **Section 173, Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) / Section 154 CrPC:** Mandatory registration of information in cognizable offenses.
* **Universal Jurisdiction (Zero FIR):** A victim or informant can register a Zero FIR at ANY police station in India, regardless of where the crime occurred. The station must record the complaint, assign it crime number '0', and transfer the docket to the jurisdictional station.
* **Free Copy of FIR:** The complainant has a statutory right to receive a certified copy of the recorded FIR immediately and free of charge.

#### 2. Legal Recourse If Police Refuse to Register FIR
1. **Written Representation to Superintendent of Police (SP / DCP):** Under BNSS Section 173(4) (formerly CrPC 154(3)), send the written complaint via registered post to the District SP or Commissioner of Police.
2. **Application before Judicial Magistrate:** If the police hierarchy fails to act, file an application under BNSS Section 175(3) (formerly CrPC Section 156(3)) before the Judicial Magistrate, who has statutory authority to order police to register an FIR and submit an investigation report.
3. **Dial 112:** Record your emergency call to 112 while at the police station to establish contemporaneous evidence of refusal.

---
> ⚖️ **Free Legal Representation:** If you need assistance filing a Section 175(3) petition, contact the **National Legal Services Authority (NALSA) at 15100** for a free panel advocate.
*(Disclaimer: This is for legal awareness and informational empowerment. Consult a licensed advocate for court representation.)*`;
          followUpSuggestions = [
            'Generate a formal Police Complaint Draft right now',
            'What are the mandatory arrest guidelines under D.K. Basu judgements?',
            'How can I track the status of an FIR online?'
          ];
        }
        break;

      case 'GOVERNMENT_SCHEME':
        const schemes = SchemeModel.getAll({ search: q });
        const topScheme = schemes[0] || SchemeModel.getById('pm-kisan');

        if (isHindi) {
          responseMarkdown = `### 🏛️ सरकारी योजना विवरण: ${topScheme.name} (${topScheme.hindiName || ''})

**मंत्रालय:** ${topScheme.ministry}  
**लाभार्थी वर्ग:** ${topScheme.targetGroup}  
**वित्तीय लाभ:** ${topScheme.benefit}

---

#### 1. प्रमुख पात्रता शर्तें (Eligibility Criteria):
* **आयु सीमा:** ${topScheme.eligibility.minAge} से ${topScheme.eligibility.maxAge} वर्ष
* **वार्षिक आय सीमा:** ${topScheme.eligibility.maxIncomeAnnual ? '₹' + topScheme.eligibility.maxIncomeAnnual.toLocaleString('en-IN') : 'कोई सीमा नहीं / लागू नहीं'}
* **विशेष शर्तें:** ${topScheme.eligibility.criteria || topScheme.eligibility.landHolding || 'भारतीय नागरिक'}

#### 2. आवश्यक दस्तावेजों की सूची (Documents Checklist):
${topScheme.documentsRequired.map(d => `* ${d}`).join('\n')}

#### 3. आवेदन करने की चरणबद्ध प्रक्रिया (How to Apply):
${topScheme.applicationProcess.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

---
* 🌐 **आधिकारिक सरकारी पोर्टल:** [${topScheme.officialUrl}](${topScheme.officialUrl})  
* 📞 **योजना हेल्पलाइन नंबर:** ${topScheme.helpline}

> ⚠️ **सावधानी:** केवल '.gov.in' या '.nic.in' वाले आधिकारिक पोर्टल पर ही आवेदन करें। किसी अनाधिकृत व्यक्ति को नकद शुल्क न दें।`;
          followUpSuggestions = [
            'क्या मैं इस योजना के लिए पात्र हूँ? पात्रता की जांच करें',
            'योजना की e-KYC प्रक्रिया कैसे पूरी करें?',
            'आयुष्मान भारत योजना के बारे में भी जानकारी दें'
          ];
        } else {
          responseMarkdown = `### 🏛️ Government Scheme Guide: ${topScheme.name}

**Ministry:** ${topScheme.ministry}  
**Target Beneficiaries:** ${topScheme.targetGroup}  
**Key Benefit:** ${topScheme.benefit}

---

#### 1. Core Eligibility Criteria:
* **Age Bracket:** ${topScheme.eligibility.minAge} to ${topScheme.eligibility.maxAge} years
* **Annual Income Limit:** ${topScheme.eligibility.maxIncomeAnnual ? '₹' + topScheme.eligibility.maxIncomeAnnual.toLocaleString('en-IN') : 'Standard / Discretionary criteria apply'}
* **Specific Parameters:** ${topScheme.eligibility.criteria || topScheme.eligibility.landHolding || 'Citizen of India'}

#### 2. Mandatory Documentation Checklist:
${topScheme.documentsRequired.map(d => `* ${d}`).join('\n')}

#### 3. Step-by-Step Application Process:
${topScheme.applicationProcess.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

---
* 🌐 **Official Portal:** [${topScheme.officialUrl}](${topScheme.officialUrl})  
* 📞 **Toll-Free Helpline:** ${topScheme.helpline}

> ⚠️ **Security Advisory:** Apply only through verified '.gov.in' or '.nic.in' domains. Government DBT schemes do not charge processing fees.`;
          followUpSuggestions = [
            'Check my eligibility for all central schemes',
            'What are the required documents for Ayushman Bharat Card?',
            'How to check DBT payment status online?'
          ];
        }
        break;

      case 'CONSUMER_RIGHTS':
        if (isHindi) {
          responseMarkdown = `### 🛍️ उपभोक्ता अधिकार और ई-दाखिल (Consumer Protection Act 2019)

यदि किसी कंपनी, ऑनलाइन शॉपिंग साइट, दुकानदार या सेवा प्रदाता ने आपको खराब उत्पाद (Defective Goods) या घटिया सेवा (Deficiency in Service) दी है और रिफंड देने से मना कर दिया है, तो आपके पास ठोस कानूनी अधिकार हैं।

---

#### 1. उपभोक्ता के वैधानिक अधिकार:
* **उपभोक्ता संरक्षण अधिनियम 2019 की धारा 35:** बिना किसी वकील के उपभोक्ता स्वयं जिला उपभोक्ता आयोग में वाद दायर कर सकता है।
* **उत्पाद दायित्व (Product Liability):** दोषपूर्ण सामान से हुए नुकसान या असुविधा की क्षतिपूर्ति (Compensation) पाने का अधिकार।
* **ई-दाखिल पोर्टल ([edaakhil.nic.in](https://edaakhil.nic.in)):** घर बैठे ऑनलाइन शिकायत और शुल्क भुगतान की सुविधा।

#### 2. समाधान के 3 व्यावहारिक चरण:
1. **राष्ट्रीय उपभोक्ता हेल्पलाइन (NCH) पर शिकायत:** टोल-फ्री **1915** पर कॉल करें या 'Consumer App' के माध्यम से ऑनलाइन शिकायत दर्ज करें। अधिकांश मामलों में 30 दिनों में सुलह हो जाती है।
2. **15-दिवसीय विधिक मांग पत्र (Legal Notice):** कंपनी को 15 दिनों का समय देते हुए लिखित नोटिस भेजें कि रिफंड न मिलने पर उपभोक्ता अदालत का रुख किया जाएगा।
3. **उपभोक्ता अदालत में ई-फाइलिंग:** ₹5 लाख तक के दावों पर कोई न्यायालय शुल्क नहीं लगता।

---
* 📞 **राष्ट्रीय उपभोक्ता हेल्पलाइन:** **1915** (सुबह 8:00 से रात 8:00)  
* 🌐 **ऑनलाइन पोर्टल:** [consumerhelpline.gov.in](https://consumerhelpline.gov.in) | [edaakhil.nic.in](https://edaakhil.nic.in)`;
          followUpSuggestions = [
            'उपभोक्ता मांग नोटिस (Consumer Notice) का प्रारूप जनरेट करें',
            'ई-दाखिल (e-Daakhil) पर बिना वकील केस कैसे फाइल करें?',
            'क्या अमेज़न / फ्लिपकार्ट के खिलाफ उपभोक्ता फोरम जा सकते हैं?'
          ];
        } else {
          responseMarkdown = `### 🛍️ Consumer Redressal Guide under Consumer Protection Act 2019

If an e-commerce platform, electronics seller, airline, or service provider has delivered defective goods or provided deficient service and refused a refund, you have **clear statutory remedies**.

---

#### 1. Core Consumer Rights & Redressal Fora
* **No Lawyer Required:** Under the Consumer Protection Act 2019, any consumer can directly represent themselves before the District Consumer Commission without hiring an advocate.
* **Three-Tier Jurisdiction:**
  - District Commission: Claims up to ₹50 Lakh.
  - State Commission: Claims from ₹50 Lakh to ₹2 Crore.
  - National Commission (NCDRC): Claims exceeding ₹2 Crore.
* **Zero Court Fees:** There is zero fee for consumer claims up to ₹5 Lakh.

#### 2. Practical 3-Step Action Plan:
1. **Lodge Grievance with National Consumer Helpline:** Call **1915** or register on [consumerhelpline.gov.in](https://consumerhelpline.gov.in). Over 70% of consumer complaints resolve at this stage through institutional mediation.
2. **Issue a Formal Demand Notice:** Send a written 15-day notice specifying the defect, order ID, amount paid, and demand for refund plus compensation.
3. **E-File on e-Daakhil:** If unresolved after 15 days, lodge an online case at [edaakhil.nic.in](https://edaakhil.nic.in).

---
* 📞 **National Consumer Helpline:** **1915** / SMS to 8800001915  
* 🌐 **E-Filing Portal:** [edaakhil.nic.in](https://edaakhil.nic.in)`;
          followUpSuggestions = [
            'Generate a formal Consumer Demand Notice now',
            'How to calculate compensation in consumer court?',
            'What evidence is needed for e-commerce return fraud?'
          ];
        }
        break;

      case 'RTI_TRANSPARENCY':
        if (isHindi) {
          responseMarkdown = `### 📜 सूचना का अधिकार अधिनियम 2005 (RTI Act)

सूचना का अधिकार (RTI) भारत के प्रत्येक नागरिक को सरकारी विभागों के कामकाज, सरकारी खर्चों, निविदाओं और फाइलों का निरीक्षण करने का संवैधानिक अधिकार देता है।

---

#### 1. मुख्य नियम और समय-सीमा:
* **धारा 6(1):** लोक सूचना अधिकारी (PIO) के समक्ष सादे कागज या ऑनलाइन पोर्टल [rtionline.gov.in](https://rtionline.gov.in) पर आवेदन करें।
* **आवेदन शुल्क:** मात्र **₹10** (गरीबी रेखा से नीचे - BPL कार्डधारकों के लिए पूरी तरह **मुफ्त**)।
* **30-दिवसीय अनिवार्य समय-सीमा (धारा 7(1)):** PIO को 30 दिनों के भीतर मांगी गई सूचना देनी होगी। यदि मामला 'जीवन या व्यक्तिगत स्वतंत्रता' से जुड़ा है, तो **48 घंटे** में जवाब देना अनिवार्य है।

#### 2. यदि 30 दिनों में जवाब न मिले:
1. **प्रथम अपील (First Appeal - धारा 19(1)):** 30 दिन पूरे होने पर अगले 30 दिनों के भीतर वरिष्ठ अधिकारी (First Appellate Authority) को प्रथम अपील भेजें।
2. **द्वितीय अपील (Second Appeal - धारा 19(3)):** राज्य सूचना आयोग (SIC) या केंद्रीय सूचना आयोग (CIC) में अपील करें। सूचना आयोग दोषी अधिकारी पर **₹250 प्रतिदिन (अधिकतम ₹25,000)** तक का व्यक्तिगत जुर्माना लगा सकता है।

---
* 🌐 **ऑनलाइन केंद्र सरकार आरटीआई:** [rtionline.gov.in](https://rtionline.gov.in)`;
          followUpSuggestions = [
            'आरटीआई आवेदन पत्र (RTI Application) का प्रारूप जनरेट करें',
            'ग्राम पंचायत सड़क निर्माण और बजट पर आरटीआई कैसे लगाएं?',
            'प्रथम अपील (First Appeal) का प्रारूप कैसे बनाएं?'
          ];
        } else {
          responseMarkdown = `### 📜 Right to Information Guide (RTI Act 2005)

The RTI Act empowers every Indian citizen to question public authorities, inspect official files, verify public work bills, and demand administrative transparency.

---

#### 1. Core Statutory Rules:
* **Filing Authority (Section 6(1)):** Addressed to the Public Information Officer (PIO) of the concerned public department.
* **Nominal Fee:** Just **₹10** per application (Completely FREE for citizens holding Below Poverty Line - BPL cards).
* **Strict 30-Day Timeline (Section 7(1)):** The PIO is legally mandated to provide the information within 30 days. If the matter involves life or personal liberty, response time is strictly **48 hours**.

#### 2. Multi-Tier Escalation if Information is Denied or Delayed:
1. **First Appeal (Section 19(1)):** File before the designated First Appellate Authority within 30 days of deadline expiry or receiving unsatisfactory reply.
2. **Second Appeal (Section 19(3)):** Appeal to the Central Information Commission (CIC) or State Information Commission (SIC). The Commission has powers to impose personal penalties of ₹250 per day up to ₹25,000 on defaulting PIOs.

---
* 🌐 **Central RTI Online Portal:** [rtionline.gov.in](https://rtionline.gov.in)`;
          followUpSuggestions = [
            'Generate a formal RTI Application draft',
            'Which public bodies are exempt under Section 24 of RTI Act?',
            'How to file First Appeal online?'
          ];
        }
        break;

      default:
        // General legal explanation
        const searchMatches = LegalModel.search(q);
        const topMatch = searchMatches[0] || LegalModel.getAll()[0];

        if (isHindi) {
          responseMarkdown = `### ⚖️ कानूनी विश्लेषण एवं नागरिक अधिकार

**विषय:** ${topMatch.title}  
**अधिनियम एवं धाराएं:** ${topMatch.bnsSection} *(पूर्व में: ${topMatch.ipcSection})*

---

#### मुख्य बिंदु:
${topMatch.keyRights.map(r => `* ${r}`).join('\n')}

#### सरल शब्दों में समझें:
${topMatch.simplifiedExplanation}

---
> ⚖️ **मुफ्त कानूनी सहायता:** आर्थिक रूप से अक्षम नागरिकों के लिए **NALSA हेल्पलाइन 15100** पर 24 घंटे मुफ्त सरकारी वकील और विधिक सहायता उपलब्ध है।
*(अस्वीकरण: यह जानकारी विधिक साक्षरता हेतु प्रदान की गई है, इसे अधिवक्ता की औपचारिक कानूनी सलाह का विकल्प न समझें।)*`;
          followUpSuggestions = [
            'भारतीय न्याय संहिता (BNS 2023) और IPC में क्या अंतर है?',
            'थाने में लिखित शिकायत कैसे दर्ज करें?',
            'नालसा (NALSA) के तहत मुफ्त कानूनी सहायता के नियम क्या हैं?'
          ];
        } else {
          responseMarkdown = `### ⚖️ Legal Guidance & Constitutional Safeguards

**Topic:** ${topMatch.title}  
**Statute Reference:** ${topMatch.bnsSection} *(Formerly: ${topMatch.ipcSection})*

---

#### Key Legal Rights:
${topMatch.keyRights.map(r => `* ${r}`).join('\n')}

#### Simplified Explanation:
${topMatch.simplifiedExplanation}

---
> ⚖️ **Free Legal Assistance:** Citizens in need of representation can contact the **National Legal Services Authority (NALSA) at 15100** for free panel lawyers under Section 12 of the Legal Services Authorities Act.
*(Disclaimer: This information is provided for legal empowerment and educational awareness. It does not establish an attorney-client relationship.)*`;
          followUpSuggestions = [
            'Explore the BNS vs IPC side-by-side transition chart',
            'Generate an official legal notice draft',
            'Find emergency legal helplines across India'
          ];
        }
        break;
    }

    return {
      text: responseMarkdown,
      citations: citations || [],
      followUpSuggestions,
      engineMode: 'NYAYA_GROUNDED_ENGINE'
    };
  }
}

module.exports = LegalGroundingService;
