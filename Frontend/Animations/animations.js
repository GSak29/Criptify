// Initialize all animations
document.addEventListener('DOMContentLoaded', function() {
    // Create particles
    createParticles();
});

// Create floating particles
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 3px and 8px
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Random animation duration
        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

// Enhance matrix effect
function enhanceMatrixEffect() {
    const container = document.getElementById('matrix-container');
    const existingChars = container.querySelectorAll('.matrix-char');
    
    // Add more matrix characters
    const additionalChars = 20;
    const chars = '01';
    
    for (let i = 0; i < additionalChars; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.style.left = `${Math.random() * 100}vw`;
        char.style.animationDuration = `${Math.random() * 10 + 10}s`;
        char.style.animationDelay = `${Math.random() * 5}s`;
        char.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
        container.appendChild(char);
    }
}

// Call enhanceMatrixEffect after a short delay
setTimeout(enhanceMatrixEffect, 1000);