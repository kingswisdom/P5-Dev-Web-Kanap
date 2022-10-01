/* ----------------------------------cart.js--------------------------------------------------

Ce fichier .js permet de charger puis afficher le panier enregistré dans LocalStorage   

---------------------------------------------------------------------------------------------*/

//-----------------------------------------------------//
//----------------Variables Globales------------------//
//---------------------------------------------------//

let savedCart = JSON.parse(localStorage.getItem("Panier"));                                 /*On récupère le panier dans le localStorage */
let totalPrice = 0;                                                                         /*On crée des variables globales pour certaines fonctions */
let totalQuantity = 0;                                                                      
let IdsInCart = [];                                                                         /*On prépare une array pour enregistrer les ids produits */
let orderBtn = document.querySelector(".cart__order__form__submit");                        /*On sélectionne le orderBtn pour plus tard*/
let orderAPI = "http://localhost:3000/api/products/order";

//-----------------------------------------------------//
//----------------------Processus---------------------//
//---------------------------------------------------//

displayCart(savedCart);                                                                     /*Processus au lancement de la page */
calculateDisplaySums(savedCart);
setInputsAttributes();
getIdsInCart(savedCart);
listenOrderBtn();

//-----------------------------------------------------//
//----------------------Fonctions---------------------//
//---------------------------------------------------//

/*####################-Affichage produit-####################*/


function displayCart(savedCart) {                                                           /*Affiche le panier à l'utilisateur */
    if (savedCart === null || savedCart.length == 0 ) {                                     /*Si le panier est vide */
        document.getElementById("cart__title").innerHTML = `Votre panier est vide`;         /*Affiche l'état du panier à l'utilisateur */
    } else {                                                                                /*Si le panier contient un/des produits */
        fetchProductsAPI(savedCart);                                                        /*Appelle la fonction festchProductsAPI */
    }
};


function fetchProductsAPI(savedCart){                                                       /*Récupère les infos de chaque produit du panier dans l'API */
    for(let element of savedCart){                                                          /*Boucle pour afficher les éléments du panier */
            let productAPI = `http://localhost:3000/api/products/${element._id}`;           /*On prépare la requête vers api/products/id */
            fetch(productAPI)                                                               /*On requete l'API*/ 
                .then( response => response.json())                                         /*Après réponse, traitement de la réponse avec JSON */
                .then( jsonData => createDiv(element, jsonData))                            /*Après traitement, envoyer la réponse à la fonction "createDiv" */
        };
}

function createDiv(element, jsonData){                                                      /*Affiche un div avec les éléments du panier + API */
    const div = document.createElement('div')                                               /*Crée un div avec le contenu suivant dans le innerHTML*/ 
    div.innerHTML += `<article class="cart__item" data-id="${element._id}">                 
                        <article class="cart__item" data-id="${element._id}">
                            <div class="cart__item__img">
                                <img src="${element.imageUrl}" alt="${element.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__titlePrice">
                                    <h2>${element.name}</h2>
                                    <p>${jsonData.price * element.quantity} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Couleur : ${element.color}</p>
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" productId="${element._id}" productColor="${element.color}" value="${element.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem" productId="${element._id}" productColor="${element.color}">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </article>`;
    div.addEventListener('change', event => editQuantity(event, savedCart));                /*Ajout d'un eventListener "change" pour le div créé */
    div.addEventListener('click', event => deleteProduct(event, savedCart))                 /*Ajout d'un eventListener "click" pour le div créé */
    document.querySelector("#cart__items").appendChild(div);                                /*On ajoute le div à la suite d'autres div dans l'élément "#cart__items" */
}

