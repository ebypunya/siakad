/* ==========================================================
   profil.js — logika halaman "Profil Saya" SIAKAD UkCorelabs
   Halaman ini dipakai bersama oleh role mahasiswa, dosen, dan
   pegawai — konten info disesuaikan otomatis sesuai role.
   (sidebar & logout dihandle oleh sidebar.js)
   ========================================================== */

   document.addEventListener('DOMContentLoaded', () => {
    const TOKEN_KEY = 'siakad_token';
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      window.location.href = '/';
      return;
    }

    const ROLE_LABELS = { mahasiswa: 'Mahasiswa', dosen: 'Dosen', pegawai: 'Pegawai', admin: 'Administrator' };
    const GENDER_LABELS = { L: 'Laki-laki', P: 'Perempuan' };
    const STATUS_LABELS = { aktif: 'Aktif', cuti: 'Cuti', lulus: 'Lulus', drop_out: 'Drop Out' };

    const alertBox = document.getElementById('profileAlert');
    const infoGrid = document.getElementById('infoGrid');

    const noHpForm = document.getElementById('noHpForm');
    const noHpInput = document.getElementById('noHpInput');
    const noHpFeedback = document.getElementById('noHpFeedback');
    const btnSaveNoHp = document.getElementById('btnSaveNoHp');

    const passwordForm = document.getElementById('passwordForm');
    const passwordFeedback = document.getElementById('passwordFeedback');
    const btnSavePassword = document.getElementById('btnSavePassword');

    function initials(name) {
      if (!name) return '--';
      return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');
    }

    function showAlert(message, type) {
      alertBox.textContent = message;
      alertBox.className = `profile-alert show ${type}`;
    }

    function renderInfoItem(label, value) {
      const hasValue = value !== null && value !== undefined && value !== '';
      return `
      <div class="info-item">
        <p class="info-label">${label}</p>
        <p class="info-value${hasValue ? '' : ' muted'}">${hasValue ? value : 'Belum diisi'}</p>
      </div>`;
    }

    function gelarLengkap(depan, nama, belakang) {
      return [depan, nama].filter(Boolean).join(' ') + (belakang ? `, ${belakang}` : '');
    }

    function renderProfile(payload) {
      const { user, detail } = payload;
      const role = user.role;
      const displayName = detail?.nama_lengkap || user.nama_lengkap || user.username;

      document.getElementById('userName').textContent = displayName;
      document.getElementById('userRole').textContent = ROLE_LABELS[role] || role;
      document.getElementById('userAvatar').textContent = initials(displayName);

      document.getElementById('profileAvatarLg').textContent = initials(displayName);
      document.getElementById('profileName').textContent = displayName;

      const rolePill = document.getElementById('profileRolePill');
      rolePill.textContent = ROLE_LABELS[role] || role;
      rolePill.className = `role-pill ${role}`;

      document.getElementById('profileIdent').textContent =
      `${user.nomor_induk} · ${user.email || 'Email belum diisi'}`;

      const statusWrap = document.getElementById('profileStatusWrap');
      if (role === 'mahasiswa' && detail?.status) {
        statusWrap.innerHTML = `<span class="status-pill ${detail.status}">${STATUS_LABELS[detail.status] || detail.status}</span>`;
      } else {
        statusWrap.innerHTML = `<span class="status-pill ${user.is_active ? 'aktif' : 'nonaktif'}">${user.is_active ? 'Akun Aktif' : 'Akun Nonaktif'}</span>`;
      }

      let rows = '';

      if (role === 'mahasiswa' && detail) {
        rows += renderInfoItem('NIM', detail.nim);
        rows += renderInfoItem('Program Studi', detail.nama_jurusan);
        rows += renderInfoItem('Fakultas', detail.nama_fakultas);
        rows += renderInfoItem('Jenjang', detail.jenjang);
        rows += renderInfoItem('Angkatan', detail.angkatan);
        rows += renderInfoItem('Status Akademik', STATUS_LABELS[detail.status] || detail.status);
        rows += renderInfoItem('Jenis Kelamin', GENDER_LABELS[detail.jenis_kelamin]);
        rows += renderInfoItem('Email', detail.email);
        rows += renderInfoItem('No. HP', detail.no_hp);
        rows += renderInfoItem(
          'Dosen Pembimbing Akademik',
          detail.dosen_pa_id
          ? gelarLengkap(detail.dosen_pa_gelar_depan, detail.dosen_pa_nama, detail.dosen_pa_gelar_belakang)
          : null
        );
        noHpInput.value = detail.no_hp || '';
      } else if (role === 'dosen' && detail) {
        rows += renderInfoItem('NIDN', detail.nidn);
        rows += renderInfoItem('Nama Lengkap', gelarLengkap(detail.gelar_depan, detail.nama_lengkap, detail.gelar_belakang));
        rows += renderInfoItem('Program Studi', detail.nama_jurusan);
        rows += renderInfoItem('Fakultas', detail.nama_fakultas);
        rows += renderInfoItem('Jenis Kelamin', GENDER_LABELS[detail.jenis_kelamin]);
        rows += renderInfoItem('Email', detail.email);
        rows += renderInfoItem('No. HP', detail.no_hp);
        noHpInput.value = detail.no_hp || '';
      } else if (role === 'pegawai' && detail) {
        rows += renderInfoItem('NIP', detail.nip);
        rows += renderInfoItem('Jabatan', detail.nama_jabatan);
        rows += renderInfoItem('Keterangan Jabatan', detail.jabatan_keterangan);
        rows += renderInfoItem('Jenis Kelamin', GENDER_LABELS[detail.jenis_kelamin]);
        rows += renderInfoItem('Email', detail.email);
        rows += renderInfoItem('No. HP', detail.no_hp);
        noHpInput.value = detail.no_hp || '';
      } else {
        rows += renderInfoItem('Username', user.username);
        rows += renderInfoItem('Email', user.email);
        noHpForm.style.display = 'none';
      }

      infoGrid.innerHTML = rows;
    }

    async function loadProfile() {
      try {
        const res = await fetch('/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/';
          return;
        }

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Gagal memuat profil.');

        renderProfile(data);
      } catch (err) {
        showAlert(err.message || 'Tidak dapat memuat data profil. Coba muat ulang halaman.', 'error');
      }
    }

    noHpForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      noHpFeedback.textContent = '';
      noHpFeedback.className = 'form-feedback';
      btnSaveNoHp.disabled = true;

      try {
        const res = await fetch('/api/profile/no-hp', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ no_hp: noHpInput.value.trim() }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          noHpFeedback.textContent = data.message || 'Nomor HP berhasil diperbarui.';
          noHpFeedback.className = 'form-feedback success';
          renderProfile(data);
        } else {
          noHpFeedback.textContent = data.message || 'Gagal memperbarui nomor HP.';
          noHpFeedback.className = 'form-feedback error';
        }
      } catch (err) {
        noHpFeedback.textContent = 'Tidak dapat terhubung ke server. Coba lagi.';
        noHpFeedback.className = 'form-feedback error';
      } finally {
        btnSaveNoHp.disabled = false;
      }
    });

    passwordForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      passwordFeedback.textContent = '';
      passwordFeedback.className = 'form-feedback';

      const oldPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmNewPassword = document.getElementById('confirmNewPassword').value;

      if (newPassword !== confirmNewPassword) {
        passwordFeedback.textContent = 'Konfirmasi kata sandi baru tidak cocok.';
        passwordFeedback.className = 'form-feedback error';
        return;
      }
      if (newPassword.length < 8) {
        passwordFeedback.textContent = 'Kata sandi baru minimal 8 karakter.';
        passwordFeedback.className = 'form-feedback error';
        return;
      }

      btnSavePassword.disabled = true;

      try {
        const res = await fetch('/api/profile/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ oldPassword, newPassword }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          passwordFeedback.textContent = data.message || 'Kata sandi berhasil diperbarui.';
          passwordFeedback.className = 'form-feedback success';
          passwordForm.reset();
        } else {
          passwordFeedback.textContent = data.message || 'Gagal mengubah kata sandi.';
          passwordFeedback.className = 'form-feedback error';
        }
      } catch (err) {
        passwordFeedback.textContent = 'Tidak dapat terhubung ke server. Coba lagi.';
        passwordFeedback.className = 'form-feedback error';
      } finally {
        btnSavePassword.disabled = false;
      }
    });

    loadProfile();
  });
