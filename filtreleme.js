// Basit Tablo Filtreleme Scripti - tamamen yeniden yazıldı
(function() {
  // Sayfa tamamen yüklendikten 3 saniye sonra çalış (tüm dinamik içerikler yüklensin diye)
  window.addEventListener('load', function() {
    console.log("Sayfa yüklendi. Filtreleme işlemi 3 saniye sonra başlayacak...");
    setTimeout(tabloyuBulVeFiltrele, 3000);
  });

  // Tablo bulma ve filtreleme işlemi
  function tabloyuBulVeFiltrele() {
    // Farklı seçicilerle tabloyu bulmaya çalış
    let tablo = document.querySelector('table');
    
    if (!tablo) {
      console.error("Tablo bulunamadı! Daha sonra tekrar denenecek...");
      // Tekrar dene - 5 saniye daha bekle
      setTimeout(tabloyuBulVeFiltrele, 5000);
      return;
    }
    
    console.log("Tablo bulundu:", tablo);
    
    // Tüm tablo başlıklarını al
    let baslikHucreleri = tablo.querySelectorAll('th');
    if (!baslikHucreleri || baslikHucreleri.length === 0) {
      console.error("Tablo başlıkları bulunamadı! Daha sonra tekrar denenecek...");
      // Tekrar dene - 5 saniye daha bekle
      setTimeout(tabloyuBulVeFiltrele, 5000);
      return;
    }
    
    console.log("Tablo başlıkları bulundu:", baslikHucreleri.length, "adet");
    
    // "Ödeme Evrakı Durumu" sütununu bul
    let hedefIndex = -1;
    for (let i = 0; i < baslikHucreleri.length; i++) {
      const baslik = baslikHucreleri[i].textContent || '';
      console.log(`Başlık ${i+1}:`, baslik);
      
      if (baslik.includes("Ödeme Evrakı Durumu")) {
        hedefIndex = i;
        console.log(`"Ödeme Evrakı Durumu" başlığı bulundu. İndex: ${hedefIndex}`);
        break;
      }
    }
    
    if (hedefIndex === -1) {
      console.error("Ödeme Evrakı Durumu sütunu bulunamadı! Daha sonra tekrar denenecek...");
      // Tekrar dene - 5 saniye daha bekle
      setTimeout(tabloyuBulVeFiltrele, 5000);
      return;
    }
    
    // Basit bir filtreleme kutusu oluştur (tablo dışında, tablonun üstüne)
    const filtreContainer = document.createElement('div');
    filtreContainer.style.margin = '15px 0';
    filtreContainer.style.padding = '10px 15px';
    filtreContainer.style.backgroundColor = '#f0f0f0';
    filtreContainer.style.border = '1px solid #ddd';
    filtreContainer.style.borderRadius = '4px';
    
    const filtreLabelElement = document.createElement('label');
    filtreLabelElement.textContent = 'Ödeme Durumu Filtrele: ';
    filtreLabelElement.setAttribute('for', 'odeme-durum-filtre');
    filtreLabelElement.style.marginRight = '10px';
    filtreLabelElement.style.fontWeight = 'bold';
    
    const filtreSelectElement = document.createElement('select');
    filtreSelectElement.id = 'odeme-durum-filtre';
    filtreSelectElement.name = 'odeme-durum-filtre';
    filtreSelectElement.style.padding = '5px 10px';
    filtreSelectElement.style.borderRadius = '4px';
    filtreSelectElement.style.border = '1px solid #ccc';
    
    // Seçenekleri oluştur
    const secenekTumu = document.createElement('option');
    secenekTumu.value = 'hepsi';
    secenekTumu.textContent = 'Tümü';
    filtreSelectElement.appendChild(secenekTumu);
    
    const secenekTeslimEdildi = document.createElement('option');
    secenekTeslimEdildi.value = 'teslim';
    secenekTeslimEdildi.textContent = 'Teslim Edildi';
    filtreSelectElement.appendChild(secenekTeslimEdildi);
    
    const secenekTeslimEdilmedi = document.createElement('option');
    secenekTeslimEdilmedi.value = 'teslim-edilmedi';
    secenekTeslimEdilmedi.textContent = 'Teslim Edilmedi';
    filtreSelectElement.appendChild(secenekTeslimEdilmedi);
    
    // Elemanları birleştir
    filtreContainer.appendChild(filtreLabelElement);
    filtreContainer.appendChild(filtreSelectElement);
    
    // Filtreleme alanını tablonun hemen üstüne ekle
    const tabloParent = tablo.parentNode;
    if (tabloParent) {
      tabloParent.insertBefore(filtreContainer, tablo);
      console.log("Filtreleme alanı tablonun üstüne eklendi");
    } else {
      document.body.insertBefore(filtreContainer, document.body.firstChild);
      console.log("Filtreleme alanı sayfanın en üstüne eklendi");
    }
    
    // Filtreleme işlevi
    filtreSelectElement.addEventListener('change', function() {
      const secim = this.value;
      console.log(`Seçilen filtre: ${secim}`);
      
      // Tablo satırlarını bul
      const satirlar = tablo.querySelectorAll('tbody tr');
      console.log(`Toplam ${satirlar.length} satır filtreleniyor`);
      
      // Her satırı kontrol et ve filtrele
      satirlar.forEach(function(satir) {
        try {
          // Hedef hücreyi bul
          const hucreler = satir.querySelectorAll('td');
          if (hedefIndex >= hucreler.length) {
            console.warn("Satırda hedef hücre bulunamadı");
            return;
          }
          
          const durum_hucresi = hucreler[hedefIndex];
          
          // Checkbox'ı bul
          const checkbox = durum_hucresi.querySelector('input[type="checkbox"]');
          if (!checkbox) {
            console.warn("Satırda checkbox bulunamadı");
            return;
          }
          
          // Checkbox durumuna göre filtrele
          const teslimEdilmisMi = checkbox.checked;
          
          if (secim === 'hepsi') {
            satir.style.display = ''; // Göster
          } else if (secim === 'teslim' && !teslimEdilmisMi) {
            satir.style.display = 'none'; // Gizle
          } else if (secim === 'teslim-edilmedi' && teslimEdilmisMi) {
            satir.style.display = 'none'; // Gizle
          } else {
            satir.style.display = ''; // Göster
          }
        } catch (err) {
          console.error("Satır filtreleme hatası:", err);
        }
      });
    });
    
    console.log("Filtreleme işlemi başarıyla tamamlandı!");
  }
})(); 