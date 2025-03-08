// Basit filtreleme çözümü - sadece ilgili alana filtre ekler
(function() {
  // DOM hazır olduğunda çalışacak fonksiyon
  function initFilter() {
    console.log('Basit filtreleme modülü başlatılıyor...');
    
    // Belirli aralıklarla tabloyu kontrol et
    let attempts = 0;
    const maxAttempts = 20;
    const checkInterval = 500; // ms
    
    function checkTableAndAddFilter() {
      attempts++;
      console.log(`Tablo kontrol ediliyor... Deneme: ${attempts}`);
      
      // Tablo başlığını bulma (Ödeme Evrakı Durumu sütunu)
      const headerCell = document.querySelector('th.w-1\\/4:nth-child(5)');
      
      if (!headerCell) {
        console.log('Hedeflenen tablo başlığı henüz bulunamadı.');
        if (attempts < maxAttempts) {
          setTimeout(checkTableAndAddFilter, checkInterval);
        }
        return;
      }
      
      // Eğer halihazırda filtre eklenmişse tekrar ekleme
      if (headerCell.querySelector('.filtre-select')) {
        console.log('Filtre zaten eklenmiş.');
        return;
      }
      
      console.log('Hedef başlık bulundu, filtre ekleniyor...');
      
      // Orijinal başlık metnini sakla
      const originalText = headerCell.textContent;
      
      // Başlık içeriğini temizle
      headerCell.innerHTML = '';
      
      // Başlık metni + filtreleme alanını içeren bir div ekle
      const headerContainer = document.createElement('div');
      headerContainer.className = 'flex flex-col space-y-2';
      
      // Orijinal başlık metnini ekle
      const titleSpan = document.createElement('span');
      titleSpan.textContent = originalText;
      titleSpan.className = 'text-xs font-medium text-gray-500 uppercase tracking-wider';
      headerContainer.appendChild(titleSpan);
      
      // Filtreleme select menüsü ekle
      const filterSelect = document.createElement('select');
      filterSelect.className = 'filtre-select w-full px-1 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500';
      filterSelect.innerHTML = `
        <option value="all">Tümü</option>
        <option value="teslim">Teslim Edildi</option>
        <option value="teslim-edilmedi">Teslim Edilmedi</option>
      `;
      headerContainer.appendChild(filterSelect);
      
      // Oluşturulan elemanları başlık hücresine ekle
      headerCell.appendChild(headerContainer);
      
      // Filtreleme işlevini ekle
      filterSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        console.log(`Filtre değeri değişti: ${selectedValue}`);
        
        // Tablodaki tüm satırları bul
        const tableBody = document.querySelector('tbody');
        if (!tableBody) {
          console.error('Tablo gövdesi bulunamadı!');
          return;
        }
        
        const rows = tableBody.querySelectorAll('tr');
        
        // Her satırı filtrele
        rows.forEach(row => {
          // Ödeme Evrakı Durumu hücresini bul (5. sütun)
          const statusCell = row.querySelector('td:nth-child(5)');
          if (!statusCell) return;
          
          // Checkbox kontrolü - evrak teslim edildi mi?
          const checkbox = statusCell.querySelector('input[type="checkbox"]');
          if (!checkbox) return;
          
          const isSubmitted = checkbox.checked;
          
          // Filtreleme mantığı
          if (selectedValue === 'all') {
            row.style.display = ''; // Tümünü göster
          } else if (selectedValue === 'teslim' && !isSubmitted) {
            row.style.display = 'none'; // Teslim edilenleri göster, edilmeyenleri gizle
          } else if (selectedValue === 'teslim-edilmedi' && isSubmitted) {
            row.style.display = 'none'; // Teslim edilmeyenleri göster, edilenleri gizle
          } else {
            row.style.display = ''; // Diğer durumlarda göster
          }
        });
      });
      
      console.log('Filtre başarıyla eklendi!');
    }
    
    // İlk kontrol
    checkTableAndAddFilter();
  }
  
  // Sayfa yüklendiğinde çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilter);
  } else {
    initFilter();
  }
})(); 