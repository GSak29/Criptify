// Authentication related functionality

// ✅ Helper: check login status
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// ✅ Helper: set login status
function setLoginStatus(status) {
    localStorage.setItem('isLoggedIn', status);
    updateNavbarVisibility();
    updateGetStartedButton();
}

// ✅ Update button text
function updateGetStartedButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        if (isLoggedIn()) {
            loginBtn.textContent = 'Enter Dashboard ⇒';
        } else {
            loginBtn.textContent = 'Get Started ⇒';
        }
    }
}

// ✅ Update navbar
function updateNavbarVisibility() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        if (isLoggedIn()) {
            navLinks.style.display = 'flex';
        } else {
            const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
            navLinks.style.display = isIndexPage ? 'none' : 'none';
        }
    }
}

// ✅ API functions (now supports email + confirmPassword)
async function signupUser(username, email, password, confirmPassword) {
    try {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, confirmPassword }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    } catch (err) {
        console.error("Signup error:", err);
        return { error: err.message || "Network error" };
    }
}

async function loginUser(email, password) {
    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    } catch (err) {
        console.error("Login error:", err);
        return { error: err.message || "Network error" };
    }
}

function parseJwt(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        return JSON.parse(json);
    } catch (_) {
        return null;
    }
}

async function fetchCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error("Fetch current user error:", err);
        return null;
    }
}

// ✅ DOMContentLoaded: modal handling + form submission
document.addEventListener('DOMContentLoaded', function() {
    updateNavbarVisibility();
    updateGetStartedButton();

    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');
    const isMainPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');

    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupLink = document.getElementById('signupLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const loginLink = document.getElementById('loginLink');

    // ✅ Handle Get Started button
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (isLoggedIn()) {
                window.location.href = 'passwords.html';
            } else {
                loginModal.style.display = 'flex';
            }
        });
    }

    // ✅ Close modals
    if (closeLoginModal) closeLoginModal.addEventListener('click', e => { e.preventDefault(); loginModal.style.display = 'none'; });
    if (closeSignupModal) closeSignupModal.addEventListener('click', e => { e.preventDefault(); signupModal.style.display = 'none'; });

    // ✅ Switch modals
    if (signupLink) signupLink.addEventListener('click', e => { e.preventDefault(); loginModal.style.display = 'none'; signupModal.style.display = 'flex'; });
    if (loginLink) loginLink.addEventListener('click', e => { e.preventDefault(); signupModal.style.display = 'none'; loginModal.style.display = 'flex'; });

    // ✅ Close on outside click
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === signupModal) signupModal.style.display = 'none';
    });

    // ✅ Login form with backend call
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('username').value; // ✅ Treat username field as email input
            const password = document.getElementById('password').value;

            const result = await loginUser(email, password);
            if (result.error) { showUIAlert(result.error, 'error'); return; }

            if (result.token) {
                localStorage.setItem('token', result.token);
                setLoginStatus(true);
                // Prefer backend-provided username for greeting
                const payload = parseJwt(result.token);
                const profile = await fetchCurrentUser();
                const primaryName = (result.username || payload?.username || profile?.username || '').trim();
                const fallbackName = (email && email.includes('@')) ? email.split('@')[0] : (email || '').trim();
                const displayName = primaryName || fallbackName || 'User';
                showWelcomePopup(`Welcome ${displayName}`, 'Login successful');
                if (isMainPage && loginModal) loginModal.style.display = 'none';
                else if (isAuthPage) window.location.href = 'index.html';
            } else {
                showUIAlert('Invalid credentials!', 'error');
            }
        });
    }

    // ✅ Signup form with backend call
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value;
            const email = document.getElementById('email').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                showUIAlert('Passwords do not match!', 'error');
                return;
            }

            const result = await signupUser(newUsername, email, newPassword, confirmPassword);
            if (result.error) { showUIAlert(result.error, 'error'); return; }

            localStorage.setItem('token', result.token); // ✅ Store JWT
            setLoginStatus(true);
            const displayName = (newUsername || '').trim();
            showWelcomePopup(`Welcome, ${displayName}!`, 'Signup successful');
            if (isMainPage && signupModal) signupModal.style.display = 'none';
            else if (isAuthPage) window.location.href = 'index.html';
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset functionality would be implemented here.');
        });
    }
});
    // 👁️ Password visibility toggles
    function attachEyeToggle(inputId, btnId) {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if (!input || !btn) return;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = '<i class="bi bi-eye-slash"></i>';
            } else {
                input.type = 'password';
                btn.innerHTML = '<i class="bi bi-eye"></i>';
            }
        });
    }

    attachEyeToggle('password', 'toggleLoginPassword');
    attachEyeToggle('newPassword', 'toggleSignupPassword');
    attachEyeToggle('confirmPassword', 'toggleConfirmPassword');
    // Inline password mismatch error for signup
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    function updateConfirmMismatch() {
        if (!newPasswordInput || !confirmPasswordInput || !confirmPasswordError) return;
        const a = newPasswordInput.value;
        const b = confirmPasswordInput.value;
        const show = b.length > 0 && a !== b;
        confirmPasswordError.classList.toggle('hidden', !show);
        confirmPasswordError.classList.toggle('visible', show);
    }
    if (newPasswordInput && confirmPasswordInput) {
        newPasswordInput.addEventListener('input', updateConfirmMismatch);
        confirmPasswordInput.addEventListener('input', updateConfirmMismatch);
    }

    // Themed UI alerts and welcome popup helpers
    function showUIAlert(message, type = 'error') {
        const containerId = 'ui-alert-container';
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'ui-alert-container';
            document.body.appendChild(container);
        }
        const alertEl = document.createElement('div');
        alertEl.className = `ui-alert ${type}`;
        alertEl.innerText = message;
        container.appendChild(alertEl);
        setTimeout(() => {
            alertEl.classList.add('hide');
            setTimeout(() => alertEl.remove(), 300);
        }, 3000);
    }

    function showWelcomePopup(title = 'Welcome!', message = 'Login successful') {
        function escapeHTML(str) {
            return String(str).replace(/[&<>"']/g, (s) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[s]);
        }
        const overlay = document.createElement('div');
        overlay.className = 'ui-popup';
        const card = document.createElement('div');
        card.className = 'ui-card';
        const safeTitle = escapeHTML(title);
        const safeMessage = escapeHTML(message);
        card.innerHTML = `
            <div class="ui-card-header">
                <i class="bi bi-shield-lock"></i>
                <h3>${safeTitle}</h3>
            </div>
            <p class="ui-card-message">${safeMessage}</p>
            <button class="ui-card-close">Close</button>
        `;
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        const closeBtn = card.querySelector('.ui-card-close');
        const close = () => overlay.remove();
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        setTimeout(close, 2500);
    }
