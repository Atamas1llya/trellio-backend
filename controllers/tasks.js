import Task from '../models/task';

export const getTasks = async (req, res, next) => {
  const { board_id } = req.params;
  let tasks;

  try {
    tasks = await Task.find({ board: board_id }).sort('date').lean();
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
}

export const getAllTasks = async (req, res, next) => {
  let tasks;

  try {
    tasks = await Task.find().sort('date').lean();
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
}

export const createTask = async (req, res, next) => {
  const { board_id } = req.params;
  let task;

  try {
    task = await Task.create({ board: board_id, ...req.body });
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
}

export const updateTask = async (req, res, next) => {
  const { task_id } = req.params;

  try {
    await Task.findOneAndUpdate({ _id: task_id }, req.body);
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
    .status(200)
    .json({
      message: 'Task successfully updated',
    });
}

export const updateTaskStatus = async (req, res, next) => {
  const { task_id, status } = req.params;

  try {
    await Task.findOneAndUpdate({ _id: task_id }, { status });
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
}

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
}
