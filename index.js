import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import adminRouter from './routes/adminRoutes.js';
import methodOverride from 'method-override'
import flash from 'connect-flash'
const app = express();

app.set("view engine", "hbs"); 
app.set("views", path.join(path.resolve(), "views"));   

app.use(express.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(flash())


app.use(session({
    secret: 'amruth', 
    resave: false,             
    saveUninitialized: true,   
  }));





app.use('/', userRouter);
app.use('/admin',adminRouter)

app.get('*',(req,res)=>{
  res.render('error')
})

app.use((req,res,next)=>{
  res.locals.error=req.flash('error')
  next()
})



const server=()=>{
  app.listen(7000, () => {
    console.log("Server is running on port 7000");
  });
}


const url = "mongodb://localhost:27017/webapplication";
mongoose.connect(url).then(() => {
    console.log("Mongodb Connected Successfully");
    server()
  }).catch((err) => { 
    console.error('Error connecting to MongoDB:', err);
  });

