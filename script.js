// 🪶 Mobile menu toggle
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!toggle) return;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}
initMobileMenu();

// 🪶 Toast notifications via CSS class + data attribute
function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = 'notification';
    n.setAttribute('data-type', type);
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 4000);
}

// 🪶 Smooth scroll anchor links (native HTML behavior fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        t?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// 🪶 Scroll animations: fade in on viewport
const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            scrollObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.service-item, .portfolio-project').forEach(el => {
    el.classList.add('scroll-animate');
    scrollObserver.observe(el);
});

// 🪶 EmailJS config
emailjs.init("nJ5sH5Yz_HhR7t1X5");

// 🪶 Form validation: HTML5 + real-time feedback
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(input);
        });
    });
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const error = document.querySelector(`.form-error[data-field="${fieldName}"]`);
    let isValid = true;
    let msg = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        msg = 'To pole jest wymagane';
    } else if (field.type === 'email' && value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            msg = 'Podaj prawidłowy adres e-mail';
        }
    } else if (field.type === 'tel' && value) {
        if (!/^[\d\s\-\+\(\)]{9,}$/.test(value)) {
            isValid = false;
            msg = 'Podaj prawidłowy numer telefonu';
        }
    }
    
    field.classList.remove('invalid', 'valid');
    if (error) error.classList.remove('show');
    
    if (!isValid) {
        field.classList.add('invalid');
        if (error) {
            error.textContent = msg;
            error.classList.add('show');
        }
    } else if (value) {
        field.classList.add('valid');
    }
    
    return isValid;
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input[required], textarea[required], input[type="email"]').forEach(input => {
        if (!validateField(input)) isValid = false;
    });
    return isValid;
}

initFormValidation();

// 🪶 Contact form submission: validate, send email, show toast
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async e => {
        e.preventDefault();
        
        if (!validateForm(form)) {
            showNotification('Sprawdź czy wszystkie pola są prawidłowo wypełnione', 'info');
            return;
        }
        
        const btn = form.querySelector('button[type="submit"]');
        const text = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Wysyłanie...';
        
        try {
            await emailjs.send('service_feniks_contact', 'template_feniks_form', {
                user_name: form.querySelector('input[name="user_name"]').value,
                user_email: form.querySelector('input[name="user_email"]').value,
                user_phone: form.querySelector('input[name="user_phone"]').value,
                user_address: form.querySelector('input[name="user_address"]').value,
                subject: form.querySelector('input[name="subject"]').value,
                message: form.querySelector('textarea[name="message"]').value
            });
            
            showNotification('✓ Dziękujemy za przesłanie wiadomości! Wkrótce się skontaktujemy.', 'success');
            form.reset();
            form.querySelectorAll('input, textarea').forEach(f => f.classList.remove('valid', 'invalid'));
        } catch (err) {
            showNotification('Błąd wysyłania wiadomości. Spróbuj później lub skontaktuj się bezpośrednio: 663 335 998', 'info');
        } finally {
            btn.disabled = false;
            btn.textContent = text;
        }
    });
}

initContactForm();

// 🪶 Header shadow on scroll
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        const top = window.pageYOffset || document.documentElement.scrollTop;
        header.style.boxShadow = top > 100 
            ? '0 4px 20px rgba(220, 38, 38, 0.2)'
            : '0 2px 10px rgba(0, 0, 0, 0.5)';
    });
}

initHeaderScrollEffect();

// 🪶 Service modal: click to expand service details
function initServiceModal() {
    const modal = document.getElementById('serviceModal');
    const btn = document.getElementById('closeModal');
    const body = document.getElementById('modalBody');
    
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('.service-item-icon').textContent;
            const title = item.querySelector('h4').textContent;
            let desc = '';
            
            item.querySelectorAll('p, ul').forEach(el => {
                if (el.tagName === 'P') {
                    desc += `<p>${el.innerHTML}</p>`;
                } else if (el.tagName === 'UL') {
                    let html = '<ul style="margin: 10px 0 0 20px; padding-left: 0;">';
                    el.querySelectorAll('li').forEach(li => {
                        html += `<li>${li.textContent}</li>`;
                    });
                    desc += html + '</ul>';
                }
            });
            
            body.innerHTML = `<div class="modal-service-icon">${icon}</div><h3 class="modal-service-title">${title}</h3><div class="modal-service-description">${desc}</div>`;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    btn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

initServiceModal();

// 🪶 Portfolio gallery: load manifest, generate cards, init modal
let allProjects = [];

async function loadProjectsManifest() {
    try {
        const r = await fetch('projects-manifest.json');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        allProjects = (await r.json()).projects || [];
    } catch (e) {
        allProjects = [];
    }
}

function generatePortfolioCards() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    
    allProjects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'portfolio-project';
        card.setAttribute('data-project', p.id);
        const img = p.images?.[0] || '';
        
        card.innerHTML = `
            <div class="portfolio-image-container" ${img ? `style="background-image: url('${img}')"` : ''}>
                <div class="portfolio-overlay">
                    <h3>${p.title}</h3>
                    <p>Kliknij aby zobaczyć realizacje</p>
                </div>
            </div>
            <div class="portfolio-content">
                <h3>${p.title}</h3>
            </div>
            <div class="portfolio-gallery" style="display: none;">
            ${(p.images || []).map(img => `<img src="${img}" alt="${p.title}">`).join('')}
            </div>
        `;
        grid.appendChild(card);
    });
}

function initPortfolioGallery() {
    document.querySelectorAll('.portfolio-project').forEach(project => {
        project.addEventListener('click', () => {
            const imgs = Array.from(project.querySelector('.portfolio-gallery').querySelectorAll('img')).map(i => i.src);
            const title = project.querySelector('.portfolio-overlay h3').textContent;
            
            if (!imgs.length) return;
            
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <div class="gallery-modal-content">
                    <button class="gallery-close-btn">&times;</button>
                    <div class="gallery-container">
                        <div class="gallery-main">
                            <img src="${imgs[0]}" alt="${title}" class="gallery-main-image">
                        </div>
                        <div class="gallery-title"><h2>${title}</h2></div>
                        ${imgs.length > 1 ? `<div class="gallery-thumbnails">${imgs.map((i, idx) => `<img src="${i}" alt="Zdjęcie ${idx+1}" class="gallery-thumb${idx === 0 ? ' active' : ''}" data-index="${idx}">`).join('')}</div>` : ''}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            const main = modal.querySelector('.gallery-main-image');
            modal.querySelectorAll('.gallery-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const idx = thumb.dataset.index;
                    main.src = imgs[idx];
                    modal.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });
            
            const closeIt = () => {
                modal.remove();
                document.body.style.overflow = 'auto';
            };
            
            modal.querySelector('.gallery-close-btn').addEventListener('click', closeIt);
            modal.addEventListener('click', e => { if (e.target === modal) closeIt(); });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && modal.parentElement) closeIt();
            }, { once: true });
        });
    });
}

async function initPortfolio() {
    await loadProjectsManifest();
    generatePortfolioCards();
    initPortfolioGallery();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
