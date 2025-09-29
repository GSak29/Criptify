// navbar.js - Reusable navbar component

document.addEventListener('DOMContentLoaded', function() {
    // Create the navbar element
    const createNavbar = () => {
        const navbar = document.createElement('nav');
        navbar.className = 'navbar';
        navbar.innerHTML = `
            <div class="logo-container">
                <div class="logo-icon">
                    <img src="Img/4.png" alt="CRIPTIFY Logo" id="nav-logo">
                </div>
                <span class="logo-text">CRIPTIFY</span>
            </div>
            
            <div class="nav-links">
                <a href="#" class="nav-link back-link"><i class="bi bi-arrow-left-square"></i></a>
                <a href="index.html" class="nav-link"><i class="bi bi-house"></i></a>
                <a href="about.html" class="nav-link"><i class="bi bi-info-circle"></i></a>
                <a href="passwords.html" class="nav-link"><i class="bi bi-box"></i></a>
                </div>
            
            <div class="nav-right">
                <div class="search-bar">
                    <i class="bi bi-search"></i>
                    <input type="text" placeholder="Search..." class="search-input" id="navbar-search-input">
                </div>
                
                <button id="theme-toggle" class="theme-toggle">
                    <i class="bi bi-moon"></i>
                </button>
                
                <button class="mobile-menu-btn">
                    <i class="bi bi-list text-2xl"></i>
                </button>
            </div>
        `;
        return navbar;
    };

    // Insert the navbar into the body
    const insertNavbar = () => {
        const body = document.body;
        
        // Create the navbar
        const navbar = createNavbar();
        
        // Append the navbar to the body instead of inserting it at the beginning
        // This ensures modals with higher z-index will appear above the navbar
        body.appendChild(navbar);
        
        // Initialize theme toggle functionality
        initThemeToggle();
        
        // Hide nav links by default on index.html if not logged in
        const navLinks = navbar.querySelector('.nav-links');
        const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
        const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (navLinks && isIndexPage && !isUserLoggedIn) {
            navLinks.style.display = 'none';
        }
    };
    
    // Initialize theme toggle button functionality
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', newTheme);
                
                // Update icon
                const icon = themeToggle.querySelector('i');
                
                // Update logo images
                const logoInNav = document.querySelector('.logo-icon img');
                const logoInHero = document.querySelector('.logo-circle img');
                
                if (newTheme === 'dark') {
                    icon.className = 'bi bi-moon';
                    if (logoInNav) logoInNav.src = 'Img/2.png';
                    if (logoInHero) logoInHero.src = 'Img/2.png';
                } else {
                    icon.className = 'bi bi-sun';
                    if (logoInNav) logoInNav.src = 'Img/4.png';
                    if (logoInHero) logoInHero.src = 'Img/4.png';
                }
                
                // Save preference
                localStorage.setItem('theme', newTheme);
            });
        }
    };
    
    // Initialize logo images based on current theme
    const initLogoImages = () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const logoInNav = document.querySelector('.logo-icon img');
        const logoInHero = document.querySelector('.logo-circle img');
        
        if (currentTheme === 'dark') {
            if (logoInNav) logoInNav.src = 'Img/2.png';
            if (logoInHero) logoInHero.src = 'Img/2.png';
        } else {
            if (logoInNav) logoInNav.src = 'Img/4.png';
            if (logoInHero) logoInHero.src = 'Img/4.png';
        }
    };
    
    // Initialize search functionality
    const initSearchNavigation = () => {
        const searchInput = document.getElementById('navbar-search-input');
        if (!searchInput) return;

        const navigateWithSearch = () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `passwords.html?search=${encodeURIComponent(searchTerm)}`;
            }
        };

        // Use keydown (keypress is deprecated and unreliable across browsers)
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                navigateWithSearch();
            }
        });

        // Optional: trigger search if user clicks the search icon while input has value
        const searchBar = searchInput.closest('.search-bar');
        if (searchBar) {
            searchBar.addEventListener('click', function(e) {
                const iconClicked = e.target && (e.target.tagName === 'I' || e.target.classList.contains('bi-search'));
                if (iconClicked && searchInput.value.trim()) {
                    navigateWithSearch();
                }
            });
        }
    };
    
    // Initialize back button functionality
    const initBackButton = () => {
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            backLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.history.back();
            });
        }
    };
    
    // Add logout functionality to the navbar
    const addLogoutButton = () => {
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right"></i>';
            logoutBtn.addEventListener('click', function() {
                // Clear login status
                if (typeof setLoginStatus === 'function') {
                    setLoginStatus(false);
                } else {
                    localStorage.setItem('isLoggedIn', 'false');
                    // Manually update navbar visibility if function not available
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks) {
                        navLinks.style.display = 'none';
                    }
                }
                
                // Redirect to home page
                window.location.href = 'index.html';
            });
            
            // Add logout button only if user is logged in
            if (localStorage.getItem('isLoggedIn') === 'true') {
                navRight.appendChild(logoutBtn);
            }
        }
    };
    
    // Call the functions to insert navbar and initialize logo images
    insertNavbar();
    
    // Wait a moment for the DOM to fully update before initializing logo images and search
    setTimeout(() => {
        initLogoImages();
        initSearchNavigation();
        initBackButton();
        addLogoutButton();
    }, 100);
});