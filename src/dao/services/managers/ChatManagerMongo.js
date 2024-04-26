import chatModel from "../../models/chat.model.js";

export class ChatManagerMongo {
    constructor(){
        this.model = chatModel
    }

    async addChat(username, message){
        try {
            const chat = await this.model.findOne({}); 
            if (chat) {
                chat.messages.push({ username, message }); 
                await chat.save(); 
                return chat;
            } else {
                return await this.model.create({ messages: [{ username, message }] });
            }
        } catch (error) {
            console.error("Error al añadir mensaje al chat", error);
            throw error;
        }
    }
}