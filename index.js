import "./assets/styles/styles.scss";
import { openModal } from "./assets/javascript/modal.js";
import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");
const categoriesContainerElement = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let articles;
let filter;
let sortBy;


const createArticles = ()=>{
    const articlesDOM= articles
    // Pour le filtre, nous déclarons une variable filter que nous allons utiliser simplement avec la méthode filter() sur notre tableau d'articles lors de la création des éléments articles sur le DOM :
        .filter((article)=>{
            // Si nous avons un filtre nous retournons le tableau filtré par catégorie, sinon nous retournons le tableau entier en retournant true pour tous les éléments. 
                if(filter){
                    return article.category === filter
                }else{
                    return true
                }
            })
        .map(article=>{
            const articleDOM = document.createElement('div');
            articleDOM.classList.add('article');
            articleDOM.innerHTML= `
        
                        <img
                            src="${article.img}"
                            alt="profile"
                        />
                        <h2>${article.title}</h2>
                        <p class="article-author">${article.author} -  ${new Date(article.createdAt )
                                                                        .toLocaleDateString("fr-FR", {
                                                                                                    weekday: "long",
                                                                                                    day: "2-digit",
                                                                                                    month: "long",
                                                                                                    year: "numeric"
                                                                                                    })}</p>
                        <p class="article-content">${article.content}</p>
                        <div class="article-actions">
                            <button class="btn btn-primary" data-id=${article._id} >Modifier</button>
                            <button class="btn btn-danger delete" data-id=${article._id}>Supprimer</button>
                        </div>
                        `;
        return articleDOM;
    });
    articleContainerElement.innerHTML = "";
    articleContainerElement.append(...articlesDOM);
    // pour edition d'un article
    const editButtons = document.querySelectorAll('.btn-primary');
    editButtons.forEach(button =>{
        button.addEventListener('click',(event)=>{
            const value = event.target;
            const articleId = value.dataset.id
            window.location.assign(`/form.html?id=${articleId}`)
        });
    });
    
  
    // pour supprimmer un article
    const deletArticle = document.querySelectorAll('.delete');
    // on parcour ts les boutton supprimmer collectés
    deletArticle.forEach(delet =>{
        delet.addEventListener('click', async (e) =>{
            // Nous allons retourner une promesse de notre fonction createModal() et nous allons donc pouvoir utiliser await
            const result = await openModal("Etes vous sûr de vouloir supprimer votre article ?");
            if (result){
                     // on recupere ID du button selection  via dataset
                        const articleId = e.target.dataset.id; 
                        try{
                            const response = await fetch(`https://restapi.fr/api/article/${articleId}`,{
                                method: "DELETE",
                            })
                            const body = await response.json();
                        }
                        catch(e){
                            console.error("e : ", e);
                        }
                        fetchArticle();
            }
       
         }); 
    })
 
}

const fetchArticle = async ()=>{
    try{
        // Dans la fonction fetchArticle() nous allons utiliser la valeur de la variable sortBy : 
        const response = await fetch (`https://restapi.fr/api/article?sort=createdAt:${sortBy}`);
        articles = await response.json();
        // Restapi retourne un objet s'il n'y a qu'un seul article
        // nous devons donc le transformer en tableau :
        if (!Array.isArray(articles)) {
        articles = [articles];
        }
// nous appelions une nouvelle fonction que nous allons créer lorsque nous récupérons les articles du serveur. 
        createCategory();
        createArticles();
        }
    catch(e){
        console.log('e :',e)
    }
   
}
fetchArticle();

// Puis nous écoutons l'événement change qui est émis dès lors qu'un élément de la liste est sélectionné afin de modifier l'ordre de tri : 
selectElement.addEventListener('change', ()=>{
    sortBy = selectElement.value
    fetchArticle();
})
const createCategory = () =>{
    // es articles récupérées du serveur et va commencer par les transformer en objet avec la méthode reduce() que nous avions vue. 
    const categories = articles.reduce((acc, article)=>{
        if (acc[article.category]){
            acc[article.category]++;
        }else{
            acc[article.category] = 1;
        }
        return acc;
    },{});
    // Ensuite, nous transformons cet objet en tableau de tableaux contenant en premier index le nom de la catégorie et en second le nombre d'articles dans la catégorie. 
    // sort((a, b) => a.localeCompare(b)) => pour trier en ordre alphabetique
    const categoryArr = Object.keys(categories).sort((a, b) => a.localeCompare(b)).map(category=>{
        return [category, categories[category]];
    });
    displayMenuCategoris(categoryArr);
}

// Cette fonction va créer un élément de liste pour chaque catégorie contenu dans le tableau.
// Chaque élément de liste contiendra le nom de la catégorie et le nombre d'articles dans la catégorie
const displayMenuCategoris = (categoryArr) => {
    const elements = categoryArr.map(element=>{
        const lis = document.createElement('li');
        lis.innerHTML = `${element[0]} (<strong>${element[1]}</strong>)`;
        // Pour un tri par date - Il ne nous reste plus qu'à ajouter la classe active sur la catégorie sélectionnée si il existe un filtre, lors de la création et de l'affichage du menu des catégories : 
        if (element[0] === filter) {
            lis.classList.add("active");
          }
        //   pour filter
        lis.addEventListener('click',()=>{
            if(filter === element[0]){
                elements.forEach( li=>{
                    li.classList.remove('active');
                });
                filter = null;
            }else{
                filter = element[0];
                elements.forEach( li=>{
                li.classList.remove('active');
                });
                lis.classList.add('active');
            }
            
            createArticles();
            
        })
        return lis;
    });
// Enfin, nous n'avons qu'à append() les éléments sur le conteneur ayant la classe categories et sur lequel nous avons créé une référence. 
    categoriesContainerElement.innerHTML = '';
    categoriesContainerElement.append(...elements);
}