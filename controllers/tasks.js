import Task from '../models/task';
import { uploadImage } from '../services/storage';

export const getTasks = async (req, res, next) => {
  const { board_id } = req.params;
  let tasks;

  try {
    tasks = await Task.find({ board: board_id }).sort('date').populate('creator').lean();
  } catch ({ message }) {
    return next({
      status: 404,
      message,
    });
  }

  res
    .status(200)
    .json({
      tasks,
    });
};

export const getAllTasks = async (req, res, next) => {
  let tasks;

  try {
    tasks = await Task.find().sort('date').populate('creator').lean();
  } catch ({ message }) {
    return next({
      status: 500,
      message,
    });
  }

  res
    .status(200)
    .json({
      tasks,
    });
};

export const createTask = async (req, res, next) => {
  const { board_id } = req.params;
  let task;

  try {
    task = await Task.create({ board: board_id, creator: req.user._id, ...req.body });
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
      message: 'New task successfully created',
      task,
    });
};

export const updateTask = async (req, res, next) => {
  const { task_id } = req.params;
  let task;

  try {
    task = await Task.findOne({ _id: task_id });
    Object.assign(task, req.body);
    await task.save();
  } catch ({ message }) {
    return next({
      status: 400,
      message,
    });
  }

  res
    .status(200)
    .json({
      message: 'Task successfully updated',
    });
};

export const updateTaskStatus = async (req, res, next) => {
  const { task_id, status } = req.params;
  let task;

  try {
    task = await Task.findOne({ _id: task_id });
    task.status = status;
    await task.save();
  } catch ({ message }) {
    return next({
      status: 400,
      message,
    });
  }

  res
    .status(200)
    .json({
      message: 'Task successfully updated',
    });
};

export const attachFile = async (req, res, next) => {
  const { task_id } = req.params;
  let task;
  let url;

  try {
    task = await Task.findOne({ _id: task_id });
    if (!task) {
      throw new Error('Task does not exists');
    }
    url = await uploadImage(req.body);
    task.attachments.push(url);
    task.save();
  } catch ({ message }) {
    return next({
      status: 400,
      message,
    });
  }

  res
    .status(200)
    .json({
      message: 'Attachment successfully uploaded',
      url,
    });
};

export const deleteTask = async (req, res, next) => {
  const { task_id } = req.params;

  try {
    await Task.findOneAndRemove({ _id: task_id });
  } catch ({ message }) {
    return next({
      status: 404,
      message,
    });
  }

  res
    .status(200)
    .json({
      message: 'Task successfully removed',
    });
};
