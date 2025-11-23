const mongoose = require('mongoose')
const Product = require('./models/Products')

const Products = [
    {
        name : "iPhone 16 Pro" ,
        img : "https://imgs.search.brave.com/rjRQywudRq3WLt9OoCfYj5AF3Wr5G8t3FIJ_2UpKjHQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXku/Z2F6ZWxsZS5jb20v/Y2RuL3Nob3AvZmls/ZXMvaVBob25lMTZQ/cm8tQmxhY2tUaXRh/bml1bS1GbGF0LWNy/b3BwZWQuanBnP3Y9/MTc1NzAxODQ2NyZ3/aWR0aD01MzM" ,
        price : 150000,
        desc : "aukat ke bahar" 
    },
    {
        name : "Macbook m2 pro" ,
        img : "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D" ,
        price : 250000,
        desc : "yeh to bilkul hi aukat ke bahar" 
    } ,
    {
        name : "Dodge Challenger" ,
        img : "https://imgs.search.brave.com/1hqEDfT8TlbDDqG7_Hg2QHdtZBZ4D4f6RtRqYpNJ9KA/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/ZG9kZ2UuY29tL2Nv/bnRlbnQvZGFtL2Ny/b3NzLXJlZ2lvbmFs/L2dsb2JhbC9kb2Rn/ZS8yMDIzL2NoYWxs/ZW5nZXIvc3J0L2Rl/c2t0b3AvTVkyM19T/UlRodWJfQ2hhbGxl/bmdlcl9IZWxsY2F0/X1JlZGV5ZV9XaWRl/Ym9keV9EZXNrdG9w/XzAxLmpwZy5pbWcu/MTQ0MC5qcGc" ,
        price : 35000000,
        desc : "The Dodge Challenger is the name of three generations of automobiles produced by the American automobile manufacturer Dodge."
    } ,
    {
        name : "IPL Ticket" ,
        img : "https://imgs.search.brave.com/pbiy1epZt4uJfu8YUsh9mX2FjWl5MsITf99VzDkk0Ug/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ub3J0/aGVhc3RsaXZlLnMz/LmFtYXpvbmF3cy5j/b20vbWVkaWEvdXBs/b2Fkcy8yMDI1LzAz/L0NPVkVSLUlQTC5q/cGc" ,
        price : 15000,
        desc : "Ticket prices vary significantly depending on the stadium and seating category."
    } ,
    {
        name : "Maggi" ,
        img : "https://imgs.search.brave.com/Ku9a4DkIWCLNi9hITS21zsXGOi4AhE5RmRtJtRg8ozY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9tYWdn/aS1ub29kbGVzLXRv/b2stZm9yay1tYWRl/LWluZGlhbi1zdHls/ZS1jYXJyb3Qtb25p/b25zLTIyMzA0NDY3/My5qcGc" ,
        price : 100,
        desc : "Bacchon ki favourite"
    }
]

async function seedDB(){ //to prevent call back function chaining 
    await Product.insertMany(Products) ;
    console.log("data seeded successfully") ;
}

module.exports = seedDB ;