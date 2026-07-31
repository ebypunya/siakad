/* =========================================================
   SIAKAD — Universitas UkCorelabs
   Interaksi halaman masuk (login)
   ========================================================= */

   (function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", init);

    function init() {
      setCurrentYear();
      setupPasswordToggle();
      setupRipple();
      setupFormValidation();
    }

    /* ---------- Tahun berjalan di footer ---------- */
    function setCurrentYear() {
      const el = document.getElementById("year");
      if (el) el.textContent = new Date().getFullYear();
    }

    /* ---------- Tampilkan / sembunyikan kata sandi ---------- */
    function setupPasswordToggle() {
      const toggleBtn = document.getElementById("togglePassword");
      const passwordInput = document.getElementById("password");
      if (!toggleBtn || !passwordInput) return;

      const eyeIcon = toggleBtn.querySelector(".icon-eye");
      const eyeOffIcon = toggleBtn.querySelector(".icon-eye-off");

      toggleBtn.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        toggleBtn.setAttribute("aria-pressed", String(isHidden));
        toggleBtn.setAttribute(
          "aria-label",
          isHidden ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
          );
        eyeIcon.hidden = isHidden;
        eyeOffIcon.hidden = !isHidden;
      });
    }

    /* ---------- Efek ripple pada tombol masuk ---------- */
    function setupRipple() {
      const btn = document.getElementById("submitBtn");
      if (!btn) return;

      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.4;
        const ripple = document.createElement("span");

        ripple.className = "submit-btn__ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

        btn.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
      });
    }

    /* ---------- Validasi & pengiriman form ---------- */
    function setupFormValidation() {
      const form = document.getElementById("loginForm");
      const alertBox = document.getElementById("formAlert");
      const submitBtn = document.getElementById("submitBtn");
      if (!form) return;

      const fields = {
        username: form.querySelector('[data-field="username"]'),
        password: form.querySelector('[data-field="password"]'),
      };

    // Saat pengguna mulai mengetik ulang, hapus status error pada field itu
    Object.values(fields).forEach((field) => {
      const input = field.querySelector("input");
      input.addEventListener("input", () => clearFieldError(field));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAlert();

      const username = fields.username.querySelector("input").value.trim();
      const password = fields.password.querySelector("input").value.trim();

      let valid = true;
      if (!username) {
        markFieldError(fields.username);
        valid = false;
      }
      if (!password) {
        markFieldError(fields.password);
        valid = false;
      }

      if (!valid) {
        const firstInvalid = form.querySelector(".field.is-invalid input");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const remember = form.querySelector("#remember").checked;
      await submitLogin({ username, password, remember });
    });

    function markFieldError(field) {
      field.classList.add("is-invalid");
      field.classList.add("is-shaking");
      field.addEventListener(
        "animationend",
        () => field.classList.remove("is-shaking"),
        { once: true }
        );
    }

    function clearFieldError(field) {
      field.classList.remove("is-invalid");
    }

    function showAlert(message) {
      alertBox.textContent = message;
      alertBox.hidden = false;
    }

    function hideAlert() {
      alertBox.hidden = true;
      alertBox.textContent = "";
    }

    function setLoading(isLoading) {
      submitBtn.classList.toggle("is-loading", isLoading);
    }

    /**
     * Titik integrasi backend.
     * Sesuaikan endpoint '/api/auth/login' dengan route login
     * yang tersedia di src/routes pada server SIAKAD.
     */
     async function submitLogin(payload) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        let data = {};
        try {
          data = await res.json();
        } catch (_) {
          /* respons tanpa body JSON, abaikan */
        }

        if (!res.ok) {
          throw new Error(
            data.message ||
            "NIM atau kata sandi belum sesuai. Periksa kembali dan coba lagi."
            );
        }

        // Berhasil masuk — arahkan ke halaman tujuan dari server, atau dashboard.
        window.location.href = data.redirect || "/dashboard";
      } catch (err) {
        showAlert(
          err && err.message
          ? err.message
          : "Terjadi kendala saat menghubungi server. Coba lagi beberapa saat lagi."
          );
      } finally {
        setLoading(false);
      }
    }
  }
})();