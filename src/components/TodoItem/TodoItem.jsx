/* eslint-disable no-useless-concat */
import React from "react";

import { FaTrash } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TodoItem = (props) => {
  const { todoDetails, deleteTodo, onChangeStatus } = props;
  const { id, title, completed } = todoDetails;
  const completedTodo = completed ? "line-through" : "";

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="todo-item py-[10px] cursor-default pl-[8px] pr-[11px] rounded-md my-[10px] flex items-center bg-cyan-100 border-l-[5px] border-teal-400 hover:scale-105 duration-200 hover:shadow-lg"
    >
      <input
        onInput={() => onChangeStatus(id)}
        onChange={() => onChangeStatus(id)}
        type="checkbox"
        id={`todo${id}`}
        checked={completed}
        className="mr-[5px] w-[20px]"
      />
      <label className={`text-black flex-1 ${completedTodo}`}>{title}</label>
      <div>
        <button className="" onMouseDown={() => deleteTodo(id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
