// require('dotenv').config({path: './.env})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ 
    path: "./.env" 
});
connectDB()
.then(async ()=>{
    const { app } = await import("./app.js");
    app.on("error", (error)=>{
        console.log("Server connection ERROR: ", error);
        throw error;
    });
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch(err=>{
    console.log("MongoDB connection failed!!! ", err);
})