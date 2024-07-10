// URL avec paramètres édités pour pouvoir accéder à l'ID
let params = new URLSearchParams(window.location.search);
let productId = params.get("id");

// Fonction pour obtenir les détails du produit depuis l'API
function fetchProductDetails(productId) {
    const url = `http://localhost:3000/api/products/${productId}`;
    fetch(url)
        .then(response => response.json())
        .then(product => {
            // Appelle la fonction pour afficher les détails du produit
            displayProductDetails(product);
        })
        .catch(error => console.error("Error: ", error));
}

// Fonction pour afficher les détails du produit sur la page
function displayProductDetails(product) {
    // Les détails du produit sont assignés aux éléments correspondants dans le DOM
    document.getElementById("title").innerText = product.name;
    document.getElementById("price").innerText = product.price;
    document.getElementById("description").innerText = product.description;
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

    const colorsSelect = document.getElementById("colors");
    // Crée un sélecteur d'option pour choisir les couleurs de chaque produit
    product.colors.forEach(color => {
        let option = document.createElement("option");
        option.value = color;
        option.innerText = color;
        colorsSelect.appendChild(option);
    });

    // Définir la quantité initiale à 1
    const quantityInput = document.getElementById("quantity");
    quantityInput.value = 1;

    // Mettre à jour le prix total en fonction de la quantité initiale
    updateTotalPrice(product.price);

    // Ajouter un événement pour mettre à jour le prix lorsque la quantité change
    document.getElementById("quantity").addEventListener("input", function(event) {
        updateTotalPrice(product.price);
    });

// Fonction pour mettre à jour le prix total
function updateTotalPrice(price) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPriceElement = document.getElementById('price');
    totalPriceElement.innerText = (price * quantity);
}}

// Appelle la fonction pour obtenir et afficher les détails du produit
if (productId) {
    fetchProductDetails(productId);
} else {
    console.error("Product ID not found in the URL");
}

// Fonction pour sauvegarder le produit dans le panier une fois le bouton cliqué
document.getElementById("addToCart").addEventListener("click", function() {
    const color = document.getElementById("colors").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    
    if (!color || quantity <= 0) {
        alert("Veuillez sélectionner une couleur et une quantité valide.");
        return;
    }

    const productData = {
        id: productId,
        color: color,
        quantity: quantity
    };

    // Obtient les données actuelles du panier depuis localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Vérifie si le produit est déjà dans le panier
    const productAdded = cart.find(item => item.id === productId && item.color === color);
    
    if (productAdded >= 0) {
        // Si le produit est déjà dans le panier, la quantité est mise à jour
        cart[productAdded].quantity += quantity;
    } else {
        // Si le produit n'est pas dans le panier, il est ajouté
        cart.push(productData);
    }

    // Enregistrer les données mises à jour du panier dans localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Produit ajouté au panier");
});
