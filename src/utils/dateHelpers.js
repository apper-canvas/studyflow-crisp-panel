import { format, isToday, isTomorrow, isThisWeek, isPast, differenceInDays } from "date-fns";

export const formatDate = (timestamp, formatStr = "MMM dd, yyyy") => {
  return format(new Date(timestamp), formatStr);
};

export const formatDateTime = (timestamp) => {
  return format(new Date(timestamp), "MMM dd, yyyy h:mm a");
};

export const getRelativeDate = (timestamp) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isPast(date)) return "Overdue";
  if (isThisWeek(date)) return format(date, "EEEE");
  
  return format(date, "MMM dd");
};

export const getDueDateStatus = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = differenceInDays(due, now);

  if (isPast(due) && !isToday(due)) {
    return { status: "overdue", color: "error", label: "Overdue" };
  }
  if (isToday(due)) {
    return { status: "today", color: "warning", label: "Due Today" };
  }
  if (diff === 1) {
    return { status: "tomorrow", color: "warning", label: "Due Tomorrow" };
  }
  if (diff <= 7) {
    return { status: "thisWeek", color: "info", label: "This Week" };
  }
  return { status: "future", color: "gray", label: "Upcoming" };
};

export const sortByDueDate = (assignments) => {
  return [...assignments].sort((a, b) => a.dueDate - b.dueDate);
};

export const groupByDueDate = (assignments) => {
  const groups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: []
  };

  assignments.forEach((assignment) => {
    const { status } = getDueDateStatus(assignment.dueDate);
    if (status === "overdue") groups.overdue.push(assignment);
    else if (status === "today") groups.today.push(assignment);
    else if (status === "tomorrow") groups.tomorrow.push(assignment);
    else if (status === "thisWeek") groups.thisWeek.push(assignment);
    else groups.later.push(assignment);
  });

  return groups;
};