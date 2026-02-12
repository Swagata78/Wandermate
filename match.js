document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.querySelector('.cards-container');
  const requestBtn = document.getElementById('request-btn');
  const skipBtn = document.getElementById('skip-btn');

  // Fetch planner data
  let plannerData = JSON.parse(localStorage.getItem('plannerData')) || [];

  // Travel buddies database
  const buddies = [
    { name: "Sarah Johnson", location: "Bali, Indonesia", interests: ["Adventure","Beaches","Photography"], image:"https://placehold.co/400x200/F3F4F6/1F2937?text=Traveler+1" },
    { name: "Mike Brown", location: "Tokyo, Japan", interests: ["Culture","Food","History"], image:"https://placehold.co/400x200/F3F4F6/1F2937?text=Traveler+2" },
    { name: "Emma García", location: "Bangkok, Thailand", interests: ["Budget","Backpacking","Local Culture"], image:"https://placehold.co/400x200/F3F4F6/1F2937?text=Traveler+3" },
    { name: "David Kim", location: "Paris, France", interests: ["Luxury","Food","Shopping"], image:"https://placehold.co/400x200/F3F4F6/1F2937?text=Traveler+4" }
  ];

  // Filter buddies based on planner
  let filteredBuddies = (plannerData.length > 0)
    ? buddies.filter(b => plannerData.some(t => b.location.toLowerCase().includes(t.destination.toLowerCase()) || t.interests.some(i => b.interests.includes(i))))
    : buddies;

  // Function to create card element
  const createCard = (buddy, index) => {
    const card = document.createElement('div');
    card.classList.add('buddy-card', 'fade-in');
    card.style.animationDelay = `${0.2 + index * 0.1}s`;

    card.innerHTML = `
      <img src="${buddy.image}" alt="${buddy.name}" class="buddy-image">
      <div class="buddy-info">
        <h3 class="buddy-name">${buddy.name}</h3>
        <div class="buddy-location">📍 ${buddy.location}</div>
        <div class="buddy-interests">
          ${buddy.interests.map(i=>`<span class="interest-tag">${i}</span>`).join('')}
        </div>
        <div class="card-footer">
          <input type="checkbox" class="select-checkbox">
          <button class="connect-btn">Connect</button>
        </div>
      </div>
    `;
    return card;
  };

  // Display buddies
  cardsContainer.innerHTML = '';
  filteredBuddies.forEach((buddy, index) => {
    cardsContainer.appendChild(createCard(buddy, index));
  });

  // Request selected button
  requestBtn.addEventListener('click', () => {
    const selectedCards = document.querySelectorAll('.select-checkbox:checked');
    if(selectedCards.length === 0){
      alert("Please select at least one traveler or skip to book!");
      return;
    }
    // Save selected buddies to localStorage to use in booking page
    const selectedBuddies = Array.from(selectedCards).map(card => {
      return {
        name: card.closest('.buddy-card').querySelector('.buddy-name').textContent,
        location: card.closest('.buddy-card').querySelector('.buddy-location').textContent.replace('📍 ','')
      }
    });
    localStorage.setItem('selectedBuddies', JSON.stringify(selectedBuddies));
    // Go to booking page
    window.location.href = "book.html";
  });

  // Skip button
  skipBtn.addEventListener('click', () => {
    // Clear selectedBuddies
    localStorage.removeItem('selectedBuddies');
    window.location.href = "book.html";
  });

});
