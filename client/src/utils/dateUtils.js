import { startOfWeek, endOfWeek, format, isSameWeek } from "date-fns";

export const getWeekKey = (date) => {
  return format(startOfWeek(new Date(date), { weekStartsOn: 1 }), "yyyy-MM-dd");
};

export const groupTasksByWeek = (tasks) => {
  const groups = {};

  tasks.forEach((task) => {
    const key = getWeekKey(task.dueDate);

    if (!groups[key]) {
      const start = startOfWeek(new Date(task.dueDate), {
        weekStartsOn: 1,
      });

      const end = endOfWeek(new Date(task.dueDate), {
        weekStartsOn: 1,
      });

      groups[key] = {
        key,
        start,
        end,
        tasks: [],
      };
    }

    groups[key].tasks.push(task);
  });

  return Object.values(groups).sort((a, b) => b.start - a.start);
};
