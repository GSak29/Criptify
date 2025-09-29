// About page component and data

document.addEventListener('DOMContentLoaded', function() {
    // Team members data
    const teamMembers = [
        {
            name: "Guru Sakthi S",
            role: "Frontend Developer",
            bio: "HTML, CSS and JavaScript expert with focus on responsive design and user experience.",
            avatar: "<i class=\"bi bi-person-circle\"></i>",
            contacts: {
                linkedin: "https://www.linkedin.com/in/gsak2985",
                github: "https://github.com/GSak29",
                instagram: "https://www.instagram.com/_.sakthi.29._/?__pwa=1#",
                gmail: "gsak0298@gmail.com",
                phone: "tel:+916374425918"
            }
        },
        {
            name: "Karthikeyan G",
            role: "Backend Developer",
            bio: "MongoDB specialist with expertise in secure database systems and API development.",
            avatar: "<i class=\"bi bi-person-circle\"></i>",
            contacts: {
                linkedin: "https://www.linkedin.com/in/karthikeyan-g-391558349?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
                github: "https://github.com/KARTHI-096",
                instagram: "https://www.instagram.com/_karthikeyan_714_?igsh=MW93cjh2cG4wbHRtbA%3D%3D&utm_source=qr",
                gmail: "karthikeyang.23ece@kongu.edu",
                phone: "tel:+916381343978"
            }
        },
        {
            name: "Hari Prasaath P",
            role: "UI/UX Designer",
            bio: "Design specialist focused on creating intuitive interfaces for password management systems.",
            avatar: "<i class=\"bi bi-person-circle\"></i>",
            contacts: {
                linkedin: "https://www.linkedin.com/in/hari-prasaath-270621357?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                github: "https://github.com/Hari-P-12",
                instagram: "https://www.instagram.com/kongu_harish_9",
                gmail: "hariprasaathp.23ece@kongu.edu",
                phone: "tel:+919025369127"
            }
        }
    ];

    // Features/offerings data
    const features = [
        { icon: "<i class=\"bi bi-shield-check\"></i>", text: "Secure, user-friendly platform for password management" },
        { icon: "<i class=\"bi bi-lock\"></i>", text: "Strong encryption for safe credential storage" },
        { icon: "<i class=\"bi bi-people\"></i>", text: "Clean interface for easy password management" },
        { icon: "<i class=\"bi bi-globe\"></i>", text: "Seamless storage features for all your credentials" }
    ];

    // Render team members
    function renderTeamMembers() {
        const teamGrid = document.querySelector('.team-grid');
        if (!teamGrid) return;
        
        // Clear existing content
        teamGrid.innerHTML = '';
        
        // Add team members as flip contact cards
        teamMembers.forEach(member => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Contact card for ${member.name}`);
            const phoneDisplay = (member.contacts?.phone || '').replace(/^tel:/, '');
            card.innerHTML = `
                <div class="contact-inner">
                    <div class="card-face front">
                        <div class="contact-avatar">${member.avatar}</div>
                        <h3 class="contact-title">${member.name}</h3>
                        <p class="contact-role">${member.role}</p>
                        <p class="contact-prompt">Tap or click to view other contacts</p>
                    </div>
                    <div class="card-face back">
                        <div>
                            <h4 class="back-title">Connect</h4>
                            <ul class="contact-links">
                                <li><a class="contact-link" href="${member.contacts.phone}"><i class="fa-solid fa-phone"></i> ${phoneDisplay}</a></li>
                                <li><a class="contact-link" href="${member.contacts.linkedin}" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
                                <li><a class="contact-link" href="${member.contacts.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a></li>
                                <li><a class="contact-link" href="${member.contacts.instagram}" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> Instagram</a></li>
                                <li><a class="contact-link" href="${member.contacts.gmail}"><i class="fa-solid fa-envelope"></i> Gmail</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            teamGrid.appendChild(card);
        });
    }

    // Render features/offerings
    function renderFeatures() {
        const featuresList = document.querySelector('.about-list');
        if (!featuresList) return;
        
        // Clear existing content
        featuresList.innerHTML = '';
        
        // Add features
        features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.innerHTML = `
                <span class="list-icon">${feature.icon}</span>
                ${feature.text}
            `;
            featuresList.appendChild(featureItem);
        });
    }

    // Add animation to about sections
    function addSectionAnimations() {
        const sections = document.querySelectorAll('.about-content, .team-section, .cta-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Initialize about page
    function initAboutPage() {
        renderTeamMembers();
        renderFeatures();
        addSectionAnimations();
        
        // Add event listeners for CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-buttons button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                // For demo purposes, just log the action
                console.log(`Button clicked: ${this.textContent.trim()}`);
                // In a real app, this would navigate or open a modal
            });
        });

        // Flip interaction for contact cards
        const teamGrid = document.querySelector('.team-grid');
        if (teamGrid) {
            teamGrid.addEventListener('click', function(event) {
                const card = event.target.closest('.contact-card');
                if (!card) return;
                // Ignore clicks on actual contact links and number
                if (event.target.closest('.contact-link, .contact-number')) return;
                // Unflip other cards
                document.querySelectorAll('.contact-card').forEach(other => {
                    if (other !== card) other.classList.remove('flipped');
                });
                card.classList.toggle('flipped');
                void card.offsetWidth; // Force reflow for smooth animation
            });

            // Keyboard accessibility: Enter/Space to flip
            teamGrid.addEventListener('keydown', function(event) {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                const card = event.target.closest('.contact-card');
                if (!card) return;
                // Ignore keyboard flip when focused on links
                if (event.target.closest('.contact-link, .contact-number')) return;
                event.preventDefault();
                document.querySelectorAll('.contact-card').forEach(other => {
                    if (other !== card) other.classList.remove('flipped');
                });
                card.classList.toggle('flipped');
            });
        }
    }

    // Initialize the about page
    initAboutPage();
});