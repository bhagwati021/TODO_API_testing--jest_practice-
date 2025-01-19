import React, {useState, useEffect} from "react"

import AddTodo from "./AddTodo"
import TodoItem from "./TodoItem"
import BACKEND_URL from "../config/config"

const TodoList = () =>{
    const [todos, setTodos] = useState([]);

    useEffect(()=>{
        fetchTodos();
    }, [])

    const fetchTodos = async () =>{
        try {
            const response = await fetch(`${BACKEND_URL}/todos`)
            const data = await response.json()
            setTodos(data.todos)
        } catch (error) {
            console.error("Error fetching the data", error)
        }
    }

    const addTodo = async (title) =>{
        console.log("Adding todo", title)
        try {
            const response = await fetch(`${BACKEND_URL}/todos`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title})
            })
            console.log("response is", response)
            const newTodo = await response.json();
            setTodos((prev)=> [...prev, newTodo])
            console.log("Response received", response)
        } catch (error) {
            console.error("Error while creating the todo", error)
        }
    }

    // Update an existing todo
    const updateTodo = async (id, updatedTitle) => {
        try {
            const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: updatedTitle }),
            });

            if (!response.ok) {
                throw new Error("Failed to update todo");
            }

            const updatedTodo = await response.json();

            // Update the todos in the state
            setTodos((prev) =>
                prev.map((todo) => (todo._id === id ? updatedTodo : todo))
            );
        } catch (error) {
            console.error("Error while updating the todo:", error);
        }
    };

    const deleteTodo = async (id) =>{
        try {
            const response = await fetch(`${BACKEND_URL}/todos/${id}`,{
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Failed to delete todo");
            }

            setTodos((prev) => prev.filter((todo) => todo._id !== id)); // Remove the deleted todo from the list
        } catch (error) {
            console.error("Error while deleting the todo:", error);
        }
    };

    return (
        <div>
            <h1> Todo List </h1>
            <AddTodo onAdd= {addTodo} />
            <ul>
                {/* Render the list of todos */}
                {todos.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} onDelete={deleteTodo} />
                ))}
            </ul>
        </div>
    )

}

export default TodoList
