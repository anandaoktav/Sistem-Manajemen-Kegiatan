let activityData = [];
        let editingIndex = -1;

        const imagePreview = document.getElementById('imagePreview');
        const buktiDukungInput = document.getElementById('buktiDukung');

        // Menampilkan pratinjau gambar setelah file dipilih
        buktiDukungInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        function saveActivity() {
            const targetKegiatan = document.getElementById('targetKegiatan').value;
            const targetMulai = document.getElementById('targetMulai').value;
            const targetSelesai = document.getElementById('targetSelesai').value;
            const tanggalKegiatan = document.getElementById('tanggalKegiatan').value;
            const namaKegiatan = document.getElementById('namaKegiatan').value;
            const catatan = document.getElementById('catatan').value;
            const buktiDukung = imagePreview.src || 'Tidak ada file';
            const status = document.getElementById('status').value;

            if (!targetKegiatan || !targetMulai || !targetSelesai || !tanggalKegiatan || !namaKegiatan || !catatan || !status) {
                alert("Semua kolom wajib diisi!");
                return;
            }

            const activity = {
                targetKegiatan,
                targetMulai,
                targetSelesai,
                tanggalKegiatan,
                namaKegiatan,
                catatan,
                buktiDukung,
                status,
            };

            if (editingIndex >= 0) {
                activityData[editingIndex] = activity;
            } else {
                activityData.push(activity);
            }

            updateTable();
            const modalTambah = document.getElementById('modalTambah');
            const bootstrapModal = bootstrap.Modal.getInstance(modalTambah);
            bootstrapModal.hide();
        }

        function updateTable() {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            activityData.forEach((activity, index) => {
                const targetMulaiFormatted = formatDate(activity.targetMulai);
                const targetSelesaiFormatted = formatDate(activity.targetSelesai);
                const tanggalKegiatanFormatted = formatDate(activity.tanggalKegiatan);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${activity.targetKegiatan}</td>
                    <td>
                        ${targetMulaiFormatted}<br>
                        <span class="text-muted">s/d</span><br>
                        ${targetSelesaiFormatted}
                    </td>
                    <td>${activity.namaKegiatan}</td>
                    <td>${tanggalKegiatanFormatted}</td>
                    <td>${activity.catatan}</td>
                    <td><img src="${activity.buktiDukung}" alt="Bukti"></td>
                    <td><span class="badge bg-${activity.status === 'Belum Dimulai' ? 'secondary' : activity.status === 'Sedang Berlangsung' ? 'warning' : 'success'}">${activity.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="openEditModal(${index})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteActivity(${index})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        function openEditModal(index) {
            const activity = activityData[index];
            const modalTambah = document.getElementById('modalTambah');
            const bootstrapModal = new bootstrap.Modal(modalTambah);

            // Isi form dengan data aktivitas yang diedit
            document.getElementById('targetKegiatan').value = activity.targetKegiatan;
            document.getElementById('targetMulai').value = activity.targetMulai;
            document.getElementById('targetSelesai').value = activity.targetSelesai;
            document.getElementById('tanggalKegiatan').value = activity.tanggalKegiatan;
            document.getElementById('namaKegiatan').value = activity.namaKegiatan;
            document.getElementById('catatan').value = activity.catatan;
            imagePreview.src = activity.buktiDukung;
            document.getElementById('status').value = activity.status;

            // Set editing index untuk menyimpan perubahan nanti
            editingIndex = index;
            bootstrapModal.show();
        }

        let activityToDelete = -1; // Index aktivitas yang akan dihapus

        function deleteActivity(index) {
            activityToDelete = index; // Simpan index aktivitas yang akan dihapus
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show(); // Tampilkan modal konfirmasi
        }

        // Konfirmasi penghapusan
        document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
            if (activityToDelete >= 0) {
                activityData.splice(activityToDelete, 1); // Hapus data dari array
                updateTable(); // Update tabel
                activityToDelete = -1; // Reset index
            }

            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide(); // Sembunyikan modal setelah penghapusan
        });

        // Reset form saat modal Tambah dibuka
        document.getElementById('modalTambah').addEventListener('show.bs.modal', function () {
    if (editingIndex === -1) {
        const form = document.getElementById('activityForm');
        form.reset();
        imagePreview.src = '';  // Reset pratinjau gambar
    }
});


        // Format tanggal menjadi dd/mm/yyyy
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Mencari aktivitas berdasarkan input pencarian
        document.getElementById('searchInput').addEventListener('input', function(event) {
            const query = event.target.value.toLowerCase();
            const filteredActivities = activityData.filter(activity =>
                activity.targetKegiatan.toLowerCase().includes(query) ||
                activity.namaKegiatan.toLowerCase().includes(query) ||
                activity.catatan.toLowerCase().includes(query)
            );
            updateTable(filteredActivities);
        });

        // Update tabel untuk menampilkan data yang difilter
        function updateTable(filteredActivities = activityData) {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            filteredActivities.forEach((activity, index) => {
                const targetMulaiFormatted = formatDate(activity.targetMulai);
                const targetSelesaiFormatted = formatDate(activity.targetSelesai);
                const tanggalKegiatanFormatted = formatDate(activity.tanggalKegiatan);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${activity.targetKegiatan}</td>
                    <td>
                        ${targetMulaiFormatted}<br>
                        <span class="text-muted">s/d</span><br>
                        ${targetSelesaiFormatted}
                    </td>
                    <td>${activity.namaKegiatan}</td>
                    <td>${tanggalKegiatanFormatted}</td>
                    <td>${activity.catatan}</td>
                    <td><img src="${activity.buktiDukung}" alt="Bukti"></td>
                    <td><span class="badge bg-${activity.status === 'Belum Dimulai' ? 'secondary' : activity.status === 'Sedang Berlangsung' ? 'warning' : 'success'}">${activity.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="openEditModal(${index})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteActivity(${index})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        document.getElementById('modalTambah').addEventListener('show.bs.modal', function () {
    // Hanya reset form jika tidak sedang mengedit
    if (editingIndex === -1) {
        const form = document.getElementById('activityForm');
        form.reset(); // Reset semua input pada form
        imagePreview.src = ''; // Reset pratinjau gambar
    }
});