import Admin from "../models/adminModels.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/userModels.js";


export const adminLogin = async (req, res) => {


    try {
        const { email, password } = req.body


        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {

            req.flash('error',"Admin is not found with this email.")

            return res.redirect('/admin');
           
        }

        const isPasswordTrue = await bcrypt.compare(password, existingAdmin.password);
        if (!isPasswordTrue) {
            req.flash('error',"Incorrect Password.")
            return res.redirect('/admin');
           
        }


        const token = jwt.sign(
            { _id: existingAdmin._id, email: existingAdmin.email, role: "Admin" },
            "my-jwt-secret",
            { expiresIn: "7d" }
        );
        res.cookie('adminToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        console.log("Admin logged in successfully:", existingAdmin.email);
        res.redirect('/admin/home');


    } catch (err) {
        console.error("Error during admin login:", err);
        res.status(500).send("An error occurred while processing your login request.");
    }
}


export const signupAdmin = async (req, res) => {
    console.log("start");

    try {
        const { name, email, password } = req.body;
        console.log(req.body);

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.json({ message: "Admin already exists" }); // Fix here
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        console.log("Account Created Successfully", newAdmin);
        return res.json({ message: "Admin created" }); // Success response
    } catch (err) {
        console.log("Account Creation Error", err);
        res.status(500).send("Error occurred while creating the account.");
    }
};


export const adminLogout = (req, res) => {

    res.clearCookie('adminToken');


    console.log("Admin logged out");
    return res.redirect('/');
};


export const getAllUser = async (req, res) => {
    try {
        const users = await User.find();


        res.render('adminhome', { users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("An error occurred while fetching users.");
    }
};


export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        console.log(`User with ID ${id} deleted successfully.`);
        res.redirect('/admin/home');
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error occurred while deleting user.");
    }
};



export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        console.log(user);

        if (!user) {
            return res.status(404).send("User not found");
        }

        return res.render('editUser', { user });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Error fetching user");

    }
}


export const editUser = async (req, res) => {
    try {
        const id = req.params.id
        const { name, email ,password} = req.body
        let updateData = { name, email };
        const hashedPassword = await bcrypt.hash(password, 10);
           updateData.password=hashedPassword
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        console.log("User updated:", updatedUser);
        return res.redirect('/admin/home');

    } catch (err) {
        console.log(err);
        return res.status(500).send("Error updating user");

    }
}