const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const keyword = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, dueDate, priority } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // Use the new date and start time when supplied.
    // Otherwise, keep compatibility with the old dueDate format.
    const taskDate =
      date && startTime ? new Date(`${date}T${startTime}`) : new Date(dueDate);

    if (!taskDate || Number.isNaN(taskDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid task date and start time are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      date: date || "",
      startTime: startTime || "",
      endTime: endTime || "",
      dueDate: taskDate,
      priority,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Keep dueDate synchronized when the new date/time fields are edited.
    if (updates.date && updates.startTime) {
      const taskDate = new Date(`${updates.date}T${updates.startTime}`);

      if (Number.isNaN(taskDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid task date or start time",
        });
      }

      updates.dueDate = taskDate;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
