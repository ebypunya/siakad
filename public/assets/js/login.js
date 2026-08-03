/* ==========================================================
   login.js — logika khusus halaman login SIAKAD UkCorelabs
   ========================================================== */
   document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const alertBox = document.getElementById('loginAlert');
    const alertText = document.getElementById('loginAlertText');
    const btn = document.getElementById('btnLogin');
    const btnLabel = document.getElementById('btnLabel');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // ---------- Notifikasi hasil verifikasi email (dari link di email) ----------
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === '1') {
      const successMsg = document.createElement('div');
      successMsg.className = 'alert show';
      successMsg.style.background = '#f0fdf4';
      successMsg.style.borderColor = '#dcfce7';
      successMsg.style.color = '#16a34a';
      successMsg.innerHTML = '<span>Email berhasil diverifikasi! Silakan masuk.</span>';
      form.parentNode.insertBefore(successMsg, form);
    } else if (params.get('verified') === '0') {
      alertText.textContent = decodeURIComponent(params.get('msg') || 'Verifikasi gagal.');
      alertBox.classList.add('show');
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.classList.remove('show');
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      if (!username || !password) {
        alertText.textContent = 'NIM/Username dan kata sandi wajib diisi.';
        alertBox.classList.add('show');
        return;
      }
      btnLabel.textContent = 'Memproses...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          localStorage.setItem('siakad_token', data.token);
          window.location.href = '/dashboard';
        } else {
          alertText.textContent = data.message || 'NIM/Username atau kata sandi salah.';
          alertBox.classList.add('show');
        }
      } catch (err) {
        alertText.textContent = 'Tidak dapat terhubung ke server. Coba lagi.';
        alertBox.classList.add('show');
      } finally {
        btnLabel.textContent = 'Masuk';
        btn.disabled = false;
      }
    });
  });