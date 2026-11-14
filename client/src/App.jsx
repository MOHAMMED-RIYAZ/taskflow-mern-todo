import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Pencil,
  CalendarDays,
  X,
} from "lucide-react";
import { format } from "date-fns";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/taskServices";

import { groupTasksByWeek } from "./utils/dateUtils";

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [swipedTaskId, setSwipedTaskId] = useState(null);
  const touchStart = useRef({ x: 0, y: 0 });

  const [search, setSearch] = useState("");
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(search);
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Unable to load tasks. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search]);

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setShowModal(true);
    setSwipedTaskId(null);
  };

  const openEditModal = (task) => {
    setEditingTask(task);

    setForm({
      title: task.title,
      description: task.description || "",
      dueDate: format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm"),
      priority: task.priority,
    });

    setShowModal(true);
    setSwipedTaskId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        dueDate: new Date(form.dueDate).toISOString(),
      };

      if (editingTask) {
        await updateTask(editingTask._id, payload);
      } else {
        await createTask(payload);
      }

      setShowModal(false);
      setEditingTask(null);
      setForm(emptyForm);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(id);
      setSwipedTaskId(null);
      await fetchTasks();
    } catch (err) {
      setError("Unable to delete task.");
    }
  };

  const handleStatus = async (task) => {
    try {
      await updateTask(task._id, {
        status: task.status === "Completed" ? "In Progress" : "Completed",
      });

      setSwipedTaskId(null);
      await fetchTasks();
    } catch (err) {
      setError("Unable to update task status.");
    }
  };

  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e, taskId) => {
    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;

    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

    // Only respond to horizontal swipes, not normal scrolling.
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < -50) {
      setSwipedTaskId(taskId);
    } else if (deltaX > 50) {
      setSwipedTaskId(null);
    }
  };

  const weeks = groupTasksByWeek(tasks);

  const completedCount = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const openCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-500">
              Organize your week, achieve your goals.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-primary text-white px-4 py-3 rounded-xl flex items-center gap-2 hover:opacity-90"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <p className="text-gray-500 mt-1">
            Manage and track your weekly progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            label="Total Tasks"
            value={tasks.length}
            icon={<CalendarDays />}
            color="text-primary"
          />

          <SummaryCard
            label="Open Tasks"
            value={openCount}
            icon={<Clock />}
            color="text-orange-500"
          />

          <SummaryCard
            label="Completed"
            value={completedCount}
            icon={<CheckCircle2 />}
            color="text-green-600"
          />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={19} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSwipedTaskId(null);
            }}
            placeholder="Search tasks by title or description..."
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary"
          />
        </div>

        {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading tasks...</p>
        ) : weeks.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <CalendarDays size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-lg">No tasks found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Add a task to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {weeks.map((week) => {
              const completed = week.tasks.filter(
                (task) => task.status === "Completed",
              ).length;

              const open = week.tasks.length - completed;
              const expanded = expandedWeek === week.key;

              return (
                <section
                  key={week.key}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setExpandedWeek(expanded ? null : week.key);
                      setSwipedTaskId(null);
                    }}
                    className="w-full p-5 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {format(week.start, "dd MMM")} -{" "}
                          {format(week.end, "dd MMM yyyy")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {week.tasks.length} tasks this week
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <span className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-sm">
                          {open} Open
                        </span>

                        <span className="bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm">
                          {completed} Completed
                        </span>
                      </div>
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                      {week.tasks.map((task) => {
                        const isSwiped = swipedTaskId === task._id;

                        return (
                          <div
                            key={task._id}
                            className="relative overflow-hidden"
                          >
                            {/* Red Delete action behind the task */}
                            <button
                              onClick={() => handleDelete(task._id)}
                              aria-label={`Delete ${task.title}`}
                              className="absolute right-0 top-0 bottom-0 w-[88px] bg-red-600 text-white flex flex-col items-center justify-center gap-1 sm:hidden"
                            >
                              <Trash2 size={21} />
                              <span className="text-xs font-semibold">
                                Delete
                              </span>
                            </button>

                            {/* Swipeable task row */}
                            <div
                              onTouchStart={handleTouchStart}
                              onTouchEnd={(e) => handleTouchEnd(e, task._id)}
                              style={{
                                transform: isSwiped
                                  ? "translateX(-88px)"
                                  : "translateX(0)",
                              }}
                              className="relative bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform duration-200 ease-out touch-pan-y"
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => handleStatus(task)}
                                  title="Change task status"
                                  className="mt-1"
                                >
                                  <CheckCircle2
                                    size={21}
                                    className={
                                      task.status === "Completed"
                                        ? "text-green-500"
                                        : "text-gray-300"
                                    }
                                  />
                                </button>

                                <div>
                                  <h4
                                    className={`font-semibold ${
                                      task.status === "Completed"
                                        ? "line-through text-gray-400"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {task.title}
                                  </h4>

                                  {task.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      {task.description}
                                    </p>
                                  )}

                                  <p className="text-xs text-gray-400 mt-2">
                                    {format(
                                      new Date(task.dueDate),
                                      "dd MMM yyyy, hh:mm a",
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-xs px-3 py-1 rounded-full ${
                                    task.priority === "High"
                                      ? "bg-red-50 text-red-600"
                                      : task.priority === "Medium"
                                        ? "bg-yellow-50 text-yellow-700"
                                        : "bg-blue-50 text-blue-600"
                                  }`}
                                >
                                  {task.priority}
                                </span>

                                <button
                                  onClick={() => openEditModal(task)}
                                  className="text-gray-500 hover:text-primary"
                                  title="Edit task"
                                >
                                  <Pencil size={18} />
                                </button>

                                {/* Desktop delete icon */}
                                <button
                                  onClick={() => handleDelete(task._id)}
                                  className="hidden sm:inline-flex text-gray-500 hover:text-red-500"
                                  title="Delete task"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-xl">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>

              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                maxLength={150}
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-xl p-3 outline-none focus:border-primary"
              />

              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 outline-none focus:border-primary"
                rows={3}
              />

              <input
                required
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 outline-none focus:border-primary"
              />

              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 outline-none focus:border-primary"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>

              <button
                type="submit"
                className="w-full bg-primary text-white rounded-xl p-3 font-semibold hover:opacity-90"
              >
                {editingTask ? "Save Changes" : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon, color }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <span className={color}>{icon}</span>
      </div>

      <h3 className="text-3xl font-bold mt-3">{value}</h3>
    </div>
  );
}

export default App;
