const express = require('express') ;
const Product = require('../models/Products');
const { model } = require('mongoose');
const { validateProduct , isLoggedIn, isAdmin} = require('../middleware');
const router = express.Router() //makes a mini-instance of app.js



//to show all the products
router.get('/products' , async(req,res)=>{
    try{
        const { q } = req.query ;
        let products ;
        if(q && q.trim().length){
            products = await Product.find({ name: { $regex: q.trim(), $options: 'i' } }) ;
        } else {
            products = await Product.find({}) ;
        }
        res.render('products/index' , {products}) //index.ejs
    }
    catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
}) ;


// to show the form for new product 
router.get('/product/new' ,isLoggedIn ,isAdmin,(req,res)=>{
    try{
        res.render('products/new') ;
    }
    catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
}) ;

//to actually add the product
router.post('/products' , validateProduct,isLoggedIn,isAdmin, async(req,res)=>{
    try{
        let{name , img ,  price , desc} = req.body ;
        await Product.create({name , img ,  price , desc})
        req.flash('success' , 'Product addedd successfully') ;
        res.redirect('/products') ;
    }
    catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
})

//to show a particular product 
router.get('/products/:id' ,isLoggedIn, async(req,res)=>{
    try{
        let {id} = req.params ;
        let foundProduct = await Product.findById(id).populate('reviews') ;
        res.render('products/show' , {foundProduct , msg:req.flash('msg')}) ; //catch flash with msg key 
    }
    catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
})

//form to edit the product
router.get('/products/:id/edit' , isLoggedIn,isAdmin,async(req,res)=>{
    try{
        let {id} = req.params ;
        let foundProduct = await Product.findById(id) ;
        res.render('products/edit' , {foundProduct}) ;
    }
    catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
})

//to actually edit the data in db
router.patch('/products/:id' , isLoggedIn,isAdmin,async (req,res)=>{
    try{
        let {id} = req.params ;
        let {name , img , price , desc} = req.body ;
        await Product.findByIdAndUpdate(id , {name , img , price , desc}) ;

        req.flash('success' , 'Product edited successfully') ;
        res.redirect(`/products/${id}`) ;
    }
    catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
})

//to delete a product
router.delete('/products/:id' ,isLoggedIn,isAdmin, async(req,res)=>{
    try{
        let {id} = req.params ;
        const product = await Product.findById(id) ;

        await Product.findByIdAndDelete(id) ;
        req.flash('success' , 'Product deleted successfully') ;
        res.redirect('/products') ;
    }catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
})


module.exports = router ;