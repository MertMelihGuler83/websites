
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Quote form simple handler
document.getElementById('quote-form')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Talebiniz alındı. En kısa sürede dönüş yapacağız. Teşekkürler!');
});

// Contact form handler
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Mesajınız gönderildi. Teşekkür ederiz!');
});

// Products rendering
const grid = document.getElementById('products-grid');
const catSel = document.getElementById('filter-category');
const brandSel = document.getElementById('filter-brand');
const priceInput = document.getElementById('filter-price');
const searchInput = document.getElementById('filter-search');

let products = [];

fetch('data/products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    buildFilters();
    renderProducts();
  })
  .catch(() => {
    grid.innerHTML = '<div class="col-12 text-center text-muted">Ürün verisi yüklenemedi.</div>';
  });

function buildFilters(){
  const cats = ['Tümü', ...new Set(products.map(p => p.category))];
  const brands = ['Tümü', ...new Set(products.map(p => p.brand))];

  catSel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  brandSel.innerHTML = brands.map(b => `<option value="${b}">${b}</option>`).join('');
}

function tryMatch(t, q){
  return t.toLocaleLowerCase('tr-TR').includes(q.toLocaleLowerCase('tr-TR'));
}

function renderProducts(){
  const maxPrice = Number(priceInput.value || Infinity);
  const cat = catSel.value || 'Tümü';
  const brand = brandSel.value || 'Tümü';
  const q = searchInput.value?.trim() || '';

  const filtered = products.filter(p => {
    const okCat = cat === 'Tümü' || p.category === cat;
    const okBrand = brand === 'Tümü' || p.brand === brand;
    const okPrice = isFinite(maxPrice) ? p.price <= maxPrice : true;
    const okSearch = q ? (tryMatch(p.name, q) || tryMatch(p.brand, q) || tryMatch(p.category, q)) : true;
    return okCat && okBrand && okPrice && okSearch;
  });

  grid.innerHTML = filtered.map(p => cardHTML(p)).join('') || '<div class="col-12 text-center text-muted">Kriterlere uygun ürün bulunamadı.</div>';
}

function cardHTML(p){
  const price = new Intl.NumberFormat('tr-TR', { style:'currency', currency:'TRY', maximumFractionDigits:0 }).format(p.price);
  return `
  <div class="col-12 col-sm-6 col-lg-4">
    <div class="card h-100 rounded-4 shadow-sm">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5 class="card-title mb-1">${p.name}</h5>
          <span class="badge text-bg-primary">${p.category}</span>
        </div>
        <div class="small text-muted mb-2">${p.brand}</div>
        <p class="card-text flex-grow-1">${p.desc || ''}</p>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="fw-bold">${price}</div>
        </div>
      </div>
    </div>
  </div>`;
}
/*<a class="btn btn-sm btn-primary" href="https://wa.me/905457497110?text=${encodeURIComponent('Merhaba, ' + p.name + ' ürünü hakkında bilgi almak istiyorum.')}" target="_blank">
            <i class="fa-brands fa-whatsapp me-1"></i>Sor
          </a>
*/
[catSel, brandSel, priceInput, searchInput].forEach(el => el?.addEventListener('input', renderProducts));
