const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("./errorResponse");

exports.adminCheck = asyncHandler(async (req, res, next) => {
  try {
    if (req.urole !== 'admin') {
      return res.status(400).json({ error: 'Not Authorized' });
    }
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this route", 400));
  }
});

exports.authenticateToken = asyncHandler(async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.uId = user.id;
      req.urole = user.role;
      next();
    });
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this route", 400));
  }
});
