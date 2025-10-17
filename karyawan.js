// karyawan.js
// Data Storage (Hanya mengambil barang dan menyimpan transaksi)
let barangData = JSON.parse(localStorage.getItem('barangData')) || [];
let transaksiData = JSON.parse(localStorage.getItem('transaksiData')) || []; // Perlu disimpan
let cartItems = [];

// Fungsi utilitas (sama dengan yang lama)
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

function saveTransactionData() {
    localStorage.setItem('transaksiData', JSON.stringify(transaksiData));
    // Data barang perlu diupdate juga karena stok berkurang
    localStorage.setItem('barangData', JSON.stringify(barangData));
}

// Navigation & Load Page
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

function loadPageData(page) {
    // Refresh data barang dari localStorage saat berpindah halaman
    barangData = JSON.parse(localStorage.getItem('barangData')) || [];
    
    switch(page) {
        case 'transaksi':
            // No specific action needed, cart is rendered on init/action
            break;
        case 'listbarang':
            renderListBarangTable();
            break;
    }
}

// --- Transaksi (Cari Barang) ---
function initSearch() {
    const searchInput = document.getElementById('searchBarang');
    const btnSearch = document.getElementById('btnSearch');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }
        
        const results = barangData.filter(b => 
            b.id.toLowerCase().includes(query) || 
            b.nama.toLowerCase().includes(query)
        );
        
        renderSearchResults(results);
    }
    
    btnSearch.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || searchInput.value.length > 2) {
            performSearch();
        }
    });
}

function renderSearchResults(results) {
    const container = document.getElementById('searchResults');
    
    if (results.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Barang tidak ditemukan</p>';
        return;
    }
    
    container.innerHTML = results.map(item => `
        <div class="search-item" onclick="addToCart('${item.id}')">
            <div class="search-item-header">
                <span class="search-item-id">ID: ${item.id}</span>
            </div>
            <div class="search-item-name">${item.nama}</div>
            <div class="search-item-prices">
                <div class="price-item">
                    <span class="price-label">Harga Kotak/Kodi:</span>
                    <span class="price-value">${formatRupiah(item.hargaKotak)}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Harga Satuan:</span>
                    <span class="price-value">${formatRupiah(item.hargaSatuan)}</span>
                </div>
            </div>
            <div class="search-item-stock">
                Stok: UD.BM 1 (${item.stokBM1}) | UD.BM 2 (${item.stokBM2}) | Total: ${item.stokBM1 + item.stokBM2}
            </div>
        </div>
    `).join('');
}

// --- Cart Functionality ---
function addToCart(itemId) {
    const barang = barangData.find(b => b.id === itemId);
    if (!barang) return;
    
    const existingItem = cartItems.find(c => c.id === itemId);
    
    if ((barang.stokBM1 + barang.stokBM2) <= (existingItem ? existingItem.qty : 0)) {
        alert('Stok barang habis!');
        return;
    }

    if (existingItem) {
        existingItem.qty++;
    } else {
        cartItems.push({
            id: barang.id,
            nama: barang.nama,
            harga: barang.hargaSatuan, // Default menggunakan harga satuan
            qty: 1,
            hargaKotak: barang.hargaKotak,
            hargaSatuanBarangAsli: barang.hargaSatuan,
            isKotak: false // Tambahkan status apakah harga kotak yang digunakan
        });
    }
    
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    
    if (cartItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Keranjang kosong</p>';
        updateCartTotal();
        return;
    }
    
    container.innerHTML = cartItems.map((item, index) => {
        const barangAsli = barangData.find(b => b.id === item.id);
        const maxStock = barangAsli ? (barangAsli.stokBM1 + barangAsli.stokBM2) : 9999;
        
        // Pilih opsi yang sesuai
        const kotakSelected = item.isKotak && item.harga === barangAsli.hargaKotak ? 'selected' : '';
        const satuanSelected = !item.isKotak && item.harga === barangAsli.hargaSatuan ? 'selected' : '';

        return `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-name">${item.nama}</span>
                    <button class="btn-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button class="btn-qty" onclick="decreaseQty(${index})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="qty-input" value="${item.qty}" 
                               onchange="updateQty(${index}, this.value)" min="1" max="${maxStock}">
                        <button class="btn-qty" onclick="increaseQty(${index})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <select class="price-selector" onchange="changeItemPrice(${index}, this.value)">
                            <option value="${barangAsli.hargaKotak}" ${kotakSelected}>Kotak</option>
                            <option value="${barangAsli.hargaSatuan}" ${satuanSelected}>Satuan</option>
                        </select>
                        <input type="number" class="price-manual-input" value="${item.harga}" 
                               onchange="updateManualPrice(${index}, this.value)" placeholder="Harga">
                    </div>
                </div>
                <div class="cart-item-total">
                    Subtotal: ${formatRupiah(item.harga * item.qty)}
                </div>
            </div>
        `;
    }).join('');
    
    updateCartTotal();
}

