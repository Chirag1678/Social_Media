// require('dotenv').config({path: './.env})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ 
    path: "./.env" 
});

const port=process.env.PORT || 8000;
connectDB()
.then(async ()=>{
    const { app } = await import("./app.js");
    app.on("error", (error)=>{
        console.log("Server connection ERROR: ", error);
        throw error;
    });
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    });
})
.catch(err=>{
    console.log("MongoDB connection failed!!! ", err);
})