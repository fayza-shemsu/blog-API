const mongoose= require("mongoose ");

const postSchema = new  mongoose.Schema ({
    title:{
        type:String , required: true},
    content:{
        type:String,required:true },
    author:{
        type:mongoose.Schema.Types.ObjectID,ref:"Users",required:true},
        categories:[{type:String}],
        Likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    },{
        timestamps:true});
        module.exports=mongoose .model("post",postSchema);