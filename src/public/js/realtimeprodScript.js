const socket = io();
const form = document.getElementById("idForm");
const table = document.querySelector("#prodTable tbody");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const infoForm = new FormData(e.target);
    infoForm.get("title");
    const prod = Object.fromEntries(infoForm);
    console.log(prod);
    socket.emit("nuevoProducto", prod);
    e.target.reset();
});

socket.on("prodsData", (products) => {
    let tableInfo = "";
    if (products) {
        products.forEach((prod, index) => {
            index = index + 1;
            tableInfo += `
                <tr>
                    <td>${index}</td>
                    <td>${prod.title}</td>
                    <td>${prod.description}</td>
                    <td>${prod.category}</td>
                    <td>$${prod.price}</td>
                    <td>${prod.thumbnail}</td>
                    <td>${prod.code}</td>
                    <td>${prod.stock}</td>
                </tr>
            `;
        });
    } else {
        console.log("error al cargar los datos");
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
        });
    }
    table.innerHTML = tableInfo;
});

socket.emit("getProducts");