/* ==========================================================
   dashboard.js — logika halaman dashboard SIAKAD UkCorelabs
   (sidebar, toggle menu, dan logout kini dihandle oleh
   sidebar.js — file ini fokus ke data profil halaman ini saja)
   ========================================================== */

   document.addEventListener('DOMContentLoaded', () => {
    const TOKEN_KEY = 'siakad_token';
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      window.location.href = '/';
      return;
    }

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

    loadProfile();
  });