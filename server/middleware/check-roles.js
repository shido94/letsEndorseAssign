

// Authentication middleware
module.exports = (roles) => (req, res, next) => {

    // `roles` argument is an array of roles
    // We check whether user authenticated or not.
    // If user authenticated, `req.user` will be object otherwise it will be `undefined`
    if(req.userData) { // `req.user` is a user object from Database
        // Checking whether `req.userData` has a corresponded role
        if ((roles.indexOf(req.userData.role) !== -1 && req.userData.isAdmin)
            || (roles.indexOf(req.userData.role) !== -1 && req.userData.role === 'user')
            || (roles.indexOf('user') !== -1 && req.userData.role === 'admin')) next(); // `req.user.role` is string and it may be "admin", "superadmin", or "user"
        else res.status(403).send({message: "unauthorized"});
    } else {
        res.status(401).send({message: "unauthorized"});
    }
};