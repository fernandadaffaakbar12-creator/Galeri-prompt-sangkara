// Tempat menyimpan data asli dari data.json agar aman dan tidak rusak
let semuaData = [];

// 1. Ambil data secara otomatis dari file data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        semuaData = data;
        tampilkanGaleri(semuaData); // Tampilan awal: Munculkan semua data
        inisialisasiFilter();       // Aktifkan fungsi klik tombol filter
    })
    .catch(error => console.error('Gagal memuat file data.json:', error));

// 2. Fungsi Utama untuk merakit kartu galeri ke layar
function tampilkanGaleri(daftarPrompt) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = ''; // Bersihkan isi galeri lama sebelum diganti baru

    if (daftarPrompt.length === 0) {
        container.innerHTML = '<p style="grid-column: span 2; text-align: center; color: #888;">Tidak ada prompt ditemukan.</p>';
        return;
    }

    daftarPrompt.forEach(item => {
        // Membuat kotak kartu
        const card = document.createElement('div');
        card.className = 'card';

        // Membuat element Gambar dengan fitur Lazy Loading (Biar Web Cepat)
        const img = document.createElement('img');
        img.src = item.image;
        img.loading = "lazy"; 
        img.alt = item.title;

        // Membuat Judul Prompt
        const title = document.createElement('h2');
        title.textContent = item.title;

        // Membuat Tombol Salin
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '📋 Salin Prompt';
        
        // Trik Aman: Menyimpan teks asli prompt langsung di dalam memori tombol
        button.promptText = item.prompt; 
        
        // Logika ketika tombol salin di-klik
        button.addEventListener('click', () => {
            salinPrompt(button, button.promptText);
        });

        // Satukan semua elemen ke dalam kartu
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(button);
        
        // Masukkan kartu ke dalam galeri utama
        container.appendChild(card);
    });
}

// 3. Fungsi Logika Penyortiran Kategori & Fitur Terbaru
function inisialisasiFilter() {
    const tombolFilter = document.querySelectorAll('.filter-btn');

    tombolFilter.forEach(tombol => {
        tombol.addEventListener('click', () => {
            // Reset efek warna aktif di semua tombol
            tombolFilter.forEach(b => b.classList.remove('active'));
            // Beri efek warna aktif ke tombol yang baru di-klik
            tombol.classList.add('active');

            const kategori = tombol.getAttribute('data-category');

            if (kategori === 'semua') {
                tampilkanGaleri(semuaData);
            } 
            else if (kategori === 'terbaru') {
                // Trik Ajaib: Mengopi data lalu membalik urutannya (Bawah ke Atas)
                const dataTerbaru = [...semuaData].reverse();
                tampilkanGaleri(dataTerbaru);
            } 
            else {
                // Saring data berdasarkan kategori biasa (pria, wanita, atau pasangan)
                const dataDisaring = semuaData.filter(item => item.category === kategori);
                tampilkanGaleri(dataDisaring);
            }
        });
    });
}

// 4. Fungsi Sistem Salin Teks ke Clipboard Otomatis
function salinPrompt(tombol, teksPrompt) {
    navigator.clipboard.writeText(teksPrompt)
        .then(() => {
            const teksAsli = tombol.innerHTML;
            tombol.innerHTML = '✅ Berhasil Disalin!';
            tombol.style.backgroundColor = '#2ecc71';
            tombol.style.color = '#fff';

            // Kembalikan tombol ke bentuk semula setelah 2 detik
            setTimeout(() => {
                tombol.innerHTML = teksAsli;
                tombol.style.backgroundColor = '';
                tombol.style.color = '';
            }, 2000);
        })
        .catch(err => {
            console.error('Gagal menyalin teks: ', err);
            alert('Maaf, gagal menyalin otomatis. Silakan salin manual.');
        });
}