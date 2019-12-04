const express=require('express');
const app=express()
const connectDB=require('./config/db');


//ConnectDB
connectDB();
app.get('/',(req,res)=>{
    res.send("API Running")
})
//Users page
app.use('/api/users',require('./routes/api/users'));

//Profile Page
app.use('/api/profile',require('./routes/api/profile'));

//Auth Page
app.use('/api/auth',require('./routes/api/auth'));

//Posts page
app.use('/api/posts',require('./routes/api/posts'));
const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`Server started on port ${port}`))