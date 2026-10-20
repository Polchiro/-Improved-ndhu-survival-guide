/**
 * NDHU International Student Guide - Interactive Script
 * Handles mobile navigation toggle, clipboard copy buttons, and back-to-top button.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      const isClickInside = menuToggle.contains(event.target) || navMenu.contains(event.target);
      if (!isClickInside && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Copy to Clipboard Functionality
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  const toast = document.getElementById('copy-toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (!textToCopy) return;

      const btnTextSpan = btn.querySelector('.btn-text');
      const originalText = btnTextSpan ? btnTextSpan.textContent : 'Copy';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        // Button state update
        btn.classList.add('copied');
        if (btnTextSpan) {
          btnTextSpan.textContent = 'Copied!';
        }

        showToast(`Copied "${textToCopy}" to clipboard!`);

        setTimeout(() => {
          btn.classList.remove('copied');
          if (btnTextSpan) {
            btnTextSpan.textContent = originalText;
          }
        }, 1800);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        showToast('Failed to copy. Please select and copy manually.');
      }
    });
  });

  // 3. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    let isTicking = false;

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
          isTicking = false;
        });
        isTicking = true;
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
