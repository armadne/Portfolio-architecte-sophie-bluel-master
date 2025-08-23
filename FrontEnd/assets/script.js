// script.js

// Variable globale pour stocker tous les travaux
let tousLesTravaux = [];

// FONCTION RECUPERATION DES TRAVUX DEPUIS LE BACKEND : "http://localhost:5678/api/works"
async function chargerTravaux() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    tousLesTravaux = await reponse.json();
    afficherTravaux(tousLesTravaux);
  } catch (erreur) {
    console.error("Erreur lors du chargement des travaux :", erreur);
  }
}

// Affiche les travaux dans la galerie
function afficherTravaux(listeTravaux) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

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

// AFFICHER LES FILTRES
async function afficherFiltres() {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    const filtresContainer = document.querySelector(".filtre");
    if (!filtresContainer) return;
    filtresContainer.innerHTML = "";

    // Fonction pour créer un bouton
    function creerBouton(id, label) {
      const bouton = document.createElement("button");
      bouton.textContent = label;
      bouton.dataset.id = id;
      bouton.classList.add("filtre-btn");

      // Ajout direct de l'événement
      bouton.addEventListener("click", () => {
        filtrerTravaux(parseInt(bouton.dataset.id));
        activerBouton(bouton);
      });

      return bouton;
    }

    // Bouton "Tous"
    filtresContainer.appendChild(creerBouton(0, "Tous"));

    // Boutons catégories
    categories.forEach(categorie => {
      filtresContainer.appendChild(creerBouton(categorie.id, categorie.name));
    });

  } catch (erreur) {
    console.error("Erreur lors du chargement des filtres :", erreur);
  }
}


// FILTRER LES TRAVAUX ET LES AFFICHER
function filtrerTravaux(idCategorie) {
  if (idCategorie === 0) {
    afficherTravaux(tousLesTravaux);
  } else {
    const travauxFiltres = tousLesTravaux.filter(work => work.categoryId === idCategorie);
    afficherTravaux(travauxFiltres);
  }
}


// FONCTION QUI CHANGE APPARARENCE DU FILTRE SELECTIONNER
function activerBouton(boutonActif) {
  const boutons = document.querySelectorAll(".filtre-btn");
  boutons.forEach(b => b.classList.remove("actif"));
  boutonActif.classList.add("actif");
}

// FONCTION AFFICHAGE FORMULAIRE DE CONNEXION
function afficherFormulaireConnexion() {
  const main = document.querySelector("main");
  if (!main) return;

  // Nettoyer le contenu existant
  main.innerHTML = "";

  // Section 
  const section = document.createElement("section");
  section.classList.add("login-section");

  //Titre 
  const h2 = document.createElement("h2");
  h2.classList.add("login-title");
  h2.textContent = "Log In";

  // Formulaire
  const form = document.createElement("form");
  form.id = "login-form";
  form.classList.add("login-form");

  // Label email
  const labelEmail = document.createElement("label");
  labelEmail.setAttribute("for", "email");
  labelEmail.classList.add("login-label");
  labelEmail.textContent = "E-mail";

  // Input email
  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.id = "email";
  inputEmail.classList.add("login-input");
  inputEmail.required = true;

  // Label password
  const labelPassword = document.createElement("label");
  labelPassword.setAttribute("for", "password");
  labelPassword.classList.add("login-label");
  labelPassword.textContent = "Mot de passe";

  // Input password
  const inputPassword = document.createElement("input");
  inputPassword.type = "password";
  inputPassword.id = "password";
  inputPassword.classList.add("login-input");
  inputPassword.required = true;

  // Bouton connexion
  const btnSubmit = document.createElement("button");
  btnSubmit.type = "submit";
  btnSubmit.classList.add("login-button");
  btnSubmit.textContent = "Se connecter";

  // Message erreur
  const errorMsg = document.createElement("p");
  errorMsg.id = "login-error";
  errorMsg.classList.add("login-error");
  errorMsg.textContent = "Email ou mot de passe incorrect.";
  errorMsg.style.display = "none";

  // Lien mot de passe oublié
  const forgotLink = document.createElement("a");
  forgotLink.href = "#";
  forgotLink.classList.add("login-link");
  forgotLink.textContent = "Mot de passe oublié";

  // Construction du DOM 
  form.appendChild(labelEmail);
  form.appendChild(inputEmail);
  form.appendChild(labelPassword);
  form.appendChild(inputPassword);
  form.appendChild(btnSubmit);
  form.appendChild(errorMsg);
  form.appendChild(forgotLink);

  section.appendChild(h2);
  section.appendChild(form);

  main.appendChild(section);

  // Gestion du submit 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        alert("Connexion réussie !");
        window.location.href = "index.html";
      } else {
        errorMsg.style.display = "block";
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  });
}



// Création d'un élément figure dans la modale

function createModalFigure(work) {
  const figure = document.createElement("figure");
  figure.classList.add("modal-figure");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  img.classList.add("modal-img");

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
  deleteIcon.dataset.id = work.id;

  deleteIcon.addEventListener("click", () => handleDeleteWork(work, figure));

  figure.appendChild(img);
  figure.appendChild(deleteIcon);

  return figure;
}


// Suppression d'un projet

async function handleDeleteWork(work, figure) {
  if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      figure.remove(); // Supprimer du DOM (modale)
      tousLesTravaux = tousLesTravaux.filter(t => t.id !== work.id);
      afficherTravaux(tousLesTravaux); // MAJ galerie principale
    } else {
      alert("Erreur lors de la suppression.");
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
}


