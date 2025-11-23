const {productSchema , reviewSchema} = require('./schema') ;

const validateProduct = (req,res,next)=>{
    const {name,img,price,desc} = req.body ;
    const {error} = productSchema.validate({name,img,price,desc}) ; // .validate actually return {error,value} but value is of our no use
    if(error){ 
        return res.render('error') ;
    }
    next() ; //matlab validateProduct ke aage wala function run hojayega 
}

const validateReview = (req,res,next)=>{
    const {rating,comment} = req.body ;
    const {error} = reviewSchema.validate({rating,comment}) ; // .validate actually return {error,value} but value is of our no use
    if(error){ 
        return res.render('error') ;
    }
    next() ;
}

//to inndono ko we'll use in routes 

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error' , 'Login first') ;
        return res.redirect('/login');
    }
    next() ;
}

const isAdmin = (req,res,next)=>{
    const list = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
    const email = req.user && req.user.email ? String(req.user.email).toLowerCase() : '';
    const allowed = !!req.user && (req.user.role === 'admin' || (email && list.includes(email)));
    if(!allowed){
        req.flash('error','Admin access required');
        return res.redirect('/products');
    }
    next();
}

module.exports = {validateProduct,validateReview,isLoggedIn,isAdmin} ;