// owner.js

// Data Storage (Menggunakan localStorage untuk persistensi data antara owner dan karyawan)
let barangData = JSON.parse(localStorage.getItem('barangData')) || [];
let transaksiData = JSON.parse(localStorage.getItem('transaksiData')) || [];
let bangunanData = JSON.parse(localStorage.getItem('bangunanData')) || [];
let takTerdugaData = JSON.parse(localStorage.getItem('takTerdugaData')) || [];

// Data Persistence
function saveData() {
    localStorage.setItem('barangData', JSON.stringify(barangData));
    localStorage.setItem('transaksiData', JSON.stringify(transaksiData));
    localStorage.setItem('bangunanData', JSON.stringify(bangunanData));
    localStorage.setItem('takTerdugaData', JSON.stringify(takTerdugaData));
}

// Inisialisasi data contoh (jika data kosong di localStorage)
function initSampleData() {
    if (barangData.length === 0) {
        barangData = [
            {
                id: "01",
                nama: "Beras Premium",
                hargaModal: 280000, // Tambahan Harga Modal
                hargaKotak: 300000,
                hargaSatuan: 32000,
                stokBM1: 50,
                stokBM2: 30,
                tanggal: new Date().toISOString().split('T')[0]
            },
            {
                id: "02",
                nama: "Minyak Goreng 2L",
                hargaModal: 180000,
                hargaKotak: 200000,
                hargaSatuan: 22000,
                stokBM1: 40,
                stokBM2: 25,
                tanggal: new Date().toISOString().split('T')[0]
            },
            {
                id: "03",
                nama: "Gula Pasir 1Kg",
                hargaModal: 110000,
                hargaKotak: 120000,
                hargaSatuan: 14000,
                stokBM1: 60,
                stokBM2: 40,
                tanggal: new Date().toISOString().split('T')[0]
            },
            {
                id: "04",
                nama: "Tepung Terigu 1Kg",
                hargaModal: 80000,
                hargaKotak: 90000,
                hargaSatuan: 11000,
                stokBM1: 15, // Stok menipis
                stokBM2: 5, // Stok menipis
                tanggal: new Date().toISOString().split('T')[0]
            }
        ];
    }
    
    if (transaksiData.length === 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        transaksiData = [
            {
                tanggal: today,
                waktu: new Date().toISOString(),
                jenis: 'Pemasukan',
                nama: 'Pelanggan A',
                alamat: 'Jl. Merdeka',
                banyaknya: 5,
                barang: 'Beras Premium (2 Satuan), Minyak Goreng 2L (3 Satuan)',
                harga: 25000, // Harga rata-rata
                total: 150000, 
                status: 'Lunas',
                catatan: '-',
                items: [
                    { id: '01', nama: 'Beras Premium', harga: 32000, qty: 2, isKotak: false },
                    { id: '02', nama: 'Minyak Goreng 2L', harga: 22000, qty: 3, isKotak: false }
                ]
            },
            {
                tanggal: yesterdayStr,
                waktu: yesterday.toISOString(),
                jenis: 'Pemasukan',
                nama: 'Pelanggan C',
                alamat: 'Jl. Sudirman',
                banyaknya: 10,
                barang: 'Beras Premium (10 Kotak)',
                harga: 300000, 
                total: 3000000, 
                status: 'Lunas',
                catatan: 'Pembelian besar',
                items: [
                    { id: '01', nama: 'Beras Premium', harga: 300000, qty: 10, isKotak: true }
                ]
            },
            {
                tanggal: yesterdayStr,
                waktu: yesterday.toISOString(),
                jenis: 'Pengeluaran',
                nama: 'Gaji Karyawan',
                alamat: '-',
                banyaknya: 1,
                barang: 'Gaji Bulanan',
                harga: 2000000,
                total: 2000000,
                status: 'Keluar',
                catatan: 'Gaji Staf Toko',
                items: []
            }
        ];
    }

    if (bangunanData.length === 0) {
        bangunanData = [
            { tanggal: '2025-09-01', keterangan: 'Simpanan Awal Bulan', jumlah: 500000 },
        ];
    }

    if (takTerdugaData.length === 0) {
        takTerdugaData = [
            { waktu: new Date().toISOString(), jenis: 'Perbaikan', biaya: 150000, keterangan: 'Perbaikan keran air' },
        ];
    }
    
    saveData();
}

