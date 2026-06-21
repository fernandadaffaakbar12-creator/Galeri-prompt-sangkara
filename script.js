// Tempat menyimpan data asli dari data.json
let semuaData = [];

// 1. Ambil data dari file data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        semuaData = data;
        // Tampilan awal saat web dibuka: Langsung balik urutan agar yang terbaru di atas
        tampilkanGaleri([...semuaData].reverse()); 
        inisialisasiFilter();       
    })
    .catch(error => console.error('Gagal memuat file data.json:', error));

// 2. Fungsi Utama untuk merakit kartu galeri ke layar
function tampilkanGaleri(daftarPrompt) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = ''; // Bersihkan isi galeri lama

    if (daftarPrompt.length === 0) {
        container.innerHTML = '<p style="grid-column: span 2; text-align: center; color: #888;">Tidak ada prompt ditemukan.</p>';
        return;
    }

    daftarPrompt.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        // Fitur Lazy Loading agar web tidak lemot
        const img = document.createElement('img');
        img.src = item.image;
        img.loading = "lazy"; 
        img.alt = item.title;

        const title = document.createElement('h2');
        title.textContent = item.title;

        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '📋 Salin Prompt';
        button.promptText = item.prompt; 
        
        button.addEventListener('click', () => {
            salinPrompt(button, button.promptText);
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(button);
        container.appendChild(card);
    });
}

// 3. Fungsi Logika Penyortiran Kategori
function inisialisasiFilter() {
    const tombolFilter = document.querySelectorAll('.filter-btn');

    tombolFilter.forEach(tombol => {
        tombol.addEventListener('click', () => {
            tombolFilter.forEach(b => b.classList.remove('active'));
            tombol.classList.add('active');

            const kategori = tombol.getAttribute('data-category');

            if (kategori === 'semua' || kategori === 'terbaru') {
                // Tombol 'Semua' dan 'Terbaru' sekarang sama-sama menampilkan dari yang paling baru
                tampilkanGaleri([...semuaData].reverse());
            } 
            else {
                // Saring datanya berdasarkan kategori (misal: "wanita")...
                const dataDisaring = semuaData.filter(item => item.category === kategori);
                // ...LALU balik urutannya agar yang terbaru tetap di atas!
                tampilkanGaleri([...dataDisaring].reverse());
            }
        });
    });
}

// 4. Fungsi Sistem Salin Teks ke Clipboard
function salinPrompt(tombol, teksPrompt) {
    navigator.clipboard.writeText(teksPrompt)
        .then(() => {
            const teksAsli = tombol.innerHTML;
            tombol.innerHTML = '✅ Berhasil Disalin!';
            tombol.style.backgroundColor = '#2ecc71';
            tombol.style.color = '#fff';

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