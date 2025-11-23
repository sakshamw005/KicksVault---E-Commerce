const express = require('express') ;
const app = express() ;
const cookieParser = require('cookie-parser');


// app.use(cookieParser()) ;
app.use(cookieParser('youneedabettersecret')) ;

app.get('/' , (req,res)=>{
    console.log(req.cookies) ;
    // res.send(req.cookies) ;
    res.send(req.signedCookies) ;
})
//signedcookie 
app.get('/getsignedcookies' , (req,res)=>{
    res.cookie('saksham' , 'badmosh' , {signed:true}) ; //by default signed is set as false 
    res.send('cookie sent successfully') ;
})

app.get('/setcookie' , (req,res)=>{ //sent by server
    res.cookie('mode' , 'dark') ;
    res.cookie('location' , 'delhi') ;
    res.cookie('username' , 'samarth') ;
    res.send('server sent you cookies') ;
})

app.get('/getcookie' , (req,res)=>{
    let {mode , location , username} = req.cookies ;
    res.send(`hi my name is ${username} , i stay in ${location} , i prefer ${mode} mode`) ;
})

app.listen(8080 , ()=>{
    console.log("Server connected at port 8080") ;
})