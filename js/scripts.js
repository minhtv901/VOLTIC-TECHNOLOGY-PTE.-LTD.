/*!
* Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
*/
// Highlights current date on contact page
window.addEventListener('DOMContentLoaded', event => {
    const listHoursArray = document.body.querySelectorAll('.list-hours li');
    listHoursArray[new Date().getDay()].classList.add(('today'));
})
// ==================== CẤU HÌNH ====================
const PAGE_SIZE = 9;
let currentPage = 1;

// ==================== GIỚI HẠN CHỮ ====================
function limitText(str, maxLength) {
    if (!str) return '';
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

// ==================== DANH SÁCH SẢN PHẨM ====================
function renderProducts(page) {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const products = PRODUCTS.slice(start, end);

    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4 d-flex">
            <div class="card h-100 shadow-sm w-100 bg-faded">
                <img src="${product.img}" class="product-img-fixed" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${limitText(product.name, 40)}</h5>
                    <p class="card-text flex-grow-1">${limitText(product.desc, 90)}</p>
                    <div class="card-buttons mt-auto">
                        <a href="product_detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm flex-fill">View Details</a>
                        <button class="btn btn-outline-primary btn-sm flex-fill" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(PRODUCTS.length / PAGE_SIZE);
    const pagination = document.getElementById("pagination");
    let html = '';

    html += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${currentPage - 1});return false;">Previous</a>
             </li>`;

    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item${i === currentPage ? ' active' : ''}">
                    <a class="page-link" href="#" onclick="goToPage(${i});return false;">${i}</a>
                 </li>`;
    }

    html += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${currentPage + 1});return false;">Next</a>
             </li>`;

    pagination.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(PRODUCTS.length / PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderProducts(currentPage);
    renderPagination();
    window.scrollTo(0, 0);
}

// ==================== ADD TO CART ====================
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return alert('Product not found!');
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (cart[productId]) {
        cart[productId].qty += 1;
    } else {
        cart[productId] = {
            id: productId,
            name: product.name,
            img: product.img,
            qty: 1
        };
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// ==================== CHI TIẾT SẢN PHẨM ====================
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10);
}

function renderProductDetail() {
    const id = getProductIdFromUrl();
    const product = PRODUCTS.find(p => p.id === id);

    const detailDiv = document.getElementById('product-detail');
    if (!detailDiv) return;

    if (!product) {
        detailDiv.innerHTML = `
            <a href="products.html" class="btn btn-secondary btn-back">&larr; Back to Products</a>
            <h2>Product not found</h2>
        `;
        return;
    }

    // Nếu không có imgs, dùng mảng có 1 phần tử là img chính
    const imgs = product.imgs && product.imgs.length ? product.imgs : [product.img];

    detailDiv.innerHTML = `
        <a href="products.html" class="btn btn-secondary btn-back">&larr; Back to Products</a>
        <div class="text-center">
            <img src="${imgs[0]}" class="product-img-detail" id="main-product-img" alt="${product.name}">
        </div>
        <div class="product-thumbs mt-2 mb-2 text-center">
            ${imgs.map((img, idx) => `
                <img src="${img}" class="product-thumb${idx === 0 ? ' active' : ''}" data-idx="${idx}" alt="thumb" style="width:48px;height:48px;object-fit:cover;cursor:pointer;margin:2px;">
            `).join('')}
        </div>
        <h2 class="mt-3 mb-2">${limitText(product.name, 60)}</h2>
        <p class="mb-4">${limitText(product.desc, 250)}</p>
        <button class="btn btn-outline-primary btn-sm flex-fill" onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    // Bắt sự kiện đổi ảnh chính khi click vào ảnh phụ
    const mainImg = document.getElementById('main-product-img');
    const thumbs = detailDiv.querySelectorAll('.product-thumb');
    thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', function() {
            mainImg.src = imgs[idx];
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ==================== GIỎ HÀNG ====================
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart'));
        if (cart && typeof cart === 'object' && !Array.isArray(cart)) {
            return Object.values(cart);
        }
        if (Array.isArray(cart)) return cart;
    } catch(e) {}
    return [];
}

function renderCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (!cart.length) {
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <h4>Your cart is empty</h4>
                <a href="products.html" class="btn btn-primary mt-4">Go to Products</a>
            </div>
        `;
        return;
    }

    let rows = '';
    cart.forEach(item => {
        rows += `
            <tr>
                <td>${limitText(item.name, 40)}</td>
                <td><img src="${item.img}" class="cart-img" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;"></td>
                <td>${item.qty}</td>
            </tr>
        `;
    });

    cartContent.innerHTML = `
        <div class="table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Image</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
        <div class="text-end mt-3">
            <a href="checkout.html" class="btn btn-outline-primary btn-sm flex-fill">Checkout</a>
        </div>
    `;
}

// ==================== KHỞI TẠO ====================
document.addEventListener('DOMContentLoaded', function() {
    // Nếu có danh sách sản phẩm thì render
    if (document.getElementById('product-list')) {
        renderProducts(currentPage);
        renderPagination();
    }
    // Nếu có chi tiết sản phẩm thì render
    if (document.getElementById('product-detail')) {
        renderProductDetail();
    }
    // Nếu có giỏ hàng thì render
    if (document.getElementById('cart-content')) {
        renderCart();
    }
});
