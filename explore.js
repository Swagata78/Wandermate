// ===== Scroll animation for country cards =====
document.addEventListener("scroll", () => {
  document.querySelectorAll(".country-card").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
});

// Initial hidden state for cards
document.querySelectorAll(".country-card").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "all 0.6s ease-out";
});

// ===== Search functionality =====
const searchInput = document.getElementById("countrySearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const countryCards = document.querySelectorAll(".country-card");

let currentFilter = "all";

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  countryCards.forEach((card) => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    const continent = card.dataset.continent;

    if ((name.includes(query)) && (currentFilter === "all" || currentFilter === continent)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// ===== Filter buttons functionality =====
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.continent;

    countryCards.forEach((card) => {
      const name = card.querySelector("h3").innerText.toLowerCase();
      const continent = card.dataset.continent;
      const query = searchInput.value.toLowerCase().trim();

      if ((currentFilter === "all" || currentFilter === continent) && name.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    // Highlight active filter button
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ===== Explore button redirect to Planner page =====
countryCards.forEach((card) => {
  const exploreBtn = card.querySelector(".explore-btn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      const countryName = card.querySelector("h3").innerText;
      localStorage.setItem("selectedCountry", countryName); // Save country
      window.location.href = "planner.html"; // Redirect
    });
  }
});
