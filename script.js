const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
const slideWidth = slides[0].getBoundingClientRect().width;

// Arrange the slides next to one another
slides.forEach((slide, index) => {
  slide.style.left = slideWidth * index + 'px';
});

// Function to move to the targeted slide
const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
};

// Click right, move slides to the left
nextButton.addEventListener('click', () => {
  const currentSlide = track.querySelector('.carousel-slide');
  const nextSlide = currentSlide.nextElementSibling || slides[0];
  moveToSlide(track, currentSlide, nextSlide);
});

// Click left, move slides to the right
prevButton.addEventListener('click', () => {
  const currentSlide = track.querySelector('.carousel-slide');
  const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
  moveToSlide(track, currentSlide, prevSlide);
});
