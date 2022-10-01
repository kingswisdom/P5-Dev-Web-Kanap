/* ----------------------------------index.js--------------------------------------------------

Ce fichier .js permet de charger puis afficher la liste des produits disponibles sur l'API,   

---------------------------------------------------------------------------------------------*/

//-----------------------------------------------------//
//----------------Variables Globales------------------//
//---------------------------------------------------//

const productsAPI = `http://localhost:3000/api/products`;                   /*Chargement de l'adresse pour la liste des produits dans la const productsList*/


//-----------------------------------------------------//
//----------------------Processus---------------------//
//---------------------------------------------------//

fetchProducts(productsAPI);


//-----------------------------------------------------//
//----------------------Fonctions---------------------//
//---------------------------------------------------//

/*###########################-API-###########################*/

function fetchProducts(productsAPI){
    fetch(productsAPI)                                                      /*On récupère la liste des produits dans le lien contenu dans productsAPI*/ 
        .then( response => response.json() )                                /*Traitement de la réponse avec JSON */
        .then( jsonData => { displayProducts(jsonData); });                 /*Lancement de la fonction displayProducts avec les données JSON*/
}


/*####################-Affichage produit-####################*/

function displayProducts(jsonData) {
    for(let element of jsonData){                                           /*Boucle : pour chaque élément de la réponse API (jsonData)*/
        addProductToInnerHTML(element);                                     /*On appelle la fonction "addProductToInnerHTML"*/
    }                                                                       
}

function addProductToInnerHTML(element){
    document.querySelector(".items").innerHTML +=                           /*On incrémente le code suivant à l'élément de classe "items"  */
        `
        <a href="./product.html?id=${element._id}">          
            <article>
                <img src="${element.imageUrl}"" alt="${element.altTxt}">
                <h3 class="productName">${element.name}</h3>
                <p class="productDescription">${element.description}</p>
            </article>
         </a>
        `;
}