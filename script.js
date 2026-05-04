const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');
const crtToggle = document.querySelector('.crt-toggle');
const crtIntensityButton = document.querySelector('.crt-intensity');
const crtStatus = document.querySelector('.crt-status');
const revealItems = document.querySelectorAll('.reveal');
let crtBootTimer = null;

const playCrtChime = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.0001;
  gainNode.connect(audioContext.destination);

  const notes = [
    { frequency: 392, start: 0, duration: 0.12 },
    { frequency: 523.25, start: 0.12, duration: 0.14 },
    { frequency: 784, start: 0.24, duration: 0.16 },
  ];

  notes.forEach(({ frequency, start, duration }) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    oscillator.start(audioContext.currentTime + start);
    oscillator.stop(audioContext.currentTime + start + duration);
  });

  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);

  window.setTimeout(() => {
    audioContext.close();
  }, 650);
};

const triggerCrtBoot = () => {
  document.body.classList.add('crt-booting');

  if (crtStatus) {
    crtStatus.classList.add('show');
    crtStatus.classList.remove('phase-signal', 'phase-prompt');
    crtStatus.classList.add('phase-ready');
  }

  playCrtChime();

  window.setTimeout(() => {
    if (crtStatus && document.body.classList.contains('crt-booting')) {
      crtStatus.classList.remove('phase-ready');
      crtStatus.classList.add('phase-signal');
    }
  }, 220);

  window.setTimeout(() => {
    if (crtStatus && document.body.classList.contains('crt-booting')) {
      crtStatus.classList.remove('phase-signal');
      crtStatus.classList.add('phase-prompt');
    }
  }, 430);

  if (crtBootTimer) {
    window.clearTimeout(crtBootTimer);
  }

  crtBootTimer = window.setTimeout(() => {
    document.body.classList.remove('crt-booting');
    if (crtStatus) {
      crtStatus.classList.remove('show');
      crtStatus.classList.remove('phase-ready', 'phase-signal', 'phase-prompt');
    }
    crtBootTimer = null;
  }, 700);
};

const applyCrtMode = (isEnabled) => {
  document.body.classList.toggle('crt-on', isEnabled);

  if (!isEnabled) {
    document.body.classList.remove('crt-booting');

    if (crtStatus) {
      crtStatus.classList.remove('show');
      crtStatus.classList.remove('phase-ready', 'phase-signal', 'phase-prompt');
    }

    if (crtBootTimer) {
      window.clearTimeout(crtBootTimer);
      crtBootTimer = null;
    }
  }

  if (crtToggle) {
    crtToggle.setAttribute('aria-pressed', String(isEnabled));
    crtToggle.textContent = isEnabled ? 'CRT: ON' : 'CRT: OFF';
  }
};

const applyCrtIntensity = (isHigh) => {
  document.body.classList.toggle('crt-high', isHigh);

  if (crtIntensityButton) {
    crtIntensityButton.setAttribute('aria-pressed', String(isHigh));
    crtIntensityButton.textContent = isHigh ? 'CRT LVL: HIGH' : 'CRT LVL: LOW';
  }
};

if (crtToggle) {
  let savedCrtMode = false;
  let savedCrtIntensity = false;

  try {
    savedCrtMode = localStorage.getItem('portfolio-crt') === 'on';
    savedCrtIntensity = localStorage.getItem('portfolio-crt-intensity') === 'high';
  } catch (error) {
    savedCrtMode = false;
    savedCrtIntensity = false;
  }

  applyCrtMode(savedCrtMode);
  applyCrtIntensity(savedCrtIntensity);

  if (savedCrtMode) {
    document.body.classList.remove('crt-booting');
  }

  crtToggle.addEventListener('click', () => {
    const nextMode = !document.body.classList.contains('crt-on');
    applyCrtMode(nextMode);

    if (nextMode) {
      triggerCrtBoot();
    }

    try {
      localStorage.setItem('portfolio-crt', nextMode ? 'on' : 'off');
    } catch (error) {
      // No-op if storage is unavailable.
    }
  });

  if (crtIntensityButton) {
    crtIntensityButton.addEventListener('click', () => {
      const nextIntensity = !document.body.classList.contains('crt-high');
      applyCrtIntensity(nextIntensity);

      try {
        localStorage.setItem('portfolio-crt-intensity', nextIntensity ? 'high' : 'low');
      } catch (error) {
        // No-op if storage is unavailable.
      }
    });
  }
}

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
