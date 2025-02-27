const blog = require("../Models/blogModel");
const User = require("../Models/UserModel");

const bloglist = async (req, res) => {
  try {
    let bloged = await blog.find().populate("comment").populate("user");
    res.status(200).json({ bloged });
  } catch (e) {
    res.status(400).json({ message: "OOPS ERROR!!" });
  }
};
//this endpoit is getting one specific user that is logged in the account
const usersBlog = async (req, res) => {
  try {
    const { id, email } = req.user;
    const findUser = await blog.find({ user: id });
    res.status(200).json({ findUser });
  } catch {
    res.status(400).json({ message: "error!!!" });
  }
};

//this endpoit is getting specific blog with user id
const oneblog = async (req, res) => {
  const id = req.params.id;

  try {
    const oneBlog = await blog.findById(id).populate("user");
    res.status(200).json({ oneBlog });
  } catch {
    res.status(400).json({ message: "from getOneBlog error!!!!!" });
  }
};

const createblog = async (req, res) => {
  const { title, content } = req.body;

  try {
    // getting users data from database
    const data = await User.findById(req.user.id);
    // checking if all inputs are filled of
    if (data.location == null || data.bio == null || data.work == null) {
      return res
        .status(401)
        .json({ message: "please compelete your profile first" });
    }

    let imageFeild = "";
    if (req.file) {
      imageFeild = req.file.originalname;
    }

    //
    const createBlog = {
      title,
      content,
      image: imageFeild,
      user: req.user.id,
    };

    //creating our new post
    await blog.create(createBlog);
    res.status(200).json({ message: " you've created a new post " });
  } catch (e) {
    res.status(400).json({
      message: "from post/create method :- we could'not save the blog",
    });
  }
};

const editblog = async (req, res) => {
  const idEdit = req.params.id;
  const { title, content } = req.body;

  let editedImage = "";
  if (req.file) {
    editedImage = req.file.originalname;
  }

  //
  const newUpdate = {
    id: idEdit,
    title: req.body.title || blog.title,
    content: req.body.content || blog.content,
    image: editedImage || blog.image,
  };

  try {
    await blog.findByIdAndUpdate(idEdit, newUpdate);
    res.status(200).json({
      message: "successfully edited ",
    });
  } catch {
    res.status(400).json({ message: "OOPS!! couldn't solved" });
  }
};

const deleteblog = async (req, res) => {
  const idDelete = req.params.id;

  try {
    await blog.findByIdAndDelete(idDelete).then(() => {
      res.status(200).json({
        message: "you've deleted successfully  ",
      });
    });
  } catch {
    res.status(400).json({ message: "OOPS!! couldn't delete" });
  }
};

module.exports = {
  bloglist,
  oneblog,
  createblog,
  editblog,
  deleteblog,
  usersBlog,
};
