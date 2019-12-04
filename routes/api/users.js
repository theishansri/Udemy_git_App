const express=require('express');
const Router=express.Router();


//@route
Router.get('/',(req,res)=>{
    res.send('Users route');
});

module.exports=Router;
