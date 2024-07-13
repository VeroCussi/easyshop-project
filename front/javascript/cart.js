// DOM
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart__items");
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");

let totalQuantity = 0;
let totalPrice = 0;

// Fonction pour créer ou mettre à jour un article dans le panier
function createOrUpdateArticle(item, product) {
    const existingArticle = cartItemsContainer.querySelector(`.cart__item[data-id="${item.id}"][data-color="${item.color}"]`);
    if (existingArticle) {
        // Mettre à jour la quantité et le prix si l'article existe déjà
        const quantityElement = existingArticle.querySelector(".itemQuantity");
        const priceElement = existingArticle.querySelector(".cart__item__content__description p:last-child");
        const newQuantity = parseInt(quantityElement.value) + parseInt(item.quantity);
        quantityElement.value = newQuantity;
        priceElement.textContent = `${newQuantity * product.price} €`;
    } else {
        // Créer un nouvel article s'il n'existe pas
        const article = document.createElement("article");
        article.classList.add("cart__item");
        article.setAttribute("data-id", item.id);
        article.setAttribute("data-color", item.color);
        article.innerHTML = `
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${item.color}</p>
                    <p>${item.quantity * product.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(article);

        // Ajouter des événements pour la mise à jour de la quantité et la suppression de l'article
        article.querySelector(".itemQuantity").addEventListener("change", function(event) {
            updateQuantity(item.id, item.color, event.target.value);
        });
        article.querySelector(".deleteItem").addEventListener("click", function() {
            deleteItem(item.id, item.color);
        });
    }

    // Mettre à jour la quantité et le prix total
    totalQuantity += parseInt(item.quantity);
    totalPrice += product.price * item.quantity;

    // Mettre à jour les éléments du DOM pour la quantité totale et le prix total
    totalQuantityElement.innerText = totalQuantity;
    totalPriceElement.innerText = totalPrice;
}

// Fonction pour récupérer les données du panier depuis localStorage
function loadCart() {
    cart.forEach(item => {
        const url = `http://localhost:3000/api/products/${item.id}`;
        fetch(url)
            .then(response => response.json())
            .then(product => {
                createOrUpdateArticle(item, product);
            })
            .catch(error => console.error("Erreur : ", error));
    });
}

// Fonction pour mettre à jour la quantité d'un produit dans le panier
function updateQuantity(id, color, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex(item => item.id === id && item.color === color);

    if (productIndex >= 0) {
        cart[productIndex].quantity = parseInt(newQuantity);
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Mettre à jour le DOM dynamiquement
        const article = document.querySelector(`.cart__item[data-id="${id}"][data-color="${color}"]`);
        const url = `http://localhost:3000/api/products/${id}`;
        fetch(url)
            .then(response => response.json())
            .then(product => {
                const priceElement = article.querySelector(".cart__item__content__description p:last-child");
                priceElement.textContent = `${product.price * newQuantity} €`;

                // Mettre à jour la quantité totale et le prix total
                updateTotal();
            })
            .catch(error => console.error("Erreur : ", error));
    }
}

// Fonction pour supprimer un produit du panier
function deleteItem(id, color) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id || item.color !== color);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Retirer l'article du DOM
    const article = document.querySelector(`.cart__item[data-id="${id}"][data-color="${color}"]`);
    if (article) {
        cartItemsContainer.removeChild(article);
    }
    
    // Mettre à jour la quantité totale et le prix total
    updateTotal();
}

// Fonction pour mettre à jour dynamiquement la quantité et le prix total
function updateTotal() {
    totalQuantity = 0;
    totalPrice = 0;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(item => {
        const url = `http://localhost:3000/api/products/${item.id}`;
        fetch(url)
            .then(response => response.json())
            .then(product => {
                totalQuantity += parseInt(item.quantity);
                totalPrice += product.price * item.quantity;

                // Mettre à jour les éléments du DOM pour la quantité totale et le prix total
                totalQuantityElement.innerText = totalQuantity;
                totalPriceElement.innerText = totalPrice;
            })
            .catch(error => console.error("Erreur : ", error));
    });
}

// Appeler la fonction pour charger les données du panier lors du chargement de la page
document.addEventListener("DOMContentLoaded", loadCart);

// Valider les données du formulaire avec des expressions régulières
function validateForm() {
    const nameRegex = /^[a-zA-Zàâäéèêëïîôöùûüç -]+$/;
    const addressRegex = /^[0-9a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return true;
}

// Envoyer la demande de commande à l'API
function submitOrder() {
    if (!validateForm()) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }

    const form = document.querySelector(".cart__order__form");
    const formData = new FormData(form);

    // Convertir FormData en un tableau de paires clé-valeur
    const formEntries = [...formData.entries()];

    // Convertir le tableau de paires clé-valeur en un objet
    const contact = Object.fromEntries(formEntries);

    const products = cart.map(item => item.id);

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contact: contact,
            products: products
        })
    })
    .then(response => response.json())
    .then(data => {
        // Vider le panier dans le stockage local
        localStorage.removeItem("cart");

        // Rediriger vers la page de confirmation avec le numéro de commande
        window.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    .catch(error => console.error("Erreur : ", error));
}

// Ajouter l'événement de soumission au formulaire
document.querySelector(".cart__order__form").addEventListener("submit", function(event) {
    event.preventDefault();
    submitOrder();
});
