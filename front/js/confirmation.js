/* ----------------------------------confirmation.js------------------------------------------

Ce fichier .js permet d'afficher la confirmation de commande à l'utilisateur   

---------------------------------------------------------------------------------------------*/

//-----------------------------------------------------//
//----------------Variables Globales------------------//
//---------------------------------------------------//

const params = new URLSearchParams(window.location.search);              /*On récupère les paramètres dans l'adresse html, envoyés par l'API */


//-----------------------------------------------------//
//----------------------Processus---------------------//
//---------------------------------------------------//

displayOrderId();


//-----------------------------------------------------//
//----------------------Fonctions---------------------//
//---------------------------------------------------//

function displayOrderId(){
    let orderId = getOrderId();
    document.getElementById("orderId").innerHTML += `${orderId}`;        /*On ajoute la valeur dans le HTML */ 
}

function getOrderId(){                                        
    return params.get("id");                                             /*On récupère le numéro de commande ("id")*/
}