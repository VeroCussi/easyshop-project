const url = "http://localhost:3000/api/products";

// recordar que la API solo funciona si tengo el node server conectado 

// Meterlo dentro de una función.

function fetchItems() {
    // Realiza una solicitud a la URL proporcionada
    fetch(url)
        // Convierte la respuesta a formato JSON
        .then(response => response.json())
        // Procesa los datos recibidos
        .then(items => {

            // Obtiene el contenedor donde se agregarán los elementos
            let itemsContainer = document.getElementById("items");

            // Itera sobre cada item recibido
            for (let item of items) {
                // Crea el HTML para cada producto
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
                // Añade el HTML creado al contenedor
                itemsContainer.innerHTML += itemHtml;
            }
        })
        // Maneja cualquier error que ocurra durante la solicitud
        .catch(error => console.error("Error: ", error));
}

// Llamada a la función
fetchItems();

