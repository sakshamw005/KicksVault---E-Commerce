const express = require('express');
const Product = require('../models/Products');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const Stripe = require('stripe');
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

function ensureCart(req){
  if(!req.session.cart){
    req.session.cart = [];
  }
}

router.get('/cart', isLoggedIn, async (req,res)=>{
  try{
    ensureCart(req);
    const ids = req.session.cart.map(i=>i.productId);
    const products = ids.length ? await Product.find({_id: {$in: ids}}) : [];
    const items = req.session.cart.map(entry=>{
      const p = products.find(pp=>String(pp._id) === String(entry.productId));
      if(!p){ return null; }
      return { product: p, qty: entry.qty, color: entry.color };
    }).filter(Boolean);
    const total = items.reduce((sum, i)=> sum + (i.product.price * i.qty), 0);
    res.render('cart', { items, total });
  }catch(e){
    res.status(500).render('error', { err: e.message });
  }
});

router.post('/cart/add/:id', isLoggedIn, async (req,res)=>{
  try{
    ensureCart(req);
    const { id } = req.params;
    const qty = Math.max(1, parseInt(req.body.qty || '1', 10));
    const color = (req.body.color || 'Default');
    const existing = req.session.cart.find(i=>String(i.productId) === String(id) && i.color === color);
    if(existing){ existing.qty += qty; }
    else { req.session.cart.push({ productId: id, qty, color }); }
    req.flash('success', 'Added to cart');
    res.redirect(`/products/${id}`);
  }catch(e){
    res.status(500).render('error', { err: e.message });
  }
});

router.post('/cart/remove/:id/:color', isLoggedIn, (req,res)=>{
  try{
    ensureCart(req);
    const { id, color } = req.params;
    req.session.cart = req.session.cart.filter(i=>!(String(i.productId) === String(id) && i.color === color));
    req.flash('success', 'Removed from cart');
    res.redirect('/cart');
  }catch(e){
    res.status(500).render('error', { err: e.message });
  }
});

router.post('/cart/remove/:id', isLoggedIn, (req,res)=>{
  try{
    ensureCart(req);
    const { id } = req.params;
    req.session.cart = req.session.cart.filter(i=>String(i.productId) !== String(id));
    req.flash('success', 'Removed from cart');
    res.redirect('/cart');
  }catch(e){
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;

router.post('/checkout', isLoggedIn, async (req,res)=>{
  try{
    if(!stripe){
      req.flash('error','Payment gateway not configured');
      return res.redirect('/cart');
    }
    ensureCart(req);
    const ids = req.session.cart.map(i=>i.productId);
    const products = ids.length ? await Product.find({_id: {$in: ids}}) : [];
    const line_items = req.session.cart.map(entry=>{
      const p = products.find(pp=>String(pp._id) === String(entry.productId));
      if(!p){ return null; }
      return {
        price_data: {
          currency: 'inr',
          product_data: { name: p.name + (entry.color ? ` (${entry.color})` : '') },
          unit_amount: Math.round(p.price * 100)
        },
        quantity: entry.qty
      };
    }).filter(Boolean);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
      cancel_url: req.protocol + '://' + req.get('host') + '/cart'
    });
    res.redirect(session.url);
  }catch(e){
    req.flash('error','Unable to start checkout');
    res.redirect('/cart');
  }
});

router.get('/checkout/success', isLoggedIn, (req,res)=>{
  req.session.cart = [];
  req.flash('success','Payment successful');
  res.redirect('/products');
});