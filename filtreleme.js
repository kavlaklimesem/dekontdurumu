// Basit Tablo Filtreleme Scripti
(function() {
  // Sayfa yüklendikten sonra çalışır
  window.addEventListener('load', function() {
    // Biraz bekleyerek tablonun yüklenmesi için zaman verin
    setTimeout(ekleFiltre, 1500);
  });

  // Filtreleme alanını ekler
  function ekleFiltre() {
    // Tabloyu bul
    const tablo = document.querySelector('table');
    if (!tablo) {
      console.log("Tablo bulunamadı!");
      return;
    }

    // Tablo başlıklarını bul
    const basliklar = tablo.querySelectorAll('th');
    if (!basliklar || basliklar.length === 0) {
      console.log("Tablo başlıkları bulunamadı!");
      return;
    }

    // "Ödeme Evrakı Durumu" sütununu bul
    let hedefIndex = -1;
    for (let i = 0; i < basliklar.length; i++) {
      if (basliklar[i].textContent.includes("Ödeme Evrakı Durumu")) {
        hedefIndex = i;
        break;
      }
    }

    if (hedefIndex === -1) {
      console.log("Ödeme Evrakı Durumu sütunu bulunamadı!");
      return;
    }

    // Tablo üstüne filtreleme alanı ekle
    const filtreDiv = document.createElement('div');
    filtreDiv.style.margin = '10px 0';
    filtreDiv.style.padding = '10px';
    filtreDiv.style.backgroundColor = '#f8f9fa';
    filtreDiv.style.borderRadius = '5px';

    filtreDiv.innerHTML = `
      <label for="durum-filtre" style="margin-right: 10px; font-weight: bold;">Ödeme Durumu Filtrele:</label>
      <select id="durum-filtre" style="padding: 5px; border-radius: 4px; border: 1px solid #ced4da;">
        <option value="hepsi">Tümü</option>
        <option value="teslim">Teslim Edildi</option>
        <option value="teslim-edilmedi">Teslim Edilmedi</option>
      </select>
    `;

    // Filtreleme alanını tablonun üstüne ekle
    tablo.parentNode.insertBefore(filtreDiv, tablo);

    // Filtreleme işlevi
    document.getElementById('durum-filtre').addEventListener('change', function() {
      const secim = this.value;
      const satirlar = tablo.querySelectorAll('tbody tr');

      satirlar.forEach(satir => {
        const hucre = satir.querySelectorAll('td')[hedefIndex];
        if (!hucre) return;

        const checkbox = hucre.querySelector('input[type="checkbox"]');
        if (!checkbox) return;

        const durumTeslim = checkbox.checked;

        if (secim === 'hepsi') {
          satir.style.display = ''; // Göster
        } else if (secim === 'teslim' && !durumTeslim) {
          satir.style.display = 'none'; // Gizle
        } else if (secim === 'teslim-edilmedi' && durumTeslim) {
          satir.style.display = 'none'; // Gizle
        } else {
          satir.style.display = ''; // Göster
        }
      });
    });

    console.log("Filtreleme alanı başarıyla eklendi!");
  }
})(); 