/* ==========================================================
   dashboard.js — logika halaman dashboard SIAKAD UkCorelabs
   ========================================================== */

   document.addEventListener('DOMContentLoaded', () => {
    const TOKEN_KEY = 'siakad_token';
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      window.location.href = '/';
      return;
    }

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btnLogout = document.getElementById('btnLogout');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    }
    menuToggle?.addEventListener('click', openSidebar);
    overlay?.addEventListener('click', closeSidebar);

    document.querySelectorAll('[data-soon]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });

    function initials(name) {
      if (!name) return '--';
      return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
    }

    function formatDate(dateStr) {
      if (!dateStr) return '—';
      try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch {
        return '—';
      }
    }

    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/';
          return;
        }

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Gagal memuat profil.');

        const user = data.user;
        const displayName = user.nama_lengkap || user.username;

        document.getElementById('userName').textContent = displayName;
        document.getElementById('userRole').textContent = user.role;
        document.getElementById('userAvatar').textContent = initials(displayName);

        document.getElementById('welcomeName').textContent = displayName;
        document.getElementById('welcomeSub').textContent = `NIM/Username: ${user.nomor_induk} · ${user.email || 'Email belum diisi'}`;

        document.getElementById('statNim').textContent = user.nomor_induk;
        document.getElementById('statRole').textContent = user.role;
        document.getElementById('statStatus').textContent = user.is_active ? 'Aktif' : 'Nonaktif';
        document.getElementById('statJoined').textContent = formatDate(user.created_at);
      } catch (err) {
        document.getElementById('welcomeSub').textContent = 'Tidak dapat memuat data profil. Coba muat ulang halaman.';
      }
    }

  // ---------- Logout (satu-satunya handler, dengan konfirmasi) ----------
  function openLogoutModal() {
    logoutModal.classList.add('show');
  }
  function closeLogoutModal() {
    logoutModal.classList.remove('show');
  }

  btnLogout?.addEventListener('click', openLogoutModal);
  cancelLogout?.addEventListener('click', closeLogoutModal);
  logoutModal?.addEventListener('click', (e) => {
    if (e.target === logoutModal) closeLogoutModal();
  });
  confirmLogout?.addEventListener('click', () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/';
  });

  loadProfile();
});