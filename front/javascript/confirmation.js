// Récupérer le numéro de commande de l'URL et l'afficher
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    // Récupérer le numéro de commande à partir des paramètres de l'URL
    const orderId = urlParams.get("orderId");
    // Afficher le numéro de commande dans l'élément avec l'ID "orderId"
    document.getElementById("orderId").innerText = orderId;
});