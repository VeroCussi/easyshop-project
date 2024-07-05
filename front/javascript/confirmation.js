// Recuperar el número de pedido de la URL y mostrarlo
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");
    document.getElementById("orderId").innerText = orderId;
});