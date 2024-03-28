/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core"; // Used dnd-kit/core toolkit for drag and drop
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TodoItem from "./TodoItem/TodoItem"; // Imported TodoItem to represent each todo item

let localTodoList = localStorage.getItem("todolist"); // The todos are being accessed from local storage
localTodoList = JSON.parse(localTodoList); // Obtained todos are parsed into their respective data types

const Todolist = () => {
  const [todoList, setTodoList] = useState(
    localTodoList === null ? [] : localTodoList // If the todoList in local storage is null then initialized with empty array
  );
  const [todo, setTodo] = useState(""); // Initialized an empty todo title

  useEffect(() => {
    const getTodos = async () => {
      const url = "https://jsonplaceholder.typicode.com/todos"; //JSonPlaceholder API
      const response = await fetch(url); // get todos through fetch call
      const data = await response.json();
      if (response.ok === true) {
        if (localTodoList === null) {
          const updatedTodoList = [...data.slice(0, 8), ...todoList];
          localStorage.setItem("todolist", JSON.stringify(updatedTodoList)); // Updating the todoList in local storage with todos obtained from API
          setTodoList(updatedTodoList); // Updated the state with updatedTodosList
        }
      }
    };
    getTodos();
  }, []); // Using empty dependency array to execute the effect callback function only once after the initial component render

  const deleteTodo = (id) => {
    // Function to delete the todoItem using Id as parameter
    const filteredList = todoList.filter((each) => each.id !== id);
    localStorage.setItem("todolist", JSON.stringify(filteredList));
    setTodoList(filteredList);
  };

  const onAddTodo = (event) => {
    // Function to add todo in todoList
    event.preventDefault(); // method to prevent default behaviour of browser

    if (todo === "") {
      alert("Enter a task"); // Made alert if the user input is empty
      return;
    }

    const newTodo = {
      id: uuidv4(), // uuidv4() returns a unique id everytime it is called
      title: todo,
      completed: false,
    };
    const updatedTodoList = [...todoList, newTodo];
    localStorage.setItem("todolist", JSON.stringify(updatedTodoList));
    setTodoList(updatedTodoList);
    setTodo("");
  };

  const getTodoPosition = (id) => todoList.findIndex((todo) => todo.id === id); // Function to obtain the index of the todoItem in toodList

  const handleDragEnd = (event) => {
    // This function handles the drag event

    const { active, over } = event;

    if (active.id === over.id) return;

    setTodoList((todos) => {
      const originalPosition = getTodoPosition(active.id);
      const newPosition = getTodoPosition(over.id);

      const updatedTodoList = arrayMove(
        todoList,
        originalPosition,
        newPosition
      );

      localStorage.setItem("todolist", JSON.stringify(updatedTodoList));
      return updatedTodoList;
    });
  };

  const onChangeStatus = (id) => {
    // Function to change the status of todo whether todo or done
    const updatedTodoList = todoList.map((each) => {
      if (each.id === id) {
        let { completed } = each;
        completed = completed ? false : true;
        return { ...each, completed };
      }
      return each;
    });
    localStorage.setItem("todolist", JSON.stringify(updatedTodoList));
    setTodoList(updatedTodoList);
  };

  const sensors = useSensors(
    // Allowing application to work using touch, pointer, keyboard
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div
      className="w-full min-h-screen flex items-start py-[60px] "
      style={{ backgroundColor: "#04192d" }}
    >
      <div className="bg-white w-[90%] md:max-w-screen-lg mx-auto rounded-lg flex flex-col items-center py-[30px]">
        <div className="flex md:justify-center items-center w-[90%] max-w-[700px] mb-[15px]">
          <h1
            style={{ color: "#0618bb" }}
            className="font-bold text-4xl md:text-[45px] mr-[20px] mb-[20px] mt-[15px]"
          >
            TO-DO List
          </h1>

          {/* todo logo */}
          <img
            src="https://res.cloudinary.com/duyhbrsgi/image/upload/v1690024974/icon_1_qthvd3.png"
            alt="todo"
            className="w-[50px] rotate-6 hover:rotate-90 duration-300"
          />
        </div>
        <form className="w-[90%] max-w-[700px] mb-[15px]" onSubmit={onAddTodo}>
          {" "}
          {/* form container to use input elements and to receive inputs from user */}
          <div className="bg-gray-200 h-[60px] flex justify-between rounded-[30px] pl-[25px]">
            <input
              type="text"
              className="bg-transparent outline-none font-signature font-normal w-[75%]"
              placeholder="Add your task"
              value={todo}
              onChange={(event) => setTodo(event.target.value)}
            />
            <button className="bg-orange-500 rounded-[30px] text-white w-[25%] max-w-[130px] outline-none">
              Create
            </button>
          </div>
        </form>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          {/* Drag and drop is implemented only inside the Dnd Context */}
          <div className="w-[90%] mt-[20px] grid grid-cols md:grid-cols-2">
            <div className="md:mr-[20px] mb-[30px]">
              <h1 className="mb-[15px] hover:-translate-y-1/4 duration-300 font-signature font-bold text-3xl bg-red-500 text-white rounded-md py-[10px] pl-[15px] md:text-center">
                TO DO
              </h1>
              <SortableContext
                items={todoList}
                strategy={verticalListSortingStrategy}
              >
                {/* Used SortedContext to reorder the todos*/}
                {todoList.map((each) => {
                  // Render the tasks who status is not completed
                  const { id, completed } = each;
                  if (completed === false) {
                    return (
                      <TodoItem
                        key={id}
                        todoDetails={each}
                        deleteTodo={deleteTodo}
                        onChangeStatus={onChangeStatus}
                      />
                    );
                  }
                })}
              </SortableContext>
            </div>

            <div className="md:ml-[20px]">
              <h1 className="mb-[15px] hover:-translate-y-1/4 duration-300 font-signature font-bold text-3xl bg-green-600 text-white rounded-md py-[10px] pl-[15px] md:text-center">
                DONE
              </h1>
              <SortableContext
                items={todoList}
                strategy={verticalListSortingStrategy}
              >
                {/* Render the tasks who status is completed */}
                {todoList.map((each) => {
                  const { id, completed } = each;
                  if (completed === true) {
                    return (
                      <TodoItem
                        key={id}
                        todoDetails={each}
                        deleteTodo={deleteTodo}
                        onChangeStatus={onChangeStatus}
                      />
                    );
                  }
                })}
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Todolist;
