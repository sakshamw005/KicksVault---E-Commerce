require('dotenv').config();
const express = require('express') ;
const app = express() ;
const path = require('path') ;
const mongoose = require('mongoose');
const seedDB = require('./seed') ;
const ejsMate = require('ejs-mate') ;
const methodOverride = require('method-override') ;
const session = require('express-session') ;
const flash = require('connect-flash') ; 
const passport = require('passport') ;
const LocalStrategy = require('passport-local') ;
const User = require('./models/User') ;

const productsRoutes = require('./routes/products') ;
const reviewRoutes = require('./routes/review') ; 
const authRoutes = require('./routes/auth') ; 
const cartRoutes = require('./routes/cart') ; 


mongoose.connect('mongodb://127.0.0.1:27017/shopping-sam-app')
.then(()=>{
    console.log("DB connected successfully")
})
.catch((err)=>{
    console.log("DB error"); 
    console.log(err)
})

//for session
let configSession = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}

app.engine('ejs',ejsMate) ;
app.set('view engine','ejs') // view engine apki .ejs files ko dekhega 
app.set('views' , path.join(__dirname , 'views')) ; // views folder
app.use(express.static(path.join(__dirname,'public'))) ; // public folder
app.use(express.urlencoded({extended:true})) ;
app.use(methodOverride('_method')) ;
app.use(session(configSession)) ;
app.use(flash()) ;

//passport vali 
app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//PASSPORT
passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{ // a middleware for locals
    res.locals.currentUser = req.user ;
    const list = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
    const email = req.user && req.user.email ? String(req.user.email).toLowerCase() : '';
    const isAdmin = !!req.user && (req.user.role === 'admin' || (email && list.includes(email)));
    res.locals.isAdmin = isAdmin;
    if(res.locals.currentUser && isAdmin){ res.locals.currentUser.role = 'admin'; }
    res.locals.success = req.flash('success') ;
    res.locals.error = req.flash('error') ;
    res.locals.cartCount = (req.session && req.session.cart) ? req.session.cart.reduce((sum,i)=>sum + (i.qty||1), 0) : 0 ;
    next() ;
})

//seeding db :
//seedDB()  //isko ek baar call karwaya then commented because nodemon thode se bhi change pr baar baar usko call krega jisse mutltiple times same data chala jayega 

app.use(productsRoutes) ; //so that har incoming request ke liye path diya jaye 
app.use(reviewRoutes) ; //so that har incoming request ke liye path diya jaye 
app.use(authRoutes) ; //so that har incoming request ke liye path diya jaye 
app.use(cartRoutes) ; // cart routes

app.get('/', (req,res)=>{ res.render('home') }) ;

app.listen(8080 , ()=>{
    console.log("PORT CONNECTED SUCCESSFULLY") ;
})

//this is a instance of application , we can't export it