// Format utilitas (sama dengan yang lama)
function formatRupiah(number) {
    if (isNaN(number)) number = 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('id-ID', options);
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.dataset.page;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
            document.getElementById('pageTitle').textContent = item.querySelector('span').textContent;
            
            // Load page specific data
            loadPageData(targetPage);
        });
    });
    
    // Mobile menu toggle
    document.getElementById('btnMenu').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('show');
    });
}

// Load page specific data
function loadPageData(page) {
    // Refresh data dari localStorage
    barangData = JSON.parse(localStorage.getItem('barangData')) || [];
    transaksiData = JSON.parse(localStorage.getItem('transaksiData')) || [];
    bangunanData = JSON.parse(localStorage.getItem('bangunanData')) || [];
    takTerdugaData = JSON.parse(localStorage.getItem('takTerdugaData')) || [];

    switch(page) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'stok':
            renderStokTable();
            break;
        case 'keuangan':
            renderKeuanganTable();
            break;
        case 'analisis':
            // Pastikan filter aktif tetap sama saat berpindah ke halaman diagram
            const activePeriod = document.querySelector('#analisis .btn-filter.active')?.dataset.period || 'daily';
            updateDiagram(activePeriod);
            updateRealtime();
            break;
        case 'pengeluaran':
            renderBangunanTable();
            renderTakTerdugaTable();
            break;
    }
}

// --- Dashboard ---
function updateDashboard() {
    // Total barang
    document.getElementById('totalBarang').textContent = barangData.length;
    
    // Pemasukan hari ini
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transaksiData.filter(t => t.tanggal === today && t.jenis === 'Pemasukan');
    const todayIncome = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    document.getElementById('pemasukanHariIni').textContent = formatRupiah(todayIncome);
    
    // Transaksi hari ini
    document.getElementById('transaksiHariIni').textContent = todayTransactions.length;
    
    // Stok menipis (kurang dari 20)
    const lowStock = barangData.filter(b => (b.stokBM1 + b.stokBM2) < 20);
    document.getElementById('stokMenipis').textContent = lowStock.length;
    
    // Recent transactions
    renderRecentTransactions();
    
    // Low stock alert
    renderLowStockAlert();
}

function renderRecentTransactions() {
    const container = document.getElementById('recentTransList');
    const recent = transaksiData.filter(t => t.jenis === 'Pemasukan').slice(-5).reverse();
    
    if (recent.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Belum ada transaksi</p>';
        return;
    }
    
    container.innerHTML = recent.map(t => `
        <div class="trans-item">
            <div class="trans-info">
                <h4>${t.nama || 'Transaksi'}</h4>
                <p>${formatDateTime(t.waktu)} - ${t.barang || 'Multiple items'}</p>
            </div>
            <div class="trans-amount">${formatRupiah(t.total)}</div>
        </div>
    `).join('');
}

function renderLowStockAlert() {
    const container = document.getElementById('lowStockList');
    const lowStock = barangData.filter(b => (b.stokBM1 + b.stokBM2) < 20);
    
    if (lowStock.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Semua stok aman</p>';
        return;
    }
    
    container.innerHTML = lowStock.map(b => `
        <div class="stock-item">
            <div class="stock-info">
                <h4>${b.nama}</h4>
                <p>ID: ${b.id}</p>
            </div>
            <div class="stock-alert">${b.stokBM1 + b.stokBM2} item</div>
        </div>
    `).join('');
}


