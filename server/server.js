import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
dotenv.config();
app.use(cors());

console.log(process.env.DB_CONNECTION);

const conn = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

conn();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const userModel=mongoose.model('interceptor',userSchema)

app.use(express.json()); // Add this line to parse JSON bodies

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await userModel.findOne({ email });
    if (!checkUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userModel({
        email,
        password: hashedPassword,
      });
      await user.save();
      res.json({ msg: ' success' });
    } else {
      res.json({ msg: 'Email already exists' });
    }
  } catch (err) {
    res.status(500).json({ msg: `Error from signup controller: ${err.message}` });
  }
});
app.post("/login",async(req,res)=>{
    const { email, password } = req.body;
    try{
        const check=await userModel.findOne({email})
        if(check){
            const checkPassword=await bcrypt.compare(password,check.password)
            if(checkPassword){
                const token= jwt.sign({email},"secret-key",{expiresIn:'2m'})
                res.json({m:"success",token:token})
            }
            else{
                res.json({m:"wrong password"})
            }
        }
        else{
            res.json({m:"enter a valid email address"})
        }
    }
    catch(err){
        res.json({err:`error from login controller ${err}`})
    }
})
const Auth=(req,res,next)=>{
    const head = req.headers['x-auth']; // Corrected header name to lowercase
    console.log(head)
    try{
        if(!head){
            res.json({m:"no token found"})
        }
        else{
            jwt.verify(head,"secret-key");
            next()
        }

    }
    catch(err){
        res.json({m:`error from jwt auth ${err}`})
    }
}
app.get("/data", Auth, async (req, res) => {
    const data = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const jsonData = await response.json();
        console.log(jsonData); // Logging the fetched data
        return jsonData;
      } catch (err) {
        console.error("Error fetching data:", err);
        throw err; // Re-throwing the error to be caught in the outer try-catch block
      }
    };
  
    try {
      const result = await data(); // Call the data function to get the result
      res.json({ m: result });
    } catch (err) {
      res.json({ m: `Error from getdata ${err}` });
    }
  });

app.listen(1010, () => {
  console.log("Server started on port 1010");
});
