import "./form.scss";
import "../assets/styles/styles.scss";


const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
let errors = [];

form.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(form);
    const article = Object.fromEntries(formData.entries());
    if (formIsValid(article)) {
      const json = JSON.stringify(article);
      // Nous ferons la requête ici !
      try {
        const json = JSON.stringify(article);
        const response = await fetch("https://restapi.fr/api/test", {
          method: "POST",
          body: json,
          headers: {
            "Content-Type": "application/json"
          }
        });
        const body = await response.json();
        console.log(body);
      } catch (e) {
        console.error("e : ", e);
      }
      
    }
});

const formIsValid = article => {
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