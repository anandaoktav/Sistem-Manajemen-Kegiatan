let kegiatanData = [];
let editingIndex = null;
let deletingIndex = null;

// Fungsi untuk memformat tanggal (DD-MM-YYYY)
function formatTanggal(tanggal) {
  const date = new Date(tanggal);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Validasi Input Form
function validateForm(formId) {
  const form = document.querySelector(`#${formId}`);
  let isValid = true;

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add("is-invalid");
    } else {
      field.classList.remove("is-invalid");
    }
  });

  return isValid;
}

// Refresh Tabel
function refreshTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  kegiatanData.forEach((data, index) => {
    const row = `
      <tr>
        <td class="text-center align-middle">${index + 1}</td>
        <td class="text-center align-middle">${data.jenisTarget}</td>
        <td class="text-center align-middle" style="white-space: nowrap;">${formatTanggal(data.tanggalMulai)}</td>
        <td class="text-center align-middle">${data.penugasan}</td>
        <td class="text-center align-middle">${data.iko}</td>
        <td class="text-center align-middle">${data.penanggungJawab}</td>
        <td class="text-center align-middle">${data.namaKegiatan}</td>
        <td class="text-center align-middle" style="white-space: nowrap;">${formatTanggal(data.tanggalSelesai)}</td>
        <td class="text-center align-middle">${data.catatan}</td>
        <td class="text-center align-middle">${data.status}</td>
        <td class="text-center align-middle">
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-warning btn-sm" onclick="showEditModal(${index})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${index})">Hapus</button>
          </div>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// Bersihkan Form
function clearForm(formId) {
  const form = document.querySelector(`#${formId}`);
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.value = "";
    field.classList.remove("is-invalid");
  });
}

// Tutup Modal dan Hapus Backdrop
function closeModal(modalId) {
  const modalElement = document.querySelector(`#${modalId}`);
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();

  // Hapus backdrop secara manual jika masih ada
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.remove();

  // Hapus class overflow dari body jika masih ada
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

// Tambah Data
document.querySelector("#saveAddDataBtn").addEventListener("click", () => {
  if (!validateForm("addTargetKegiatanForm")) {
    document.querySelector("#addError").textContent = "Semua kolom harus diisi.";
    return;
  }

  const data = {
    jenisTarget: document.querySelector("#addJenisTarget").value,
    penugasan: document.querySelector("#addPenugasan").value,
    iko: document.querySelector("#addIKO").value,
    tanggalMulai: document.querySelector("#addTanggalMulai").value,
    tanggalSelesai: document.querySelector("#addTanggalSelesai").value,
    penanggungJawab: document.querySelector("#addPenanggungJawab").value,
    namaKegiatan: document.querySelector("#addNamaKegiatan").value,
    catatan: document.querySelector("#addCatatan").value,
    status: document.querySelector("#addStatus").value,
  };

  kegiatanData.push(data);

  clearForm("addTargetKegiatanForm");
  closeModal("addTargetKegiatanModal");
  refreshTable();
});

// Tampilkan Modal Edit
function showEditModal(index) {
  editingIndex = index;
  const data = kegiatanData[index];

  document.querySelector("#editJenisTarget").value = data.jenisTarget;
  document.querySelector("#editPenugasan").value = data.penugasan;
  document.querySelector("#editIKO").value = data.iko;
  document.querySelector("#editTanggalMulai").value = data.tanggalMulai;
  document.querySelector("#editTanggalSelesai").value = data.tanggalSelesai;
  document.querySelector("#editPenanggungJawab").value = data.penanggungJawab;
  document.querySelector("#editNamaKegiatan").value = data.namaKegiatan;
  document.querySelector("#editCatatan").value = data.catatan;
  document.querySelector("#editStatus").value = data.status;

  new bootstrap.Modal(document.querySelector("#editTargetKegiatanModal")).show();
}

// Simpan Perubahan Edit
document.querySelector("#saveEditDataBtn").addEventListener("click", () => {
  if (!validateForm("editTargetKegiatanForm")) {
    document.querySelector("#editError").textContent = "Semua kolom harus diisi.";
    return;
  }

  const data = {
    jenisTarget: document.querySelector("#editJenisTarget").value,
    penugasan: document.querySelector("#editPenugasan").value,
    iko: document.querySelector("#editIKO").value,
    tanggalMulai: document.querySelector("#editTanggalMulai").value,
    tanggalSelesai: document.querySelector("#editTanggalSelesai").value,
    penanggungJawab: document.querySelector("#editPenanggungJawab").value,
    namaKegiatan: document.querySelector("#editNamaKegiatan").value,
    catatan: document.querySelector("#editCatatan").value,
    status: document.querySelector("#editStatus").value,
  };

  kegiatanData[editingIndex] = data;

  clearForm("editTargetKegiatanForm");
  closeModal("editTargetKegiatanModal");
  refreshTable();
});

// Tampilkan Modal Hapus
function showDeleteModal(index) {
  deletingIndex = index;
  new bootstrap.Modal(document.querySelector("#deleteTargetKegiatanModal")).show();
}

// Hapus Data
document.querySelector("#deleteDataBtn").addEventListener("click", () => {
  kegiatanData.splice(deletingIndex, 1);
  closeModal("deleteTargetKegiatanModal");
  refreshTable();
});

refreshTable();
