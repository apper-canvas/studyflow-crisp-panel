import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import { formatDate } from "@/utils/dateHelpers";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAssignmentsForDate = (date) => {
return assignments.filter((assignment) => {
      const assignmentDate = new Date(assignment.due_date_c);
      return isSameDay(assignmentDate, date);
    });
  };

const getCourseColor = (courseId) => {
    const course = courses.find((c) => {
      const cid = courseId?.Id || courseId;
      return c.Id === cid;
    });
    return course?.color || "#3b82f6";
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const selectedDateAssignments = selectedDate ? getAssignmentsForDate(selectedDate) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600 mt-1">View your assignments on calendar</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ApperIcon name="ChevronLeft" size={20} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-slate-900">
              {format(currentDate, "MMMM yyyy")}
            </h2>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayAssignments = getAssignmentsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square p-2 rounded-lg transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-md"
                      : isTodayDate
                      ? "bg-primary/10 text-primary font-semibold"
                      : isCurrentMonth
                      ? "hover:bg-slate-100 text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  <div className="text-sm mb-1">{format(day, "d")}</div>
                  {dayAssignments.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {dayAssignments.slice(0, 3).map((assignment) => (
                        <div
key={assignment.Id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: getCourseColor(assignment.course_id_c) }}
                          style={{ backgroundColor: getCourseColor(assignment.courseId) }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {selectedDate ? formatDate(selectedDate.getTime(), "EEEE, MMMM d") : "Select a date"}
          </h3>
          {selectedDate ? (
            selectedDateAssignments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No assignments on this day</p>
              </div>
            ) : (
              <div className="space-y-3">
{selectedDateAssignments.map((assignment) => {
                  const assignmentCourseId = assignment.course_id_c?.Id || assignment.course_id_c;
                  const course = courses.find((c) => c.Id === assignmentCourseId);
                  return (
                    <div key={assignment.Id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {course && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                        )}
                        <span className="text-sm font-medium text-slate-700">
                          {course?.courseCode}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">{assignment.title}</h4>
                      {assignment.description && (
                        <p className="text-sm text-slate-600 mb-2">{assignment.description}</p>
                      )}
                      <div className="flex gap-2">
                        <Badge variant={assignment.priority === "high" ? "error" : assignment.priority === "medium" ? "warning" : "default"} size="sm">
                          {assignment.priority}
                        </Badge>
                        <Badge variant={assignment.status === "completed" ? "success" : "default"} size="sm">
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="CalendarDays" size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Click on a date to view assignments</p>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
};

export default Calendar;