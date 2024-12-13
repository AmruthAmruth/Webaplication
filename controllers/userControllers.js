import bcrypt from 'bcryptjs';
import User from '../models/userModels.js';  
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render('signup', { error: "Email is already in use. Please choose another email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("Account Created Successfully", newUser);
   return req.cookies.adminToken ? res.redirect('/admin/home') : res.redirect('/')
    
  } catch (err) {
    console.log("Account Creation Error", err);
    res.status(500).send("Error occurred while creating the account.");
  }
};


export const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
       
       req.flash('error',"Email is not exist")

       return res.redirect('/');
      }
  
      
      const isPasswordTrue = await bcrypt.compare(password, existingUser.password);
  
      if (!isPasswordTrue) {
        req.flash('error',"Incorrect password")

        return res.redirect('/');
      }
  
    
      req.session.user=existingUser.name
      console.log(req.session.user);
      
    
    return req.session.user ? res.redirect('/home') : res.render('login')
      
  
    } catch (err) {
      console.log("Account Login Error", err);
      res.status(500).send("Error occurred while logging into the account.");
    }
  };


 


  export const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
        return res.status(500).send("Unable to log out. Please try again.");
      }
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.redirect('/'); 
    });
  };