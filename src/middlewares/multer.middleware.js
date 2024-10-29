import multer from "multer";

const storage = multer.diskStorage({
    destination: (req,file,cb) => { // cb is callback function, file is the file that is being uploaded, req is the request object
        cb(null, "./public/temp")
    },
    filename: (req,file,cb) => {
        // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) // unique suffix is a random number, for now let's comment it
        cb(null, file.originalname) // original name is the name of the file as it was uploaded, as it was stored for small time, we can use it as the filename
    }
})

export const upload = multer({ 
    storage, 
});