const Post=require("../../models/postSchema")
const Category=require("../../models/categorySchema")
const Comment=require("../../models/commentSchema")
const {isEmpty} =require("../../conf/customFunctions")

module.exports.indexRoute=(req,res)=>{
        res.render("admin/index")
}

module.exports.savePost=(req,res)=>{
    let fileName=``
    if (isEmpty(req.files)){
    let file=req.files.uploadedFile
        fileName=file.name
        let uploadDir="./public/uploads/"
        file.mv(uploadDir+fileName,(err)=>{
            console.log(err)
        })
    }

    const newPost= new Post({
        title:req.body.title,
        description:req.body.description,
        status:req.body.status,
        allowComments:req.body.allowComments==="on",
        category:req.body.category,
        file:`/uploads/${fileName}`
    })
    newPost.save().then(post=>{
        res.redirect("/admin/posts")
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.saveCategories=(req,res)=>{
    const newCategory= new Category({
        title:req.body.title
    })
    newCategory.save().then(category=>{
        res.json({title:category.title,
        _id:category._id})
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.saveEditPost=(req,res)=>{
    Post.findByIdAndUpdate(req.body.postID.split("/")[0],{
        title:req.body.title,
        description:req.body.description,
        allowComments:req.body.allowComments==="on",
        status:req.body.status
    }).then(result=>{
        res.redirect("/admin/posts")
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.editCategories=(req,res)=>{
    Category.find().then(categories=>{
        Category.findById(req.params.id).then((category)=>{
            res.render("admin/category/edit", {categories,title:category.title,id:category.id})
        })

    }).catch(err=>{
        console.log(err)
    })
}

module.exports.saveCategory=(req,res)=>{
    Category.findByIdAndUpdate(req.body.id,{title:req.body.name}).then(result=>{
        res.redirect("/admin/category")
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.deleteCategories=(req,res)=>{
    Category.findByIdAndDelete(req.params.id).then(result=>{
        res.redirect("/admin/category")
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.getPosts=(req,res)=>{
    Post.find().populate("category")
        .then(posts=>{
            res.render("admin/posts/posts", {posts})
    }).catch(err=>{
        console.log(err)
    })

}

module.exports.createPost=(req,res)=>{
    Category.find().then(categories=>{
        res.render("admin/posts/create",{categories})
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.editPost=(req,res)=>{
    const id =req.params.id
    Post.findById(id).then(post=>{
        Category.find().then(categories=> {
            res.render("admin/posts/edit", {post,categories})
        })
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.deletePost=(req,res)=>{
    const id =req.params.id
    Post.findByIdAndDelete(id).then(post=>{
        res.redirect("/admin/posts")
    })
}

module.exports.getCategories=(req,res)=>{
    Category.find().then(categories=>{
        res.render("admin/category/",{categories})
    }).catch(err=>{
        console.log(err)
    })

}

module.exports.getComment=(req,res)=>{
    Comment.find().populate("user")
        .then(comments=>{
        res.render("./admin/comments/comments",{comments})
    }).catch(err=>{
        console.log(err)
    })

}


