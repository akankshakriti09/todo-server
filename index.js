const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const modalTask = require("./modal.task");
const { Op } = require("sequelize");

const server = express();
server.use(bodyParser.json());
const port = process.env.PORT || 3600;

// server.use(cors())

server.get("/", (req, res) => {
  res.send("HEllo wORld");
});

server.get("/task-list", async (req, res) => {
  try {
    const { search } = req.query;
    const todo = await modalTask.findAll({
      where: {
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
        },
      },
    });

    return res
      .status(200)
      .json({ status: true, message: "List fetched Successfully", data: todo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong !!",
      errors: error,
    });
  }
});

server.get("/view-task", async (req, res) => {
  try {
    const todo = await modalTask.findOne({ where: { id: req.query.id } });
    if (todo) {
      return res.status(200).json({
        status: true,
        message: "Detail fetched Successfully",
        data: todo,
      });
    } else {
      return res.status(204).json({
        status: true,
        message: "No data found",
        //   data: todo,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong !!",
      errors: error,
    });
  }
});

server.patch("/update-task", async (req, res) => {
  try {
    const todo = await modalTask.findOne({
      where: { id: req.query.id },
    });
    if (todo) {
      todo.update({
        name: req.body.name,
      });
      return res
        .status(200)
        .json({ status: true, message: "Task updated Successfully" });
    } else {
      return res.status(404).json({
        status: true,
        message: "No data found",
        //   data: todo,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong !!",
      errors: error,
    });
  }
});

server.delete("/remove-task", async (req, res) => {
  try {
    const todo = await modalTask.destroy({
      where: { id: req.query.id },
    });
    if (todo) {
      return res
        .status(200)
        .json({ status: true, message: "Task Deleted Successfully" });
    } else {
      return res.status(404).json({
        status: true,
        message: "No data found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong !!",
      errors: error,
    });
  }
});

server.post("/add-task", async (req, res) => {
  try {
    await modalTask.create({
      name: req.body.name,
      status: false,
    });
    return res
      .status(200)
      .json({ status: true, message: "Task created Successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong !!",
      errors: error,
    });
  }
});

server.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});
