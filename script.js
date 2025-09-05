// Store state for each carousel
const carousels = {};

function initCarousel(carouselId) {
  const container = document.getElementById(carouselId);
  const images = container.querySelectorAll("img");
  
  carousels[carouselId] = {
    index: 0,
    total: images.length,
    container: container,
    timer: null
  };

  updateCarousel(carouselId);
  startAutoSlide(carouselId);
}

function updateCarousel(carouselId) {
  const state = carousels[carouselId];
  state.container.style.transform = `translateX(-${state.index * 100}%)`;
}

function nextSlide(carouselId) {
  const state = carousels[carouselId];
  state.index = (state.index + 1) % state.total;
  updateCarousel(carouselId);
  resetAutoSlide(carouselId);
}

function prevSlide(carouselId) {
  const state = carousels[carouselId];
  state.index = (state.index - 1 + state.total) % state.total;
  updateCarousel(carouselId);
  resetAutoSlide(carouselId);
}

// Auto-slide handling
function startAutoSlide(carouselId) {
  const state = carousels[carouselId];
  state.timer = setInterval(() => {
    nextSlide(carouselId);
  }, 5000);
}

function resetAutoSlide(carouselId) {
  const state = carousels[carouselId];
  clearInterval(state.timer);
  startAutoSlide(carouselId);
}

// Initialize all carousels
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel-images").forEach(carousel => {
    initCarousel(carousel.id);
  });

  // Burger menu toggle
  document.getElementById("burger").addEventListener("click", function () {
    const navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("active");
  });
});


// MULTI SLIDER SUPPORT
document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll(".slider");

    sliders.forEach((slider) => {
        const slides = slider.querySelectorAll(".slides img");
        const prevBtn = slider.querySelector(".prev");
        const nextBtn = slider.querySelector(".next");

        let slideIndex = 0;
        let intervalId = null;

        function showSlide(index) {
            if (index >= slides.length) slideIndex = 0;
            else if (index < 0) slideIndex = slides.length - 1;

            slides.forEach((slide) => slide.classList.remove("displaySlide"));
            slides[slideIndex].classList.add("displaySlide");
        }

        function prevSlide() {
            clearInterval(intervalId);
            slideIndex--;
            showSlide(slideIndex);
        }

        function nextSlide() {
            slideIndex++;
            showSlide(slideIndex);
        }

        function initializeSlider() {
            if (slides.length > 0) {
                slides[slideIndex].classList.add("displaySlide");
                intervalId = setInterval(nextSlide, 5000); // autoplay every 5s
            }
        }

        // Hook up buttons
        if (prevBtn) prevBtn.addEventListener("click", prevSlide);
        if (nextBtn) nextBtn.addEventListener("click", nextSlide);

        initializeSlider();
    });
});

