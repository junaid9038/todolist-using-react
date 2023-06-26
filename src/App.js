import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function App() {
  const [todos, setTodos] = useState([]); //  It represents the array of todos.
  const [newTodo, setNewTodo] = useState(''); //  It represents the value of a new todo input field.
  const [editTodoId, setEditTodoId] = useState(null); // It stores the ID of the todo being edited. Initially set to null.
  const [editTodoValue, setEditTodoValue] = useState(''); //  It represents the value of the todo being edited

  useEffect(() => {
    fetchTodos();
  }, []);

  //  fetch todolist  from an API using the fetch function
  const fetchTodos = async () => { 
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log('Error fetching todos:', error);
    }
  };

  //adds the new todo to the todos state, resets the input field,
  // and handles any errors that may occur during the process.
  const addTodo = async () => {
    if (newTodo.trim() === '') {
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo,
          completed: false,
        }),
      });

      const data = await response.json();

      setTodos([...todos, data]);
      setNewTodo('');  //
    } catch (error) {
      console.log('Error adding todo:', error);
    }
  };
 
  //updateTodo function is invoked with the ID of a todo item, it searches for the matching item in the todos array.
  const updateTodo = (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    setEditTodoId(id);
    setEditTodoValue(todoToUpdate.title);
  };

 //updates the state of the todo item, 
  const saveUpdatedTodo = async () => {
    if (editTodoValue.trim() === '') {
      return;
    }

    try {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === editTodoId) {
          return { ...todo, title: editTodoValue };
        }
        return todo;
      });

      setTodos(updatedTodos);

      await fetch(`${API_URL}/${editTodoId}`, { //sends a PUT request to the API to save the updated todo item,
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodos.find((todo) => todo.id === editTodoId)),
      });

      setEditTodoId(null);
      setEditTodoValue('');   // and resets the state variables for editing.
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  };
  
  // It reflects the toggled status in the UI by updating the todos state variable.
  const toggleCompleted = async (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedTodos);

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodos.find((todo) => todo.id === id)),
      });
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  };

  //  deletes a todo item by sending a DELETE request to the API 
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
     //updating the state accordingly.
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.log('Error deleting todo:', error);
    }
  };

  return (
    <div className="todo-app">
      <h2>Todo List</h2>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
         <button onClick={addTodo}>Add</button> {/* add button */}
      </div>
       <ul className="todo-list"> {/*ul tag will contain the todo items. */}
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <div className="todo-content">
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo.id)}
                />
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.title}
                </span>
              </div>
              {editTodoId === todo.id ? (
                <div className="edit-input">
                  <input
                    type="text"
                    value={editTodoValue}
                    onChange={(e) => setEditTodoValue(e.target.value)}
                  />
                  <button className="save-button" onClick={saveUpdatedTodo}>
                    Save
                  </button>
                </div>
              ) : (
                <button className="update-button" onClick={() => updateTodo(todo.id)}>
                  Update
                </button>
              )}
            </div>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
