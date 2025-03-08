// Tablo ve filtreleme için basit script
(function() {
  // Sayfa ilk yüklendiğinde, React uygulaması DOM'u tamamen oluşturduktan sonra çalışması için
  // tabloyu gözleyen bir observer oluşturacağız
  
  // Tablo oluşturulunca çalışacak fonksiyon
  function addTableFilter() {
    console.log("Tablo bulundu, filtre ekleniyor...");
    
    // "Ödeme Evrakı Durumu" başlığını bul
    const headers = document.querySelectorAll('table th');
    
    if (!headers || headers.length === 0) {
      console.log("Tablo başlıkları bulunamadı");
      return false;
    }
    
    console.log(`${headers.length} adet tablo başlığı bulundu`);
    
    // Başlıkları tarayarak "Ödeme Evrakı Durumu" içereni bul
    let targetIndex = -1;
    let targetHeader = null;
    
    headers.forEach((header, index) => {
      console.log(`Başlık ${index+1}: "${header.textContent}"`);
      
      if (header.textContent.includes("Ödeme Evrakı Durumu")) {
        targetHeader = header;
        targetIndex = index;
        console.log(`"Ödeme Evrakı Durumu" başlığı bulundu. İndex: ${index}`);
      }
    });
    
    if (!targetHeader) {
      console.log("Hedef başlık bulunamadı");
      return false;
    }
    
    // Artık doğru başlığımız var, filtreleme ekleyebiliriz
    if (targetHeader.querySelector('.filtre-select')) {
      console.log("Filtre zaten eklenmiş");
      return true;
    }
    
    try {
      // Orijinal başlık metni
      const originalText = targetHeader.textContent.trim();
      
      // Başlığı temizle ve yeni içerik oluştur
      targetHeader.innerHTML = '';
      
      // Başlık + filtreleme içeren div oluştur
      const headerDiv = document.createElement('div');
      headerDiv.className = 'flex flex-col space-y-1';
      
      // Orijinal başlık metnini ekle
      const titleSpan = document.createElement('span');
      titleSpan.textContent = originalText;
      titleSpan.className = 'text-xs font-medium text-gray-500 uppercase tracking-wider';
      headerDiv.appendChild(titleSpan);
      
      // Filtreleme select menüsünü ekle
      const filterSelect = document.createElement('select');
      filterSelect.className = 'filtre-select w-full px-1 py-1 text-xs border border-gray-300 rounded-md';
      filterSelect.innerHTML = `
        <option value="all">Tümü</option>
        <option value="teslim">Teslim Edildi</option>
        <option value="teslim-edilmedi">Teslim Edilmedi</option>
      `;
      headerDiv.appendChild(filterSelect);
      
      // Oluşturduğumuz içeriği başlığa ekle
      targetHeader.appendChild(headerDiv);
      
      console.log("Filtre dropdown başarıyla eklendi");
      
      // Filtreleme işlevi
      filterSelect.addEventListener('change', function() {
        const value = this.value;
        console.log(`Filtreleme: ${value} seçildi`);
        
        // Tablo gövdesini bul
        const tbody = document.querySelector('table tbody');
        if (!tbody) {
          console.error("Tablo gövdesi bulunamadı");
          return;
        }
        
        // Tüm satırları filtrele
        const rows = tbody.querySelectorAll('tr');
        console.log(`${rows.length} satır filtreleniyor...`);
        
        rows.forEach(row => {
          // Hedef indexteki hücreyi bul
          const cells = row.querySelectorAll('td');
          
          if (targetIndex >= cells.length) {
            console.warn("Satır için yeterli sütun yok!");
            return;
          }
          
          const statusCell = cells[targetIndex];
          const checkbox = statusCell.querySelector('input[type="checkbox"]');
          
          if (!checkbox) {
            console.warn("Checkbox bulunamadı!");
            return;
          }
          
          const isSubmitted = checkbox.checked;
          
          // Filtrele
          if (value === 'all') {
            row.style.display = ''; // Göster
          } else if (value === 'teslim' && !isSubmitted) {
            row.style.display = 'none'; // Gizle
          } else if (value === 'teslim-edilmedi' && isSubmitted) {
            row.style.display = 'none'; // Gizle
          } else {
            row.style.display = ''; // Göster
          }
        });
      });
      
      return true;
    } catch (err) {
      console.error(`Filtre ekleme hatası: ${err.message}`);
      return false;
    }
  }
  
  // React bileşenini bekleyip gözleyen fonksiyon
  function watchForTable() {
    console.log("Tablo gözlemi başlatılıyor...");
    
    // Maksimum deneme sayısı
    let maxAttempts = 20; // 20 deneme (yaklaşık 20 saniye) 
    let attempts = 0;
    
    // Tabloyu bulmayı dene
    const checkForTable = () => {
      // Deneme sayısını artır
      attempts++;
      
      // Maksimum deneme sayısını aşarsa durdur
      if (attempts > maxAttempts) {
        console.log("Maksimum deneme sayısına ulaşıldı. İşlem durduruldu.");
        return;
      }
      
      // Tablo var mı diye kontrol edelim
      const tables = document.querySelectorAll('table');
      
      if (tables.length > 0) {
        console.log(`${tables.length} adet tablo bulundu`);
        const success = addTableFilter();
        if (!success) {
          // Tablo bulundu ama filtreleme eklenemedi, 
          // muhtemelen içerik henüz hazır değil, biraz daha bekleyelim
          console.log("Tablo içeriği tam oluşmamış, tekrar denenecek...");
          setTimeout(checkForTable, 500);
        }
      } else {
        // Tablo henüz oluşturulmamış, tekrar deneyelim
        console.log("Henüz tablo oluşmamış, 1 saniye sonra tekrar deneniyor... (Deneme: " + attempts + "/" + maxAttempts + ")");
        setTimeout(checkForTable, 1000);
      }
    };
    
    // İlk kontrol
    setTimeout(checkForTable, 2000); // React uygulamasının yüklenmesi için 2 saniye bekle
  }
  
  // DOM hazır olduğunda çalıştır
  if (document.readyState === 'loading') {
    console.log("DOM yükleniyor, event listener eklendi");
    document.addEventListener('DOMContentLoaded', function() {
      console.log("DOM yüklendi, tabloyu gözlemeye başlıyoruz");
      watchForTable();
    });
  } else {
    console.log("DOM zaten yüklü, tabloyu gözlemeye başlıyoruz");
    watchForTable();
  }
})(); 