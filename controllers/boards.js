import Board from '../models/board';
import Task from '../models/task';

export const getBoards = async (req, res, next) => {
  let boards;

  try {
    boards = await Board.find().populate('creator').lean();
  } catch ({ message }) {
    return next({
      status: 500,
      message,
    });
  }

  res
    .status(200)
    .json({
      boards,
    });
}


export const createBoard = async (req, res, next) => {
  const { title } = req.body;
  const creator = req.user._id;

  let board;

  try {
    board = await Board.create({ title, creator });
  } catch (err) {
    const message = Object
      .values(err.errors)
      .join(', '); // get string error from errors objects

    return next({
      status: 400,
      message,
    });
  }

  res
    .status(201)
    .json({
      message: 'New board successfully created',
      board,
    })
}

export const updateBoard = async (req, res, next) => {
  const { _id } = req.params;
  let board;

  try {
    board = await Board.findOne({ _id });
    
    if (!board) {
      return next({
        status: 404,
        message: 'Board not found!',
      });
    }

    Object.assign(board, req.body);
    await board.save();
  } catch ({ message }) {
    return next({
      status: 400,
      message,
    });
  }

  res
    .status(200)
    .json({
      message: 'Board successfully updated',
    });
}

export const deleteBoard = async (req, res, next) => {
  const { _id } = req.params;

  try {
    await Board.findOneAndRemove({ _id });
  } catch ({ message }) {
    return next({
      status: 404,
      message,
    });
  }

  res
    .status(200)
    .json({
      message: 'Board successfully removed!',
    });
}
