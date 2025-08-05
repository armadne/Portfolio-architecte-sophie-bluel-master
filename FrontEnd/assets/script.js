// script.js

// Fonction qui va chercher les travaux depuis l'API et les injecte dans la galerie
async function chargerTravaux() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();

    const gallery = document.querySelector(".gallery");

    // Optionnel : vider la galerie au cas où
    gallery.innerHTML = "";

    works.forEach(work => {    // Pour chaque projet : afficher image , titre etc...
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
  } catch (erreur) {
    console.error("Erreur lors du chargement des travaux :", erreur);
  }
}

// Lancer la fonction quand le DOM est chargé
document.addEventListener("DOMContentLoaded", chargerTravaux);

async function filtres() {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    const filtresContainer = document.querySelector(".filtre");

    // Vider le conteneur des filtres
    filtresContainer.innerHTML = "";

    // Créer le bouton "Tous"
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Tous";
    boutonTous.dataset.id = 0;
    boutonTous.classList.add("filtre-btn");
    filtresContainer.appendChild(boutonTous);

    // Créer un bouton pour chaque catégorie
    categories.forEach(categorie => {
      const bouton = document.createElement("button");
      bouton.textContent = categorie.name;
      bouton.dataset.id = categorie.id;
      bouton.classList.add("filtre-btn");
      filtresContainer.appendChild(bouton);
    });

    // Ajouter les écouteurs d'événements à tous les boutons
    const boutons = document.querySelectorAll(".filtre-btn");
    boutons.forEach(bouton => {
      bouton.addEventListener("click", () => {
        const idCategorie = parseInt(bouton.dataset.id);
        filtrerTravaux(idCategorie);
      });
    });

  } catch (erreur) {
    console.error("Erreur lors du chargement des filtres :", erreur);
  }
}

// À appeler après le chargement de la page
filtres();

// Fonction de filtrage (à adapter selon ta logique)
function filtrerTravaux(idCategorie) {
  console.log(`Filtrage des travaux pour la catégorie : ${idCategorie}`);
  // Ici tu dois implémenter l'affichage des travaux filtrés dans .gallery
}
