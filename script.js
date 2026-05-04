const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');
const revealItems = document.querySelectorAll('.reveal');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const yearNode = document.querySelector('#year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const track = document.querySelector('.carousel-track');
const slides = track ? Array.from(track.children) : [];
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

let currentIndex = 0;

const renderSlide = () => {
  if (!track || slides.length === 0) {
    return;
  }

  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  slides.forEach((slide, index) => {
    slide.classList.toggle('current-slide', index === currentIndex);
  });
};

if (nextButton && prevButton && slides.length > 0) {
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    renderSlide();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    renderSlide();
  });

  renderSlide();
}
