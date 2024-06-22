import { UserRepository } from "../../../repositories/user.repository.js";

export class UserManagerMongo {
    constructor() {
        this.repository = new UserRepository();
    }

    async findById(id) {
        return await this.repository.findById(id);
    }

    async findByEmail(email) {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            console.warn(`No se encontró ningún usuario con el email '${email}'`);
            return null; 
        }
        return user;
    }

    async createOne(obj) {
        return await this.repository.createOne(obj);
    }
}
