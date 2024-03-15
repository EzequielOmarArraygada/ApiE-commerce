const socket = io();

socket.on ("products", products => {
    console.log(products)
    const productsContainter = document.getElementById("table")
    productsContainter.innerHTML = `
    <tr>
        <th>Id:</th>
        <th>Título:</th>
        <th>Descripción:</th>
        <th>Código:</th>
        <th>Precio:</th>
        <th>Estado:</th>
        <th>Stock:</th>
        <th>Categoría:</th>
        <th>Imágen:</th>
    </tr>
    `
    products.forEach((product) => {
        productsContainter.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.status}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.thumbnail}</td>
        </tr>
        `
    }) 
})

document.getElementById("addNewProduct").addEventListener("submit", (event) => {
    event.preventDefault()

    socket.emit("new-Product", {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value
    })
    event.target.reset();
});

document.getElementById("deleteProduct").addEventListener("submit", (event) => {
    event.preventDefault()
    const pId = document.querySelector("#id").value
    console.log(pId)
    socket.emit("delete-product" ,pId )
    event.target.reset();

})



socket.on('response', (response) => {
    if(response.status === 'success') {
        document.getElementById('responseContainer').innerHTML = `<p class="success">${response.message}</p>`;
    } else {
        document.getElementById('responseContainer').innerHTML = `<p class="error">${response.message}</p>`;
    }
});    


