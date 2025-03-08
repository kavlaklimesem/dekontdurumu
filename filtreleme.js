// Filtreleme modülü
(function() {
  // Sabit değerler ve seçiciler
  const STATUS_ALL = 'all';
  const STATUS_TESLIM = 'teslim';
  const STATUS_TESLIM_EDILMEDI = 'teslim-edilmedi';
  
  // DOM elemanları için seçiciler
  let tablebody;
  let tableRows = [];
  let filtrele = {
    status: STATUS_ALL,
    searchTerm: ''
  };
  
  // Sayfalama değişkenleri
  let currentPage = 1;
  const rowsPerPage = 10;
  let totalPages = 1;
  let allRows = [];
  
  // Yükleme işlevi
  function init() {
    // Sayfa yüklendikten sonra çalış
    document.addEventListener('DOMContentLoaded', function() {
      // Ana içerik alanını bul (öğrenci verileri tablosunun olduğu div)
      const mainContent = document.querySelector('.bg-white.rounded-b-2xl.shadow-lg.p-6');
      if (!mainContent) return;
      
      // Tablo ve öğrencileri kontrol et
      const table = mainContent.querySelector('table');
      if (!table) return;
      
      tablebody = table.querySelector('tbody');
      if (!tablebody) return;
      
      // Tüm satırları al
      tableRows = Array.from(tablebody.querySelectorAll('tr'));
      allRows = [...tableRows];
      
      // Eğer tabloda satır yoksa döngüyü sonlandır
      if (tableRows.length === 0) return;
      
      // Filtreleme arayüzünü ekle
      addFilterInterface(table);
      
      // İlk sayfa yüklendiğinde filtreleri uygula
      applyFilters();
    });
  }
  
  // Filtreleme arayüzünü oluştur
  function addFilterInterface(table) {
    // Tablo konteynerını bul
    const tableContainer = table.closest('.overflow-x-auto');
    if (!tableContainer) return;
    
    // Filtreleme div'ini oluştur
    const filterDiv = document.createElement('div');
    filterDiv.className = 'mb-6 bg-white p-4 rounded-lg shadow';
    filterDiv.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Arama</label>
          <input 
            type="text" 
            id="searchInput"
            placeholder="Ad, işletme veya kimlik no ara..." 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Evrak Durumu</label>
          <select 
            id="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="${STATUS_ALL}">Tümü</option>
            <option value="${STATUS_TESLIM}">Teslim Edildi</option>
            <option value="${STATUS_TESLIM_EDILMEDI}">Teslim Edilmedi</option>
          </select>
        </div>
      </div>
      <div class="mt-3 text-sm text-gray-600 flex justify-between items-center">
        <div>
          Toplam <span id="filteredCount" class="font-medium">0</span> öğrenci gösteriliyor
        </div>
        <div id="filterInfo" style="display: none">
          Filtre uygulandı: <span id="filteredTotal" class="font-medium">0</span>/<span id="totalCount" class="font-medium">0</span>
        </div>
      </div>
    `;
    
    // Filtreleme arayüzünü tablodan önce yerleştir
    tableContainer.parentNode.insertBefore(filterDiv, tableContainer);
    
    // Event listener'ları ekle
    document.getElementById('searchInput').addEventListener('input', function(e) {
      filtrele.searchTerm = e.target.value.toLowerCase();
      currentPage = 1; // Filtrelemeyi uyguladığımızda ilk sayfaya geri dön
      applyFilters();
    });
    
    document.getElementById('statusFilter').addEventListener('change', function(e) {
      filtrele.status = e.target.value;
      currentPage = 1; // Filtrelemeyi uyguladığımızda ilk sayfaya geri dön
      applyFilters();
    });
    
    // Filtreleme bilgilerini güncelle
    document.getElementById('totalCount').textContent = tableRows.length;
  }
  
  // Filtreleri uygula
  function applyFilters() {
    const filteredRows = allRows.filter(row => {
      // Tüm hücreleri al
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length < 5) return false;
      
      // Gerekli verileri al
      const isletmeAdi = cells[0].textContent.toLowerCase();
      const kimlikNo = cells[1].textContent.toLowerCase();
      const adSoyad = cells[2].textContent.toLowerCase();
      
      // Evrak durumu checkbox kontrolü
      const evrakCheckbox = cells[4].querySelector('input[type="checkbox"]');
      const evrakTeslimEdildi = evrakCheckbox ? evrakCheckbox.checked : false;
      
      // Durum filtreleme
      if (filtrele.status === STATUS_TESLIM && !evrakTeslimEdildi) return false;
      if (filtrele.status === STATUS_TESLIM_EDILMEDI && evrakTeslimEdildi) return false;
      
      // Arama terimini kontrol etme
      if (filtrele.searchTerm && !(
        adSoyad.includes(filtrele.searchTerm) ||
        isletmeAdi.includes(filtrele.searchTerm) ||
        kimlikNo.includes(filtrele.searchTerm)
      )) return false;
      
      return true;
    });
    
    // Filtrelenmiş satırları göster
    tableRows = filteredRows;
    
    // Sayfalama işlemi
    totalPages = Math.ceil(tableRows.length / rowsPerPage);
    updatePagination();
    showCurrentPage();
    
    // Filtreleme bilgilerini güncelle
    const filteredCountElement = document.getElementById('filteredCount');
    if (filteredCountElement) {
      filteredCountElement.textContent = tableRows.length;
    }
    
    const filterInfoElement = document.getElementById('filterInfo');
    const filteredTotalElement = document.getElementById('filteredTotal');
    
    if (filterInfoElement && filteredTotalElement) {
      if (tableRows.length !== allRows.length) {
        filterInfoElement.style.display = 'block';
        filteredTotalElement.textContent = tableRows.length;
      } else {
        filterInfoElement.style.display = 'none';
      }
    }
  }
  
  // Mevcut sayfayı göster
  function showCurrentPage() {
    if (!tablebody) return;
    
    // Önce tüm satırları temizle
    tablebody.innerHTML = '';
    
    // Mevcut sayfaya ait satırları hesapla
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, tableRows.length);
    
    // Sayfaya ait satırları ekle
    for (let i = startIndex; i < endIndex; i++) {
      tablebody.appendChild(tableRows[i].cloneNode(true));
    }
    
    // Checkbox'ların durumunu güncelle, işlevselliğini koru
    const checkboxes = tablebody.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        // Burada orijinal checkbox'ın değişim olayını tetikle
        const rowIndex = Array.from(tablebody.querySelectorAll('tr')).findIndex(
          row => row.contains(checkbox)
        );
        
        if (rowIndex !== -1 && startIndex + rowIndex < tableRows.length) {
          const originalCheckbox = tableRows[startIndex + rowIndex].querySelector('input[type="checkbox"]');
          if (originalCheckbox) {
            originalCheckbox.checked = checkbox.checked;
            // Event oluşturarak orijinal işlevi tetikle
            const event = new Event('change', { bubbles: true });
            originalCheckbox.dispatchEvent(event);
          }
        }
      });
    });
  }
  
  // Sayfalamayı güncelle
  function updatePagination() {
    // Sayfalama konteynerini bul
    const paginationContainer = document.querySelector('.flex.justify-center.mt-6.space-x-1');
    if (!paginationContainer) return;
    
    // Mevcut sayfalama butonlarını temizle
    paginationContainer.innerHTML = '';
    
    // Sayfa sayısı 1'den büyükse sayfalama butonlarını ekle
    if (totalPages > 1) {
      // Önceki sayfa butonu
      if (currentPage > 1) {
        addPaginationButton(paginationContainer, currentPage - 1, '&laquo;', 'Önceki');
      }
      
      // Sayfa butonlarını ekle
      const pagesToShow = getPagesToShow();
      pagesToShow.forEach(page => {
        if (page === '...') {
          // Ellipsis ekle
          const ellipsis = document.createElement('span');
          ellipsis.className = 'px-3 py-1 text-gray-600';
          ellipsis.innerHTML = '...';
          paginationContainer.appendChild(ellipsis);
        } else {
          // Sayfa butonu ekle
          addPaginationButton(paginationContainer, page, page, page);
        }
      });
      
      // Sonraki sayfa butonu
      if (currentPage < totalPages) {
        addPaginationButton(paginationContainer, currentPage + 1, '&raquo;', 'Sonraki');
      }
    }
  }
  
  // Sayfalama butonu ekle
  function addPaginationButton(container, pageNum, text, ariaLabel) {
    const button = document.createElement('button');
    button.className = pageNum === currentPage
      ? 'px-3 py-1 rounded-md bg-blue-600 text-white focus:outline-none'
      : 'px-3 py-1 rounded-md bg-white text-gray-600 hover:bg-gray-50 focus:outline-none';
    button.innerHTML = text;
    button.setAttribute('aria-label', ariaLabel || `Sayfa ${pageNum}`);
    
    button.addEventListener('click', function() {
      currentPage = pageNum;
      showCurrentPage();
      updatePagination();
    });
    
    container.appendChild(button);
  }
  
  // Gösterilecek sayfa numaralarını hesapla
  function getPagesToShow() {
    if (totalPages <= 5) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }
    
    const pages = [];
    const leftSide = 2;
    const rightSide = 2;
    
    if (currentPage > leftSide + 1) {
      pages.push(1);
      if (currentPage > leftSide + 2) {
        pages.push('...');
      }
    }
    
    const start = Math.max(1, currentPage - leftSide);
    const end = Math.min(totalPages, currentPage + rightSide);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - rightSide) {
      if (currentPage < totalPages - rightSide - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  }
  
  // Global scope'a işlevleri ekle
  window.DecontFiltreleme = {
    init: init
  };
})();

// Sayfa yüklendiğinde filtreleme modülünü başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (window.DecontFiltreleme) {
      window.DecontFiltreleme.init();
    }
  });
} else {
  if (window.DecontFiltreleme) {
    window.DecontFiltreleme.init();
  }
} 