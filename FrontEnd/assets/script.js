// script.js

// Variable globale pour stocker tous les travaux
let tousLesTravaux = [];


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


async function afficherFiltres() {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    const filtresContainer = document.querySelector(".filtre");
    if (!filtresContainer) return;
    filtresContainer.innerHTML = "";

    // Bouton "Tous"
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Tous";
    boutonTous.dataset.id = 0;
    boutonTous.classList.add("filtre-btn");
    filtresContainer.appendChild(boutonTous);

    // Boutons catégories
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

function filtrerTravaux(idCategorie) {
  if (idCategorie === 0) {
    afficherTravaux(tousLesTravaux);
  } else {
    const travauxFiltres = tousLesTravaux.filter(work => work.categoryId === idCategorie);
    afficherTravaux(travauxFiltres);
  }
}

function activerBouton(boutonActif) {
  const boutons = document.querySelectorAll(".filtre-btn");
  boutons.forEach(b => b.classList.remove("actif"));
  boutonActif.classList.add("actif");
}


function afficherFormulaireConnexion() {
  const main = document.querySelector("main");
  if (!main) return;

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

  const form = document.getElementById("login-form");
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        alert("Connexion réussie !");
        window.location.href = "index.html";
      } else {
        document.getElementById("login-error").style.display = "block";
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  });
}

// FENETRE MODALE 
async function fetchWorksAndDisplayInModal() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const travaux = await response.json();
    const modalGallery = document.getElementById("modal-gallery");
    if (!modalGallery) return;
    modalGallery.innerHTML = "";

    travaux.forEach(work => {
      const figure = document.createElement("figure");
      figure.classList.add("modal-figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      img.classList.add("modal-img");

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
      deleteIcon.dataset.id = work.id;

      // ✅ Gestion du clic sur la corbeille
deleteIcon.addEventListener("click", async () => {
  if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 🔥 Supprimer du DOM (modale)
        figure.remove();

        // 🔥 Supprimer aussi dans la galerie principale
        tousLesTravaux = tousLesTravaux.filter(t => t.id !== work.id);
        afficherTravaux(tousLesTravaux);
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  }
});

      figure.appendChild(img);
      figure.appendChild(deleteIcon);
      modalGallery.appendChild(figure);
    });

  } catch (error) {
    console.error("Erreur lors de l'affichage des travaux dans la modale :", error);
  }
}

// ÉVÉNEMENTS DOM 
document.addEventListener("DOMContentLoaded", () => {
  chargerTravaux();
  afficherFiltres();

  // Gestion login/logout
  const token = localStorage.getItem("token");

    //  Affiche la barre noire "Mode Edition" seulement si connecté
  const modeEditionBar = document.getElementById("mode-edition-container");
  if (modeEditionBar) {
    modeEditionBar.style.display = token ? "flex" : "none"; 
  }

    //  On n'affiche les filtres QUE si l'user n'est pas connecté
  if (!token) {
    afficherFiltres();
  } else {
    const filtresContainer = document.querySelector(".filtre");
    if (filtresContainer) filtresContainer.style.display = "none";
  }




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

  // Modale ouverture/fermeture
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

  // Vue ajout photo
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

// Upload photo preview
const display = document.getElementById("upload-placeholder");
const input = document.getElementById("input-file");

if (input && display) {
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      display.innerHTML = ""; // 🔥 enlève le bouton + et le texte
      const img = document.createElement("img");
      img.src = e.target.result;
      img.id = "photo-preview";
      img.style.maxHeight = "100%"; // pour rester dans le cadre
      img.style.objectFit = "contain";
      
      // Clique sur l'image = re-ouvrir l'input file
      img.addEventListener("click", () => {
        input.click();
      });

      display.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}



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

          // 🔥 Ajouter le nouveau travail à la liste globale
          tousLesTravaux.push(newWork);

          // 🔥 Réafficher tous les travaux
          afficherTravaux(tousLesTravaux);

          // 🔥 Mettre à jour la galerie modale
          fetchWorksAndDisplayInModal();

          // Réinitialiser le formulaire
          addPhotoForm.reset();
          display.innerHTML = `
            <img src="./assets/images/picture-svgrepo-com1.png" alt="">
            <label for="input-file" class="upload-label">+ Ajouter photo</label>
            <p class="upload-info">jpg, png : 4mo max</p>
          `;

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
});
