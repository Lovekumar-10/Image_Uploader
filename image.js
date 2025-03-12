// Import Required Modules
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { File } from './models/model.js';

const app = express();
const port = 4000;

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: 'dtylb1sfu', 
    api_key: '722328585371274', 
    api_secret: 'ka9Ew4CnVg_57fM8qhwXFYurf7c'
});

// ✅ Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));  

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://lovekumar161129:rJi9qBMx9v1rmrw7@cluster0.vp53h.mongodb.net/", {
    dbName: "NodeJs_Trails"
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch((err) => {
    console.log("❌ Error in connecting to MongoDB", err);
});

// ✅ Define Routes
app.get('/', (req, res) => {
    res.render('Ui.ejs', { Url: null });  // ✅ Fixed incorrect template name
});

// ✅ Fixing Multer Storage Configuration
const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, 'public/upload'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// ✅ Initialize Multer
const upload = multer({ storage: storage });

// ✅ Route to Upload Image
app.post('/upload', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded!");
        }

        // ✅ Use absolute file path for Cloudinary upload
        const filePath = path.resolve(req.file.path);

        // ✅ Upload to Cloudinary
        const cloudinaryRes = await cloudinary.uploader.upload(filePath, {
            folder: 'NodeJs_Trails'
        });

        // ✅ Save to MongoDB
        const dbEntry = await File.create({
            filename: req.file.originalname,
            public_id: cloudinaryRes.public_id,
            imgurl: cloudinaryRes.secure_url
        });

        console.log("✅ File saved to DB:", dbEntry);

        // ✅ Render UI with Uploaded Image URL
        res.render("Ui.ejs", { Url: cloudinaryRes.secure_url });

    } catch (error) {
        console.error("❌ Error uploading file:", error);
        res.status(500).send("Error uploading file");
    }
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
