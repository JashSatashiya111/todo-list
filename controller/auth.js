const asyncHandler = require("../middleware/async")
const bcrypt = require("bcryptjs");
const User = require("../model/user")
const jwt = require('jsonwebtoken');
const router = require("express").Router();

// Sign up for admin/user:
const signup = asyncHandler(async (req, res, next) => {
  try {
    if (!['admin', 'user'].includes(req.body.role)) {
      throwError('Please enter valid role', 400)
    }
    const findExistData = await User.findOne({ email: req.body.email })
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    if (findExistData) {
      throwError('user already exist', 409)
    }
    let data = await User.create(req.body)
    const accessToken = jwt.sign({ id: data._id, role: data.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: data._id, role: data.role }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });

    res.status(200).send({ data: { accessToken, refreshToken }, message: "user created successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// login for admin/user:
const login = asyncHandler(async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email }).select('+password').lean();
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      // return res.status(400).send({message : "email or password invalid."})
      throwError('email or password invalid.', 400)
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
    delete user.password;
    user.accessToken = accessToken
    user.refreshToken = refreshToken
    return res.status(200).send({ data: user, message: "user login successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// To get new access token:
const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      throwError('user not found', 400)
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).send({ data: accessToken, message: "token generated successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});


router.post("/signup", signup);
router.post("/login", login);
router.post("/refreshToken", refreshToken);

module.exports = router;