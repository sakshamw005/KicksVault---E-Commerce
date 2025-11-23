const express = require('express') ;
const Product = require('../models/Products');
const Review = require('../models/Review');
const { validateReview } = require('../middleware');
const router = express.Router() //makes a mini-instance of app.js

router.post('/products/:id/review' , validateReview ,async(req,res)=>{
    try{
        let {id} = req.params ;
        let {rating , comment} = req.body ;
        const product = await Product.findById(id) ;
        const review = new Review({rating , comment}) ;

        product.reviews.push(review) ; // product is the product we found by id , reviews is the array and we push the found 'review' into 'reviews' array

        await product.save() ;
        await review.save() ;
        
        req.flash('success' , 'Review added successfully') ; //here 'msg' is the key of the flash message but as we're redirecting , so we send the flash message along with the redirect from products.js route to show a product
        res.redirect(`/products/${id}`) ;

    }catch(e){
        res.status(500).render('error' , {err:e.message}) ;
    }
})


module.exports = router ;