// Afficher les projets dans la modale

async function fetchWorksAndDisplayInModal() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const travaux = await response.json();
    const modalGallery = document.getElementById("modal-gallery");
    if (!modalGallery) return;

    modalGallery.innerHTML = "";
    travaux.forEach(work => {
      modalGallery.appendChild(createModalFigure(work));
    });
  } catch (error) {
    console.error("Erreur lors de l'affichage des travaux dans la modale :", error);
  }
}


// Gérer la barre d'édition

function toggleModeEdition(token) {
  const modeEditionBar = document.getElementById("mode-edition-container");
  if (modeEditionBar) {
    modeEditionBar.style.display = token ? "flex" : "none";
  }
}


// Gérer les filtres

function toggleFiltres(token) {
  const filtresContainer = document.querySelector(".filtre");
  if (!filtresContainer) return;
  filtresContainer.style.display = token ? "none" : "flex";
  if (!token) afficherFiltres();
}


// Gérer le login/logout

function setupLogin(token) {
  const loginLink = document.getElementById("login-link");
  const editBtn = document.getElementById("edit-btn");

  if (editBtn) editBtn.style.display = token ? "inline-flex" : "none";

  if (loginLink) {
    loginLink.textContent = token ? "logout" : "login";
    loginLink.addEventListener("click", e => {
      e.preventDefault();
      if (token) {
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        afficherFormulaireConnexion();
      }
    });
  }
}


// Gestion ouverture / fermeture modale

function setupModal() {
  const modal = document.getElementById("modal");
  document.getElementById("open-modal")?.addEventListener("click", () => {
    modal?.classList.remove("hidden");
    fetchWorksAndDisplayInModal();
  });
  document.getElementById("close-modal")?.addEventListener("click", () => {
    modal?.classList.add("hidden");
  });
  modal?.addEventListener("click", e => {
    const modalContent = document.querySelector(".modal-content");
    if (!modalContent.contains(e.target)) modal.classList.add("hidden");
  });
}

// Gestion ajout photo

function setupPhotoUpload() {
  const display = document.getElementById("upload-placeholder");
  const input = document.getElementById("input-file");

  if (input && display) {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        display.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.id = "photo-preview";
        img.style.maxHeight = "100%";
        img.style.objectFit = "contain";
        img.addEventListener("click", () => input.click());
        display.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }
}


// INITITALISATION : Quand le DOM est chargé : on initialise les travaux, la session utilisateur et les modales

document.addEventListener("DOMContentLoaded", () => {
  chargerTravaux();

  const token = localStorage.getItem("token");

  toggleModeEdition(token);
  toggleFiltres(token);
  setupLogin(token);
  setupModal();
  setupPhotoUpload();

  // Navigation modale : galerie <-> ajout
  const addPhotoBtn = document.getElementById("add-photo-btn");
  const modalViewGallery = document.getElementById("modal-view-gallery");
  const modalViewAdd = document.getElementById("modal-view-add");
  const backToGalleryBtn = document.getElementById("back-to-gallery");

  addPhotoBtn?.addEventListener("click", () => {
    modalViewGallery?.classList.add("hidden");
    modalViewAdd?.classList.remove("hidden");
  });
  backToGalleryBtn?.addEventListener("click", () => {
    modalViewAdd?.classList.add("hidden");
    modalViewGallery?.classList.remove("hidden");
  });
});




// Soumission du formulaire "Ajout photo"
const addPhotoForm = document.getElementById("add-photo-form");
const validerBtn = document.getElementById("valider-btn");

if (addPhotoForm) {
  addPhotoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titre = document.getElementById("titre").value.trim();
    const categorie = document.getElementById("categorie").value;
    const fichier = document.getElementById("input-file").files[0];
    const token = localStorage.getItem("token");

    if (!titre || !categorie || !fichier) {
      alert("Merci de remplir tous les champs !");
      return;
    }

    const formData = new FormData();
    formData.append("title", titre);
    formData.append("category", categorie);
    formData.append("image", fichier);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const newWork = await response.json();

        //  Ajouter le nouveau travail à la liste globale
        tousLesTravaux.push(newWork);

        //  Réafficher tous les travaux
        afficherTravaux(tousLesTravaux);

        // Mettre à jour la galerie modale
        fetchWorksAndDisplayInModal();

        // Réinitialiser le formulaire
        addPhotoForm.reset();

        // Réinitialiser l'affichage de l'upload (sans HTML brut)
        const display = document.getElementById("upload-placeholder");
        display.innerHTML = ""; // Nettoyage

        const img = document.createElement("img");
        img.src = "./assets/images/picture-svgrepo-com1.png";
        img.alt = "";

        const label = document.createElement("label");
        label.setAttribute("for", "input-file");
        label.classList.add("upload-label");
        label.textContent = "+ Ajouter photo";

        const info = document.createElement("p");
        info.classList.add("upload-info");
        info.textContent = "jpg, png : 4mo max";

        display.appendChild(img);
        display.appendChild(label);
        display.appendChild(info);

        // Fermer la modale
        modal.classList.add("hidden");
        modalViewAdd.classList.add("hidden");
        modalViewGallery.classList.remove("hidden");
      } else {
        alert("Erreur lors de l'ajout du projet.");
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  });
}



  // Fermer modale en cliquant en dehors
  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal?.classList.add("hidden");
      modalViewAdd?.classList.add("hidden");
      modalViewGallery?.classList.remove("hidden");
    }
  });

