document.addEventListener('DOMContentLoaded', function() {
    // Add 3D tilt effect to the logo
    const logoCircle = document.querySelector('.logo-circle');
    const heroTitle = document.querySelector('.hero-title');
    
    // 3D tilt effect for logo
    document.addEventListener('mousemove', function(e) {
        if (!logoCircle) return;
        
        const x = e.clientX;
        const y = e.clientY;
        
        // Calculate the center of the viewport
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate the distance from the center (normalized)
        const distanceX = (x - centerX) / centerX;
        const distanceY = (y - centerY) / centerY;
        
        // Apply the tilt effect (max 15 degrees)
        const tiltX = distanceY * 15;
        const tiltY = -distanceX * 15;
        
        // Apply the transform with a smooth transition
        logoCircle.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    // Reset the tilt when mouse leaves the viewport
    document.addEventListener('mouseleave', function() {
        if (!logoCircle) return;
        logoCircle.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
    
    // Add glitch effect to the title occasionally
    if (heroTitle) {
        setInterval(function() {
            // Add glitch class
            heroTitle.classList.add('glitch-effect');
            
            // Remove glitch class after a short duration
            setTimeout(function() {
                heroTitle.classList.remove('glitch-effect');
            }, 200);
        }, 5000); // Trigger every 5 seconds
    }
});