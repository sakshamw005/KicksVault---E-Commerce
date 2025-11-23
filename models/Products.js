const mongoose = require("mongoose");
const Review = require("./Review");


const productSchema = new mongoose.Schema({ //accepts a object
    name : { // it is must , trimmed hona chahiye 
        type : String ,
        trim : true ,
        required : true  // it is must to be given
    } , 
    img : {
        type : String ,
        trim : true 
        //default : 
    },
    price :{
        type : Number,
        min : 0 ,
        required : true 
    },
    desc :{
        type : String , 
        trim : true 
    } ,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Review' 
        }
    ]
})

//middleware jo BTS mongodb operations karwane pr use hote hain and iske andar pre and post middleware hote hai which are basically used over the schema and before the model is js class

productSchema.post('findOneAndDelete' , async function(product){ // this is catched when thrown by products.js -> const product = await Product.findById(id) ;
    if(product.reviews.length > 0){
        await Review.deleteMany({_id:{$in:product.reviews}}) ;
    }
})


let Product = mongoose.model('Product' , productSchema) ;
module.exports = Product ;