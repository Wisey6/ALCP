/* Small, progressive enhancements confined to the program page. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-program-reveal]').forEach((element) => observer.observe(element));
  }

  // Complement the existing shared menu with keyboard dismissal.
  const menuButton = document.querySelector('.hamburger');
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      menuButton.click();
      menuButton.focus();
    }
  });
})();

// Keep the off-canvas menu usable with a keyboard and across rotations.
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.hamburger');
  const menu = document.querySelector('#main-navigation');
  const overlay = document.querySelector('.nav-overlay');
  const mobile = window.matchMedia('(max-width: 1100px)');
  if (!button || !menu) return;

  const sync = () => {
    menu.inert = mobile.matches && button.getAttribute('aria-expanded') !== 'true';
  };
  button.addEventListener('click', () => {
    sync();
    if (mobile.matches && !menu.inert) menu.querySelector('a')?.focus();
  });
  overlay?.addEventListener('click', () => { sync(); button.focus(); });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', sync));
  mobile.addEventListener('change', () => {
    if (!mobile.matches && button.getAttribute('aria-expanded') === 'true') button.click();
    sync();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !mobile.matches || button.getAttribute('aria-expanded') !== 'true') return;
    const items = [...menu.querySelectorAll('a'), button];
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  sync();
});
