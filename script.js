// ===== NOTIFICATION SYSTEM =====
/**
 * System powiadomień - wyświetla notyfikacje na dole ekranu
 * Obsługuje typy: 'success' (zielony) i 'info' (niebieski)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#dc2626' : '#3b82f6',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        opacity: '0',
        transform: 'translateX(100px)',
        transition: 'all 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Animacja wjazdu
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Usuń po 4 sekundach
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== SMOOTH SCROLL & ACTIVE NAV =====
/**
 * Smooth scroll do sekcji przy kliknięciu na linki nawigacyjne
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
/**
 * Obserwuje elementy i dodaje animacji gdy wjeżdżają w viewport
 * Obsługuje: service-card, service-item, testimonial-card
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-item, .testimonial-card').forEach(element => {
    element.classList.add('scroll-animate');
    scrollObserver.observe(element);
});

// ===== HOVER EFFECT NA SERVICE CARDS =====
/**
 * Dodaje efekt uniesienia karty przy najechaniu myszą
 */
function initHoverEffects() {
    // Hover effect jest teraz obsługiwany przez CSS
}

initHoverEffects();

// ===== FORM SUBMISSION =====
/**
 * Obsługuje wysyłanie formularza kontaktowego
 * Zbiera dane i wyświetla potwierdzenie
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const data = {
                name: contactForm.querySelector('input[placeholder="Imię"]').value,
                email: contactForm.querySelector('input[placeholder="E-mail"]').value,
                phone: contactForm.querySelector('input[placeholder="Telefon"]').value,
                address: contactForm.querySelector('input[placeholder="Adres"]').value,
                subject: contactForm.querySelector('input[placeholder="Temat"]').value,
                message: contactForm.querySelector('textarea').value
            };

            console.log('Wiadomość do wysłania:', data);
            showNotification('Dziękujemy za przesłanie wiadomości! Wkrótce się skontaktujemy.', 'success');
            contactForm.reset();
        });
    }
}

initContactForm();

// ===== HEADER SCROLL EFFECT =====
/**
 * Zmienia shadow headera w zależności od pozycji scrollu
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(220, 38, 38, 0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        }
    });
}

initHeaderScrollEffect();

// ===== LAZY LOAD IMAGES =====
/**
 * Leniwi ładuje obrazy gdy pojawiają się w widoku
 * Wymaga atrybutu data-src na obrazach
 */
function initLazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
    }
}

initLazyLoadImages();

// ===== SERVICE MODAL =====
/**
 * Modal do wyświetlania pełnego opisu usługi po kliknięciu
 * Pokazuje blur background i rozszerzającą się kartę
 */
function initServiceModal() {
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    
    // Otwórz modal przy kliknięciu na usługę
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', function() {
            const icon = this.querySelector('.service-item-icon').textContent;
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            
            modalBody.innerHTML = `
                <div class="modal-service-icon">${icon}</div>
                <h3 class="modal-service-title">${title}</h3>
                <p class="modal-service-description">${description}</p>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scrolling
        });
    });
    
    // Zamknij modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Zamknij na ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

initServiceModal();

// ===== INIT & LOG =====
console.log('FENIKS - Strona załadowana pomyślnie! 🚀');
