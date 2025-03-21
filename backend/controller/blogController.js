
const Blog = require("../Model/blog");
const User = require("../Model/user")
const cloudinary = require("cloudinary");

const setBlog = async (req, res) => {
  try {
    const { title, description,avatar,userId } = req.body;
    const user = await User.findById(userId);



 
    const exsistingBlog = await Blog.findOne({ title });

    if (exsistingBlog) {
      return res.status(400).json({
        message: "Blog Already Exsist",
      });
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "blogs",
    });



    const blog = new Blog({
      title,
      description,
      avatar:{
        public_id:myCloud.public_id,
        url:myCloud.secure_url
      },
      creator:user
   
       
    });

    const savedBlog = await blog.save();

    res.status(200).json({
      message: "Blog Created",
      data: savedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 5; // Default to 10 blogs per page
  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  try {
    const blogs = await Blog.find()
      .populate('creator', 'username avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalBlogs = await Blog.countDocuments(); // Count total documents
    const totalPages = Math.ceil(totalBlogs / limit); // Calculate total pages

    res.status(200).json({
      message: "All Blogs",
      data: blogs,
      totalBlogs,   // Total number of blogs
      totalPages,   // Total number of pages
      currentPage: page, // Current page number
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getBlogByUser = async (req, res) => {
  const { Id } = req.user;
  console.log(Id);
 
 
  try {
    
    const userBlogs = await Blog.find({creator:Id}).populate('creator');  // Fetch blogs for the current user
    
    if (userBlogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this user." });
    }

    return res.status(200).json({ blogs: userBlogs });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching blogs.", error });
  }
};


const deleteBlog = async (req, res) => {
  const id = req.params.id;
 
  try {
    const findBlog = await Blog.findById(id);

    if (!findBlog) {
      return res.status(400).json({
        message: "No Blog Found",
      });
    }
    await cloudinary.uploader.destroy(findBlog.avatar.public_id);

    const deleteBlogById = await Blog.findByIdAndDelete(findBlog);

    res.status(200).json({
      message: "Blog Deleted Successfully",
      data: deleteBlogById,
    });
  } catch (error) {}
};

const getSingleBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const getBlog = await Blog.findById(blogId);
    if (!getBlog) {
      return res.status(400).json({
        message: "No blog found with this id",
      });
    }
    getBlog.views +=1;

    await getBlog.save();

    res.status(200).json({
      message: "Blog Found!",
      data: getBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const increaseView = async (req, res) => {
  const blogId = req.params.id;

  try {
    const getBlog = await Blog.findById(blogId);
    if (!getBlog) {
      return res.status(400).json({
        message: "No blog found with this id",
      });
    }
    getBlog.views +=1;

    await getBlog.save();

   
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const updateBlog = async (req,res)=>{
   try {
    const { id } = req.params; // Assuming you're passing the blog id in the request params
    const { title, description, avatar } = req.body;

    // Find the blog by its id
    let blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // If a new avatar is provided, handle the upload and update
    if (avatar) {
      // Delete the old image from Cloudinary if it exists
      if (blog.avatar && blog.avatar.public_id) {
        await cloudinary.uploader.destroy(blog.avatar.public_id);
      }

      // Upload the new avatar to Cloudinary
      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "blogs",
      });
      blog.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }


    // Save the updated blog
    const updatedBlog = await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}


  const getBlogPerPage = async (req,res)=>{
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage =2;
    const skip = (page - 1 ) * perPage;
    try {
      const blogs = await Blog.find().skip(skip).limit(perPage);
      res.status(200).json({
        message:"Blogs",
        data:blogs
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }

  }


  const searchBlog = async(req,res)=>{
    try {
      const blogs = await Blog.find({
        "$or":[
          {
            title:{$regex:req.params.key.toLowerCase(),$options:"i"}
          },
       
        ]
      })

  res.status(200).json({
    message:"Search Result",
    data:blogs
  })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }

  }


module.exports = {
  setBlog,
  getAllBlogs,
  deleteBlog,
  getSingleBlog,
  updateBlog,
  getBlogPerPage,
  increaseView,
  searchBlog,
  getBlogByUser
};
