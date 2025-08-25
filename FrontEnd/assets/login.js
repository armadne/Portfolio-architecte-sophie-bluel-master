// login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("login-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Stocker le token
        localStorage.setItem("token", data.token);

        // Redirection vers l’accueil
        window.location.href = "index.html";
      } else {
        errorMsg.style.display = "block";
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  });
});
