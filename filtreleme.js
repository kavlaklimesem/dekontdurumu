// Basit Tablo Filtreleme - Sadece seçim yapıldığında çalışır
(function() {
  // Sayfa yüklendiğinde bir kez çalış
  window.addEventListener('load', function() {
    // Tablo üzerine filtreleme seçeneklerini ekle
    ekleFiltre();
  });

  // Filtreleme kutusunu ekler
  function ekleFiltre() {
    // Tabloyu bul
    const tablo = document.querySelector('table');
    if (!tablo) return;
    
    // Ödeme Evrakı Durumu sütununu bul
    const basliklar = tablo.querySelectorAll('th');
    if (!basliklar || basliklar.length === 0) return;
    
    let odemeSutunIndex = -1;
    
    for (let i = 0; i < basliklar.length; i++) {
      if (basliklar[i].textContent.includes("Ödeme Evrakı Durumu")) {
        odemeSutunIndex = i;
        break;
      }
    }
    
    if (odemeSutunIndex === -1) return; // Sütun bulunamadı
    
    // Filtreleme kutusu oluştur
    const filtreKutusu = document.createElement('div');
    filtreKutusu.style.margin = '10px 0';
    filtreKutusu.style.padding = '10px';
    filtreKutusu.style.backgroundColor = '#f8f9fa';
    filtreKutusu.style.border = '1px solid #dee2e6';
    filtreKutusu.style.borderRadius = '4px';
    
    // Etiket ve açılır liste
    filtreKutusu.innerHTML = `
      <label for="odeme-filtre" style="margin-right: 10px; font-weight: bold;">Ödeme Durumu Filtrele:</label>
      <select id="odeme-filtre" style="padding: 5px 10px; border: 1px solid #ced4da; border-radius: 4px;">
        <option value="hepsi">Tümü</option>
        <option value="teslim-edildi">Ödeme Evrakı Teslim Edildi</option>
        <option value="teslim-edilmedi">Ödeme Evrakı Zamanında Teslim Edilmedi</option>
      </select>
    `;
    
    // Filtreleme kutusunu tablonun üstüne ekle
    tablo.parentNode.insertBefore(filtreKutusu, tablo);
    
    // Filtreleme işlevi - SADECE kullanıcı seçim yaptığında çalışır
    document.getElementById('odeme-filtre').addEventListener('change', function() {
      const secim = this.value;
      
      // Tablo satırlarını bul
      const satirlar = tablo.querySelectorAll('tbody tr');
      
      // Her satırı kontrol et
      satirlar.forEach(function(satir) {
        // İlgili sütunu bul
        const hedefHucre = satir.querySelectorAll('td')[odemeSutunIndex];
        if (!hedefHucre) return;
        
        // Checkbox'ı bul
        const checkbox = hedefHucre.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        
        // Checkbox'ın durumuna göre filtrele
        const teslimEdildi = checkbox.checked;
        
        if (secim === 'hepsi') {
          satir.style.display = ''; // Göster
        } else if (secim === 'teslim-edildi' && !teslimEdildi) {
          satir.style.display = 'none'; // Gizle
        } else if (secim === 'teslim-edilmedi' && teslimEdildi) {
          satir.style.display = 'none'; // Gizle
        } else {
          satir.style.display = ''; // Göster
        }
      });
    });
  }
})(); 