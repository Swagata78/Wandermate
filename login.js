const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.status === 200) {
      // ✅ Save user info to localStorage
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);

      alert("🎉 Login successful! Redirecting to Explore page...");
      window.location.href = "explore.html";
    } else {
      alert(data.message || "❌ Login failed. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("⚠️ Server error. Please try again later.");
  }
});
