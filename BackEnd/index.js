const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const fileRoutes = require("./routes/fileRoutes");
const connect = require("./config/connectDb");
const userRoute = require('./routes/AuthRoutes');
const dotenv = require('dotenv');
dotenv.config();


const port = process.env.port || 3000;
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/api/files", fileRoutes);
app.use("/api/user",userRoute);
app.get('/api/testing',(req,res)=>{
  res.send("working perfectly fine!!")
})

const startServer = async ()=>{
    try {
        connect();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
        });
    
      } catch (error) {
          process.exit(1);
      }
}

startServer();