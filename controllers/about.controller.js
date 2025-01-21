exports.getPageAbout=(req,res,next)=>{
    res.render('about',{ user: req.session.user})
}