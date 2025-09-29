// Scripts/passwords.js
// Works with backend if token exists, otherwise stores in-memory

(() => {
  const API_BASE = "http://localhost:5000/api/passwords";

  const state = {
    passwords: [],
    editingId: null,
    searchTerm: ""
  };

  document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const addPasswordBtn = document.getElementById("addPasswordBtn");
    const addFirstPasswordBtn = document.getElementById("addFirstPasswordBtn");
    const passwordModal = document.getElementById("passwordModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const passwordForm = document.getElementById("passwordForm");
    const passwordGrid = document.getElementById("passwordGrid");
    const emptyState = document.getElementById("emptyState");
    const categoryBtns = document.querySelectorAll(".category-btn");
    const closeDeleteModalBtn = document.getElementById("closeDeleteModalBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const deleteModal = document.getElementById("deleteModal");

    // Modal inputs
    const passwordIdInput = document.getElementById("passwordId");
    const websiteInput = document.getElementById("website");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const descriptionInput = document.getElementById("description");
    const categorySelect = document.getElementById("category");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const generatePasswordBtn = document.getElementById("generatePassword");
    const passwordStrengthBar = document.getElementById("passwordStrength");
    const strengthText = document.getElementById("strengthText");

    let currentFilter = "all";
    let idToDelete = null;
    
    // Search term from URL (e.g., passwords.html?search=bank)
    function getSearchTerm() {
      try {
        const params = new URLSearchParams(window.location.search);
        return (params.get("search") || "").trim();
      } catch (_) {
        return "";
      }
    }

    // Compute a simple relevance score for a password entry against a term
    function getMatchScore(entry, term) {
      if (!term) return 0;
      const t = term.toLowerCase();
      const website = String(entry.website || "").toLowerCase();
      const username = String(entry.username || "").toLowerCase();
      const description = String(entry.description || "").toLowerCase();
      const category = String(entry.category || "").toLowerCase();

      let score = 0;
      // Website priority: startsWith > includes
      if (website.startsWith(t)) score += 3;
      else if (website.includes(t)) score += 2;

      // Description: hashtag match gets extra weight
      if (description.includes(`#${t}`)) score += 2;
      else if (description.includes(t)) score += 1;

      // Username/app account
      if (username.includes(t)) score += 1;

      // Category exact match
      if (category === t) score += 1;

      return score;
    }

    // ---------- Helpers ----------
    function setEmptyStateVisibility() {
      if (!passwordGrid) return;
      if (passwordGrid.children.length === 0) {
        emptyState?.classList.remove("hidden");
        emptyState && (emptyState.style.display = "");
      } else {
        emptyState?.classList.add("hidden");
        emptyState && (emptyState.style.display = "none");
      }
    }

    function updatePasswordStrengthUI(pwd) {
      const strength = getPasswordStrength(pwd);
      let percent = 0;
      let color = "red";
      let text = "Weak";

      if (strength === "very-strong") { percent = 100; color = "green"; text = "Very Strong"; }
      else if (strength === "strong") { percent = 80; color = "green"; text = "Strong"; }
      else if (strength === "medium") { percent = 50; color = "yellow"; text = "Medium"; }
      else { percent = 25; color = "red"; text = "Weak"; }

      if (passwordStrengthBar) passwordStrengthBar.style.width = `${percent}%`;
      if (strengthText) {
        strengthText.textContent = text;
        strengthText.className = `strength-text`; // keep stable class; colors from styles
      }
    }

    function getPasswordStrength(password) {
      if (!password) return "weak";
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      let score = 0;
      if (password.length >= 12) score += 2;
      else if (password.length >= 8) score += 1;
      if (hasLower) score++;
      if (hasUpper) score++;
      if (hasNumber) score++;
      if (hasSpecial) score += 2;
      if (score >= 6) return "very-strong";
      if (score >= 5) return "strong";
      if (score >= 3) return "medium";
      return "weak";
    }

    function createCard(passwordObj) {
      const id = passwordObj._id || passwordObj.id || String(Date.now());
      const card = document.createElement("div");
      card.className = "password-card bg-white rounded-xl shadow-md overflow-hidden";
      card.dataset.category = passwordObj.category || "personal";
      card.dataset.id = id;

      // Escape text simple
      const website = (passwordObj.website || "").replace(/</g, "&lt;");
      const username = (passwordObj.username || "").replace(/</g, "&lt;");
      const description = (passwordObj.description || "").replace(/</g, "&lt;");

      card.innerHTML = `
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-xl font-bold text-gray-800">${website}</h3>
              ${username ? `<p class="text-gray-600 mt-1">${username}</p>` : ""}
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-gray-200">${card.dataset.category}</span>
          </div>

          <div class="mt-4 flex items-center">
            <input type="password" value="${passwordObj.password || ""}" class="password-display flex-grow px-3 py-2 bg-gray-100 rounded-lg text-gray-800 font-mono" readonly>
            <button class="toggle-password-btn ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" aria-label="Toggle password">
              <i class="bi bi-eye"></i>
            </button>
          </div>

          ${description ? `<div class="mt-3 bg-gray-50 p-2 rounded-lg"><p class="text-sm text-gray-700 description-text">${description}</p></div>` : ""}

          <div class="mt-6 flex justify-end space-x-2">
            <button class="edit-btn px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" data-id="${id}">
              <i class="bi bi-edit mr-1"></i> Edit
            </button>
            <button class="delete-btn px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" data-id="${id}">
              <i class="bi bi-trash mr-1"></i> Delete
            </button>
          </div>
        </div>
      `;

      // toggle password visibility for this card
      const toggleBtn = card.querySelector(".toggle-password-btn");
      const pwdInput = card.querySelector(".password-display");
      toggleBtn.addEventListener("click", () => {
        if (pwdInput.type === "password") {
          pwdInput.type = "text";
          toggleBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
        } else {
          pwdInput.type = "password";
          toggleBtn.innerHTML = '<i class="bi bi-eye"></i>';
        }
      });

      // edit
      card.querySelector(".edit-btn").addEventListener("click", () => openPasswordModal(id));
      // delete
      card.querySelector(".delete-btn").addEventListener("click", () => openDeleteModal(id));

      return card;
    }

    // ---------- Backend helpers ----------
    function getUserIdFromToken() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload?.id || payload?._id || null;
      } catch (_) {
        return null;
      }
    }

    async function fetchFromAPI() {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const userId = getUserIdFromToken();
      if (!userId) return null;
      try {
        const res = await fetch(`${API_BASE}/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Fetch failed");
        return await res.json();
      } catch (err) {
        console.warn("API fetch error:", err);
        return null;
      }
    }

    async function saveToAPI(data, id = null, method = "POST") {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Missing user id");
      const payload = { ...data, userId };
      const url = id ? `${API_BASE}/${id}` : API_BASE;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Save failed");
      return await res.json();
    }

    async function deleteFromAPI(id) {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Delete failed");
      return true;
    }

    // ---------- Core ----------

    async function fetchPasswords() {
      // try backend first
      const apiData = await fetchFromAPI();
      if (apiData && Array.isArray(apiData)) {
        state.passwords = apiData;
      } else {
        // no token or API failed: keep existing in-memory state (already in state.passwords)
      }
      renderPasswords();
    }

    function renderPasswords() {
      passwordGrid.innerHTML = "";
      const term = state.searchTerm;
      // First apply category filter
      let items = state.passwords.filter(p => (currentFilter === "all" ? true : p.category === currentFilter));

      // If searching, filter to matches and sort by relevance
      if (term) {
        items = items
          .map(p => ({ p, score: getMatchScore(p, term) }))
          .filter(x => x.score > 0)
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            // secondary: alphabetic by website
            const aw = (a.p.website || "").toLowerCase();
            const bw = (b.p.website || "").toLowerCase();
            return aw.localeCompare(bw);
          })
          .map(x => x.p);
      }

      items.forEach(p => {
        passwordGrid.appendChild(createCard(p));
      });
      setEmptyStateVisibility();
    }

    function openPasswordModal(id = null) {
      state.editingId = id;
      passwordIdInput.value = id || "";
      if (id) {
        const p = state.passwords.find(x => (x._id === id || x.id === id || String(x._id) === id));
        if (p) {
          websiteInput.value = p.website || "";
          usernameInput.value = p.username || "";
          passwordInput.value = p.password || "";
          descriptionInput.value = p.description || "";
          categorySelect.value = p.category || "social";
          updatePasswordStrengthUI(passwordInput.value);
        }
      } else {
        passwordForm.reset();
        passwordIdInput.value = "";
        updatePasswordStrengthUI("");
      }
      passwordModal.classList.remove("modal-hidden");
    }

    function closePasswordModal() {
      passwordModal.classList.add("modal-hidden");
    }

    function openDeleteModal(id) {
      idToDelete = id;
      deleteModal.classList.remove("modal-hidden");
    }

    function closeDeleteModal() {
      idToDelete = null;
      deleteModal.classList.add("modal-hidden");
    }

    // ---------- Form handlers ----------
    passwordForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        website: websiteInput.value.trim(),
        username: usernameInput.value.trim(),
        password: passwordInput.value,
        category: categorySelect.value,
        description: descriptionInput.value.trim(),
        strength: getPasswordStrength(passwordInput.value)
      };

      try {
        const token = localStorage.getItem("token");
        if (token) {
          // use API
          if (state.editingId) {
            await saveToAPI(payload, state.editingId, "PUT");
          } else {
            await saveToAPI(payload, null, "POST");
          }
          await fetchPasswords();
        } else {
          // fallback to local in-memory
          if (state.editingId) {
            const idx = state.passwords.findIndex(x => (x._id === state.editingId || x.id === state.editingId));
            if (idx >= 0) state.passwords[idx] = { ...state.passwords[idx], ...payload, _id: state.passwords[idx]._id || state.passwords[idx].id };
          } else {
            state.passwords.push({ ...payload, _id: String(Date.now()) });
          }
          renderPasswords();
        }
        closePasswordModal();
      } catch (err) {
        console.error("Save error:", err);
        alert("Error saving password: " + (err.message || err));
      } finally {
        state.editingId = null;
      }
    });

    confirmDeleteBtn?.addEventListener("click", async () => {
      if (!idToDelete) return;
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await deleteFromAPI(idToDelete);
          await fetchPasswords();
        } else {
          state.passwords = state.passwords.filter(x => (x._id !== idToDelete && x.id !== idToDelete));
          renderPasswords();
        }
        closeDeleteModal();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting password");
      }
    });

    // ---------- UI control listeners ----------
    if (addPasswordBtn) addPasswordBtn.addEventListener("click", () => openPasswordModal());
    if (addFirstPasswordBtn) addFirstPasswordBtn.addEventListener("click", () => openPasswordModal());
    if (closeModalBtn) closeModalBtn.addEventListener("click", () => closePasswordModal());
    if (cancelBtn) cancelBtn.addEventListener("click", () => closePasswordModal());
    if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener("click", () => closeDeleteModal());
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", () => closeDeleteModal());

    // category buttons
    categoryBtns.forEach(b => {
      b.addEventListener("click", () => {
        categoryBtns.forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        currentFilter = b.dataset.category || "all";
        renderPasswords();
      });
    });

    // removed '+new' category toggle: always use select

    // toggle modal password visibility
    togglePasswordBtn?.addEventListener("click", () => {
      if (!passwordInput) return;
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
      } else {
        passwordInput.type = "password";
        togglePasswordBtn.innerHTML = '<i class="bi bi-eye"></i>';
      }
    });

    // generate password
    generatePasswordBtn?.addEventListener("click", () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
      let p = '';
      for (let i = 0; i < 12; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
      passwordInput.value = p;
      updatePasswordStrengthUI(p);
    });

    // strength meter update
    passwordInput?.addEventListener("input", () => updatePasswordStrengthUI(passwordInput.value));

    // --- Inline search integration with navbar ---
    // Initialize search term from URL
    state.searchTerm = getSearchTerm();

    // Hook into navbar search input for immediate filtering (no navigation required)
    const navbarSearchInput = document.getElementById("navbar-search-input");
    if (navbarSearchInput) {
      const updateSearch = () => {
        const term = navbarSearchInput.value.trim();
        state.searchTerm = term;
        // Reflect term in URL without reload
        const base = window.location.pathname.split("/").pop() || "passwords.html";
        const qs = term ? `?search=${encodeURIComponent(term)}` : "";
        window.history.replaceState(null, "", `${base}${qs}`);
        renderPasswords();
      };
      navbarSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          updateSearch();
        }
      });
      // Optional: live filter while typing after small delay
      let searchTypingTimer;
      navbarSearchInput.addEventListener("input", () => {
        clearTimeout(searchTypingTimer);
        searchTypingTimer = setTimeout(updateSearch, 200);
      });
    }

    // Respond to browser navigation (back/forward)
    window.addEventListener("popstate", () => {
      state.searchTerm = getSearchTerm();
      renderPasswords();
    });

    // initial load
    fetchPasswords();
  });
})();
