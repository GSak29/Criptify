document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const logoCircle = document.querySelector('.logo-circle');
    const heroTitle = document.querySelector('.hero-title');
    
    // Add subtle hover effect to logo
    if (logoCircle) {
        logoCircle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        logoCircle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'all 0.3s ease';
        });
    }
    
    // Add subtle hover effect to title
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px var(--accent-color), 0 0 30px rgba(0, 255, 255, 0.7)';
            this.style.transition = 'all 0.3s ease';
        });
        
        heroTitle.addEventListener('mouseleave', function() {
            // Let the animation take over again
            this.style.textShadow = '';
            this.style.transition = 'all 0.3s ease';
        });
    }
    
    // Add occasional pulse effect to logo
    if (logoCircle) {
        setInterval(function() {
            logoCircle.classList.add('extra-pulse');
            
            setTimeout(function() {
                logoCircle.classList.remove('extra-pulse');
            }, 1000);
        }, 5000); // Every 5 seconds
    }
});