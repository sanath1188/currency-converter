module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        
        res.status(401).json({
            data: "User not authorized to perform this action!"
        })
    }
}