const express=require('express');
const Router=express.Router();

//Private Page
Router.get('/',(req,res)=>{
    res.send('Posts route');
})
module.exports=Router;