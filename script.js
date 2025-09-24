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


// calender 
  const calendarGrid = document.getElementById("calendar-grid");
  const calendarHeader = document.getElementById("calendar-header");
  const eventsEl = document.getElementById("events");
  const sidebarDateEl = document.getElementById("sidebar-date");

  let events = [];
  let currentDate = new Date();

  // Add navigation buttons
  const nav = document.createElement("div");
  nav.style.textAlign = "center";
  nav.style.margin = "10px 0";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "← Prev";
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next →";

  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);

  document.getElementById("calendar").insertBefore(nav, calendarHeader);

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Load events from JSON
  fetch("events.json")
    .then(res => res.json())
    .then(data => {
      events = data;
      renderCalendar(currentDate);
      updateSidebar(new Date()); // show today at start
    });

  function renderCalendar(date) {
    calendarGrid.innerHTML = "";
    calendarHeader.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Show month & year above calendar
    const title = document.createElement("div");
    title.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
    title.style.gridColumn = "span 7";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "5px";
    title.style.textAlign = "center";
    calendarHeader.appendChild(title);

    // Day names
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    dayNames.forEach(d => {
      const header = document.createElement("div");
      header.textContent = d;
      header.style.fontWeight = "bold";
      calendarHeader.appendChild(header);
    });

    // Blank days before start
    for (let i = 0; i < firstDay.getDay(); i++) {
      const blank = document.createElement("div");
      calendarGrid.appendChild(blank);
    }

    // Calendar days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      const cell = document.createElement("div");
      cell.classList.add("day");
      cell.textContent = day;

      // Highlight today
      if (currentDate.toDateString() === new Date().toDateString()) {
        cell.classList.add("today");
      }

      // Check if this date has events
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayEvents = events.filter(e => e.date === dateStr);

      if (dayEvents.length > 0) {
        cell.classList.add("event");
        cell.addEventListener("click", () => updateSidebar(currentDate));
      }

      calendarGrid.appendChild(cell);
    }
  }

  function updateSidebar(date) {
  const dateStr = date.toISOString().split("T")[0];
  const dayEvents = events.filter(e => e.date === dateStr);

  const options = { weekday: "long", month: "long", day: "numeric" };
  if (date.getFullYear() !== new Date().getFullYear()) {
    options.year = "numeric"; // show year only if not current year
  }

  sidebarDateEl.textContent = date.toLocaleDateString("en-US", options);

  eventsEl.innerHTML = "";

  if (dayEvents.length > 0) {
    dayEvents.forEach(ev => {
      const li = document.createElement("li");
      li.textContent = ev.title;
      eventsEl.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No events for this day.";
    li.classList.add("placeholder");
    eventsEl.appendChild(li);
  }
}