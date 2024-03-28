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
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TodoItem from "./TodoItem/TodoItem";

let localTodoList = localStorage.getItem("todolist");
localTodoList = JSON.parse(localTodoList);

const Todolist = () => {
  const [todoList, setTodoList] = useState(
    localTodoList === null ? [] : localTodoList
  );
  const [todo, setTodo] = useState("");

  // const todoTasks = todoList.filter((each) => each.completed === false);
  // const doneTasks = todoList.filter((each) => each.completed === true);

  useEffect(() => {
    const getTodos = async () => {
      const url = "https://jsonplaceholder.typicode.com/todos";
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok === true) {
        if (localTodoList === null) {
          const updatedTodoList = [...data.slice(0, 8), ...todoList];
          localStorage.setItem("todolist", JSON.stringify(updatedTodoList));
          setTodoList(updatedTodoList);
        }
      }
    };
    getTodos();
  }, []);

  const deleteTodo = (id) => {
    const filteredList = todoList.filter((each) => each.id !== id);
    localStorage.setItem("todolist", JSON.stringify(filteredList));
    setTodoList(filteredList);
  };

  const onAddTodo = (event) => {
    event.preventDefault();

    if (todo === "") {
      alert("Enter a task");
      return;
    }

    const newTodo = {
      id: uuidv4(),
      title: todo,
      completed: false,
    };
    const updatedTodoList = [...todoList, newTodo];
    localStorage.setItem("todolist", JSON.stringify(updatedTodoList));
    setTodoList(updatedTodoList);
    setTodo("");
  };

  const getTodoPosition = (id) => todoList.findIndex((todo) => todo.id === id);

  const handleDragEnd = (event) => {
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
          <img
            src="https://res.cloudinary.com/duyhbrsgi/image/upload/v1690024974/icon_1_qthvd3.png"
            alt="todo"
            className="w-[50px] rotate-6 hover:rotate-90 duration-300"
          />
        </div>
        <form className="w-[90%] max-w-[700px] mb-[15px]" onSubmit={onAddTodo}>
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
          <div className="w-[90%] mt-[20px] grid grid-cols md:grid-cols-2">
            <div className="md:mr-[20px] mb-[30px]">
              <h1 className="mb-[15px] hover:-translate-y-1/4 duration-300 font-signature font-bold text-3xl bg-red-500 text-white rounded-md py-[10px] pl-[15px] md:text-center">
                TO DO
              </h1>
              <SortableContext
                items={todoList}
                strategy={verticalListSortingStrategy}
              >
                {todoList.map((each) => {
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
