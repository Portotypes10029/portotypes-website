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
                  if (slider.hasAttribute("slow-autoplay")) {
                      intervalId = setInterval(nextSlide, 10000); // autoplay every 10s
                  } else if (slider.hasAttribute("no-data-autoplay")) {
                      // Do not autoplay
                  } else {
                      intervalId = setInterval(nextSlide, 5000); // autoplay every 5s
                  }
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
  let currentDate = new Date(); // keep this as the "display month"

  // --- Helper: format date as local YYYY-MM-DD ---
  function formatDateLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  // --- Load events ---
  fetch("/events.json")
    .then(res => res.json())
    .then(data => {
      events = data;
      renderCalendar(currentDate);
      updateSidebar(new Date()); // show today at start (after events load)
    });

  function renderCalendar(date) {
    calendarGrid.innerHTML = "";
    calendarHeader.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // --- Month title container with buttons ---
    const headerContainer = document.createElement("div");
    headerContainer.style.display = "flex";
    headerContainer.style.justifyContent = "space-between";
    headerContainer.style.alignItems = "center";
    headerContainer.style.gridColumn = "span 7";
    headerContainer.style.marginBottom = "5px";

    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Prev";
    prevBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
    });

    // Month title
    const title = document.createElement("div");
    title.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
    title.classList.add("calendar-title");

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next →";
    nextBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
    });

    headerContainer.appendChild(prevBtn);
    headerContainer.appendChild(title);
    headerContainer.appendChild(nextBtn);
    calendarHeader.appendChild(headerContainer);

    // --- Day names ---
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    dayNames.forEach(d => {
      const header = document.createElement("div");
      header.textContent = d;
      header.classList.add("day-name");
      calendarHeader.appendChild(header);
    });

    // --- Blank days before start ---
    for (let i = 0; i < firstDay.getDay(); i++) {
      const blank = document.createElement("div");
      calendarGrid.appendChild(blank);
    }

    // --- Calendar days ---
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDateCell = new Date(year, month, day);
      const cell = document.createElement("div");
      cell.classList.add("day");
      cell.textContent = day;

      if (formatDateLocal(currentDateCell) === formatDateLocal(new Date())) {
        cell.classList.add("today");
      }

      const dateStr = formatDateLocal(currentDateCell);
      const dayEvents = events.filter(e => e.date === dateStr);
      if (dayEvents.length > 0) {
        cell.classList.add("event");
        cell.addEventListener("click", () => updateSidebar(currentDateCell));
      }

      calendarGrid.appendChild(cell);
    }
  }

  function updateSidebar(date) {
    const dateStr = formatDateLocal(date);
    const dayEvents = events.filter(e => e.date === dateStr);

    const options = { weekday: "long", month: "long", day: "numeric" };
    if (date.getFullYear() !== new Date().getFullYear()) {
      options.year = "numeric";
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

// Dark mode toggle
const toggleBtn = document.getElementById("dark-toggle");
const body = document.body;

// Load saved preference
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const mascot = document.getElementById("mascot");
  const bubble = document.getElementById("speechBubble");
  if (!sessionStorage.getItem("tomSeen")) {
    bubble.textContent = "Psst… click me!";
    bubble.style.display = "block";

    setTimeout(() => {
      bubble.style.display = "none";
    }, 5000);
    sessionStorage.setItem("tomSeen", "true");
  }
  
  const messagesDefault = [
    "Go Portotypes! 🦅",
    "STEM starts here 🤖",
    "Build. Code. Compete.",
    "Team 10029 💪",
    "See you at Mishawaka! 🏆",
  ];

  const messagesMishawaka = [
    "See you at Mishawaka! 🏆",
    "Team 10029 💪",
    "Go Portotypes! 🦅",
    "Let’s crush the district competition!",
    "Team 10029 is ready!"
  ];

  const messagesWashington = [
    "Washington District, here we come!",
    "Bring the trophy home!",
    "Keep building, team!"
  ];

  const today = new Date();

  let messages;

  if (today >= new Date("2026-03-06") && today <= new Date("2026-03-08")) {
    messages = messagesMishawaka;
  } else if (today >= new Date("2026-04-02") && today <= new Date("2026-04-04")) {
    messages = messagesWashington;
  } else {
    messages = messagesDefault;
  }

  mascot.addEventListener("click", () => {
    bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
    bubble.style.display = "block";
    clearTimeout(window.bubbleTimeout);
    window.bubbleTimeout = setTimeout(() => {
      bubble.style.display = "none";
    }, 3000);
  });

});
