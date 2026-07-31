/* ==========================================================
   SIAKAD UkCorelabs — Auth pages shared script
   Dipakai oleh: login.html, register.html, forgot-password.html
   Berisi perilaku umum: toggle lihat kata sandi & efek ripple
   tombol utama. Logika submit form ada di file JS masing-masing
   halaman (login.js / register.js / forgot-password.js).
   ========================================================== */

   const AUTH_ICON_EYE_OPEN =
   '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>';
   const AUTH_ICON_EYE_OFF =
   '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.6 21.6 0 0 1-3.22 4.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>';

   /** Aktifkan tombol "lihat/sembunyikan kata sandi" pada semua field password di halaman. */
   function initPasswordToggles() {
    document.querySelectorAll('.toggle-pass').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wrap = btn.closest('.input-wrap');
        const input = wrap.querySelector('input');
        const icon = btn.querySelector('svg');
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.innerHTML = isPassword ? AUTH_ICON_EYE_OFF : AUTH_ICON_EYE_OPEN;
        btn.setAttribute('aria-label', isPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
      });
    });
  }

  /** Aktifkan efek ripple saat tombol utama (.btn-primary) diklik. */
  function initButtonRipple() {
    document.querySelectorAll('.btn-primary').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
    initButtonRipple();
  });