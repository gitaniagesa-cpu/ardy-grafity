/**
 * Ardy_grafity Design & Printing Services - Main JavaScript
 * This file handles all interactive elements and animations for the website.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Navbar Scroll Effect
    // ==========================================
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 2. Mobile Hamburger Menu
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 3. Smooth Scroll
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 4. Active Nav Link on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.scrollY;
        const navbarHeight = navbar ? navbar.offsetHeight : 80;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 50;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    // ==========================================
    // 5. Scroll Reveal Animations
    // ==========================================
    const revealTargets = ['.service-card', '.feature-card', '.stat-card', '.portfolio-item', '.contact-item', '.about-text', '.contact-form'];
    revealTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (!el.classList.contains('reveal')) el.classList.add('reveal');
            
            // Add staggered delay loosely based on element order
            if (!el.classList.contains('reveal-delay-1') && 
                !el.classList.contains('reveal-delay-2') && 
                !el.classList.contains('reveal-delay-3') && 
                !el.classList.contains('reveal-delay-4')) {
                const delay = (index % 4) + 1;
                el.classList.add(`reveal-delay-${delay}`);
            }
        });
    });

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ==========================================
    // 6. Statistics Counter Animation
    // ==========================================
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const easeOutQuad = t => t * (2 - t);
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = easeOutQuad(progress);
            
            const currentVal = Math.floor(easeProgress * (end - start) + start);
            obj.innerHTML = currentVal + (end === 100 ? '%' : '+');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statOptions = {
        threshold: 0.5
    };
    
    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateValue(counter, 0, target, 2000);
                });
                observer.unobserve(entry.target);
            }
        });
    }, statOptions);

    document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

    // ==========================================
    // 7. & 8. Filtering (Services & Portfolio)
    // ==========================================
    const setupFilter = (btnSelector, itemSelector, itemCategoryAttr) => {
        const buttons = document.querySelectorAll(btnSelector);
        const items = document.querySelectorAll(itemSelector);
        
        if (!buttons.length || !items.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state on buttons
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter') || btn.getAttribute('data-category');
                
                items.forEach(item => {
                    const itemCategory = item.getAttribute(itemCategoryAttr);
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        // Small timeout to allow display block to apply before transition
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.transform = 'scale(0.8)';
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300); // matches expected CSS transition duration
                    }
                });
            });
        });
    };

    setupFilter('.category-btn', '.service-card', 'data-category');
    setupFilter('.filter-btn', '.portfolio-item', 'data-category');

    // ==========================================
    // 9. Portfolio Lightbox
    // ==========================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (portfolioItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-close">&times;</div>
            <div class="lightbox-content"></div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const bg = window.getComputedStyle(item).backgroundImage;
                lightboxContent.style.backgroundImage = bg;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }

    // ==========================================
    // 10. Testimonial Slider
    // ==========================================
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (track && dots.length > 0) {
        let currentSlide = 0;
        const slideCount = dots.length;
        let slideInterval;
        
        const goToSlide = (index) => {
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        };
        
        const nextSlide = () => {
            goToSlide((currentSlide + 1) % slideCount);
        };
        
        const startSlider = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };
        
        const stopSlider = () => {
            clearInterval(slideInterval);
        };
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopSlider();
                startSlider();
            });
        });
        
        track.addEventListener('mouseenter', stopSlider);
        track.addEventListener('mouseleave', startSlider);
        
        startSlider();
    }

    // ==========================================
    // 11. Hero Particles
    // ==========================================
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes particleFloat {
                0% { transform: translateY(100vh) translateX(0); opacity: 0; }
                10% { opacity: var(--particle-opacity); }
                90% { opacity: var(--particle-opacity); }
                100% { transform: translateY(-100px) translateX(var(--sway)); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2; // 2px to 6px
            const left = Math.random() * 100; // 0% to 100%
            const opacity = Math.random() * 0.4 + 0.1; // 0.1 to 0.5
            const duration = Math.random() * 20 + 15; // 15s to 35s
            const delay = Math.random() * 15; // 0s to 15s
            const sway = (Math.random() - 0.5) * 100; // -50px to 50px
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: #d4a853;
                border-radius: 50%;
                left: ${left}%;
                bottom: -10px;
                opacity: 0;
                --particle-opacity: ${opacity};
                --sway: ${sway}px;
                animation: particleFloat ${duration}s linear ${delay}s infinite;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }

    // ==========================================
    // 12. Contact Form & Toast Notification
    // ==========================================
    const createToastContainer = () => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
        return container;
    };
    
    const showToast = (message, type = 'success') => {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        toast.style.cssText = `
            background: rgba(25, 25, 25, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #fff;
            padding: 15px 25px;
            border-radius: 4px;
            border-left: 4px solid ${type === 'success' ? '#d4a853' : '#ff4444'};
            transform: translateX(120%);
            transition: transform 0.3s ease-in-out;
            font-family: inherit;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        container.appendChild(toast);
        
        // Trigger reflow
        void toast.offsetWidth;
        
        toast.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    };

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            let valid = true;
            contactForm.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) valid = false;
            });
            
            if (valid) {
                showToast('Message sent successfully! We will get back to you soon.');
                contactForm.reset();
            } else {
                showToast('Please fill out all required fields.', 'error');
            }
        });
    }

    // ==========================================
    // 13. Parallax Effect
    // ==========================================
    const heroSection = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroSection && heroContent) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50; 
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            
            heroContent.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            heroContent.style.transform = `translate(0px, 0px)`;
            heroContent.style.transition = `transform 0.5s ease`;
        });
        
        heroSection.addEventListener('mouseenter', () => {
            heroContent.style.transition = `none`;
        });
    }

    // ==========================================
    // 14. Typing Effect
    // ==========================================
    const typeWriter = (element, speed = 50) => {
        if (!element) return;
        const text = element.textContent;
        element.textContent = '';
        element.style.display = 'inline-block';
        
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s step-end infinite';
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        element.parentNode.insertBefore(cursor, element.nextSibling);
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        setTimeout(type, 500); // initial delay
    };
    
    const badge = document.querySelector('.hero-badge');
    if (badge) typeWriter(badge);

    // ==========================================
    // 15. Page Load Animation
    // ==========================================
    const animateLoad = () => {
        const elements = [
            document.querySelector('.hero-badge'),
            document.querySelector('.hero-title'),
            document.querySelector('.hero-subtitle'),
            document.querySelector('.hero-buttons')
        ];
        
        elements.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 200 + (index * 200));
            }
        });
    };
    
    animateLoad();
});
