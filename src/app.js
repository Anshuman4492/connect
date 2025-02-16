import express from "express";

const app = express();
const PORT = 3000;

app.post('/login',(req,res)=>{
    res.send('Login Page')
})
app.post('/register',(req,res)=>{
    res.send('Register Page')
})
app.get('/user',(req,res)=>{
    res.send('User Data fetched successfully')
})
app.post('/user',(req,res)=>{
    res.send('User Data saved successfully')
})
app.delete('/user',(req,res)=>{
    res.send('User Data deleted successfully')
})
app.put('/user',(req,res)=>{
    res.send('User Data updated successfully')
})
app.use('/user',(req,res)=>{
    res.send('User Data Wildcard')
})
app.use('/',(req,res)=>{
    res.send('Homepage')
})


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
