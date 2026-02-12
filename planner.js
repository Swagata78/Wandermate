// ===== planner.js (final merged version + confirm option) =====
document.addEventListener('DOMContentLoaded', function () {
  // ---- DOM ----
  const tripForm = document.getElementById('tripForm');
  const cardsContainer = document.getElementById('cardsContainer');
  const searchInput = document.getElementById('searchTrip');
  const destinationInput = document.getElementById('destination');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const budgetInput = document.getElementById('budget');
  const travelTypeInput = document.getElementById('travelType');
  const interestsInput = document.getElementById('interests');

  if (!tripForm || !cardsContainer) return; // safety

  // ---- State ----
  let trips = loadTrips();

  // Pre-fill destination from Explore
  const selectedCountry = localStorage.getItem('selectedCountry');
  if (selectedCountry && destinationInput) destinationInput.value = selectedCountry;

  // Initial render
  renderTrips(trips);

  // ---- Events ----
  tripForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const trip = {
      destination: (destinationInput.value || '').trim(),
      startDate: (startDateInput.value || '').trim(),
      endDate: (endDateInput.value || '').trim(),
      budget: (budgetInput.value || '').trim(),
      travelType: (travelTypeInput.value || '').trim().toLowerCase(), // solo|group|couple
      interests: (interestsInput.value || '').trim(),
    };

    if (!trip.destination) return alert('Please enter a destination.');

    trips.push(trip);
    saveTrips(trips);
    renderTrips(trips);
    tripForm.reset();
    if (selectedCountry && destinationInput) destinationInput.value = selectedCountry;
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = (this.value || '').toLowerCase();
      const filtered = trips
        .map((t, i) => ({ t, i }))
        .filter(({ t }) => t.destination.toLowerCase().includes(q));
      renderTrips(filtered.map(x => x.t), filtered.map(x => x.i));
    });
  }

  // ---- Functions ----
  function loadTrips() {
    try {
      return JSON.parse(localStorage.getItem('trips')) || [];
    } catch {
      return [];
    }
  }

  function saveTrips(list) {
    localStorage.setItem('trips', JSON.stringify(list));
  }

  function renderTrips(list, originalIndices) {
    cardsContainer.innerHTML = '';
    list.forEach((trip, idx) => {
      const realIndex = Array.isArray(originalIndices) ? originalIndices[idx] : idx;

      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.index = String(realIndex);
      card.innerHTML = `
        <h3>${escapeHtml(trip.destination || '')}</h3>
        <p><strong>Dates:</strong> ${escapeHtml(trip.startDate || '—')} to ${escapeHtml(trip.endDate || '—')}</p>
        <p><strong>Budget:</strong> $${escapeHtml(trip.budget || '—')}</p>
        <p><strong>Type:</strong> ${escapeHtml(trip.travelType || '—')}</p>
        <p><strong>Interests:</strong> ${escapeHtml(trip.interests || '—')}</p>
        <div class="card-actions" style="display:flex; gap:8px; margin-top:8px;">
          <button class="continue-btn">Continue</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn" style="background:#e11; color:#fff;">Delete</button>
        </div>
      `;

      // Clicking card background = Continue
      card.addEventListener('click', function (e) {
        if (e.target.closest('.card-actions')) return;
        continueTrip(realIndex);
      });

      // Buttons
      card.querySelector('.continue-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        continueTrip(realIndex);
      });

      card.querySelector('.edit-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        editTrip(realIndex);
      });

      card.querySelector('.delete-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        deleteTrip(realIndex);
      });

      cardsContainer.appendChild(card);
    });
  }

  function deleteTrip(index) {
    trips.splice(index, 1);
    saveTrips(trips);
    renderTrips(trips);
  }

  function editTrip(index) {
    const trip = trips[index];
    if (!trip) return;

    destinationInput.value = trip.destination || '';
    startDateInput.value = trip.startDate || '';
    endDateInput.value = trip.endDate || '';
    budgetInput.value = trip.budget || '';
    travelTypeInput.value = trip.travelType || '';
    interestsInput.value = trip.interests || '';

    trips.splice(index, 1);
    saveTrips(trips);
    renderTrips(trips);
  }

  // --- Main redirect logic (with confirm option) ---
  function continueTrip(index) {
    const trip = trips[index];
    if (!trip) return;

    // Save selected trip
    localStorage.setItem('selectedTrip', JSON.stringify(trip));

    // Ask user if they want to travel with someone
    const withSomeone = confirm(
      "Do you want to travel with someone?\n\nOK = Yes (go to match page)\nCancel = No (direct booking page)"
    );

    if (withSomeone) {
      window.location.href = 'match.html';
    } else {
      window.location.href = 'book.html';
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
