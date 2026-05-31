const verifyMod = (req, res, next) => {
    if (req.user.role !== 'mod') {
        return res.status(403).json({
            success: false,
            message: "You are not a moderator"
        });
    }
    next();
}

module.exports = verifyMod;