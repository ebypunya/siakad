/* ==========================================================
   krs.js — logika halaman Kartu Rencana Studi (mahasiswa)
   SIAKAD UkCorelabs
   ========================================================== */

   document.addEventListener('DOMContentLoaded', () => {
    const TOKEN_KEY = 'siakad_token';
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      window.location.href = '/';
      return;
    }

    const STATUS_LABELS = { draft: 'Draft', diajukan: 'Menunggu Persetujuan', disetujui: 'Disetujui', ditolak: 'Ditolak' };
    const HARI_LABELS = { senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis', jumat: 'Jumat', sabtu: 'Sabtu' };

    const alertBox = document.getElementById('krsAlert');
    const periodClosedState = document.getElementById('periodClosedState');
    const krsMainContent = document.getElementById('krsMainContent');
    const periodLabel = document.getElementById('periodLabel');
    const krsStatusPill = document.getElementById('krsStatusPill');
    const sksValue = document.getElementById('sksValue');
    const sksMax = document.getElementById('sksMax');
    const rejectNote = document.getElementById('rejectNote');
    const takenList = document.getElementById('takenList');
    const availableList = document.getElementById('availableList');
    const btnSubmitKrs = document.getElementById('btnSubmitKrs');

    let currentState = null;

    function initials(name) {
      if (!name) return '--';
      return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');
    }

    function showAlert(message, type) {
      alertBox.textContent = message;
      alertBox.className = `krs-alert show ${type}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => alertBox.classList.remove('show'), 5000);
    }

    function formatJadwal(item) {
      const hari = HARI_LABELS[item.hari] || item.hari || '—';
      const jam = item.jam_mulai ? `${item.jam_mulai.slice(0,5)}–${item.jam_selesai?.slice(0,5) || ''}` : '';
      return [hari, jam, item.ruangan].filter(Boolean).join(' · ');
    }

    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) { localStorage.removeItem(TOKEN_KEY); window.location.href = '/'; return; }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;
        const displayName = data.user.nama_lengkap || data.user.username;
        document.getElementById('userName').textContent = displayName;
        document.getElementById('userRole').textContent = data.user.role;
        document.getElementById('userAvatar').textContent = initials(displayName);
      } catch { /* biarkan, bukan bagian kritikal halaman */ }
    }

    function renderTaken(state) {
      const { detail, krs, totalSks, maxSks } = state;
      const editable = krs && (krs.status === 'draft' || krs.status === 'ditolak');

      sksValue.textContent = totalSks;
      sksMax.textContent = maxSks;

      krsStatusPill.textContent = STATUS_LABELS[krs?.status] || '—';
      krsStatusPill.className = `krs-status-pill ${krs?.status || ''}`;

      btnSubmitKrs.style.display = editable ? 'inline-flex' : 'none';
      btnSubmitKrs.disabled = detail.length === 0;

      if (krs?.status === 'ditolak') {
        rejectNote.style.display = 'flex';
        rejectNote.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>
        <span>KRS kamu ditolak dan perlu direvisi. Silakan sesuaikan mata kuliah yang diambil, lalu ajukan kembali.</span>`;
      } else {
        rejectNote.style.display = 'none';
      }

      if (detail.length === 0) {
        takenList.innerHTML = '<p class="krs-muted-text">Belum ada mata kuliah yang diambil. Pilih dari daftar di bawah.</p>';
        return;
      }

      takenList.innerHTML = detail.map((item) => `
        <div class="krs-item">
        <div class="krs-item-main">
        <span class="krs-item-code">${item.kode_mk}</span>
        <p class="krs-item-name">${item.nama_mk} — Kelas ${item.nama_kelas}</p>
        <p class="krs-item-meta">${item.dosen_nama || 'Dosen belum ditentukan'} · ${formatJadwal(item)}</p>
        </div>
        <div class="krs-item-side">
        <span class="krs-item-sks">${item.sks} SKS</span>
        ${editable ? `<button class="krs-btn-remove" data-kelas-id="${item.kelas_id}">Hapus</button>` : ''}
        </div>
        </div>
        `).join('');

      takenList.querySelectorAll('.krs-btn-remove').forEach((btn) => {
        btn.addEventListener('click', () => removeClass(btn.dataset.kelasId, btn));
      });
    }

    function renderAvailable(classes, takenKelasIds, editable) {
      if (classes.length === 0) {
        availableList.innerHTML = '<p class="krs-muted-text">Tidak ada mata kuliah tersedia untuk program studi kamu saat ini.</p>';
        return;
      }

      availableList.innerHTML = classes.map((item) => {
        const alreadyTaken = takenKelasIds.has(item.kelas_id);
        const locked = !item.prasyaratTerpenuhi;
        const full = item.kapasitas != null && item.kapasitas <= 0;

        return `
        <div class="krs-item ${locked ? 'locked' : ''}">
        <div class="krs-item-main">
        <span class="krs-item-code">${item.kode_mk}</span>
        <p class="krs-item-name">${item.nama_mk} — Kelas ${item.nama_kelas}</p>
        <p class="krs-item-meta">${item.dosen_nama || 'Dosen belum ditentukan'} · ${formatJadwal(item)} · Kapasitas ${item.kapasitas}</p>
        ${locked ? `<div class="krs-lock-note">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        Prasyarat: ${item.prasyarat.map((p) => p.kode_mk).join(', ')}
        </div>` : ''}
        </div>
        <div class="krs-item-side">
        <span class="krs-item-sks">${item.sks} SKS</span>
        ${editable ? `<button class="krs-btn-add" data-kelas-id="${item.kelas_id}" ${alreadyTaken || locked ? 'disabled' : ''}>
        ${alreadyTaken ? 'Sudah Diambil' : 'Tambah'}
        </button>` : ''}
        </div>
        </div>`;
      }).join('');

      availableList.querySelectorAll('.krs-btn-add:not(:disabled)').forEach((btn) => {
        btn.addEventListener('click', () => addClass(btn.dataset.kelasId, btn));
      });
    }

    async function loadState() {
      const res = await fetch('/api/krs/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { localStorage.removeItem(TOKEN_KEY); window.location.href = '/'; return null; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Gagal memuat data KRS.');
      return data;
    }

    async function loadAvailable() {
      const res = await fetch('/api/krs/available', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Gagal memuat mata kuliah tersedia.');
      return data;
    }

    async function refreshAll() {
      try {
        const state = await loadState();
        if (!state) return;
        currentState = state;

        if (!state.tahunAkademik) {
          periodClosedState.style.display = 'block';
          krsMainContent.style.display = 'none';
          return;
        }

        periodClosedState.style.display = 'none';
        krsMainContent.style.display = 'block';
        periodLabel.textContent = `${state.tahunAkademik.tahun_ajaran} · Semester ${state.tahunAkademik.semester === 'ganjil' ? 'Ganjil' : 'Genap'}`;

        renderTaken(state);

        const editable = state.krs && (state.krs.status === 'draft' || state.krs.status === 'ditolak');
        const availableData = await loadAvailable();
        const takenKelasIds = new Set(state.detail.map((d) => d.kelas_id));
        renderAvailable(availableData.classes || [], takenKelasIds, editable);
      } catch (err) {
        showAlert(err.message || 'Terjadi kesalahan saat memuat data.', 'error');
      }
    }

    async function addClass(kelasId, btn) {
      btn.disabled = true;
      btn.textContent = 'Menambahkan...';
      try {
        const res = await fetch('/api/krs/detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ kelas_id: Number(kelasId) }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Gagal menambahkan mata kuliah.');
        showAlert(data.message, 'success');
        await refreshAll();
      } catch (err) {
        showAlert(err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Tambah';
      }
    }

    async function removeClass(kelasId, btn) {
      btn.disabled = true;
      btn.textContent = 'Menghapus...';
      try {
        const res = await fetch(`/api/krs/detail/${kelasId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Gagal menghapus mata kuliah.');
        showAlert(data.message, 'success');
        await refreshAll();
      } catch (err) {
        showAlert(err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Hapus';
      }
    }

    btnSubmitKrs.addEventListener('click', async () => {
      const confirmed = confirm('Ajukan KRS ini ke dosen PA? Kamu tidak bisa mengubah mata kuliah setelah diajukan.');
      if (!confirmed) return;

      btnSubmitKrs.disabled = true;
      btnSubmitKrs.textContent = 'Mengajukan...';
      try {
        const res = await fetch('/api/krs/submit', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Gagal mengajukan KRS.');
        showAlert(data.message, 'success');
        await refreshAll();
      } catch (err) {
        showAlert(err.message, 'error');
      } finally {
        btnSubmitKrs.textContent = 'Ajukan KRS';
      }
    });

    loadUser();
    refreshAll();
  });