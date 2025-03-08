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
      
      // Önce tüm tablo başlıklarını bulalım
      const tableHeaders = document.querySelectorAll('th');
      
      // Tablo başlıkları var mı kontrol et
      if (!tableHeaders || tableHeaders.length === 0) {
        console.log('Tablo başlıkları henüz bulunamadı.');
        if (attempts < maxAttempts) {
          setTimeout(checkTableAndAddFilter, checkInterval);
        }
        return;
      }
      
      console.log(`Bulunan tablo başlığı sayısı: ${tableHeaders.length}`);
      
      // "Ödeme Evrakı Durumu" içeren başlığı bul
      let targetHeader = null;
      
      for (let i = 0; i < tableHeaders.length; i++) {
        const headerText = tableHeaders[i].textContent.trim();
        console.log(`Başlık ${i+1}: "${headerText}"`);
        
        if (headerText.includes('Ödeme Evrakı Durumu')) {
          targetHeader = tableHeaders[i];
          console.log(`Hedef başlık bulundu (${i+1}. başlık): "${headerText}"`);
          break;
        }
      }
      
      // Hedef başlık bulunamadı ise tekrar dene
      if (!targetHeader) {
        console.log('Ödeme Evrakı Durumu başlığı bulunamadı.');
        if (attempts < maxAttempts) {
          setTimeout(checkTableAndAddFilter, checkInterval);
        }
        return;
      }
      
      // Eğer halihazırda filtre eklenmişse tekrar ekleme
      if (targetHeader.querySelector('.filtre-select')) {
        console.log('Filtre zaten eklenmiş.');
        return;
      }
      
      console.log('Hedef başlık bulundu, filtre ekleniyor...');
      
      try {
        // Orijinal başlık metnini sakla
        const originalText = targetHeader.textContent;
        
        // Başlık içeriğini temizle
        targetHeader.innerHTML = '';
        
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
        targetHeader.appendChild(headerContainer);
        
        console.log('Filtre DOM elemanları eklendi.');
        
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
          console.log(`Filtrelenecek satır sayısı: ${rows.length}`);
          
          // Her satırı filtrele
          rows.forEach((row, index) => {
            try {
              // Başlıkların sayısını al
              const headerCount = tableHeaders.length;
              
              // Ödeme Evrakı Durumu hücresini bul (eğer 5 sütun varsa)
              const statusCellIndex = Array.from(tableHeaders).findIndex(header => 
                header.textContent.includes('Ödeme Evrakı Durumu')
              );
              
              if (statusCellIndex === -1) {
                console.error('Status hücresi başlığı bulunamadı!');
                return;
              }
              
              // Tablo satırındaki ilgili hücreyi al
              const cells = row.querySelectorAll('td');
              if (statusCellIndex >= cells.length) {
                console.error(`Satır ${index+1}: Yetersiz sütun sayısı`);
                return;
              }
              
              const statusCell = cells[statusCellIndex];
              
              // Checkbox kontrolü - evrak teslim edildi mi?
              const checkbox = statusCell.querySelector('input[type="checkbox"]');
              if (!checkbox) {
                console.error(`Satır ${index+1}: Checkbox bulunamadı!`);
                return;
              }
              
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
            } catch (err) {
              console.error(`Satır filtreleme hatası (${index+1}): ${err.message}`);
            }
          });
        });
        
        console.log('Filtre başarıyla eklendi ve event listener bağlandı!');
      } catch (err) {
        console.error(`Filtre ekleme hatası: ${err.message}`);
      }
    }
    
    // İlk kontrol
    checkTableAndAddFilter();
  }
  
  // Sayfa yüklendiğinde çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilter);
  } else {
    // Biraz gecikme ekleyelim - React'in DOM'u oluşturması için zaman tanıyalım
    setTimeout(initFilter, 1000);
  }
})(); 