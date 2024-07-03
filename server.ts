import { app } from "./app"
import { v2 as cloudinary} from  "cloudinary"
import connectDB from "./src/utils/db";
require("dotenv").config();
const PORT = process.env.PORT || 5471;

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})

app.listen(PORT, ()=>{
    console.log(`Server is up and running at port ${PORT}`);
    connectDB();
})

