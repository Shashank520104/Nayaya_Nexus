/**
 * Schemes & Eligibility Evaluator Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const openEligibilityModalBtn = document.getElementById('openEligibilityModalBtn');
  const closeEligibilityModalBtn = document.getElementById('closeEligibilityModalBtn');
  const eligibilityModal = document.getElementById('eligibilityModal');
  const eligibilityForm = document.getElementById('eligibilityForm');
  const evalResultsBox = document.getElementById('evalResultsBox');
  const evalMatchCount = document.getElementById('evalMatchCount');
  const evalCardsList = document.getElementById('evalCardsList');

  // Modal Open/Close Handlers
  if (openEligibilityModalBtn && eligibilityModal) {
    openEligibilityModalBtn.addEventListener('click', () => {
      eligibilityModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeEligibilityModalBtn && eligibilityModal) {
    closeEligibilityModalBtn.addEventListener('click', () => {
      eligibilityModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  if (eligibilityModal) {
    eligibilityModal.addEventListener('click', (e) => {
      if (e.target === eligibilityModal) {
        eligibilityModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && eligibilityModal.style.display === 'flex') {
        eligibilityModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Handle Form Submission
  if (eligibilityForm) {
    eligibilityForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(eligibilityForm);
      const profile = {
        age: formData.get('age'),
        income: formData.get('income'),
        gender: formData.get('gender'),
        occupation: formData.get('occupation'),
        state: formData.get('state')
      };

      const submitBtn = document.getElementById('evaluateSubmitBtn');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Evaluating Schemes...</span>';
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch('/api/schemes/check-eligibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });

        const data = await response.json();

        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass-chart"></i> <span>Re-Evaluate Eligibility</span>';
          submitBtn.disabled = false;
        }

        if (data.success && data.evaluation) {
          renderEvaluationResults(data.evaluation);
        }
      } catch (err) {
        console.error('[Eligibility Evaluator Error]', err);
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass-chart"></i> <span>Evaluate Eligible Schemes</span>';
          submitBtn.disabled = false;
        }
        alert('Failed to evaluate schemes. Please try again.');
      }
    });
  }

  function renderEvaluationResults(evaluation) {
    if (!evalResultsBox || !evalCardsList) return;

    evalResultsBox.style.display = 'block';
    const matches = evaluation.allMatches || [];
    const eligibleMatches = matches.filter(m => m.score >= 50);

    if (evalMatchCount) {
      evalMatchCount.textContent = `${eligibleMatches.length} / ${evaluation.totalEvaluated} Schemes Matched`;
    }

    evalCardsList.innerHTML = eligibleMatches.map(m => {
      const s = m.scheme;
      const isHigh = m.score >= 80;

      return `
        <div class="eval-card ${isHigh ? 'highly-eligible' : ''}">
          <div class="eval-card-top">
            <h5 class="eval-scheme-title">${s.name} (${s.category})</h5>
            <span class="score-badge ${isHigh ? 'score-high' : 'score-mid'}">
              ${m.score}% Match
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <strong>Benefit:</strong> ${s.benefit}
          </p>

          <div style="font-size: 0.8rem; margin-bottom: 0.6rem;">
            <strong>Match Analysis:</strong>
            <ul style="list-style: disc; margin-left: 1.25rem; color: var(--text-main);">
              ${m.reasons.map(r => `<li>${r}</li>`).join('')}
              ${m.warnings.map(w => `<li style="color: var(--warning);">${w}</li>`).join('')}
            </ul>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.5rem;">
            <a href="${s.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-portal" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
              <span>Official Apply Portal</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="/chat?q=How can I apply for ${encodeURIComponent(s.name)} with annual income of ${evaluation.profileSummary.income}?" class="btn-ask-scheme" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
              <i class="fa-solid fa-comments"></i> <span>Ask AI Guidance</span>
            </a>
          </div>
        </div>
      `;
    }).join('');

    evalResultsBox.scrollIntoView({ behavior: 'smooth' });
  }
});
