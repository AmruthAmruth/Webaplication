import { adminLogin, adminLogout, deleteUser, editUser, getAllUser, getUserById, signupAdmin } from "../controllers/adminControllers.js";
import { adminAuthenticate, disableCache, redirectIfAuthenticatedAdmin } from "../middileware/middileware.js";

import express from 'express';

const adminRouter = express.Router();


adminRouter.get('/', disableCache, redirectIfAuthenticatedAdmin, (req, res) => {
    
    if(!req.cookies.adminToken){

        return res.render('adminLogin',{error:req.flash('error')});
    }
});


adminRouter.get('/home', adminAuthenticate, disableCache ,getAllUser, (req, res) => {
   
    
    return res.render('adminhome');
});


adminRouter.post('/signup', signupAdmin);


adminRouter.post('/', adminLogin);


adminRouter.post('/logout', adminLogout);

adminRouter.post('/user/:id/delete', deleteUser);

adminRouter.post('/user/:id/update',getUserById)

adminRouter.post('/edituser/:id',editUser)

adminRouter.post('/adduser',adminAuthenticate,(req,res)=>{
    return res.render('signup',{title:"Create a new user"})
})

export default adminRouter;