function changeItemPrice(index, priceValue) {
    const newPrice = parseFloat(priceValue);
    const barangAsli = barangData.find(b => b.id === cartItems[index].id);
    
    if (barangAsli) {
        cartItems[index].harga = newPrice;
        // Tentukan status isKotak berdasarkan perbandingan dengan harga asli dari data barang
        cartItems[index].isKotak = newPrice === barangAsli.hargaKotak;
    } else {
        // Jika data barang tidak ditemukan, asumsikan harga satuan
        cartItems[index].harga = newPrice;
        cartItems[index].isKotak = false;
    }
    
    renderCart();
}

function updateManualPrice(index, value) {
    const newPrice = parseFloat(value);
    if (!isNaN(newPrice) && newPrice >= 0) {
        cartItems[index].harga = newPrice;
        // Reset isKotak status karena harga sudah diubah manual
        cartItems[index].isKotak = false; 
    } else {
        alert('Harga tidak valid!');
    }
    renderCart(); // Render ulang untuk menampilkan nilai yang diinput
}

function increaseQty(index) {
    const barangAsli = barangData.find(b => b.id === cartItems[index].id);
    const maxStock = barangAsli ? (barangAsli.stokBM1 + barangAsli.stokBM2) : 9999;

    if (cartItems[index].qty < maxStock) {
        cartItems[index].qty++;
        renderCart();
    } else {
        alert('Jumlah melebihi stok yang tersedia!');
    }
}

function decreaseQty(index) {
    if (cartItems[index].qty > 1) {
        cartItems[index].qty--;
        renderCart();
    }
}

function updateQty(index, value) {
    const qty = parseInt(value);
    const barangAsli = barangData.find(b => b.id === cartItems[index].id);
    const maxStock = barangAsli ? (barangAsli.stokBM1 + barangAsli.stokBM2) : 9999;

    if (qty > 0 && qty <= maxStock) {
        cartItems[index].qty = qty;
        renderCart();
    } else if (qty > maxStock) {
        alert('Jumlah melebihi stok yang tersedia!');
        cartItems[index].qty = maxStock; 
        renderCart();
    } else {
        alert('Kuantitas minimal 1!');
        cartItems[index].qty = 1; 
        renderCart();
    }
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    renderCart();
}

function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    document.getElementById('cartTotal').textContent = formatRupiah(total);
    
    // Update change amount
    const paymentInput = document.getElementById('paymentAmount');
    const payment = parseFloat(paymentInput.value) || 0;
    const change = payment - total;
    document.getElementById('changeAmount').textContent = formatRupiah(change >= 0 ? change : 0);
}

// Payment change calculation
document.getElementById('paymentAmount').addEventListener('input', function() {
    updateCartTotal();
});

