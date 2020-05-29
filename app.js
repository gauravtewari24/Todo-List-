var express = require("express");
var mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

var app = express();

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/Todo", {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log(Error, err.message);
  });
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});

var Port = process.env.PORT || 3000;
app.listen(Port, function () {
  console.log("Server Started");
});