// --- Stock Management (Owner) ---
function renderStokTable(filteredData = barangData) {
    const tbody = document.getElementById('stokTableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px;">Belum ada data barang</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredData.map((item, index) => {
        // Cari index asli di barangData untuk fungsi edit/delete
        const actualIndex = barangData.findIndex(b => b.id === item.id); 

        return `
            <tr>
                <td>${item.id}</td>
                <td>${formatDate(item.tanggal)}</td>
                <td>${item.nama}</td>
                <td>${formatRupiah(item.hargaModal)}</td>
                <td>${formatRupiah(item.hargaKotak)}</td>
                <td>${formatRupiah(item.hargaSatuan)}</td>
                <td>${item.stokBM1}</td>
                <td>${item.stokBM2}</td>
                <td><strong>${item.stokBM1 + item.stokBM2}</strong></td>
                <td>
                    <button class="btn-edit" onclick="editBarang(${actualIndex})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteBarang(${actualIndex})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function initStokSearch() {
    const searchInput = document.getElementById('stokBarangSearch');
    searchInput?.addEventListener('keyup', () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = barangData.filter(b => 
            b.id.toLowerCase().includes(query) || 
            b.nama.toLowerCase().includes(query)
        );
        renderStokTable(filtered);
    });
}

// --- Modal Functionality (Owner) ---
function initModals() {
    // Modal Barang
    const modalBarang = document.getElementById('modalBarang');
    const btnTambahBarang = document.getElementById('btnTambahBarang');
    const btnCancelBarang = document.getElementById('btnCancelBarang');
    const formBarang = document.getElementById('formBarang');
    
    btnTambahBarang?.addEventListener('click', () => {
        modalBarang.classList.add('show');
    });
    
    btnCancelBarang?.addEventListener('click', () => {
        modalBarang.classList.remove('show');
        formBarang.reset();
    });
    
    formBarang?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const idBarangValue = document.getElementById('idBarang').value;
        if (barangData.some(b => b.id === idBarangValue)) {
            alert('ID Barang sudah ada, gunakan ID lain.');
            return;
        }

        const newBarang = {
            id: idBarangValue,
            nama: document.getElementById('namaBarang').value,
            hargaModal: parseFloat(document.getElementById('hargaModal').value), // Harga Modal
            hargaKotak: parseFloat(document.getElementById('hargaKotak').value),
            hargaSatuan: parseFloat(document.getElementById('hargaSatuan').value),
            stokBM1: parseInt(document.getElementById('stokBM1').value),
            stokBM2: parseInt(document.getElementById('stokBM2').value),
            tanggal: new Date().toISOString().split('T')[0]
        };
        
        barangData.push(newBarang);
        saveData();
        renderStokTable();
        modalBarang.classList.remove('show');
        formBarang.reset();
        alert('Barang berhasil ditambahkan!');
        updateDashboard();
    });
    
    // Modal Edit Barang
    const modalEditBarang = document.getElementById('modalEditBarang');
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    const formEditBarang = document.getElementById('formEditBarang');
    
    btnCancelEdit?.addEventListener('click', () => {
        modalEditBarang.classList.remove('show');
    });
    
    formEditBarang?.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('editBarangIndex').value);
        const newId = document.getElementById('editIdBarang').value;

        if (barangData.some((b, i) => b.id === newId && i !== index)) {
            alert('ID Barang sudah ada, gunakan ID lain.');
            return;
        }

        barangData[index] = {
            ...barangData[index],
            id: newId,
            nama: document.getElementById('editNamaBarang').value,
            hargaModal: parseFloat(document.getElementById('editHargaModal').value), // Harga Modal
            hargaKotak: parseFloat(document.getElementById('editHargaKotak').value),
            hargaSatuan: parseFloat(document.getElementById('editHargaSatuan').value),
            stokBM1: parseInt(document.getElementById('editStokBM1').value),
            stokBM2: parseInt(document.getElementById('editStokBM2').value)
        };
        
        saveData();
        renderStokTable();
        modalEditBarang.classList.remove('show');
        alert('Barang berhasil diupdate!');
        updateDashboard();
    });
    
    // Modal Bangunan (Sama seperti yang lama)
    const modalBangunan = document.getElementById('modalBangunan');
    const btnTambahBangunan = document.getElementById('btnTambahBangunan');
    const btnCancelBangunan = document.getElementById('btnCancelBangunan');
    const formBangunan = document.getElementById('formBangunan');
    
    btnTambahBangunan?.addEventListener('click', () => {
        modalBangunan.classList.add('show');
    });
    
    btnCancelBangunan?.addEventListener('click', () => {
        modalBangunan.classList.remove('show');
        formBangunan.reset();
    });
    
    formBangunan?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newBangunan = {
            tanggal: new Date().toISOString().split('T')[0],
            keterangan: document.getElementById('keteranganBangunan').value,
            jumlah: parseFloat(document.getElementById('jumlahBangunan').value)
        };
        
        bangunanData.push(newBangunan);
        saveData();
        renderBangunanTable();
        modalBangunan.classList.remove('show');
        formBangunan.reset();
        alert('Simpanan berhasil ditambahkan!');
    });
    
    // Modal Tak Terduga (Sama seperti yang lama, plus simpan ke transaksiData)
    const modalTakTerduga = document.getElementById('modalTakTerduga');
    const btnTambahTakTerduga = document.getElementById('btnTambahTakTerduga');
    const btnCancelTakTerduga = document.getElementById('btnCancelTakTerduga');
    const formTakTerduga = document.getElementById('formTakTerduga');
    
    btnTambahTakTerduga?.addEventListener('click', () => {
        modalTakTerduga.classList.add('show');
    });
    
    btnCancelTakTerduga?.addEventListener('click', () => {
        modalTakTerduga.classList.remove('show');
        formTakTerduga.reset();
    });
    
    formTakTerduga?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const biaya = parseFloat(document.getElementById('biayaTakTerduga').value);

        const newTakTerduga = {
            waktu: new Date().toISOString(),
            jenis: document.getElementById('jenisTakTerduga').value,
            biaya: biaya,
            keterangan: document.getElementById('keteranganTakTerduga').value
        };
        
        takTerdugaData.push(newTakTerduga);
        
        // Tambahkan sebagai Pengeluaran ke Transaksi Data
        transaksiData.push({
            tanggal: new Date().toISOString().split('T')[0],
            waktu: new Date().toISOString(),
            jenis: 'Pengeluaran',
            nama: 'Biaya Tak Terduga',
            alamat: '-',
            banyaknya: 1,
            barang: newTakTerduga.jenis,
            harga: biaya,
            total: biaya,
            status: 'Keluar',
            catatan: newTakTerduga.keterangan || '-',
            items: [] 
        });

        saveData();
        renderTakTerdugaTable();
        modalTakTerduga.classList.remove('show');
        formTakTerduga.reset();
        alert('Biaya berhasil ditambahkan!');
        updateDashboard(); 
        loadPageData('keuangan'); 
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
    
    // Close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });
}

function editBarang(index) {
    const barang = barangData[index];
    const modal = document.getElementById('modalEditBarang');
    
    document.getElementById('editBarangIndex').value = index;
    document.getElementById('editIdBarang').value = barang.id;
    document.getElementById('editNamaBarang').value = barang.nama;
    document.getElementById('editHargaModal').value = barang.hargaModal; // Harga Modal
    document.getElementById('editHargaKotak').value = barang.hargaKotak;
    document.getElementById('editHargaSatuan').value = barang.hargaSatuan;
    document.getElementById('editStokBM1').value = barang.stokBM1;
    document.getElementById('editStokBM2').value = barang.stokBM2;
    
    modal.classList.add('show');
}

function deleteBarang(index) {
    if (confirm('Yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan!')) {
        barangData.splice(index, 1);
        saveData();
        renderStokTable();
        alert('Barang berhasil dihapus!');
        updateDashboard();
    }
}

// --- Keuangan ---
function initKeuangan() {
    const filterBulan = document.getElementById('filterBulan');
    const filterTahun = document.getElementById('filterTahun');
    const btnPrintKeuangan = document.getElementById('btnPrintKeuangan');
    
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        filterTahun.appendChild(option);
    }
    
    filterBulan.value = String(new Date().getMonth() + 1).padStart(2, '0');
    filterTahun.value = currentYear;
    
    filterBulan.addEventListener('change', () => renderKeuanganTable());
    filterTahun.addEventListener('change', () => renderKeuanganTable());
    btnPrintKeuangan.addEventListener('click', printKeuanganTable);
}

function renderKeuanganTable() {
    const bulan = document.getElementById('filterBulan').value;
    const tahun = document.getElementById('filterTahun').value;
    const tbody = document.getElementById('keuanganTableBody');
    
    const filtered = transaksiData.filter(t => {
        const date = new Date(t.tanggal);
        return String(date.getMonth() + 1).padStart(2, '0') === bulan && date.getFullYear() === parseInt(tahun);
    }).sort((a, b) => new Date(a.waktu) - new Date(b.waktu)); 
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Tidak ada transaksi pada bulan ini</td></tr>';
        document.getElementById('totalPemasukan').textContent = 'Rp 0';
        document.getElementById('totalPengeluaran').textContent = 'Rp 0';
        document.getElementById('saldoBulanan').textContent = 'Rp 0';
        return;
    }
    
    tbody.innerHTML = filtered.map(t => {
        let barangList = '<ul class="barang-list">';
        let hargaQtyList = '<ul class="barang-list">';

        if (t.items && t.items.length > 0) {
            t.items.forEach(item => {
                const unit = item.isKotak ? 'Kotak' : 'Satuan';
                barangList += `<li>${item.nama}</li>`;
                hargaQtyList += `<li>${item.qty} ${unit} / ${formatRupiah(item.harga)}</li>`;
            });
        } else {
            // Untuk Pengeluaran
            barangList += `<li>${t.barang || '-'}</li>`;
            hargaQtyList += `<li>${t.jenis === 'Pengeluaran' ? formatRupiah(t.harga) : '-'}</li>`;
        }
        
        barangList += '</ul>';
        hargaQtyList += '</ul>';

        return `
            <tr>
                <td>${formatDate(t.tanggal)}</td>
                <td>${t.jenis}</td>
                <td>${t.nama}</td>
                <td>${t.alamat || '-'}</td>
                <td>${barangList}</td>
                <td>${hargaQtyList}</td>
                <td>${formatRupiah(t.total)}</td>
                <td><span style="color: ${t.status === 'Lunas' ? '#10b981' : (t.jenis === 'Pengeluaran' ? '#000000' : '#ef4444')}">${t.status}</span></td>
                <td>${t.catatan || '-'}</td>
            </tr>
        `;
    }).join('');
    
    const pemasukan = filtered.filter(t => t.jenis === 'Pemasukan').reduce((sum, t) => sum + t.total, 0);
    const pengeluaran = filtered.filter(t => t.jenis === 'Pengeluaran').reduce((sum, t) => sum + t.total, 0);
    
    document.getElementById('totalPemasukan').textContent = formatRupiah(pemasukan);
    document.getElementById('totalPengeluaran').textContent = formatRupiah(pengeluaran);
    document.getElementById('saldoBulanan').textContent = formatRupiah(pemasukan - pengeluaran);
}

function printKeuanganTable() {
    const tableContainer = document.querySelector('#keuangan .table-container');
    const tableHTML = tableContainer.innerHTML;
    const filterBulan = document.getElementById('filterBulan').options[document.getElementById('filterBulan').selectedIndex].text;
    const filterTahun = document.getElementById('filterTahun').value;

    const printContent = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>Cetak Rekap Keuangan UD.BM</title>
            <style>
                body { font-family: Arial, sans-serif; }
                h2 { text-align: center; margin-bottom: 5px; }
                p { text-align: center; margin-top: 0; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
                th { background-color: #f2f2f2; }
                td:nth-child(7) { text-align: center; } /* Kolom Total */
                ul { margin: 0; padding-left: 15px; list-style-type: disc; }
                li { margin: 0; padding: 0; }
                .summary { margin-top: 20px; text-align: right; }
                .summary div { font-weight: bold; margin-bottom: 5px; }
            </style>
        </head>
        <body>
            <h2>Rekap Keuangan Bulanan UD.BM</h2>
            <p>Periode: ${filterBulan} ${filterTahun}</p>
            ${tableHTML}
            <div class="summary">
                <div>Total Pemasukan: ${document.getElementById('totalPemasukan').textContent}</div>
                <div>Total Pengeluaran: ${document.getElementById('totalPengeluaran').textContent}</div>
                <div>Saldo: ${document.getElementById('saldoBulanan').textContent}</div>
            </div>
            <script>
                // Remove Status column
                const table = document.getElementById('keuanganTable');
                if (table) {
                    const headerRow = table.querySelector('thead tr');
                    // Kolom Status ada di index ke-8 (td:nth-child(8))
                    table.querySelectorAll('th:nth-child(8), td:nth-child(8)').forEach(el => el.remove());
                }
                window.print();
            </script>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
}


// --- Analisis (Real-time dan Diagram) ---
let salesChart = null;

function updateRealtime() {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transaksiData.filter(t => t.tanggal === today && t.jenis === 'Pemasukan');
    
    document.getElementById('rtTransaksi').textContent = todayTransactions.length;
    
    const todayIncome = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    document.getElementById('rtPemasukan').textContent = formatRupiah(todayIncome);
    
    const totalItems = todayTransactions.reduce((sum, t) => sum + (t.banyaknya || 0), 0);
    document.getElementById('rtBarangTerjual').textContent = totalItems + ' Item';
    
    const container = document.getElementById('realtimeList');
    const recent = todayTransactions.slice(-10).reverse();
    
    if (recent.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Belum ada transaksi hari ini</p>';
        return;
    }
    
    container.innerHTML = recent.map(t => `
        <div class="realtime-item">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong>${t.nama}</strong>
                <span style="color: #10b981; font-weight: 700;">${formatRupiah(t.total)}</span>
            </div>
            <div style="font-size: 14px; color: #6b7280;">
                ${formatDateTime(t.waktu)} - ${t.barang}
            </div>
        </div>
    `).join('');
}

function initDiagram() {
    const filterButtons = document.querySelectorAll('#analisis .btn-filter');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDiagram(btn.dataset.period);
        });
    });
}

function updateDiagram(period) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    let labels = [];
    let data = [];
    let periodName = '';
    let allFilteredTransactions = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (period === 'daily') {
        periodName = '7 Hari Terakhir';
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            labels.push(formatDate(dateStr).slice(0, 5));
            
            const dayTransactions = transaksiData.filter(t => t.tanggal === dateStr && t.jenis === 'Pemasukan');
            const dayTotal = dayTransactions.reduce((sum, t) => sum + t.total, 0);
            data.push(dayTotal);
            allFilteredTransactions.push(...dayTransactions);
        }
    } else if (period === 'weekly') {
        periodName = '4 Minggu Terakhir';
        for (let i = 3; i >= 0; i--) {
            const endDate = new Date(today);
            endDate.setDate(today.getDate() - (today.getDay() === 0 ? 7 : today.getDay()) - (i * 7) + 6); 
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 6); 

            labels.push(`${startDate.toLocaleDateString('id-ID', {day: '2-digit'})} - ${endDate.toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit'})}`);
            
            const weekTransactions = transaksiData.filter(t => {
                const tDate = new Date(t.tanggal);
                tDate.setHours(0, 0, 0, 0);
                return tDate >= startDate && tDate <= endDate && t.jenis === 'Pemasukan';
            });
            const weekTotal = weekTransactions.reduce((sum, t) => sum + t.total, 0);
            data.push(weekTotal);
            allFilteredTransactions.push(...weekTransactions);
        }
    } else if (period === 'monthly') {
        periodName = '6 Bulan Terakhir';
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
            labels.push(monthStr);
            
            const monthTransactions = transaksiData.filter(t => {
                const tDate = new Date(t.tanggal);
                return tDate.getMonth() === date.getMonth() && 
                       tDate.getFullYear() === date.getFullYear() && 
                       t.jenis === 'Pemasukan';
            });
            const monthTotal = monthTransactions.reduce((sum, t) => sum + t.total, 0);
            data.push(monthTotal);
            allFilteredTransactions.push(...monthTransactions);
        }
    }
    
    if (salesChart) {
        salesChart.destroy();
    }
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Penjualan',
                data: data,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                }
            }
        }
    });
    
    document.getElementById('periodName').textContent = periodName;
    const total = data.reduce((sum, val) => sum + val, 0);
    const average = data.length > 0 ? total / data.length : 0;
    const transactionCount = allFilteredTransactions.length;
    
    document.getElementById('periodTotal').textContent = formatRupiah(total);
    document.getElementById('periodAverage').textContent = formatRupiah(average);
    document.getElementById('periodTransactions').textContent = transactionCount;
}