// --- Checkout ---
function initCheckout() {
    document.getElementById('btnCheckout').addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }
        
        const total = cartItems.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        const payment = parseFloat(document.getElementById('paymentAmount').value) || 0;
        
        if (payment < total) {
            alert('Jumlah pembayaran kurang!');
            return;
        }
        
        // Buat daftar barang untuk kolom barang di keuangan
        const barangListForKeuangan = cartItems.map(item => 
            `${item.nama} (${item.qty} ${item.isKotak ? 'Kotak' : 'Satuan'})`
        ).join(', ');

        // Create transaction
        const transaction = {
            tanggal: new Date().toISOString().split('T')[0],
            waktu: new Date().toISOString(),
            jenis: 'Pemasukan',
            nama: document.getElementById('customerName').value || 'Customer',
            alamat: document.getElementById('customerAddress').value || '-',
            banyaknya: cartItems.reduce((sum, item) => sum + item.qty, 0),
            barang: barangListForKeuangan,
            harga: cartItems.length === 1 ? cartItems[0].harga : total / cartItems.reduce((sum, item) => sum + item.qty, 0), 
            total: total,
            status: 'Lunas',
            catatan: document.getElementById('transactionNote').value || '-',
            items: cartItems.map(item => ({
                id: item.id,
                nama: item.nama,
                harga: item.harga, 
                qty: item.qty,
                isKotak: item.isKotak
            }))
        };
        
        transaksiData.push(transaction);
        
        // Update stock
        cartItems.forEach(cartItem => {
            const barang = barangData.find(b => b.id === cartItem.id);
            if (barang) {
                let qtyNeeded = cartItem.qty;
                
                // Prioritaskan stok BM1
                if (barang.stokBM1 >= qtyNeeded) {
                    barang.stokBM1 -= qtyNeeded;
                } else {
                    const remaining = qtyNeeded - barang.stokBM1;
                    barang.stokBM1 = 0;
                    barang.stokBM2 -= remaining;
                    if (barang.stokBM2 < 0) barang.stokBM2 = 0; 
                }
            }
        });
        
        saveTransactionData();
        
        // Clear cart and form
        cartItems = [];
        document.getElementById('customerName').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('transactionNote').value = '';
        document.getElementById('paymentAmount').value = '';
        document.getElementById('changeAmount').textContent = 'Rp 0';
        
        renderCart();
        alert(`Transaksi berhasil!\nTotal: ${formatRupiah(total)}\nBayar: ${formatRupiah(payment)}\nKembalian: ${formatRupiah(payment - total)}`);
    });
}

// --- List Barang (Read-Only) ---
function renderListBarangTable(filteredData = barangData) {
    const tbody = document.getElementById('listBarangTableBody');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Belum ada data barang atau tidak ditemukan</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredData.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td>${item.nama}</td>
            <td>${formatRupiah(item.hargaKotak)}</td>
            <td>${formatRupiah(item.hargaSatuan)}</td>
            <td>${item.stokBM1}</td>
            <td>${item.stokBM2}</td>
            <td><strong>${item.stokBM1 + item.stokBM2}</strong></td>
        </tr>
    `).join('');
}

function initListBarangSearch() {
    const searchInput = document.getElementById('listBarangSearch');
    searchInput?.addEventListener('keyup', () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = barangData.filter(b => 
            b.id.toLowerCase().includes(query) || 
            b.nama.toLowerCase().includes(query)
        );
        renderListBarangTable(filtered);
    });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Muat ulang data dari localStorage saat startup
    barangData = JSON.parse(localStorage.getItem('barangData')) || []; 
    transaksiData = JSON.parse(localStorage.getItem('transaksiData')) || [];
    
    // Jika data barang kosong, inisialisasi dengan data contoh
    if (barangData.length === 0) {
        // Data inisialisasi minimal agar karyawan bisa bertransaksi
        barangData = [
            { id: "01", nama: "Beras Premium", hargaModal: 280000, hargaKotak: 300000, hargaSatuan: 32000, stokBM1: 50, stokBM2: 30, tanggal: new Date().toISOString().split('T')[0] },
            { id: "02", nama: "Minyak Goreng 2L", hargaModal: 180000, hargaKotak: 200000, hargaSatuan: 22000, stokBM1: 40, stokBM2: 25, tanggal: new Date().toISOString().split('T')[0] },
        ];
        localStorage.setItem('barangData', JSON.stringify(barangData));
    }
    
    initNavigation();
    initSearch();
    initCheckout();
    initListBarangSearch();
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    renderCart(); // Render cart saat startup
    // list barang akan dirender saat diklik di nav
});