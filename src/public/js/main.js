const socket = io();
let currentPage = 1;

socket.on("prodsData", (products) => {
  const tBody = document.querySelector("#tableContent");

  let tableInfo = "";

  if (products) {
    products.forEach((prod) => {
      tableInfo += `
            <tr>
                <td>${prod._id}</td>
                <td>${prod.code}</td>
                <td>${prod.title}</td>
                <td>${prod.description}</td>
                <td>${prod.category}</td>
                <td>$${prod.price}</td>
                <td>${prod.stock}</td>
                <td>${prod.status}</td>
                <td>${prod.thumbnail}</td>
            </tr>
            `;
    });
  } else {
    throw new Error("Error en el arreglo");
  }
  tBody.innerHTML = tableInfo;
});
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        socket.emit('loadProducts', { page: currentPage });
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    socket.emit('loadProducts', { page: currentPage });
});

socket.emit('loadProducts', { page: currentPage });
