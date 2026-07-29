import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useEffect } from "react";
import { excelExport } from "./excel";

const Calender = () => {
  const [input, setInput] = useState("");
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectDate, setSelectDate] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [editId,setEditId]=useState(null)

  useEffect(() => {
    const container = document.getElementById("external-events");

    const draggable = new Draggable(container, {
      itemSelector: ".fc-event",
      eventData: function (event1) {
        return {
          title: event1.innerText,
        };
      },
    });
    return () => draggable.destroy();
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    setSearch("");
    if (!input.trim()) return;

    if(editId){
      setTasks((prev)=>prev.map((item)=>item.id===editId?
    {...item,task:input}:item))
    setInput('')
    setEditId(null)
    }else{ 
      setTasks((prev) => [...prev, { id: crypto.randomUUID(), task: input }]);
      setInput("");
    }
  };


  const deleteTask = (id) => {
    setTasks((tasks) => tasks.filter((item) => item.id !== id));
  };

  const filteredTasks = tasks.filter((item) => {
    return item.task.toLowerCase().includes(search.toLowerCase());
  });

  const selectTasks = events.filter((item) => {
    return item.start === selectDate;
  });

  return (
    <div className="min-h-screen bg-gray-400 p-8">
      <div className="mx-auto flex max-w-7xl gap-8">
        <section
          id="external-events"
          className="w-80 rounded-2xl bg-white p-6 shadow-xl"
        >
          {/* add task */}
          <h1 className="mb-5 text-3xl font-bold text-slate-700">Tasks</h1>
          <form onSubmit={addTask} className="mb-4 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500"
              placeholder="Add task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
              {editId?"Save":"Add"}
            </button>
          </form>
          {/* search filter */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-5 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500"
          />
          {filteredTasks.length === 0 && (
            <h1 className="text-center text-gray-400">No tasks found</h1>
          )}
          {filteredTasks.map((item) => (
            <div
            key={item.id}
            className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-slate-50 p-3 shadow-sm transition hover:shadow-md"
            >
              <h1 className="fc-event cursor-grab font-medium text-gray-700">
                {item.task}
              </h1>
              <div className="flex gap-3">

            <button onClick={()=>{
              setEditId(item.id)
              setInput(item.task)}}>🖊</button>

              <button
                onClick={() => deleteTask(item.id)}
                className="rounded-lg bg-red-500 px-3 py-1 text-white transition hover:bg-red-600"
                >
                ✕
              </button>
                </div>
            </div>
          ))}
        </section>
        <section className="relative flex-1 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex justify-between mb-3">

          <h1 className="mb-5 text-3xl font-bold text-slate-700">Calendar</h1>
        <button
  onClick={() => excelExport(events)}
  className="rounded-lg bg-green-600 px-4 text-white hover:bg-green-700"
>
  Export Excel
</button>
  </div>
  {/* calendar */}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            droppable={true}
            events={events}
            eventColor="#5e5652"
            displayEventTime={false}
            dateClick={(info) => {
              setSelectDate(info.dateStr);
              console.log(info.dateStr);
              setShowCard(true);
            }}
            eventReceive={(info) => {
              console.log("event receive");
              info.event.remove();

              setEvents((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  title: info.event.title,
                  start: info.event.startStr,
                },
              ]);
            }}
          />

          {/* popup card */}
          {showCard && (
            <div className="absolute z-30 bg-gray-300 top-40 left-30 w-100 rounded-xl border p-4 shadow-xl">
              <div className="flex justify-between mb-3 items-center">
                <h2 className="font-bold">{selectDate} Tasks</h2>
                <button onClick={() => setShowCard(false)}>X</button>
              </div>
              {selectTasks.length === 0 ? (
                <p className="text-gray-400">No Tasks Found</p>
              ) : (
                selectTasks.map((item) => (
                  <div
                    key={item.id}
                    className="mb-2 rounded-lg bg-slate-100 p-2"
                  >
                    <h2>{item.title}</h2>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Calender;
