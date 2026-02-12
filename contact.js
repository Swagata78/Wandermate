const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function(e){
  e.preventDefault();
  // You can add AJAX here to send data to backend
  formMessage.textContent = "Your message has been sent successfully!";
  contactForm.reset();
});
