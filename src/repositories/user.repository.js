import User from '../dao/models/user.model.js';

export class UserRepository {
    constructor() {
        this.model = User;
    }

    async findById(id) {
        try {
            const user = await this.model.findById(id);
            if (!user) {
                return null; 
            }
            return user;
        } catch (error) {
            console.error(`Error al buscar usuario por ID ${id}:`, error);
            throw error; 
        }
    }

    async findByEmail(email) {
        try {
            const user = await this.model.findOne({ email });
            if (!user) {
                return null; 
            }
            return user;
        } catch (error) {
            console.error(`Error al buscar usuario por email '${email}':`, error);
            throw error; 
        }
    }

    async createOne(obj) {
        try {
            const user = await this.model.create(obj);
            return user;
        } catch (error) {
            console.error('Error al crear un usuario:', error);
            throw error; 
        }
    }
}