function calculateDisplaySums(savedCart) {                                                  /*Calcule puis affiche les quantités produits et sommes de prix*/
    for(let element of savedCart){                                                          /*Boucle pour chaque élément du panier*/
        let priceSum = parseInt(element.price * element.quantity);                          /*On récupère le prix multiplié par la quantité pour chaque ligne */
        let quantitySum = parseInt(element.quantity);                                       /*On récupère la quantité pour chaque ligne */
        totalPrice += priceSum;                                                             /*On ajoute la somme des prix pour chaque ligne */
        totalQuantity += quantitySum;                                                       /*Idem pour la quantité */
    }
    document.querySelector("#totalPrice").innerHTML = `${totalPrice}`;                      /*On ajoute au HTML le prix total du panier*/
    document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}`;                /*On ajoute au HTML la quantité d'articles du panier */
}


/*######################-Edition panier-#####################*/

function editQuantity(event, savedCart) {                                                   /*Edite les quantités de produits dans le panier */
    let selectedItem = findItemToUpdate(event, savedCart);                                  /*Récupère l'élement sélectionné par l'utilisateur   */
    selectedItem.quantity = event.target.value;                                             /*Remplace la quantité du panier par l'entrée utilisateur  */
    updateCart(savedCart);                                                                  /*On envoie le nouveau panier vers la fonction "updateCart" */
   
}

function deleteProduct(event, savedCart) {                                                  /*Supprime un produit du panier */
    if(event.target.classList.contains('deleteItem') === true){                             /*Si l'utilisateur a cliqué sur le bouton "Supprimer" */
        let selectedItem = findItemToUpdate(event, savedCart);                              /*Récupère l'élement visé par l'utilisateur   */
        updatedCart = savedCart.filter(item => item != selectedItem);                       /*On enregistre tous les éléments SAUF l'item sélectionné */
        updateCart(updatedCart);                                                            /*On envoie le nouveau panier vers la fonction "updateCart" */
    }
}

function findItemToUpdate(event, savedCart){                                                /*Récupère le produit sélectionné par l'utilisateur*/
    let productId = event.target.getAttribute("productId");                                 /*On récupère les attributs du produit sélectionné */
    let productColor = event.target.getAttribute("productColor");                           /* */
    const selectedItem = savedCart.find(element =>                                          /*Dans le panier, on veut trouver l'élément contenant les mêmes id et couleur */
        element._id == productId && element.color == productColor
    );
    return selectedItem;                                                                    /*La fonction retourne l'élément du panier correspondant */
}

function updateCart(newCart) {                                                              /*Enregistre puis met à jour l'interface pour afficher le nouveau panier */
    localStorage.setItem("Panier", JSON.stringify(newCart));                                /*Enregistre le panier edité dans le localStorage */
    resetGlobalVariables();                                                                 /*Remet à 0 les variables globales */
    calculateDisplaySums(JSON.parse(localStorage.getItem("Panier")));                       /*Calcule puis affiche les nouveaux totaux */
    displayCart(JSON.parse(localStorage.getItem("Panier")))                                 /* */
    getIdsInCart(JSON.parse(localStorage.getItem("Panier")))
}

function resetGlobalVariables(){                                                            /*Remet à 0 les variables globales */
    totalPrice = 0; 
    totalQuantity = 0; 
    IdsInCart = [];  
    document.querySelector("#cart__items").innerHTML = "";
}

/*######################-gestion input-#####################*/


function setInputsAttributes() {                                                            /*On applique l'attribut pattern afin de définir les caractères autorisés */
    document.querySelector("#firstName").setAttribute("pattern", "[a-zA-Z-éèà]*");
    document.querySelector("#lastName").setAttribute("pattern", "[a-zA-Z-éèà]*");
    document.querySelector("#city").setAttribute("pattern", "[a-zA-Z-éèà]*");
    document.querySelector("#email").setAttribute("pattern", "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$");
}


/*###################-Validation commande-##################*/

function getIdsInCart(savedCart) {                                                          /*Fonction pour récupérer les ids dans localStorage */
    for(let element of savedCart){
        IdsInCart.push(element._id);                                                        /*On push chaque id dans l'array IdsInCart */
    }
}

function listenOrderBtn(){
    orderBtn.addEventListener("click", function(event) {                                    /*eventListener "click" sur le orderBtn */
        event.preventDefault();                                                             /*Evite un formulaire vide */
        sendOrder();                                                                        /*Appelle la fonction sendOrder */
    });
}

function sendOrder() {                                                                      /*Fonction pour valider la commande */
    if( document.querySelector("#firstName").reportValidity() == false ||                   /*Si il manque : le prénom,        */
        document.querySelector("#lastName").reportValidity() == false ||                    /*            ou le nom,          */
        document.querySelector("#address").reportValidity() == false ||                     /*            ou l'adresse       */
        document.querySelector("#email").reportValidity() == false ||                       /*            ou l'email        */
        document.querySelector("#city").reportValidity() == false )                         /*            ou la ville      */
        {
            return;                                                                         /*Afficher une alerte utilisateur "required"*/
        } 
    else {                                                                                  /*Si toutes les infos sont présentes */
       sendPOSTRequest();
    }        
}

function sendPOSTRequest(){
    const request = fetch(orderAPI, {                                                   /*On crée la requête POST qui sera envoyée au server*/
                                        method: "POST",
                                        headers: {
                                            'Accept': 'application/json', 
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            contact: {
                                                firstName: document.getElementById("firstName").value,
                                                lastName: document.getElementById("lastName").value,
                                                address: document.getElementById("address").value,
                                                city: document.getElementById("city").value,
                                                email: document.getElementById("email").value
                                                },
                                            products : IdsInCart
                                        })
                                    }); 
    request.then(async (answer) => {                                                    /*Quand la requête est terminée, le then s'execute avec la réponse du server */
        try {
            const data = await answer.json();                                           /*Attend que le serveur réponde  */
            window.location.href = `confirmation.html?id=${data.orderId}`;              /*dès résolution, on charge la page de confirmation avec l'orderId */
            localStorage.clear();                                                       /*On efface le panier */
        } catch (e) {
        }
    });
}