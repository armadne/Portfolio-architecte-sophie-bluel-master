// script.js

// Variable globale pour stocker tous les travaux une fois récupérés
let tousLesTravaux = [];

// Fonction qui récupère tous les travaux depuis l'api localhost/works et va les afficher sur le site dans "mes projets"
async function chargerTravaux() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    tousLesTravaux = await reponse.json(); // On stocke les travaux pour les réutiliser plus tard
    afficherTravaux(tousLesTravaux); // On affiche tout au début
  } catch (erreur) {
    console.error("Erreur lors du chargement des travaux :", erreur);
  }
}

// Fonction d'affichage des travaux dans la galerie
function afficherTravaux(listeTravaux) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Si besoin on vide les balises présents dans la balise div avec la classe galerie

  // Pour chaque projet on va récupérer les titres, images de chaque projet depuis localhost/works pour les afficher sur le site
  listeTravaux.forEach(work => {
    const figure = document.createElement("figure"); // creation balise figure (fonctionne comme un container comme div)

    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const titre = document.createElement("figcaption"); // creation d'une légende
    titre.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(titre);
    gallery.appendChild(figure);
  });
}




// Fonction qui affiche les filtres (boutons)
async function filtres() {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories"); // Récuperation des noms des catégories depuis loaclhost/categories
    const categories = await reponse.json();

    const filtresContainer = document.querySelector(".filtre");  // On sélectionne l’endroit où les boutons de filtre seront affichés
    filtresContainer.innerHTML = "";

    // Création du Bouton "Tous" pour afficher tous les projets (aucuns filtres appliqués)
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Tous";
    boutonTous.dataset.id = 0;
    boutonTous.classList.add("filtre-btn");
    filtresContainer.appendChild(boutonTous);

    // Boutons de catégories
    categories.forEach(categorie => {
      const bouton = document.createElement("button");
      bouton.textContent = categorie.name; // On crée un bouton avec le nom de la catégorie.
      bouton.dataset.id = categorie.id; // Quand on clique dessus, on recharge les projets en filtrant par l’id de cette catégorie.
      bouton.classList.add("filtre-btn");
      filtresContainer.appendChild(bouton);
    });

//Cette partie (ci dessus) sert à afficher les boutons de filtre dans le HTML.
//Chaque bouton correspond à une catégorie (ex : Objets, Appartements, Hôtels).
//On leur associe un identifiant (dataset.id) qui sera utilisé plus tard pour filtrer.
// Sa ne filtre rien pour le moment






    // Gestion des clics et pièce centrale qui fait le lien entre les boutons créés dynamiquement et les fonctions de filtrage.
    const boutons = document.querySelectorAll(".filtre-btn"); // On récupère tous les boutons avec la classe "filtre-btn"
    boutons.forEach(bouton => {
      bouton.addEventListener("click", () => { 
        const idCategorie = parseInt(bouton.dataset.id); // récupère l’id de la catégorie depuis un data-id (ex : <button data-id="1">Objets</button>)
        filtrerTravaux(idCategorie); //afficher les projets qui correspondent à la catégorie (exemple categorie: objets)
        activerBouton(bouton); // mettre en surbrillance le bouton cliqué
      });
    });

  } catch (erreur) {
    console.error("Erreur lors du chargement des filtres :", erreur);
  }
}





// Fonction qui filtre les travaux selon la catégorie cliquée
function filtrerTravaux(idCategorie) { 
  if (idCategorie === 0) {
    afficherTravaux(tousLesTravaux); // Afficher tous les projets
  } else {
    const travauxFiltres = tousLesTravaux.filter(
      work => work.categoryId === idCategorie
    );
    afficherTravaux(travauxFiltres); // Afficher les projets filtrés
  }
}

//Cette fonction "filtrerTravaux" est appelée quand un bouton est cliqué.
//Elle prend l’id de la catégorie du bouton cliqué et :
//soit affiche tous les projets si idCategorie === 0 (souvent "Tous"), soit affiche uniquement les projets de cette catégorie.



// Fonction pour gérer l'apparence du bouton actif
function activerBouton(boutonActif) {
  const boutons = document.querySelectorAll(".filtre-btn");
  boutons.forEach(b => b.classList.remove("actif")); //  On enlève la classe CSS "actif" à tous les boutons pour que un seul puisse être actif à la fois.
  boutonActif.classList.add("actif"); // On ajoute la classe "actif" au bouton qui a été cliqué.
  // lors du clique sur le bouton , le bouton devient actif avec un changement de couleur
}



// === Affiche dynamiquement le formulaire de connexion ===
function afficherFormulaireConnexion() {
  const main = document.querySelector("main");
  main.innerHTML = `
    <section class="login-section">
      <h2 class="login-title">Log In</h2>
      <form id="login-form" class="login-form">
        <label for="email" class="login-label">E-mail</label>
        <input type="email" id="email" class="login-input" required />

        <label for="password" class="login-label">Mot de passe</label>
        <input type="password" id="password" class="login-input" required />

        <button type="submit" class="login-button">Se connecter</button>

        <p id="login-error" class="login-error">Email ou mot de passe incorrect.</p>
        <a href="#" class="login-link">Mot de passe oublié</a>
      </form>
    </section>
  `;

  // Gestion du formulaire
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        alert("Connexion réussie !");
        window.location.href = "index.html"; // Redirige vers la page d'accueil
      } else {
        document.getElementById("login-error").style.display = "block";
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  });
}




// Quand le DOM est prêt, on charge tout
// Après que tous le code HTML soit chargé
document.addEventListener("DOMContentLoaded", () => {
  chargerTravaux(); // Affiche dynamiquement via "fetch" les projets
  filtres(); // Affiche dynamiquement via "fetch" les filtres sous forme de boutons
  
});


  // Gestion du bouton "login"
  const loginLink = document.getElementById("login-link");
  if (loginLink) { // Lorsqu'on clique sur "login" dans le menu de navigation on affiche la page de connexion
    loginLink.addEventListener("click", afficherFormulaireConnexion);
  }





  document.addEventListener("DOMContentLoaded", () => {
  chargerTravaux();
  filtres();

  const token = localStorage.getItem("token");

  // Afficher le bouton "modifier" si connecté
  const editBtn = document.getElementById("edit-btn");
  if (token && editBtn) {
    editBtn.style.display = "inline-flex"; // ou "inline-block" selon ton style
  }

  // Gestion du lien login/logout
  const loginLink = document.getElementById("login-link");
  if (loginLink) {
    if (token) {
      loginLink.textContent = "logout";
      loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.reload();
      });
    } else {
      loginLink.addEventListener("click", afficherFormulaireConnexion);
    }
  }
});