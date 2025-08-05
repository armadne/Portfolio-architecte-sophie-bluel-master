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

    // Pour chaque catégorie, on crée un bouton avec son nom.
//Chaque bouton reçoit une classe CSS "button".
// Lorsqu'on clique sur un bouton, la fonction chargerTravaux(id) est appelée, avec l'id de la catégorie.
// Cette fonction filtre les projets pour n’afficher que ceux qui ont une propriété categoryId correspondant à l’id de la catégorie sélectionnée.
// Lorsqu’on clique sur un bouton, la fonction `chargerTravaux(id)` est appelée avec l’id de la catégorie (ex: 1 pour “Objets”).
// Cette fonction :
// efface les projets déjà visibles dans la galerie,
// sélectionne uniquement ceux qui ont `categoryId === id`, (exemple categorie "Objets" donc id = 1)
//  puis affiche ces projets (avec leur image et titre) dans la galerie. (donc affiche tous les projets qui ont comme id= 1)
// *Chaque projet possède une image, un titre et un identifiant de catégorie.




    // Gestion des clics
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

// Fonction pour gérer l'apparence du bouton actif
function activerBouton(boutonActif) {
  const boutons = document.querySelectorAll(".filtre-btn");
  boutons.forEach(b => b.classList.remove("actif")); //  On enlève la classe CSS "actif" à tous les boutons pour que un seul puisse être actif à la fois.
  boutonActif.classList.add("actif"); // On ajoute la classe "actif" au bouton qui a été cliqué.
  // lors du clique sur le bouton , le bouton devient actif avec un changement de couleur
}

// Quand le DOM est prêt, on charge tout
// Après que tous le code HTML soit chargé
document.addEventListener("DOMContentLoaded", () => {
  chargerTravaux(); // Affiche dynamiquement via "fetch" les projets
  filtres(); // Affiche dynamiquement via "fetch" les filtres sous forme de boutons
});
