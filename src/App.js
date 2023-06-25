// import React, { useState, useEffect } from 'react';
// import './App.css';

// const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// function App() {
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState('');

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const data = await response.json();
//       setTodos(data);
//     } catch (error) {
//       console.log('Error fetching todos:', error);
//     }
//   };

//   const addTodo = async () => {
//     if (newTodo.trim() === '') {
//       return;
//     }

//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: newTodo,
//           completed: false,
//         }),
//       });

//       const data = await response.json();

//       setTodos([...todos, data]);
//       setNewTodo('');
//     } catch (error) {
//       console.log('Error adding todo:', error);
//     }
//   };

//   const updateTodo = async (id) => {
//     try {
//       const updatedTodos = todos.map((todo) => {
//         if (todo.id === id) {
//           return { ...todo, completed: !todo.completed };
//         }
//         return todo;
//       });

//       setTodos(updatedTodos);

//       await fetch(`${API_URL}/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedTodos.find((todo) => todo.id === id)),
//       });
//     } catch (error) {
//       console.log('Error updating todo:', error);
//     }
//   };

//   const deleteTodo = async (id) => {
//     try {
//       await fetch(`${API_URL}/${id}`, {
//         method: 'DELETE',
//       });

//       const updatedTodos = todos.filter((todo) => todo.id !== id);
//       setTodos(updatedTodos);
//     } catch (error) {
//       console.log('Error deleting todo:', error);
//     }
//   };

//   return (
//     <div className="todo-app">
//       <h2>Todo List</h2>
//       <div className="todo-input">
//         <input
//           type="text"
//           placeholder="Add a task"
//           value={newTodo}
//           onChange={(e) => setNewTodo(e.target.value)}
//         />
//         <button onClick={addTodo}>Add</button>
//       </div>
//       <ul className="todo-list">
//         {todos.map((todo) => (
//           <li className="todo-item" key={todo.id}>
//             <div className="todo-content">
//               <input
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() => updateTodo(todo.id)}
//               />
//               <span className={todo.completed ? 'completed' : ''}>
//                 {todo.title}
//               </span>
//             </div>
//             <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoValue, setEditTodoValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log('Error fetching todos:', error);
    }
  };

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
      setNewTodo('');
    } catch (error) {
      console.log('Error adding todo:', error);
    }
  };

  const updateTodo = (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    setEditTodoId(id);
    setEditTodoValue(todoToUpdate.title);
  };

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

      await fetch(`${API_URL}/${editTodoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodos.find((todo) => todo.id === editTodoId)),
      });

      setEditTodoId(null);
      setEditTodoValue('');
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  };

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

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

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
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
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
