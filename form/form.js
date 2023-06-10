import "./form.scss";
import "../assets/styles/styles.scss";
import { openModal } from "../assets/javascript/modal.js";



const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const cancelButton = document.querySelector('.btn-secondary');
let errors = [];
let  articleId;

form.addEventListener("submit", async event => {
    event.preventDefault();
    // pour recuperer les données du formulaire
    const formData = new FormData(form);
    // pour les convertir en object
    const article = Object.fromEntries(formData.entries());
    
     
    if (formIsValid(article)) {
      
      // Nous ferons la requête ici !
      try {
        // convertir en json
        const json = JSON.stringify(article);
        let response;
        // Lorsque nous éditons, nous ne créons pas de nouvelle ressource sur le serveur.
        // Nous n’utilisons donc pas une requête POST mais une requête PATCH.
        // Pas PUT car nous ne remplaçons pas la ressource distante (nous gardons
        // la date de création et l’id).
        if (articleId){
          // PATCH pour remplacer que certains elements 
              response = await fetch(`https://restapi.fr/api/article/${articleId}`, {
                  method: "PATCH",
                  body: json,
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
        }else{
            response = await fetch("https://restapi.fr/api/article", {
                method: "POST",
                body: json,
                headers: {
                  "Content-Type": "application/json"
                }
              });
          }
          // const body = await response.json();


          // on verifie si le status est valide et redirige vers l'index
          // en utilisant objet location 
          if (response.status < 299) {
            window.location.assign("/index.html");
          }
        
        // console.log(body);
        } catch (e) {
          console.error("e : ", e);
        }
      
    }
    // form.reset();
});

// Nous allons créer une fonction asynchrone que nous invoquons de suite.
// Nous parsons l’URL de la page et vérifions si nous avons un paramètre id.
// Si nous avons un id, nous récupérons l’article correspondant.
const initForm = async ()=>{
  const params = new URL(window.location.href);
  articleId = params.searchParams.get("id");
 if (articleId){
  const response = await fetch(`https://restapi.fr/api/article/${articleId}`);
  if(response.status <300){
    const article = await response.json();
    
    fillArticle(article);
    
  }
 }

}
initForm();

// Nous remplissons tous les champs de notre formulaire en créant des références
// et en utilisant les informations récupérées du serveur.
const fillArticle = article => {
  const author = document.querySelector('input[name="author"]');
  const category = document.querySelector('input[name="category"]');
  const img = document.querySelector('input[name="img"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector('textarea');
  
    author.value = article.author ||'';
    img.value = article.img || "";
    category.value = article.category || "";
    title.value = article.title || "";
    content.value = article.content || "";
  
};


cancelButton.addEventListener("click", async ()=>{

  const result = await openModal("Si vous quittez la page, vous allez perdre votre article");
  if (result){
  // redirection vers la page index 
  window.location.assign("/index.html")
  }
});
const formIsValid = article => {
  // pour eviter l'affichage  des erreurs répétés on déclare un tableau vide
  errors = [];
  if (
    !article.author ||
    !article.category ||
    !article.content ||
    !article.img ||
    !article.title 
    ){
    errors.push("Vous devez renseigner tous les champs");
  } else {
    errors = [];
  }
  if (errors.length) {
    let errorHTML = "";
    errors.forEach(e => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};