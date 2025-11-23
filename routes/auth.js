const express = require('express') ;
const User = require('../models/User');
const passport = require('passport');
const router = express.Router() //makes a mini-instance of app.js

//to show the form of registeration
router.get('/register' , (req,res)=>{
    res.render('auth/signup') ;
})

//actually wanna register a user in my DB
router.post('/register' , async(req,res)=>{
    try{
        let {email,password,username} = req.body ;
        const user = new User({email,username}) ;
        await User.register(user,password) ;
        req.flash('success','Account created. Please log in.') ;
        res.redirect('/login') ;
    }catch(e){
        if(e && e.name === 'UserExistsError'){
            req.flash('error','Account already exists. Please log in.') ;
            return res.redirect('/login') ;
        }
        req.flash('error','Unable to register. Please try again.') ;
        res.redirect('/register') ;
    }
})

//to show the form of login
router.get('/login' , (req,res)=>{
    if(req.isAuthenticated && req.isAuthenticated()){
        req.flash('success','You are already logged in') ;
        return res.redirect('/products');
    }
    res.render('auth/login') ;
})

router.get('/forgot', (req,res)=>{
    res.render('auth/forgot');
});

router.post('/forgot', async (req,res)=>{
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            req.flash('error','No account with that email');
            return res.redirect('/forgot');
        }
        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 1000*60*30;
        await user.save();
        const nodemailer = require('nodemailer');
        let transporter;
        if(process.env.SMTP_HOST){
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: false,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
        } else {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: { user: testAccount.user, pass: testAccount.pass }
            });
        }
        const resetUrl = req.protocol + '://' + req.get('host') + '/reset/' + token;
        await transporter.sendMail({
            from: 'no-reply@kicksvault.app',
            to: user.email,
            subject: 'Reset your password',
            html: '<p>Click <a href="'+resetUrl+'">here</a> to reset your password. This link expires in 30 minutes.</p>'
        });
        req.flash('success','Password reset link sent to your email');
        res.redirect('/login');
    }catch(e){
        req.flash('error','Unable to send reset link');
        res.redirect('/forgot');
    }
});

router.get('/reset/:token', async (req,res)=>{
    const { token } = req.params;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if(!user){
        req.flash('error','Reset link is invalid or expired');
        return res.redirect('/forgot');
    }
    res.render('auth/reset', { token });
});

router.post('/reset/:token', async (req,res)=>{
    try{
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if(!user){
            req.flash('error','Reset link is invalid or expired');
            return res.redirect('/forgot');
        }
        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        req.flash('success','Password updated. Please log in.');
        res.redirect('/login');
    }catch(e){
        req.flash('error','Unable to reset password');
        res.redirect('/forgot');
    }
});

//actually wanna login a user 
router.post('/login' , 
    passport.authenticate('local', 
        { 
            failureRedirect: '/login' ,
            failureMessage : true 
        }), 
        async(req,res)=>{ //we use passport.authenticate()
            //console.log(req.user,'sam'); 
            req.flash('success' , 'welcome back') ;
            res.redirect('/products') ;
})

//logout
router.get('/logout',(req,res,next)=>{
    try{
        if(req.logout){
            req.logout(function(err){
                if(err){ return next(err); }
                req.flash('success','Logged out');
                return res.redirect('/');
            });
        } else {
            req.flash('success','Logged out');
            return res.redirect('/');
        }
    }catch(e){
        next(e);
    }
})


module.exports = router ;