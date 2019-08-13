const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const app = express();
const port = 3000;

// APP CONFIG
mongoose.connect("mongodb://localhost/BlogApp",{useNewUrlParser: true});
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


// MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res)=>{
	res.redirect("/blogs");
});

//RESTFUL ROUTES
//INDEX ROUTE
app.get("/blogs", (req, res)=>{
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index", {blogs: blogs});
		}
	});	
});

//NEW ROUTE
app.get("/blogs/new", (req, res)=>{
		res.render("new");
		});

//CREATE ROUTE
app.post("/blogs", (req, res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog)=>{
		if(err){
			console.log(err);
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res)=>{
	Blog.findById(req.params.id, (err, foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res)=>{
	Blog.findById(req.params.id, (err, foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});	
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, editedBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
app.delete("/blogs/:id", (req, res)=>{
	Blog.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.listen(port, ()=>console.log("BlogApp is now serving on port " +port));