/* ==========================================================
   register.js — logika khusus halaman daftar SIAKAD UkCorelabs
   ========================================================== */

   document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const alertBox = document.getElementById('registerAlert');
    const alertText = document.getElementById('registerAlertText');
    const btn = document.getElementById('btnRegister');
    const btnLabel = document.getElementById('btnLabel');

    const fullnameInput = document.getElementById('fullname');
    const nimInput = document.getElementById('nim');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const termsInput = document.getElementById('terms');

    const confirmField = confirmInput.closest('.field');
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthLabel = document.getElementById('strengthLabel');

    /** Hitung skor kekuatan kata sandi sederhana (0-3) dan perbarui indikator visual. */
    function updateStrength() {
      const val = passwordInput.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;

      strengthMeter.classList.remove('level-1', 'level-2', 'level-3');
      if (val.length === 0) {
        strengthLabel.textContent = 'Kekuatan kata sandi';
      } else if (score <= 1) {
        strengthMeter.classList.add('level-1');
        strengthLabel.textContent = 'Lemah — tambahkan huruf besar, angka, atau simbol';
      } else if (score === 2) {
        strengthMeter.classList.add('level-2');
        strengthLabel.textContent = 'Cukup — bisa diperkuat lagi';
      } else {
        strengthMeter.classList.add('level-3');
        strengthLabel.textContent = 'Kuat';
      }
    }

    /** Validasi kecocokan kata sandi & konfirmasi secara langsung saat mengetik. */
    function checkConfirmMatch() {
      if (confirmInput.value && confirmInput.value !== passwordInput.value) {
        confirmField.classList.add('has-error');
      } else {
        confirmField.classList.remove('has-error');
      }
    }

    passwordInput.addEventListener('input', () => {
      updateStrength();
      checkConfirmMatch();
    });
    confirmInput.addEventListener('input', checkConfirmMatch);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.classList.remove('show');

      const fullname = fullnameInput.value.trim();
      const nim = nimInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;

      if (!fullname || !nim || !email || !password || !confirmPassword) {
        alertText.textContent = 'Semua kolom wajib diisi.';
        alertBox.classList.add('show');
        return;
      }
      if (password !== confirmPassword) {
        confirmField.classList.add('has-error');
        alertText.textContent = 'Konfirmasi kata sandi tidak cocok.';
        alertBox.classList.add('show');
        return;
      }
      if (password.length < 8) {
        alertText.textContent = 'Kata sandi minimal 8 karakter.';
        alertBox.classList.add('show');
        return;
      }
      if (!termsInput.checked) {
        alertText.textContent = 'Kamu harus menyetujui Syarat & Ketentuan terlebih dahulu.';
        alertBox.classList.add('show');
        return;
      }

      btnLabel.textContent = 'Memproses...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullname, nim, email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          form.style.display = 'none';
          alertBox.classList.remove('show');
          const successMsg = document.createElement('div');
          successMsg.className = 'alert show';
          successMsg.style.background = '#f0fdf4';
          successMsg.style.borderColor = '#dcfce7';
          successMsg.style.color = '#16a34a';
          successMsg.innerHTML = `<span>Registrasi berhasil! Silakan cek email <strong>${email}</strong> untuk verifikasi akun sebelum login.</span>`;
          form.parentNode.insertBefore(successMsg, form);
        } else {
          alertText.textContent = data.message || 'Pendaftaran gagal, silakan coba lagi.';
          alertBox.classList.add('show');
        }
      } catch (err) {
        alertText.textContent = 'Tidak dapat terhubung ke server. Coba lagi.';
        alertBox.classList.add('show');
      } finally {
        btnLabel.textContent = 'Daftar';
        btn.disabled = false;
      }
    });
  });