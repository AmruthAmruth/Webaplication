import jwt from 'jsonwebtoken'

export const disableCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
};

export const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/home'); 
    }
    next(); 
};




export const adminAuthenticate = (req, res, next) => {
  // Retrieve token from cookies
  const token = req.cookies.adminToken;

  // Check if token exists
  if (!token) {
    return res.redirect('/admin'); // If no token, redirect to login page
  }

  // Verify the token
  jwt.verify(token, "my-jwt-secret", (err, admin) => {
    if (err) {
      console.log("Invalid admin token:", err);
      return res.redirect('/admin'); // Token verification failed, redirect to login
    }

    // Token verified successfully, attach admin info to request
    req.admin = admin;

    // Proceed to the next middleware or route handler
    next();
  });
};



export const redirectIfAuthenticatedAdmin = (req, res, next) => {
  if (req.cookies.adminToken) {
    return res.redirect('/admin/home');
  }
  next();
};