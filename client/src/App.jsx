import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Trash2,
  Pencil,
  X,
  Settings,
  Bell,
} from "lucide-react";

import { format, addDays, startOfWeek, isSameDay, isSameWeek } from "date-fns";

import Welcome from "./Welcome";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/taskServices";

const emptyForm = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  priority: "Medium",
};

function App() {
  const [tasks, setTasks] = useState([]);

  const [hasStarted, setHasStarted] = useState(false);

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [swipedTaskId, setSwipedTaskId] = useState(null);
  const touchStart = useRef({ x: 0, y: 0 });

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
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

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
    const taskDate = new Date(task.dueDate);

    setEditingTask(task);

    setForm({
      title: task.title,
      date: task.date || format(taskDate, "yyyy-MM-dd"),
      startTime: task.startTime || format(taskDate, "HH:mm"),
      endTime: task.endTime || "",
      description: task.description || "",
      priority: task.priority || "Medium",
    });

    setShowModal(true);
    setSwipedTaskId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (form.endTime <= form.startTime) {
      setError("End time must be later than start time.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        description: form.description,
        priority: form.priority,
        dueDate: new Date(`${form.date}T${form.startTime}`).toISOString(),
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
    } finally {
      setSubmitting(false);
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

    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < -50) {
      setSwipedTaskId(taskId);
    } else if (deltaX > 50) {
      setSwipedTaskId(null);
    }
  };

  // Navigate between weeks
  const goToPreviousWeek = () => {
    setSelectedDate((current) => addDays(current, -7));
    setSwipedTaskId(null);
  };

  const goToNextWeek = () => {
    setSelectedDate((current) => addDays(current, 7));
    setSwipedTaskId(null);
  };

  // Monday through Sunday
  const weekStart = startOfWeek(selectedDate, {
    weekStartsOn: 1,
  });

  const weekDates = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );

  // Tasks belonging to the selected week
  const tasksThisWeek = tasks.filter((task) =>
    isSameWeek(new Date(task.dueDate), selectedDate, { weekStartsOn: 1 }),
  );

  const completedThisWeek = tasksThisWeek.filter(
    (task) => task.status === "Completed",
  );

  const pendingThisWeek = tasksThisWeek.filter(
    (task) => task.status !== "Completed",
  );

  const progress =
    tasksThisWeek.length === 0
      ? 0
      : Math.round((completedThisWeek.length / tasksThisWeek.length) * 100);

  // Search shows matching tasks across all dates.
  // Otherwise, show tasks for the selected date.
  const visibleTasks = search.trim()
    ? tasks
    : tasks.filter((task) => isSameDay(new Date(task.dueDate), selectedDate));

  const sortedTasks = [...visibleTasks].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );

  if (!hasStarted) {
    return (
      <Welcome
        onGetStarted={() => {
          setHasStarted(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fc] text-[#20243a] pb-28">
      <main className="max-w-3xl mx-auto px-5 pt-7">
        {/* Top icons */}
        <div className="flex items-center justify-between mb-7">
          <button
            type="button"
            className="text-[#263b8f]"
            aria-label="Settings"
          >
            <Settings size={24} />
          </button>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search tasks"
              className="text-[#263b8f]"
            >
              <Search size={24} />
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="text-[#263b8f]"
            >
              <Bell size={24} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-7">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={22}
          />

          <input
            id="task-search"
            ref={searchInputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSwipedTaskId(null);
            }}
            placeholder="Search tasks by title or description..."
            className="w-full h-[60px] rounded-2xl bg-white border border-gray-200 pl-14 pr-5 text-base outline-none focus:border-[#4964eb] shadow-sm"
          />
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={goToPreviousWeek}
            aria-label="Previous week"
            className="p-2 rounded-lg hover:bg-white text-[#4964eb]"
          >
            <ChevronLeft size={24} />
          </button>

          <span className="font-semibold text-sm">
            {format(weekStart, "dd MMM")} -{" "}
            {format(addDays(weekStart, 6), "dd MMM yyyy")}
          </span>

          <button
            type="button"
            onClick={goToNextWeek}
            aria-label="Next week"
            className="p-2 rounded-lg hover:bg-white text-[#4964eb]"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Date selector */}
        <div className="grid grid-cols-7 gap-1 mb-8">
          {weekDates.map((date) => {
            const active = isSameDay(date, selectedDate);

            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setSwipedTaskId(null);
                }}
                className={`flex flex-col items-center justify-center py-3 rounded-lg transition ${
                  active
                    ? "bg-[#4964eb] text-white shadow-md"
                    : "text-gray-400 hover:bg-white"
                }`}
              >
                <span className="text-xs">{format(date, "EEE")}</span>

                <span className="text-lg font-semibold mt-1">
                  {format(date, "dd")}
                </span>

                {active && (
                  <span className="w-1 h-1 rounded-full bg-white mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Weekly summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#eef1ff] rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-[#dce3ff] text-[#354fbd] p-2 rounded-md">
                <CheckCircle2 size={25} />
              </div>

              <span className="text-sm font-medium">Task Complete</span>
            </div>

            <div className="flex items-baseline gap-2 mt-3 ml-1">
              <span className="text-3xl font-bold">
                {completedThisWeek.length}
              </span>

              <span className="text-xs text-gray-500">This Week</span>
            </div>
          </div>

          <div className="bg-[#ffebed] rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-[#ffd6da] text-[#c34c59] p-2 rounded-md">
                <Circle size={25} />
              </div>

              <span className="text-sm font-medium">Task Pending</span>
            </div>

            <div className="flex items-baseline gap-2 mt-3 ml-1">
              <span className="text-3xl font-bold">
                {pendingThisWeek.length}
              </span>

              <span className="text-xs text-gray-500">This Week</span>
            </div>
          </div>
        </div>

        {/* Weekly progress */}
        <section className="mb-9">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Weekly Progress</h2>

            <span className="text-sm font-semibold text-[#4964eb]">
              {progress}%
            </span>
          </div>

          <div className="w-full h-4 bg-[#dedffc] rounded-sm overflow-hidden">
            <div
              className="h-full bg-[#293f9d] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Tasks list */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">
                {search.trim() ? "Search Results" : "Tasks Today"}
              </h2>

              {!search.trim() && (
                <p className="text-sm text-gray-400 mt-1">
                  {format(selectedDate, "EEEE, dd MMMM")}
                </p>
              )}
            </div>

            <span className="text-sm font-semibold text-[#4964eb]">
              {sortedTasks.length} Tasks
            </span>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {loading ? (
            <p className="text-center py-12 text-gray-500">Loading tasks...</p>
          ) : sortedTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <CheckCircle2 size={38} className="mx-auto text-gray-300 mb-3" />

              <h3 className="font-semibold text-lg">
                {search.trim() ? "No matching tasks" : "No tasks for this day"}
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                {search.trim()
                  ? "Try searching with another keyword."
                  : "Tap the + button to create a new task."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {sortedTasks.map((task) => {
                const isSwiped = swipedTaskId === task._id;
                const completed = task.status === "Completed";

                return (
                  <div
                    key={task._id}
                    className="relative overflow-hidden border-b border-gray-100 last:border-b-0"
                  >
                    {/* Mobile swipe delete */}
                    <button
                      onClick={() => handleDelete(task._id)}
                      aria-label={`Delete ${task.title}`}
                      className="absolute right-0 top-0 bottom-0 w-[88px] bg-red-600 text-white flex flex-col items-center justify-center gap-1 sm:hidden"
                    >
                      <Trash2 size={21} />
                      <span className="text-xs font-semibold">Delete</span>
                    </button>

                    <div
                      onTouchStart={handleTouchStart}
                      onTouchEnd={(e) => handleTouchEnd(e, task._id)}
                      style={{
                        transform: isSwiped
                          ? "translateX(-88px)"
                          : "translateX(0)",
                      }}
                      className="relative bg-white px-5 py-5 flex items-center gap-4 transition-transform duration-200 ease-out touch-pan-y"
                    >
                      <button
                        onClick={() => handleStatus(task)}
                        aria-label="Change task status"
                        className="shrink-0"
                      >
                        {completed ? (
                          <CheckCircle2 size={27} className="text-[#4964eb]" />
                        ) : (
                          <Circle size={27} className="text-[#8b9acb]" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-semibold text-base break-words ${
                            completed
                              ? "line-through text-gray-400"
                              : "text-[#20243a]"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1 break-words">
                            {task.description}
                          </p>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          {format(new Date(task.dueDate), "dd MMM yyyy")}
                          {" • "}
                          {task.startTime
                            ? format(
                                new Date(`2000-01-01T${task.startTime}`),
                                "hh:mm a",
                              )
                            : format(new Date(task.dueDate), "hh:mm a")}

                          {task.endTime &&
                            ` - ${format(
                              new Date(`2000-01-01T${task.endTime}`),
                              "hh:mm a",
                            )}`}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              task.priority === "High"
                                ? "bg-red-50 text-red-600"
                                : task.priority === "Medium"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {task.priority || "Medium"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => openEditModal(task)}
                          className="text-[#4964eb] p-2"
                          aria-label="Edit task"
                        >
                          <Pencil size={20} />
                        </button>

                        <button
                          onClick={() => handleDelete(task._id)}
                          className="hidden sm:block text-gray-400 hover:text-red-500"
                          aria-label="Delete task"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Floating add button */}
      <button
        onClick={openCreateModal}
        aria-label="Add new task"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[76px] h-[76px] rounded-full bg-[#4964eb] text-white shadow-xl flex items-center justify-center hover:bg-[#354fce] active:scale-95 transition"
      >
        <Plus size={36} strokeWidth={1.8} />
      </button>

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-7">
              <h2 className="font-bold text-2xl">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close form"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Task title */}
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Task Title
                </label>

                <input
                  required
                  maxLength={150}
                  placeholder="Enter task title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-[#4964eb]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm text-gray-500 mb-2">Date</label>

                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-[#4964eb]"
                />
              </div>

              {/* Start and End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Start Time
                  </label>

                  <input
                    required
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-[#4964eb]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    End Time
                  </label>

                  <input
                    required
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-[#4964eb]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Description
                </label>

                <textarea
                  placeholder="Add Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-[#4964eb]"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm text-gray-500 mb-2">
                  Priority
                </label>

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-[#4964eb]"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#4964eb] text-white rounded-md p-4 font-semibold disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingTask
                    ? "Save Changes"
                    : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
