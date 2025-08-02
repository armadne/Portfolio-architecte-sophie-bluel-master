// script.js

// Fonction qui va chercher les travaux depuis l'API et les injecte dans la galerie
async function chargerTravaux() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();

    const galerie = document.querySelector(".gallery");

    // Optionnel : vider la galerie au cas où
    galerie.innerHTML = "";

    travaux.forEach(travail => {
      const figure = document.createElement("figure");

      const image = document.createElement("img");
      image.src = travail.imageUrl;
      image.alt = travail.title;

      const titre = document.createElement("figcaption");
      titre.textContent = travail.title;

      figure.appendChild(image);
      figure.appendChild(titre);
      galerie.appendChild(figure);
    });
  } catch (erreur) {
    console.error("Erreur lors du chargement des travaux :", erreur);
  }
}

// Lancer la fonction quand le DOM est chargé
document.addEventListener("DOMContentLoaded", chargerTravaux);
