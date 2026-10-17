/**
 * JING COFFEE - Main Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navbarLinks = document.getElementById('navbar-links');
    const navLinks = document.querySelectorAll('.nav-link-item');

    if (hamburgerBtn && navbarLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navbarLinks.classList.toggle('open');
            hamburgerBtn.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile drawer when clicking any link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarLinks.classList.remove('open');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');

                // Update active link style
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // 2. Navbar Scroll Effect (Subtle shrink and blur intensification)
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. Product Filter & Search System
    const categoryTabs = document.querySelectorAll('.tab-btn');
    const priceFilter = document.getElementById('priceFilter');
    const stockFilter = document.getElementById('stockFilter');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productCards = document.querySelectorAll('.product-card');
    const noResults = document.getElementById('noResults');

    let currentCategory = 'all';

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const priceVal = priceFilter ? priceFilter.value : 'all';
        const stockVal = stockFilter ? stockFilter.value : 'all';

        let visibleCount = 0;

        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardPrice = parseFloat(card.getAttribute('data-price')) || 0;
            const cardStock = card.getAttribute('data-stock');
            const cardName = (card.getAttribute('data-name') || '').toLowerCase();
            const cardText = card.innerText.toLowerCase();

            // Category match
            const matchCategory = (currentCategory === 'all' || cardCategory === currentCategory);

            // Search query match
            const matchQuery = !query || cardName.includes(query) || cardText.includes(query);

            // Price match
            let matchPrice = true;
            if (priceVal === 'under-4') {
                matchPrice = cardPrice < 4.00;
            } else if (priceVal === '4-6') {
                matchPrice = cardPrice >= 4.00 && cardPrice <= 6.00;
            } else if (priceVal === 'over-6') {
                matchPrice = cardPrice > 6.00;
            }

            // Stock match
            let matchStock = true;
            if (stockVal === 'in-stock') {
                matchStock = (cardStock === 'in-stock');
            } else if (stockVal === 'popular') {
                matchStock = !!card.querySelector('.product-badge');
            }

            if (matchCategory && matchQuery && matchPrice && matchStock) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide empty state
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
    }

    // Category Tabs Click
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.getAttribute('data-category') || 'all';
            applyFilters();
        });
    });

    // Dropdowns Change
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (stockFilter) stockFilter.addEventListener('change', applyFilters);

    // Search Input Real-Time & Button
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
                const menuSec = document.getElementById('menu');
                if (menuSec) menuSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            applyFilters();
            const menuSec = document.getElementById('menu');
            if (menuSec) menuSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Expose resetFilters globally for button onclick
    window.resetFilters = function() {
        currentCategory = 'all';
        categoryTabs.forEach(t => {
            t.classList.toggle('active', t.getAttribute('data-category') === 'all');
        });
        if (searchInput) searchInput.value = '';
        if (priceFilter) priceFilter.value = 'all';
        if (stockFilter) stockFilter.value = 'all';
        applyFilters();
    };
});

// 4. Shopping Cart System & Toast Notification
let cartCount = 0;
let toastTimeout = null;

function addToCart(productName, price) {
    cartCount++;
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.classList.remove('pulse');
        // Trigger bounce animation reflow
        void cartCountEl.offsetWidth;
        cartCountEl.classList.add('pulse');
    }

    // Temporary button state feedback
    const event = window.event;
    if (event && event.currentTarget) {
        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = '<i class="fa fa-check"></i> Added';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = originalHtml;
        }, 1200);
    }

    // Show Toast
    showToast(`Added "${productName}" ($${price.toFixed(2)}) to your bag!`);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// 5. Newsletter Submission Handler
function handleNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    if (emailInput && emailInput.value) {
        showToast(`🎉 Welcome to Jing Coffee Club! Check ${emailInput.value} for your 20% discount code.`);
        emailInput.value = '';
    }
}
