const url = "http://localhost:3000/api/products";

// Récupère des éléments à partir d'une URL fournie et les ajoute dynamiquement à la page d'accueil.
function fetchItems() {
    
    fetch(url)    
        .then(response => response.json())
        .then(items => {

        // Obtient le conteneur où les éléments seront ajoutés
        let itemsContainer = document.getElementById("items");

            // Itère sur chaque élément reçu
            for (let item of items) {
                // Crée le HTML pour chaque produit
                let itemHtml = `
                    <a href="./product.html?id=${item._id}">
                        <article class="items">
                            <img src="${item.imageUrl}" alt="${item.altTxt}">
                            <h2 class="productName">${item.name}</h2>
                            <p class="productPrice"><strong>Price:</strong> $${item.price}</p>
                            <p class="productDescription">${item.description}</p>
                            <p class="productColors"><strong>Colors:</strong> ${item.colors.join(', ')}</p>
                        </article>
                    </a>
                `;
                // Ajoute le HTML créé au conteneur
                itemsContainer.innerHTML += itemHtml;
            }
        })
        // Handle any errors
        .catch(error => console.error("Error: ", error));
}
// Call the function
fetchItems();

