import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    const { title, completed, priority, tags, dueDate } = req.body;
    let createdTodo = await Todo.create({
      title,
      completed,
      priority,
      tags,
      dueDate
    });

    createdTodo = createdTodo.toObject();
    res.status(201).json(createdTodo);

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {  
  try {
    const filter = {};
    let { page = 1 , limit = 10, completed, priority, search} = req.query;
    page = Number(page);
    limit = Number(limit);
    if(completed){
      filter.completed = completed === "true";
    }
    if(priority){
      filter.priority = priority;
    }
    if(search){
      filter.title = new RegExp(search, "i");
    }
    const data = await Todo.find(filter).skip((page -1) * limit).limit(limit).sort({createdAt: -1});
    const total = await Todo.countDocuments(filter);
    const pages = Math.ceil(total/limit);
    res.status(200).json({ data, meta: { total, page, limit, pages }})
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const {id} = req.params;
    const todo = await Todo.findById(id);
    if(!todo) return res.status(404).json({error: {message: "Item not found"}});
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const { title, completed, priority, tags, dueDate } = req.body;
    const { id } = req.params;
    const todo = await Todo.findByIdAndUpdate(
      id,
      {...req.body},
      {new: true, runValidators: true}
    )
    if(!todo) return res.status(404).json({ error: { message: "Todo not found"}});
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    const {id} = req.params;
    const todo = await Todo.findById(id);
        console.log("todo is:");
        console.log(todo);

    if(!todo) return res.status(404).json({error: {message: "Todo not found"}})

    todo.completed = !todo.completed;
    await todo.save();
    res.status(200).json(todo.toObject());
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if(!todo) return res.status(404).json({error: { message: "Todo not found"}});
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
