document.addEventListener('DOMContentLoaded', () => {

    // --- DATA PRODUK (DUMMY) ---
    const products = [
        {
            id: 1,
            name: 'Asus Tuf Gaming F16',
            category: 'laptop',
            price: 29999000,
            image: 'assets/produk/f16.png',
            description: 'Intel® Core™ i7 Processor 14650HX 2.2 GHz NVIDIA® GeForce RTX™ 5070 Laptop GPU.'
        },
        {
            id: 2,
            name: 'ASUS TUF GAMING A16',
            category: 'laptop',
            price: 24999000,
            image: 'assets/produk/a16.png',
            description: 'AMD Ryzen™ 7 260 Processor 3.8GHz NVIDIA® GeForce RTX™ 5060 Laptop GPU.'
        },
        {
            id: 3,
            name: 'ROG STRIX SCAR 16',
            category: 'laptop',
            price: 86999000,
            image: 'assets/produk/scar16.png',
            description: 'Intel® Core™ Ultra 9 Processor 275HX 2.7 GHz NVIDIA® GeForce RTX™ 5090 Laptop GPU'
        },
        {
            id: 4,
            name: 'ESSENTIAL75 HE 75%',
            category: 'keyboard',
            price: 679000,
            image: 'assets/produk/ds75.png',
            description: 'ESSENTIAL75 HE, hadir dengan tampilan dan keycaps eksklusif bertema Rengoku dari Demon Slayer.'
        },
        {
            id: 5,
            name: 'AULA F75',
            category: 'keyboard',
            price: 739000,
            image: 'assets/produk/f75.png',
            description: 'Tri-Mode Nirkabel (BT/2.4G/Berkabel), Struktur Gasket, Tombol yang Dapat Ditukar Sepenuhnya, Tata Letak 75%.'
        },
        {
            id: 6,
            name: 'Mouse LAMZU MAYA X',
            category: 'mouse',
            price: 3399000,
            image: 'assets/produk/mayax.png',
            description: 'Mouse ringan dengan desain simpel dan spesifikasi tinggi untuk gaming.'
        },
        {
            id: 7,
            name: 'HyperX Cloud III Wireless',
            category: 'headset',
            price: 2999000,
            image: 'assets/produk/hyperx.png',
            description: 'Up to 120-Hour Battery Life[1] HyperX Signature Comfort and Durability. Tuned, Angled 53mm Drivers. Ultra-Clear Microphone with LED Mute Indicator. Compatibility: PC, PS5, PS4, Nintendo Switch'
        },
        {
            id: 8,
            name: 'Razer BlackShark V2 Pro',
            category: 'headset',
            price: 2850000,
            image: 'assets/produk/v2pro.png',
            description: 'RAZER HYPERCLEAR SUPER WIDEBAND MIC High-definition, Pro-level Voice Quality'
        },
        {
            id: 9,
            name: 'Logitech PRO X SUPERLIGHT 2',
            category: 'mouse',
            price: 2399000,
            image: 'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/new-gallery-assets-2025/pro-x-superlight-2-mice-top-angle-black-gallery-1.png?v=1',
            description: 'RAPC dengan Windows® 10 atau versi terbaru dan port USB 2.0 Akses internet untuk Software Logitech G HUB. Akses internet untuk Software Logitech G HUB.'
        },
    ];

    // --- STATE APLIKASI ---
    let cart = [];
    let currentFilter = 'all';

    // --- SELEKSI ELEMEN DOM ---
    const productGrid = document.getElementById('product-grid');
    const categoryButtons = document.querySelectorAll('.filter-btn');
    // const loginBtn = document.getElementById('login-btn'); // DIHAPUS
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const productDetailModal = document.getElementById('product-detail-modal');
    // const loginModal = document.getElementById('login-modal'); // DIHAPUS
    const closeButtons = document.querySelectorAll('.close-btn');
    const addToCartDetailBtn = document.getElementById('add-to-cart-detail');
    // const loginForm = document.getElementById('login-form'); // DIHAPUS
    const checkoutBtn = document.querySelector('.cart-footer .btn-primary');

    // --- FUNGSI-FUNGSI UTAMA ---

    // 1. Render Produk ke Grid
    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Tambah ke Keranjang</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // 2. Menampilkan Detail Produk
    function showProductDetail(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('detail-image').src = product.image;
            document.getElementById('detail-name').innerText = product.name;
            document.getElementById('detail-price').innerText = `Rp ${product.price.toLocaleString('id-ID')}`;
            document.getElementById('detail-description').innerText = product.description;
            addToCartDetailBtn.dataset.id = productId;
            productDetailModal.style.display = 'flex';
        }
    }

    // 3. Menambahkan ke Keranjang
    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }

        updateCartUI();
    }

    // 4. Fungsi Menghapus dari Keranjang
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    // 5. Memperbarui Tampilan Keranjang
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang Anda kosong.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                totalPrice += item.price * item.quantity;
            });
        }

        cartTotal.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }

    // 6. Filter Produk berdasarkan Kategori
    function filterProducts(category) {
        currentFilter = category;
        if (category === 'all') {
            renderProducts(products);
        } else {
            const filteredProducts = products.filter(p => p.category === category);
            renderProducts(filteredProducts);
        }
    }

    // --- EVENT LISTENERS ---

    // Event Klik pada Grid Produk (Menggunakan Event Delegation)
    productGrid.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(target.dataset.id);
            addToCart(productId);
        } else if (target.closest('.product-card')) {
            const productId = parseInt(target.closest('.product-card').querySelector('.add-to-cart-btn').dataset.id);
            showProductDetail(productId);
        }
    });

    // Event Klik pada Tombol Filter Kategori
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });

    // Event Klik untuk Tombol di Header
    // loginBtn.addEventListener('click', () => { ... }); // DIHAPUS

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    // Event Klik untuk Tombol Tutup (Close)
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            productDetailModal.style.display = 'none';
            // loginModal.style.display = 'none'; // DIHAPUS
            cartSidebar.classList.remove('active');
        });
    });

    // Event Klik di Luar Modal untuk Menutup
    window.addEventListener('click', (e) => {
        if (e.target === productDetailModal /* || e.target === loginModal */) { // DIHAPUS bagian ini
            e.target.style.display = 'none';
        }
    });

    // Event Klik Tombol "Tambah ke Keranjang" di Modal Detail
    addToCartDetailBtn.addEventListener('click', () => {
        const productId = parseInt(addToCartDetailBtn.dataset.id);
        addToCart(productId);
        productDetailModal.style.display = 'none';
    });

    // Event Submit Form Login
    // loginForm.addEventListener('submit', (e) => { ... }); // DIHAPUS

    // Event Listener untuk Hapus Item di Keranjang
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-remove')) {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        }
    });

    // Event Listener untuk Tombol Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang Anda masih kosong!');
            return;
        }

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderSummary = cart.map(item => `${item.name} (x${item.quantity})`).join('\n');

        const isConfirmed = confirm(
            `Anda akan melakukan checkout untuk:\n\n` +
            `${orderSummary}\n\n` +
            `Total: Rp ${totalPrice.toLocaleString('id-ID')}\n\n` +
            `Apakah Anda yakin?`
        );

        if (isConfirmed) {
            alert('Terima kasih! Pesanan Anda telah berhasil dibuat.');
            cart = [];
            updateCartUI();
            cartSidebar.classList.remove('active');
        }
    });

    // --- INISIALISASI ---
    renderProducts(products);
    updateCartUI();
});