// --- Pengeluaran ---
function initPengeluaranTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function renderBangunanTable() {
    const tbody = document.getElementById('bangunanTableBody');
    
    if (bangunanData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Belum ada data simpanan</td></tr>';
        document.getElementById('totalBangunan').textContent = 'Rp 0';
        return;
    }
    
    let runningTotal = 0;
    const sortedData = [...bangunanData].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    tbody.innerHTML = sortedData.map((item, index) => {
        runningTotal += item.jumlah;
        return `
            <tr>
                <td>${formatDate(item.tanggal)}</td>
                <td>${item.keterangan}</td>
                <td>${formatRupiah(item.jumlah)}</td>
                <td>${formatRupiah(runningTotal)}</td>
                <td>
                    <button class="btn-delete" onclick="deleteBangunan(${bangunanData.indexOf(item)})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    const total = bangunanData.reduce((sum, item) => sum + item.jumlah, 0);
    document.getElementById('totalBangunan').textContent = formatRupiah(total);
}

function renderTakTerdugaTable() {
    const tbody = document.getElementById('takTerdugaTableBody');
    
    if (takTerdugaData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Belum ada data biaya</td></tr>';
        document.getElementById('totalTakTerduga').textContent = 'Rp 0';
        return;
    }

    const sortedData = [...takTerdugaData].sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
    
    tbody.innerHTML = sortedData.map((item, index) => `
        <tr>
            <td>${formatDateTime(item.waktu)}</td>
            <td>${item.jenis}</td>
            <td>${formatRupiah(item.biaya)}</td>
            <td>${item.keterangan || '-'}</td>
            <td>
                <button class="btn-delete" onclick="deleteTakTerduga(${takTerdugaData.indexOf(item)})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        </tr>
    `).join('');
    
    const total = takTerdugaData.reduce((sum, item) => sum + item.biaya, 0);
    document.getElementById('totalTakTerduga').textContent = formatRupiah(total);
}

function deleteBangunan(index) {
    if (confirm('Yakin ingin menghapus data simpanan ini?')) {
        bangunanData.splice(index, 1);
        saveData();
        renderBangunanTable();
        alert('Data berhasil dihapus!');
    }
}

function deleteTakTerduga(index) {
    if (confirm('Yakin ingin menghapus biaya tak terduga ini?')) {
        const deletedItem = takTerdugaData[index];
        takTerdugaData.splice(index, 1);
        
        // Hapus dari transaksiData (Keuangan) juga
        const transIndex = transaksiData.findIndex(t => 
            t.jenis === 'Pengeluaran' && 
            t.nama === 'Biaya Tak Terduga' && 
            t.total === deletedItem.biaya &&
            new Date(t.waktu).getTime() === new Date(deletedItem.waktu).getTime()
        );

        if (transIndex !== -1) {
            transaksiData.splice(transIndex, 1);
        }

        saveData();
        renderTakTerdugaTable();
        alert('Biaya berhasil dihapus!');
        updateDashboard(); 
        loadPageData('keuangan');
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initSampleData(); // Pastikan data minimal ada
    
    initNavigation();
    initStokSearch();
    initModals();
    initKeuangan();
    initDiagram();
    initPengeluaranTabs();
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    updateDashboard(); 
    
    // Auto refresh realtime every 5 seconds
    setInterval(() => {
        if (document.getElementById('analisis').classList.contains('active')) {
            updateRealtime();
        }
    }, 5000);
});