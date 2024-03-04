const asyncHandler = require("../middleware/async")
const todo = require("../model/todo")
const { authenticateToken, adminCheck } = require("../middleware/auth");
const router = require("express").Router();

// add Todo:
const Add_todo = asyncHandler(async (req, res, next) => {
  try {
    const todoItem = new todo({ title: req.body.title, description: req.body.description, userId: req.uId });
    await todoItem.save();
    res.status(200).send({ data: todoItem, message: "todo Item added  successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// update Todo:
const update_todo = asyncHandler(async (req, res, next) => {
  try {
    const updateTodo = await todo.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      },
      { returnDocument: 'after' },
    );
    if (!updateTodo) {
      throwError('no todo found', 400)
    }
    return res.status(200).send({ data: updateTodo, message: "tofo updated successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// get single Todo:
const get_todo = asyncHandler(async (req, res, next) => {
  try {
    const getTodo = await todo.findOne(
      {
        _id: req.params.id,
      }
    );
    if (!getTodo) {
      throwError('no todo found', 400)
    }
    return res.status(200).send({ data: getTodo, message: "tofo updated successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// get Todo list with pagination:
const get_todo_list = asyncHandler(async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const getTodo = await todo.find().sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    if (!getTodo) {
      throwError('no todo found', 400)
    }
    const getTodocount = await todo.find().countDocuments();
    const totalPage = Math.ceil(getTodocount / limit);

    return res.status(200).send({ data: { totalRecords: getTodocount, records: getTodo, currentPage: Number(page), totalPages: totalPage }, message: "tofo updated successfully" })
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

// delete multi Todo:
const delete_todo = asyncHandler(async (req, res, next) => {
  try {
    await todo.deleteMany({
      _id: { $in: req.body.id },
    });

    res.status(200).send({ message: "todo deleted successfully" });
  } catch (error) {
    return next(setError(error, error?.status));
  }
});

router.post("/Add_todo", authenticateToken, adminCheck, Add_todo);
router.put("/update_todo/:id", authenticateToken, adminCheck, update_todo);
router.get("/get_todo/:id", authenticateToken, get_todo);
router.get("/get_todo_list", authenticateToken, get_todo_list);
router.post("/delete_todo", authenticateToken, adminCheck, delete_todo);

module.exports = router;