import Message from '../dao/models/message.model.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: 'Sender, receiver and content are required' });
    }

    const message = new Message({ sender, receiver, content });
    await message.save();
    res.status(201).json({ message: 'Message sent', message });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    await message.remove();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
