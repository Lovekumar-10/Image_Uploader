import mongoose from 'mongoose';

const imgschema = new mongoose.Schema({
    filename: String,
    public_id: String,
    imgurl: String
    
})

export const File = mongoose.model( 'cloudinary',imgschema);
