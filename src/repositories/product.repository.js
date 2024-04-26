import productModel from "../dao/models/product.model.js";

export class ProductRepository {
    constructor(){
        this.model = productModel
    }
    
    async getProducts(page, limit, sortOrder, category, status) {
        try {
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: sortOrder ? { price: sortOrder === 'asc' ? 1 : -1 } : null,
                lean: true
            };

            const query = category ? { category: category } : {};
            const queryStatus = status ? { status: status } : {};

            return await this.model.paginate({ ...query, ...queryStatus }, options);
        } catch (error) {
            console.error("Error al mostrar los productos", error);
        }
    }

    async getProductById(pid){
        return await this.model.findById(pid).lean(); 
    }
    
    async addProduct(newProduct){
        try {
            console.log("Datos recibidos para agregar el producto en el repositorio:", newProduct); 
            return await this.model.create(newProduct);
        } catch (error) {
            console.error("Error al agregar el producto en el repositorio:", error); 
            throw error;
        }
    }
    
    
    async updateProduct(pid, updatedProduct){
        return await this.model.findByIdAndUpdate(pid, updatedProduct, { new: true });
    }
    
    async deleteProduct(pid){
        return await this.model.findByIdAndDelete(pid);
    }
}