document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.textContent = '☰';
            });
        });
    }

    // Smooth scroll for anchor links (enhance native behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal on scroll animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe sections and cards
    document.querySelectorAll('.section, .card, .skill-card, .project-card').forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });

    // Animate skill bars
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const targetPercent = skillCard.getAttribute('data-skill');
                const progressBar = skillCard.querySelector('.skill-progress');
                const percentElement = skillCard.querySelector('.skill-percent');

                let currentPercent = 0;
                const increment = targetPercent / 50; // Duration ~1.5 seconds

                const timer = setInterval(() => {
                    if (currentPercent >= targetPercent) {
                        clearInterval(timer);
                        currentPercent = targetPercent;
                    }
                    progressBar.style.width = currentPercent + '%';
                    percentElement.textContent = Math.round(currentPercent) + '%';
                    currentPercent += increment;
                }, 30);
                skillObserver.unobserve(skillCard);
            }
        });
    }, { threshold: 0.5 });

    skillCards.forEach(card => skillObserver.observe(card));

    // Project card button interaction
    document.querySelectorAll('.project-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectTitle = this.closest('.project-card').querySelector('.project-title').textContent;
            this.textContent = 'Project View (Placeholder)';
            this.style.backgroundColor = 'var(--color-accent)';
            this.style.borderColor = 'var(--color-accent)';

            setTimeout(() => {
                this.textContent = 'View Project';
                this.style.backgroundColor = '';
                this.style.borderColor = '';
            }, 1500);
        });
    });

    // Simple dynamic background for hero (Canvas particles)
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas && window.CanvasRenderingContext2D) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        heroCanvas.appendChild(canvas);

        function resizeCanvas() {
            canvas.width = heroCanvas.clientWidth;
            canvas.height = heroCanvas.clientHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const particleCount = 60;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(0, ${150 + Math.random() * 105}, ${255}, ${0.4 + Math.random() * 0.3})`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(0, 150, 255, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    // Update copyright year (optional)
    const yearSpan = document.querySelector('#current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});