import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import Courses from "@/components/pages/Courses";
import PromptPassword from "@/components/pages/PromptPassword";
import Grades from "@/components/pages/Grades";
import ErrorPage from "@/components/pages/ErrorPage";
import Callback from "@/components/pages/Callback";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import ResetPassword from "@/components/pages/ResetPassword";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { clearUser, setUser } from "@/store/userSlice";

export const AuthContext = createContext(null);
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState(null);
const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const handleQuickAdd = (type) => {
    setQuickAddType(type);
    if (type === "course") navigate("/courses");
    else if (type === "assignment") navigate("/assignments");
    else if (type === "grade") navigate("/grades");
    else if (type === "student") navigate("/students");
  };

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

return (
    <>
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
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
                <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
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
    </>
  );
}

function App() {
  const [authMethods, setAuthMethods] = useState(null);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={authMethods}>
        <AppContent />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;