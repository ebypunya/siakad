/* ==========================================================
   forgot-password.js — logika khusus halaman lupa kata sandi
   SIAKAD UkCorelabs
   ========================================================== */

   document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotForm');
    const alertBox = document.getElementById('forgotAlert');
    const alertText = document.getElementById('forgotAlertText');
    const btn = document.getElementById('btnForgot');
    const btnLabel = document.getElementById('btnLabel');
    const identifierInput = document.getElementById('identifier');

    const requestState = document.getElementById('requestState');
    const successState = document.getElementById('successState');
    const sentTarget = document.getElementById('sentTarget');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.classList.remove('show');

      const identifier = identifierInput.value.trim();
      if (!identifier) {
        alertText.textContent = 'Email atau NIM wajib diisi.';
        alertBox.classList.add('show');
        return;
      }

      btnLabel.textContent = 'Mengirim...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          sentTarget.textContent = identifier;
          requestState.style.display = 'none';
          successState.classList.add('show');
        } else {
          alertText.textContent = data.message || 'Akun dengan email/NIM tersebut tidak ditemukan.';
          alertBox.classList.add('show');
        }
      } catch (err) {
        alertText.textContent = 'Tidak dapat terhubung ke server. Coba lagi.';
        alertBox.classList.add('show');
      } finally {
        btnLabel.textContent = 'Kirim Tautan Reset';
        btn.disabled = false;
      }
    });
  });