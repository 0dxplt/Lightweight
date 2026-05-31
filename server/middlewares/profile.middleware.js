const canAccessProfile = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({
            success: false,
            message: "You must be a user"
        });
    }

    const body = req.body;
    const profileId = body.profileId;

    if (profileId != req.user.userId) {
        return res.status(403).json({
            success: false,
            message: "You cannot access other users profiles"
        });
    }

    next();
}

module.exports = canAccessProfile;