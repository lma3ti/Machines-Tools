


exports.getPageContact=(req,res,next)=>{
    res.render('contact',{ user: req.session.user})
}