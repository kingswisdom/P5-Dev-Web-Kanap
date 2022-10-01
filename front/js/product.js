/* ----------------------------------products.js----------------------------------------------

Ce fichier .js permet de charger puis afficher le produit sélectionné par son id   

---------------------------------------------------------------------------------------------*/ 

//-----------------------------------------------------//
//----------------Variables Globales------------------//
//---------------------------------------------------//

const productId = new URLSearchParams(window.location.search).get("id");         /*On utilise URLSearchParams pour "parse" l'URL, et sélectionner le paramètre "id" */
const productAPI = `http://localhost:3000/api/products/${productId}`;            /*On stocke l'url API du produit */
let localStorageCart = JSON.parse(localStorage.getItem("Panier"))                /*Cherche dans le localStorage si il y a un item "Product" */


//-----------------------------------------------------//
//----------------------Processus---------------------//
//---------------------------------------------------//

fetchProduct(productAPI);


//-----------------------------------------------------//
//----------------------Fonctions---------------------//
//---------------------------------------------------//

/*###########################-API-###########################*/

function fetchProduct(productAPI){
    fetch(productAPI)                                                            /*On récupère les infos du produit dans productAPI*/ 
        .then( response => response.json() )                                     /*Traitement de la réponse avec JSON */
        .then( product => { 
            editInnerHTML(product);        
            listeningOrder(product);        
        });
}


/*####################-Affichage produit-####################*/

function editInnerHTML(product){
    document.querySelector(".item__img").innerHTML += `<img src="${product.imageUrl}"" alt="${product.altTxt}">`;
    document.querySelector("#title").innerHTML +=  `${product.name}`;
    document.querySelector("#price").innerHTML += `${product.price}`;
    document.querySelector("#description").innerHTML += `${product.description}`;                                           /*On ajoute les données au HTML */
    for (element of product.colors) {
        document.querySelector("#colors").innerHTML += `<option value="${element}">${element}</option>`
        }
}


/*######################-EventListener-######################*/

function listeningOrder(product){
    document.querySelector("#addToCart").addEventListener('click', (event) => {                                             /*EventListener sur le bouton #addToCart */
        if(parseInt(document.querySelector("#quantity").value == 0) || document.querySelector("#colors").value == "" ) {    /*Si il manque une option */
            alert("Veuillez sélectionner une option !");
        }
        else {                                                                                                              /*Si les options sont valides */
            let productOptions = {
                _id: `${product._id}`,
                name: `${product.name}`,
                color: document.querySelector("#colors").value,
                quantity: parseInt(document.querySelector("#quantity").value),
                price: `${product.price}`,
                imageUrl: `${product.imageUrl}`,
                altTxt: `${product.altTxt}`
            }
            addToCart(productOptions);
        }            
    })
}


/*####################-Gestion commmande-####################*/

function addToCart(productOptions){    
    if (localStorageCart === null) {                                           /*Si localStorage vide */
        createNewCart(productOptions);        
    }
    else {                                                                     /*Si il y a déjà un ou des items dans le localStorage */
        handleItemAlreadyInCart(productOptions);
    }
}

function createNewCart(productOptions){
    localStorageCart = [];                                                     /*On créé une array */
    localStorageCart.push(productOptions);                                     /*On push dans l'array les données du produit à ajouter */
    saveCart();
}

function handleItemAlreadyInCart(productOptions) {
    let itemAlreadyInCart = findItemAlreadyInCart(productOptions);                                                       
        if (itemAlreadyInCart == undefined) {                                  /*Si l'objet n'est pas déjà dans le panier */
            localStorageCart.push(productOptions);                             /*Push les infos du produits dans le panier */
            saveCart();                                                        /*Enregistre le panier dans le localStorage */
        }
        else {                                                                 /*Si l'objet est déjà dans le panier */
            itemAlreadyInCart.quantity += productOptions.quantity;             /*Incrémenter la quantité choisie à la quantité dans le panier*/
            saveCart();                                                        /*Enregistrer le nouveau panier */
        }
}

function findItemAlreadyInCart(productOptions){
    let itemAlreadyInCart = localStorageCart.find(element => 
        element._id == productOptions._id &&
        element.color == productOptions.color                                  /*Cherche si il y a un produit avec la meme couleur et le meme _id*/
    );
    return itemAlreadyInCart;  
}

function saveCart(){
    localStorage.setItem("Panier", JSON.stringify(localStorageCart));          /*On crée un item Panier sous forme de string dans le localStorage */
    console.log("Item saved to cart succefully ! ")
    console.log(localStorage)
}




//-----------------------------------------------------//
//---------Récupération des infos sur l'API-----------//
//---------------------------------------------------//




//-----------------------------------------------------//
//---------Gestion de l'affichage du produit----------//
//---------------------------------------------------//




//-----------------------------------------------------//
//-------------------EventListener--------------------//
//---------------------------------------------------//




//-----------------------------------------------------//
//--------------Gestion de la commande----------------//
//---------------------------------------------------//

