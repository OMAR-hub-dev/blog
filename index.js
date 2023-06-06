import "./assets/styles/styles.scss";

import "./index.scss";

const articleContainerElement = document.querySelector(".articles-container");
const createArticles = (articles)=>{
    const articlesDOM= articles.map(article=>{
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
         }); 
    })
 
}

const fetchArticle = async ()=>{
    try{
        const response = await fetch ("https://restapi.fr/api/article");
        let articles = await response.json();
        // Restapi retourne un objet s'il n'y a qu'un seul article
        // nous devons donc le transformer en tableau :
        if (!Array.isArray(articles)) {
        articles = [articles];
        }
        // console.log(articles);
        createArticles(articles);
        }
    catch(e){
        console.log('e :',e)
    }
}
fetchArticle();