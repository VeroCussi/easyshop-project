// DOM
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart__items");
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");

let totalQuantity = 0;
let totalPrice = 0;

// Función para recuperar los datos del carrito de localStorage
function loadCart() {
    cart.forEach(item => {
        const url = `http://localhost:3000/api/products/${item.id}`;
        fetch(url)
            .then(response => response.json())
            .then(product => {
                // Verificar si el artículo ya existe en el carrito
                const existingArticle = cartItemsContainer.querySelector(`.cart__item[data-id="${item.id}"][data-color="${item.color}"]`);
                if (existingArticle) {
                    // Actualizar la cantidad y el precio si el artículo ya existe
                    const quantityElement = existingArticle.querySelector(".itemQuantity");
                    const priceElement = existingArticle.querySelector(".cart__item__content__description p:last-child");
                    const newQuantity = parseInt(quantityElement.value) + parseInt(item.quantity);
                    quantityElement.value = newQuantity;
                    priceElement.textContent = `${newQuantity * product.price} €`;
                } else {
                    // Crear un nuevo artículo si no existe
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
    
                    // Agregar eventos para la actualización de la cantidad y la eliminación del producto
                    article.querySelector(".itemQuantity").addEventListener("change", function(event) {
                        updateQuantity(item.id, item.color, event.target.value);
                    });
                    article.querySelector(".deleteItem").addEventListener("click", function() {
                        deleteItem(item.id, item.color);
                    });
                }

                // Actualizar la cantidad y el precio total
                totalQuantity += parseInt(item.quantity);
                totalPrice += product.price * item.quantity;

                // Actualizar los elementos del DOM para la cantidad total y el precio total
                totalQuantityElement.innerText = totalQuantity;
                totalPriceElement.innerText = totalPrice;
            })
            .catch(error => console.error("Error: ", error));
    });
}

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(id, color, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex(item => item.id === id && item.color === color);

    if (productIndex >= 0) {
        cart[productIndex].quantity = parseInt(newQuantity);
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Actualizar el DOM dinámicamente
        const article = document.querySelector(`.cart__item[data-id="${id}"][data-color="${color}"]`);
        const url = `http://localhost:3000/api/products/${id}`;
        fetch(url)
            .then(response => response.json())
            .then(product => {
                const priceElement = article.querySelector(".cart__item__content__description p:last-child");
                priceElement.textContent = `${product.price * newQuantity} €`;

                // Actualizar la cantidad total y el precio total
                updateTotal();
            })
            .catch(error => console.error("Error: ", error));
    }
}

// Función para eliminar un producto del carrito
function deleteItem(id, color) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id || item.color !== color);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Remover el artículo del DOM
    const article = document.querySelector(`.cart__item[data-id="${id}"][data-color="${color}"]`);
    if (article) {
        cartItemsContainer.removeChild(article);
    }
    
    // Actualizar la cantidad total y el precio total
    updateTotal();
}

// Función para actualizar dinámicamente
function updateTotal() {
    let totalQuantity = 0;
    let totalPrice = 0;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(item => {
        const url = `http://localhost:3000/api/products/${item.id}`;
        fetch(url)
            .then(response => response.json())
            .then(product => {
                totalQuantity += parseInt(item.quantity);
                totalPrice += product.price * item.quantity;

                // Actualizar los elementos del DOM para la cantidad total y el precio total
                totalQuantityElement.innerText = totalQuantity;
                totalPriceElement.innerText = totalPrice;
            })
            .catch(error => console.error("Error: ", error));
    });
}

// Llamar a la función para cargar los datos del carrito al cargar la página
document.addEventListener("DOMContentLoaded", loadCart);

// Validar los datos del formulario con expresiones regulares
function validateForm() {
    const nameRegex = /^[a-zA-Zàâäéèêëïîôöùûüç -]+$/;
    const addressRegex = /^[0-9a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const email = document.getElementById("email").value;

    if (!nameRegex.test(firstName)) {
        document.getElementById("firstNameErrorMsg").innerText = "Prénom invalide.";
        return false;
    } else {
        document.getElementById("firstNameErrorMsg").innerText = "";
    }

    if (!nameRegex.test(lastName)) {
        document.getElementById("lastNameErrorMsg").innerText = "Nom invalide.";
        return false;
    } else {
        document.getElementById("lastNameErrorMsg").innerText = "";
    }

    if (!addressRegex.test(address)) {
        document.getElementById("addressErrorMsg").innerText = "Adresse invalide.";
        return false;
    } else {
        document.getElementById("addressErrorMsg").innerText = "";
    }

    if (!nameRegex.test(city)) {
        document.getElementById("cityErrorMsg").innerText = "Ville invalide.";
        return false;
    } else {
        document.getElementById("cityErrorMsg").innerText = "";
    }

    if (!emailRegex.test(email)) {
        document.getElementById("emailErrorMsg").innerText = "Email invalide.";
        return false;
    } else {
        document.getElementById("emailErrorMsg").innerText = "";
    }

    return true;
}

// Enviar la solicitud de pedido a la API
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

    // Convertir FormData en una matriz de pares clave-valor
    const formEntries = [...formData.entries()];

    // Convertir la matriz de pares clave-valor en un objeto
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
        // Limpiar el carrito en el almacenamiento local
        localStorage.removeItem("cart");

        // Redirigir a la página de confirmación con el número de pedido
        window.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    .catch(error => console.error("Error:", error));
}

// Agregar el evento de envío al formulario
document.querySelector(".cart__order__form").addEventListener("submit", function(event) {
    event.preventDefault();
    submitOrder();
});
