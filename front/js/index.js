/* ----------------------------------index.js--------------------------------------------------

Ce fichier .js permet de charger puis afficher la liste des produits disponibles sur l'API,   

---------------------------------------------------------------------------------------------*/

const productsAPI = `http://localhost:3000/api/products`; /*Chargement de la liste des produits dans la const productsList*/

function displayProducts(jsonData) {
    for(let i=0; i<=jsonData.length; i++){ /*on fait une boucle avec itération sur la longueur du document json*/
        let product = jsonData[i] /*On stocke chaque ligne dans la variable product */
        document.querySelector(".items").innerHTML += `<a href="./product.html?id=${product._id}">          
                                                                <article>
                                                                    <img src="${product.imageUrl}"" alt="${product.altTxt}">
                                                                    <h3 class="productName">${product.name}</h3>
                                                                    <p class="productDescription">${product.description}</p>
                                                                </article>
                                                            </a>`; /*On ajoute le code ci-dessus au HTML, à l'élément possédant l'id "items" */
    }
}




fetch(productsAPI) /*On récupère la liste des produits dans le lien contenu dans productsList*/ 
    .then( response => response.json() ) /*Traitement de la réponse avec JSON */
    .then( jsonData => { 
        displayProducts(jsonData); /*Lancement de la fonction displayProducts avec les données JSON*/
});




 