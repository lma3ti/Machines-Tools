
exports.getPageallproducts=(req,res,next)=>{
    res.render('allproducts',{ user: req.session.user})
}