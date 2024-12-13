import { logout, signupUser, userLogin } from '../controllers/userControllers.js'
import express from 'express'
import {  disableCache, redirectIfAuthenticated } from '../middileware/middileware.js'

const userRouter = express.Router()

userRouter.get('/signup',[redirectIfAuthenticated,disableCache], (req, res) => {
  res.render('signup')  
})

userRouter.get('/', [redirectIfAuthenticated,disableCache],(req,res)=>{
        if(!req.cookies.adminToken){
          res.render('login',{error:req.flash('error')})
        }else{
          res.redirect('/admin/home')
        }



})

userRouter.get('/home',disableCache,(req,res)=>{
  if (req.session.user) {
    res.render('home',{user:req.session.user})
    
  } else {
    res.redirect('/'); 
  }
})



userRouter.post('/',disableCache,userLogin)

userRouter.post('/logout',logout)
userRouter.post('/signup', signupUser)

export default userRouter
