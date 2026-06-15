document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery-container");
    const filterBtns = document.querySelectorAll(".filter-btn");
    
    let semuaDataPrompt = []; 

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            semuaDataPrompt = data;
            tampilkanGaleri("semua"); 
        })
        .catch(error => console.error("Gagal memuat data:", error));

    function tampilkanGaleri(kategori) {
        galleryContainer.innerHTML = "";

        const dataDifilter = kategori === "semua" 
            ? semuaDataPrompt 
            : semuaDataPrompt.filter(item => item.category === kategori);

        dataDifilter.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");

            // DI SINI PERUBAHANNYA: 
            // Kita menghapus baris <p class="prompt-text"> sehingga hanya ada Gambar, Judul, dan Tombol.
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h2>${item.title}</h2>
                <button class="copy-btn">📋 Salin Prompt</button>
            `;

            // Logika Tombol Salin (Tetap berfungsi karena mengambil dari 'item.prompt' di data.json)
            const copyBtn = card.querySelector(".copy-btn");
            copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(item.prompt).then(() => {
                    const originalText = copyBtn.innerText;
                    copyBtn.innerText = "✅ Berhasil Disalin!";
                    copyBtn.classList.add("copied");

                    setTimeout(() => {
                        copyBtn.innerText = originalText;
                        copyBtn.classList.remove("copied");
                    }, 2000);
                });
            });

            galleryContainer.appendChild(card);
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const kategoriPilihan = btn.getAttribute("data-category");
            tampilkanGaleri(kategoriPilihan);
        });
    });
});