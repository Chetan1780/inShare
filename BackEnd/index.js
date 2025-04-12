const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.port || 3000;
const fileRoutes = require("./routes/fileRoutes");
const connect = require("./config/connectDb")
app.use(cors());

app.use("/api/files", fileRoutes);
app.get('/testing',(req,res)=>{
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
        console.error('Failed to start server:', error);
        process.exit(1);
      }
}

// testing api 
startServer();