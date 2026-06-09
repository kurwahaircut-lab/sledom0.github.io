  // ─── GALLERY ───
  function switchImg(mainId, thumbsId, clickedThumb, src) {
    const mainImg = document.getElementById(mainId);
    mainImg.classList.add('switching');
    setTimeout(() => {
      mainImg.src = src;
      mainImg.onload = () => mainImg.classList.remove('switching');
    }, 200);
    document.querySelectorAll('#' + thumbsId + ' .thumb').forEach(t => t.classList.remove('active'));
    clickedThumb.classList.add('active');
  }
 
  // ─── FILTER BUTTONS ───
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
 
  // ─── FAVOURITES ───
  const favourites = {};
 
  function toggleFavPanel() {
    document.getElementById('fav-panel').classList.toggle('open');
    document.getElementById('fav-overlay').classList.toggle('open');
  }
 
  function updateFavCount() {
    const count = Object.keys(favourites).length;
    const el = document.getElementById('fav-count');
    const btn = document.getElementById('nav-fav-btn');
    el.textContent = count;
    btn.classList.toggle('has-items', count > 0);
    // bump animation
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
  }
 
  function renderFavPanel() {
    const body = document.getElementById('fav-panel-body');
    const empty = document.getElementById('fav-empty');
    const keys = Object.keys(favourites);
 
    // remove existing fav-items
    body.querySelectorAll('.fav-item').forEach(el => el.remove());
 
    if (keys.length === 0) {
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';
 
    keys.forEach(key => {
      const p = favourites[key];
      const item = document.createElement('div');
      item.className = 'fav-item';
      item.dataset.key = key;
      item.innerHTML = `
        <div class="fav-item-img">${p.imgHtml}</div>
        <div class="fav-item-info">
          <div class="fav-item-name">${p.name}</div>
          <div class="fav-item-price">${p.price}</div>
        </div>
        <button class="fav-item-remove" onclick="removeFav('${key}')">✕</button>
      `;
      body.appendChild(item);
    });
  }
 
  function removeFav(key) {
    delete favourites[key];
    // un-highlight the heart button
    document.querySelectorAll('.btn-fav').forEach(btn => {
      if (btn.dataset.name === key) {
        btn.textContent = '♡';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.background = '';
      }
    });
    renderFavPanel();
    updateFavCount();
  }
 
  // Attach to all fav buttons
  document.querySelectorAll('.btn-fav').forEach(btn => {
    btn.addEventListener('click', function() {
      const name = this.dataset.name || 'Produkt';
      const price = this.dataset.price || '';
 
      // Get thumbnail image from same card
      const card = this.closest('.product-card');
      let imgHtml = '♡';
      const mainImg = card ? card.querySelector('.gallery-main img, .product-img-wrap img') : null;
      if (mainImg) {
        const src = mainImg.src;
        imgHtml = `<img src="${src}" alt="">`;
      }
 
      const isAdded = !!favourites[name];
 
      if (isAdded) {
        removeFav(name);
      } else {
        favourites[name] = { name, price, imgHtml };
        this.textContent = '♥';
        this.style.color = '#2563EB';
        this.style.borderColor = '#2563EB';
        this.style.background = '#EFF6FF';
        renderFavPanel();
        updateFavCount();
      }
    });
  });
