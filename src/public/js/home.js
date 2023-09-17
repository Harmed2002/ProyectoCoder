const socket = io.connect('http://localhost:4000')
const button = document.getElementById("load") 

button.addEventListener("click", () =>{
    socket.emit("llamarProductos")
})
    
socket.on("productos", (products)=>{
    const tableBody = document.querySelector("#productsTable tbody")
    let tableContent = ''
    if (products && Array.isArray(products)) {
    products.forEach(product => {
        tableContent += `
            <tr>
                <td>${product._id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>${product.code}</td>
                <td>${product.thumbnail}</td>
            </tr>
        `
    })
} else {
    console.error('Productos no definidos o no es un array:', products)
}

    tableBody.innerHTML = tableContent
    
})
