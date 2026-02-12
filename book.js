// ====== DOM Elements ======
const totalAmount = document.getElementById("totalAmount");
const addonsTotal = document.getElementById("addonsTotal");
const servicesTotal = document.getElementById("servicesTotal");
const checkboxes = document.querySelectorAll(".checkbox");
const bookNowBtn = document.getElementById("bookNow");

const tripImage = document.querySelector(".trip-image");
const tripTitle = document.querySelector(".trip-details h3");
const tripDate = document.querySelector(".trip-date");
const tripGroup = document.querySelector(".trip-group");
const tripBudget = document.querySelector(".trip-budget");
const tripTravelers = document.querySelector(".trip-travelers");

// ====== Base Price ======
const baseAmount = 2000;

// ====== Pricing Map ======
const pricing = {
  "Insurance": 50,
  "Extra Luggage": 30,
  "Guided Tour": 100,
  "Hotel Booking": 200,
  "Flight Ticket": 500,
  "Cruise Ticket": 700
};

// ====== Load trip data from planner/explore/match ======
function loadPlannerData() {
  const plannerData = JSON.parse(localStorage.getItem("plannerData"));
  const exploreData = JSON.parse(localStorage.getItem("exploreData"));
  const matchData   = JSON.parse(localStorage.getItem("matchData"));

  // ✅ Location + Image
  if (exploreData) {
    tripImage.src = exploreData.image || tripImage.src;
    tripTitle.textContent = exploreData.location || "Unknown Location";
  } else if (plannerData) {
    tripImage.src = plannerData.image || tripImage.src;
    tripTitle.textContent = plannerData.location || "Unknown Location";
  } else {
    tripTitle.textContent = "Choose a destination from Explore";
    tripImage.src = "https://placehold.co/400x300/F3F4F6/1F2937?text=Select+Destination";
  }

  // ✅ Fill details from Match first
  if (matchData) {
    tripDate.innerHTML = `<strong>Date:</strong> ${matchData.date || "Not set"}`;
    tripGroup.innerHTML = `<strong>Group:</strong> ${matchData.groupName || "Unspecified"}`;
    tripBudget.innerHTML = `<strong>Budget:</strong> ${matchData.budget || "Not set"}`;
    tripTravelers.innerHTML = `<strong>Travelers:</strong> ${matchData.travelers || "Not set"}`;
  } 
  // ✅ Fallback to Planner
  else if (plannerData) {
    tripDate.innerHTML = `<strong>Dates:</strong> ${plannerData.startDate || "Not selected"} - ${plannerData.endDate || "Not selected"}`;
    tripGroup.innerHTML = `<strong>Group:</strong> Not set`;
    tripBudget.innerHTML = `<strong>Budget:</strong> Not set`;
    tripTravelers.innerHTML = `<strong>Travelers:</strong> ${plannerData.travelers || "Not specified"}`;
  } 
  // ✅ Defaults
  else {
    tripDate.innerHTML = `<strong>Date:</strong> Not set`;
    tripGroup.innerHTML = `<strong>Group:</strong> Not set`;
    tripBudget.innerHTML = `<strong>Budget:</strong> Not set`;
    tripTravelers.innerHTML = `<strong>Travelers:</strong> Not set`;
  }

  // ✅ Restore addons
  if (plannerData && plannerData.addons) {
    checkboxes.forEach(cb => {
      if (plannerData.addons.includes(cb.value)) {
        cb.checked = true;
      }
    });
  }
}

// ====== Calculate Total ======
function calculateTotal() {
  let addonsSum = 0;
  let servicesSum = 0;
  let total = baseAmount;

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const price = pricing[cb.value] || 0;
      if (["Insurance","Extra Luggage","Guided Tour"].includes(cb.value)) {
        addonsSum += price;
      } else {
        servicesSum += price;
      }
      total += price;
    }
  });

  addonsTotal.textContent = `$${addonsSum}`;
  servicesTotal.textContent = `$${servicesSum}`;
  totalAmount.textContent = `$${total}`;
}

// ====== Generate downloadable booking summary ======
function generateSummary() {
  const selectedOptions = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const exploreData = JSON.parse(localStorage.getItem("exploreData")) || {};
  const matchData   = JSON.parse(localStorage.getItem("matchData")) || {};

  const tripData = {
    Location: exploreData.location || "Not Selected",
    Date: matchData.date || "Not Set",
    Group: matchData.groupName || "None",
    Travelers: matchData.travelers || "None",
    Budget: matchData.budget || "N/A",
    SelectedOptions: selectedOptions.join(", ") || "None",
    TotalAmount: totalAmount.textContent
  };

  let summaryText = "=== WanderMate Booking Confirmation ===\n\n";
  for (const key in tripData) {
    summaryText += `${key}: ${tripData[key]}\n`;
  }

  // Download file
  const blob = new Blob([summaryText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `WanderMate_Ticket_${tripData.Location.replace(/\s/g,'_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ====== Event Listeners ======
checkboxes.forEach(cb => cb.addEventListener("change", calculateTotal));

bookNowBtn.addEventListener("click", () => {
  generateSummary();
  alert(`Booking Confirmed!\n\nTotal: ${totalAmount.textContent}\nThank you for choosing WanderMate!`);
  // Optional: Reset selections
  checkboxes.forEach(cb => cb.checked = false);
  calculateTotal();
});

// ====== Initialize ======
loadPlannerData();
calculateTotal();
