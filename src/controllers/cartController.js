import Cart from '../dao/models/cart.model.js';
import Product from '../dao/models/product.model.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.json(cart);
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    await cart.save();
    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.products = [];

    await cart.save();
    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Error in clearCart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
