import { UserRepository } from "../../../repositories/user.repository.js";

export class UserManagerMongo {
    constructor(){
        this.repository = new UserRepository();
    }

    async findById(id) {
        return await this.repository.findById(id);
    }

    async findByEmail(email) {
        return await this.repository.findByEmail(email);
    }

    async createOne(obj) {
        return await this.repository.createOne(obj);
    }

    async update(user) {
        return await this.repository.update(user);
    }
}
