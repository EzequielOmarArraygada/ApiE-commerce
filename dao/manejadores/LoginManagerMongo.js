import userModel from "../models/user.model.js";

const adminUser = {
    first_name: "Admin",
    last_name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
};

export class LoginManagerMongo {
    constructor(){
        this.model = userModel;
    }

    async byId(id) {
        const user = await this.model.findById(id);
        return user;
    }

    async byEmail(email) {
        if (email === adminUser.email) {
            return adminUser;
        } else {
            const user = await this.model.findOne({ email });
            if (!user) {
                throw new Error("El usuario no existe");
            } 
            return user;
        }
    }

    async newUser(userData) {
        const newUser = await this.model.create(userData);
        return newUser;
    }
}