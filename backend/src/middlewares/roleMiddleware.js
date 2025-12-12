// PATIENT ROLE CHECK
function patientRoleMiddleware(req, res, next) {
  try {
    if (!req.user || req.user.role !== "Patient") {
      return res.status(403).json({ message: "Patient access only" });
    }

    if (req.user.isActive === false) {
      return res.status(403).json({ message: "User account is blocked" });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
}



// DOCTOR ROLE CHECK
function doctorRoleMiddleware(req, res, next) {
  try {
    if (!req.user || req.user.role !== "Doctor") {
      return res.status(403).json({ message: "Doctor access only" });
    }

    if (req.user.isActive === false) {
      return res.status(403).json({ message: "Doctor account is blocked" });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
}



// ADMIN ROLE CHECK
function adminRoleMiddleware(req, res, next) {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
}



module.exports = {
  patientRoleMiddleware,
  doctorRoleMiddleware,
  adminRoleMiddleware,
};
