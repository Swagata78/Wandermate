const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form values
  const name = registerForm.querySelector('input[name="name"]').value.trim();
  const username = registerForm.querySelector('input[name="username"]').value.trim();
  const email = registerForm.querySelector('input[name="email"]').value.trim();
  const password = registerForm.querySelector('input[name="password"]').value.trim();
  const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]').value.trim();
  const phone = registerForm.querySelector('input[name="phone"]').value.trim();
  const country = registerForm.querySelector('select[name="country"]').value;
  const dob = registerForm.querySelector('input[name="dob"]').value;
  const gender = registerForm.querySelector('select[name="gender"]').value;
  const travelStyle = registerForm.querySelector('select[name="travelStyle"]').value;
  const bio = registerForm.querySelector('textarea[name="bio"]').value.trim();

  // ===== Validations =====
  if (password !== confirmPassword) {
    alert("⚠️ Passwords do not match!");
    return;
  }

  if (password.length < 6) {
    alert("⚠️ Password must be at least 6 characters long.");
    return;
  }

  if (!/^\d{10,15}$/.test(phone)) {
    alert("⚠️ Enter a valid phone number (10-15 digits).");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
        phone,
        country,
        dob,
        gender,
        travelStyle,
        bio
      })
    });

    const data = await res.json();

    if (res.status === 201) {
      alert("🎉 Registration successful! Redirecting to Login...");
      window.location.href = "login.html";
    } else {
      alert(data.message || "⚠️ Registration failed.");
    }
  } catch (err) {
    alert("❌ Server error. Please try again later.");
    console.error(err);
  }
});
