const express=require('express');
const Router=express.Router();


//Private Page
Router.get('/',(req,res)=>{
    res.send('Profile route');
});

module.exports=Router;
