// ===== SMOOTH SCROLL & ACTIVE NAV ===== 
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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Obserwuj wszystkie karty usług
document.querySelectorAll('.service-card, .service-item, .testimonial-card').forEach(element => {
    element.classList.add('scroll-animate');
    observer.observe(element);
});

// ===== FORM SUBMISSION ===== 
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Zbierz dane formularza
        const formData = new FormData(contactForm);
        const data = {
            name: contactForm.querySelector('input[placeholder="Imię"]').value,
            email: contactForm.querySelector('input[placeholder="E-mail"]').value,
            phone: contactForm.querySelector('input[placeholder="Telefon"]').value,
            address: contactForm.querySelector('input[placeholder="Adres"]').value,
            subject: contactForm.querySelector('input[placeholder="Temat"]').value,
            message: contactForm.querySelector('textarea').value
        };

        console.log('Wiadomość do wysłania:', data);
        
        // Pokaż potwierdzenie
        showNotification('Dziękujemy za przesłanie wiadomości! Wkrótce się skontaktujemy.', 'success');
        
        // Reset formularza
        contactForm.reset();
    });
}

// ===== NOTIFICATION SYSTEM ===== 
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const styles = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        background-color: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
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
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    });
    
    document.body.appendChild(notification);
    
    // Animacja wjazdu
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    notification.style.transition = 'all 0.3s ease-out';
    
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

// ===== SCROLL PROGRESS INDICATOR ===== 
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Opcjonalnie: możesz dodać visual progress bar
    // document.getElementById('progressBar').style.width = scrollPercent + '%';
});

// ===== HOVER EFFECT NA SERVICE CARDS ===== 
document.querySelectorAll('.service-card, .service-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = this.classList.contains('service-card') 
            ? 'translateY(-10px)' 
            : 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===== HEADER SCROLL EFFECT ===== 
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 20px rgba(220, 38, 38, 0.2)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===== LAZY LOAD IMAGES ===== 
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

console.log('FENIKS - Strona załadowana pomyślnie! 🚀');
