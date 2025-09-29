        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        const themeIcon = themeToggle.querySelector('i');
        const logoInNav = document.querySelector('.logo-icon img');
        const logoInHero = document.querySelector('.logo-circle img');
        
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                themeIcon.classList.remove('bi-moon');
                themeIcon.classList.add('bi-sun');
                logoInNav.src = 'Img/4.png';
                logoInHero.src = 'Img/4.png';
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('bi-sun');
                themeIcon.classList.add('bi-moon');
                logoInNav.src = 'Img/2.png';
                logoInHero.src = 'Img/2.png';
            }
        });
        
        // Matrix Background Effect
        function createMatrixBackground() {
            const container = document.getElementById('matrix-container');
            const chars = '01';
            const columns = Math.floor(window.innerWidth / 20);
            
            for (let i = 0; i < columns; i++) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.style.left = `${i * 20}px`;
                char.style.animationDuration = `${Math.random() * 10 + 10}s`;
                char.style.animationDelay = `${Math.random() * 5}s`;
                char.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
                container.appendChild(char);
            }
        }
        
        // Initialize Matrix Background
        createMatrixBackground();
        
        // Mobile menu toggle (placeholder)
        document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
            alert('Mobile menu would open here');
        });