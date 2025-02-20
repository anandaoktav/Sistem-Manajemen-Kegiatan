let agendas = {};
let currentCategory = "";

// Fungsi untuk toggle kategori
function toggleCategory(category) {
    const element = document.getElementById(`kategori-${category}`);
    element.classList.toggle('hidden');
}

// Fungsi untuk menampilkan tabel berdasarkan kategori
function showTable(category, categoryLabel) {
    currentCategory = category;
    document.getElementById('toolbar').classList.remove('hidden');
    document.getElementById('categoryTitle').innerText = `AGENDA - ${categoryLabel}`;
    updateTable();
}

// Fungsi untuk membuka modal (Tambah/Edit Agenda)
function openModal(mode, index = null) {
    const modal = document.getElementById('agendaModal');
    modal.classList.remove('hidden');

    if (mode === 'edit' && index !== null) {
        modalTitle.innerText = 'Edit Agenda'; 
        const agenda = agendas[currentCategory][index];
        document.getElementById('editIndex').value = index;
        document.getElementById('agendaTitle').value = agenda.title;
        document.getElementById('progress').value = agenda.progress;
        document.getElementById('month').value = agenda.month;
        document.getElementById('target').value = agenda.target;

        const responsibleContainer = document.getElementById('responsibleContainer');
        responsibleContainer.innerHTML = '';
        agenda.responsibles.forEach(responsible => {
            const div = document.createElement('div');
            div.classList.add('flex', 'space-x-2');
            div.innerHTML = `
                <select class="responsibleName w-full border px-4 py-2 rounded" required>
                    <option value="${responsible.name}" selected>${responsible.name}</option>
                </select>
                <select class="responsiblePosition w-full border px-4 py-2 rounded" required>
                    <option value="${responsible.position}" selected>${responsible.position}</option>
                </select>
                <button type="button" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition" onclick="removeResponsible(this)">Hapus</button>
            `;
            responsibleContainer.appendChild(div);
        });
    } else {
        modalTitle.innerText = 'Tambah Agenda Baru';
        document.getElementById('editIndex').value = '';
        document.getElementById('agendaForm').reset();
        document.getElementById('responsibleContainer').innerHTML = '';
        addResponsible();
    }
}

// Fungsi untuk menutup modal
function closeModal() {
    document.getElementById('agendaModal').classList.add('hidden');
}

// Fungsi untuk menambah penanggung jawab
function addResponsible() {
    const container = document.getElementById('responsibleContainer');
    const div = document.createElement('div');
    div.classList.add('flex', 'space-x-2');
    div.innerHTML = `
        <select class="responsibleName w-full border px-4 py-2 rounded" required>
            <option value="" disabled selected>Pilih Nama Penanggung Jawab</option>
            <option value="RIMA IZZEL MILA, S.Kom.">RIMA IZZEL MILA, S.Kom.</option>
            <option value="MOHAMMAD FAIZ ANDORRAWA, S.Kom.">MOHAMMAD FAIZ ANDORRAWA, S.Kom.</option>
            <option value="PUNGKI DWI PRASETIO, S.Kom.">PUNGKI DWI PRASETIO, S.Kom.</option>
            <option value="Kardiansyah">Kardiansyah</option>
            <option value="YUSUF EFFENDI S.Kom.">YUSUF EFFENDI S.Kom.</option>
            <option value="AGUS ULUM MULYO S.Kom.,MT">AGUS ULUM MULYO S.Kom.,MT</option>
        </select>
        <select class="responsiblePosition w-full border px-4 py-2 rounded" required>
            <option value="" disabled selected>Pilih Jabatan</option>
            <option value="Ketua Tim">Ketua Tim</option>
            <option value="Kepala Bidang">Kepala Bidang</option>
            <option value="Anggota">Anggota</option>
        </select>
        <button type="button" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition" onclick="removeResponsible(this)">Hapus</button>
    `;
    container.appendChild(div);
}

// Fungsi untuk menghapus penanggung jawab
function removeResponsible(button) {
    const div = button.parentElement;
    div.remove();
}

// Fungsi untuk menyimpan agenda (tambah/edit)
function saveAgenda(event) {
    event.preventDefault();
    const title = document.getElementById('agendaTitle').value;
    const progress = document.getElementById('progress').value;
    const month = document.getElementById('month').value;
    const target = document.getElementById('target').value;

    const responsibles = Array.from(document.querySelectorAll('#responsibleContainer > .flex')).map(row => ({
        name: row.querySelector('.responsibleName').value,
        position: row.querySelector('.responsiblePosition').value,
    }));

    const agenda = { title, responsibles, progress, month, target };

    const editIndex = document.getElementById('editIndex').value;

    if (editIndex !== '') {
        agendas[currentCategory][editIndex] = agenda;
    } else {
        if (!agendas[currentCategory]) agendas[currentCategory] = [];
        agendas[currentCategory].push(agenda);
    }

    closeModal();
    updateTable();
}

// Fungsi untuk memperbarui tabel agenda
function updateTable() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (!agendas[currentCategory] || agendas[currentCategory].length === 0) {
        taskList.innerHTML = '<tr><td colspan="6" class="text-center px-4 py-4">Belum ada agenda untuk kategori ini</td></tr>';
        return;
    }

    agendas[currentCategory].forEach((agenda, index) => {
        const responsibles = agenda.responsibles
            .map(r => {
                let icon = '';
                if (r.position === 'Ketua Tim') icon = '⭐';
                else if (r.position === 'Kepala Bidang') icon = '👤';
                return `<li>${r.name} ${icon}</li>`;
            })
            .join('');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border border-gray-300 px-4 py-2">${agenda.title}</td>
            <td class="border border-gray-300 px-4 py-2">${responsibles}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">
                <span class="block text-sm font-bold">${agenda.progress}%</span>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-400 h-2 rounded-full" style="width: ${agenda.progress}%;"></div>
                </div>
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">${agenda.month}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">${agenda.target}</td>
            <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                <button class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition" onclick="openModal('edit', ${index})">Edit</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition" onclick="deleteAgenda(${index})">Hapus</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

// Fungsi untuk menghapus agenda menggunakan SweetAlert
function deleteAgenda(index) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Agenda ini akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            agendas[currentCategory].splice(index, 1);
            updateTable();
            Swal.fire(
                'Terhapus!',
                'Agenda telah dihapus.',
                'success'
            );
        }
    });
}
