import Blog from '../models/blog.model.js';
import fs from 'fs';

export const allBlogs = async (req, res) => {
    try {
        // Fetch all blogs, sorted by newest first
        const blogs =  await Blog.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ blogs, success: true,message:"All blogs fetched successfully" });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const createBlog = async (req, res) => {
    try {
       const { title, category, description} = req.body; 
         const image_filename=`${req.file.filename}`;
         const blog = await Blog.create({
            title,
            category,
            description,
            image: image_filename,
            author:{          //data is coming from auth middleware
                id: req.user._id,
                name: req.user.name,
                image: req.user.image
            }
         });
         return res.status(201).json({ message: 'Blog created successfully', blog, success: true });
    } catch (error) {
       return res.status(500).json({ message: 'Server error' });
    }
};

export const deleteBlog = async (req, res) => {
    const blog=await Blog.findById(req.params.id);
    fs.unlink(`uploads/${blog.image}`,()=>{}); //delete image from uploads folder
    if(!blog){
        return res.status(404).json({message:"Blog not found",success:false});
    } //only author can delete his blog
    if(blog.author.id.toString()!==req.user._id.toString()){
        return res.status(403).json({message:"You are not authorized to delete this blog",success:false});
    }
    await blog.deleteOne();
    return res.status(404).json({message:"Blog deleted successfully",success:true});
};

export const singleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        return res.status(200).json({ message:"Blog fetched successfully", blog, success: true });
    } catch (error) {
        return res.status(500).json({ message: 'internal server error',success:false });
    }
}

export const userBlogs=async(req,res)=>{
      // Find blogs where the embedded author.id matches the logged-in user's _id
    try {
        const blogs=await Blog.find({"author.id":req.user._id}).sort({ createdAt: -1 });
        return res.status(200).json({blogs});
    } catch (error) {
        return res.status(500).json({ message: 'internal server error',success:false });
    }
}