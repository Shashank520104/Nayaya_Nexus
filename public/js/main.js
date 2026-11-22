/**
 * Main Application Client Script
 * Handles Theme Toggling, Language Switching, and Global Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light / Dark)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('nyaya_theme') || 'light';
  
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('nyaya_theme', newTheme);
    });
  }

  // 2. Language Dropdown in Header
  const langPickerBtn = document.getElementById('langPickerBtn');
  const langDropdown = document.getElementById('langDropdown');
  const currentLangLabel = document.getElementById('currentLangLabel');

  if (langPickerBtn && langDropdown) {
    langPickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      langDropdown.classList.remove('show');
    });

    const langOptions = langDropdown.querySelectorAll('.lang-option');
    langOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const code = opt.getAttribute('data-code');
        const nativeName = opt.querySelector('.lang-native').textContent;
        if (currentLangLabel) {
          currentLangLabel.textContent = nativeName;
        }
        localStorage.setItem('nyaya_lang', code);
        langDropdown.classList.remove('show');

        // If on chat page, sync chat language select
        const chatLangSelect = document.getElementById('chatLanguageSelect');
        if (chatLangSelect) {
          chatLangSelect.value = code;
        }
      });
    });
  }

  // Set initial language label from storage if present
  const storedLang = localStorage.getItem('nyaya_lang');
  if (storedLang && currentLangLabel) {
    const langSelect = document.getElementById('chatLanguageSelect');
    if (langSelect) {
      langSelect.value = storedLang;
    }
  }

  // 3. Mobile Navigation Menu Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      hamburgerBtn.classList.toggle('active');
    });
  }
});
