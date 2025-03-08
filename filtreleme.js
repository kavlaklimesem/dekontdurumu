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

    // Form oluştur - erişilebilirlik doğru çalışsın diye
    const form = document.createElement('form');
    form.setAttribute('role', 'search');
    form.setAttribute('aria-label', 'Ödeme durumu filtreleme');
    form.onsubmit = function(e) { e.preventDefault(); return false; };
    
    // Label oluştur
    const label = document.createElement('label');
    label.textContent = 'Ödeme Durumu Filtrele: ';
    label.style.marginRight = '10px';
    label.style.fontWeight = 'bold';
    label.htmlFor = 'durumFiltre';
    
    // Select oluştur
    const select = document.createElement('select');
    select.id = 'durumFiltre';
    select.name = 'durumFiltre';
    select.style.padding = '5px';
    select.style.borderRadius = '4px';
    select.style.border = '1px solid #ced4da';
    
    // Seçenekleri ekle
    const options = [
      {value: 'hepsi', text: 'Tümü'},
      {value: 'teslim', text: 'Teslim Edildi'},
      {value: 'teslim-edilmedi', text: 'Teslim Edilmedi'}
    ];
    
    options.forEach(option => {
      const optElement = document.createElement('option');
      optElement.value = option.value;
      optElement.textContent = option.text;
      select.appendChild(optElement);
    });
    
    // Elemanları birleştir
    form.appendChild(label);
    form.appendChild(select);
    filtreDiv.appendChild(form);
    
    // Filtreleme alanını tablonun üstüne ekle
    tablo.parentNode.insertBefore(filtreDiv, tablo);

    // Filtreleme işlevi
    select.addEventListener('change', function() {
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