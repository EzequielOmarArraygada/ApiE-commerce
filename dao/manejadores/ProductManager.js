import fs from "fs"

export class ProductManager {
    constructor () {
    this.products = [];
    this.path = "./info/products.json"
    };

    getProducts(){
        try {
            const data = fs.readFileSync("./info/products.json", "utf8");
            this.products = JSON.parse(data);
            return this.products;              
        }
        catch (error) {
            console.error("Error al intentar leer el archivo", error);
            return []; 
        }
    };

    getProductById(pid){
        this.getProducts()
        const productId = this.products.find (product => product.id === pid);

        if (productId) {
            return productId;
        } else {
            console.log("No se encontro el producto");
        }    
    };

    addProduct(product) {
        const { title, description, price, thumbnail, code, stock, category, status } = product;


        if (title === "" || description === "" || price === "" || thumbnail === "" || code === "" || stock === "" || category === "" || status === "") {
            throw new Error("Todos los campos son obligatorios");
        } else if (this.products.some((product) => product.code === code)) {
            throw new Error("Ese producto ya existe");
        } else {
            const newProduct = {
                id: this.products.length + 1,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                status: status,
                category: category,
            };


            this.products.push(newProduct);
            console.log("Se ah agregado el producto");


            try {
                fs.writeFileSync(this.path, JSON.stringify(this.products));
                console.log("Se guardo el producto");
                return newProduct;
            } catch (error) {
                console.error("No se guardó el producto", error);
                throw error;
            }
        }
    }

    deleteProduct(id) {
        this.getProducts();
        const productId = this.products.find((product) => product.id === id);
        if (productId) {
            const Index = this.products.findIndex((product) => product.id === id);
            this.products.splice(Index, 1);
            try {
                fs.writeFileSync(this.path, JSON.stringify(this.products));
                console.log("Producto borrado");
            } catch (error) {
                console.error("Error al eliminar producto", error);
            }
        } else {
            throw new Error("No se encontró el producto");
        }
    }
    

    updateProduct(id, productUpdate) {
        this.getProducts();
        const productId = this.products.find (product => product.id === id);
        if (productId) {
            const Index = this.products.findIndex (product => product.id === id);
            this.products[Index] = {id, ...productUpdate};
            try {
                fs.writeFileSync(this.path, JSON.stringify(this.products));
                console.log("Se actualizo el archivo")    
            } catch (error) {
                console.error("Error al actualizar el archivo", error)
            }
        } else {
            console.error("No se encontro el producto");
        }   
    };
};

