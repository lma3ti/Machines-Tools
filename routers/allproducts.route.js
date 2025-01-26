const route=require('express').Router()
const contactController=require('../controllers/allproducts.controller')


route.get('/allproducts',contactController.getPageallproducts)



module.exports=route