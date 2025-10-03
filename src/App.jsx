import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Grades from "@/components/pages/Grades";
import Students from "@/components/pages/Students";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState(null);

const handleQuickAdd = (type) => {
    setQuickAddType(type);
    // Navigation based on type would go here
    if (type === "course") window.location.href = "/courses";
    else if (type === "assignment") window.location.href = "/assignments";
    else if (type === "grade") window.location.href = "/grades";
    else if (type === "student") window.location.href = "/students";
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)}
            onAddClick={handleQuickAdd}
          />
          
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
<Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<Courses />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/students" element={<Students />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;