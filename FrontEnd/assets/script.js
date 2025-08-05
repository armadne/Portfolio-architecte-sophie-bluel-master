// script.js

// Variable globale pour stocker tous les travaux une fois récupérés
let tousLesTravaux = [];

// Fonction qui récupère tous les travaux et les stocke
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
  gallery.innerHTML = ""; // On vide la galerie

  listeTravaux.forEach(work => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const titre = document.createElement("figcaption");
    titre.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(titre);
    gallery.appendChild(figure);
  });
}

// Fonction qui affiche les filtres (boutons)
async function filtres() {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    const filtresContainer = document.querySelector(".filtre");
    filtresContainer.innerHTML = "";

    // Bouton "Tous"
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Tous";
    boutonTous.dataset.id = 0;
    boutonTous.classList.add("filtre-btn");
    filtresContainer.appendChild(boutonTous);

    // Boutons de catégories
    categories.forEach(categorie => {
      const bouton = document.createElement("button");
      bouton.textContent = categorie.name;
      bouton.dataset.id = categorie.id;
      bouton.classList.add("filtre-btn");
      filtresContainer.appendChild(bouton);
    });

    // Gestion des clics
    const boutons = document.querySelectorAll(".filtre-btn");
    boutons.forEach(bouton => {
      bouton.addEventListener("click", () => {
        const idCategorie = parseInt(bouton.dataset.id);
        filtrerTravaux(idCategorie);
        activerBouton(bouton);
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

// Fonction pour gérer l'apparence du bouton actif
function activerBouton(boutonActif) {
  const boutons = document.querySelectorAll(".filtre-btn");
  boutons.forEach(b => b.classList.remove("actif")); // Supprimer la classe active
  boutonActif.classList.add("actif"); // Ajouter la classe active
}

// Quand le DOM est prêt, on charge tout
document.addEventListener("DOMContentLoaded", () => {
  chargerTravaux();
  filtres();
});
