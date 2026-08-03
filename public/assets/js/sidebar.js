/* ==========================================================
   sidebar.js — Komponen sidebar SIAKAD UkCorelabs (reusable)
   Cukup include file ini di halaman mana pun (setelah <body>
   dibuka, sebelum script halaman lain) untuk memunculkan
   sidebar, overlay mobile, dan modal logout secara otomatis.
   ========================================================== */

   (function () {
    const TOKEN_KEY = 'siakad_token';

    // ---------- Daftar menu sidebar ----------
    // Tambah/ubah menu di sini akan otomatis muncul di semua halaman.
    const NAV_ITEMS = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      soon: false,
      icon: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    },
    {
      href: '/profil',
      label: 'Profil Saya',
      soon: false,
      icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    },
    {
      href: '/krs',
      label: 'Kartu Rencana Studi',
      soon: true,
      icon: '<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>',
    },
    {
      href: '/khs',
      label: 'Kartu Hasil Studi',
      soon: true,
      icon: '<path d="M3 3v18h18"/><path d="M7 15l4-6 4 3 5-8"/>',
    },
    {
      href: '/transkrip',
      label: 'Transkrip Akademik',
      soon: true,
      icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    },
    {
      href: '/jadwal',
      label: 'Jadwal Kuliah &amp; Ujian',
      soon: true,
      icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    },
    {
      href: '/absensi',
      label: 'Absensi / Presensi',
      soon: true,
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/>',
    },
    {
      href: '/keuangan',
      label: 'Informasi Keuangan',
      soon: true,
      icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="17" cy="15" r="1.4"/>',
    },
    {
      href: '/kurikulum',
      label: 'Kurikulum Program Studi',
      soon: true,
      icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    },
    {
      href: '/layanan',
      label: 'Layanan &amp; Pengajuan',
      soon: true,
      icon: '<path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6"/><path d="M17 14v6M14 17h6"/>',
    },
    ];

    function buildNavItemHtml(item, currentPath) {
      const isActive = currentPath === item.href;
      const soonAttr = item.soon ? ' data-soon="true"' : '';
      const badge = item.soon ? '<span class="badge-soon">Segera</span>' : '';
      const href = item.soon ? '#' : item.href;

      return `
      <li class="nav-item${isActive ? ' active' : ''}">
      <a href="${href}"${soonAttr}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${item.icon}</svg>
      ${item.label}
      ${badge}
      </a>
      </li>`;
    }

    function renderSidebar() {
      const currentPath = window.location.pathname;
      const navHtml = NAV_ITEMS.map((item) => buildNavItemHtml(item, currentPath)).join('');

      const sidebarHtml = `
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
      <aside class="sidebar" id="sidebar">
      <div class="brand-row">
      <div class="brand-mark">SC</div>
      <div class="brand-text">SIAKAD <span>UkCorelabs</span></div>
      </div>

      <ul class="nav-list">${navHtml}</ul>

      <div class="sidebar-foot">
      <button class="logout-btn" id="btnLogout" type="button">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
      Keluar
      </button>
      </div>
      </aside>`;

      const modalHtml = `
      <div class="modal-overlay" id="logoutModal">
      <div class="modal-box">
      <div class="modal-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
      </div>
      <h3>Keluar dari akun?</h3>
      <p>Kamu perlu masuk kembali untuk mengakses SIAKAD UkCorelabs.</p>
      <div class="modal-actions">
      <button class="btn-ghost" id="cancelLogout" type="button">Batal</button>
      <button class="btn-danger" id="confirmLogout" type="button">Ya, Keluar</button>
      </div>
      </div>
      </div>`;

      document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function initInteractions() {
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

      // Menu yang masih "Segera" tidak boleh navigasi
      document.querySelectorAll('[data-soon]').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
        });
      });

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
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderSidebar();
      initInteractions();
    });
  })();