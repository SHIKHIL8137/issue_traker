import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IssuesList from './pages/IssuesList.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import IssueForm from './pages/IssueForm.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import UserManagement from './pages/UserManagement.jsx';
import DeveloperPanel from './pages/DeveloperPanel.jsx';
import UserPanel from './pages/UserPanel.jsx';
import UserIssuesList from './pages/UserIssuesList.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950">
          <NavBar />
          <div className="max-w-6xl mx-auto p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<ProtectedRoute />}> 
                <Route path="/" element={<Dashboard />} />
                <Route path="/issues" element={<IssuesList />} />
                <Route path="/issues/new" element={<IssueForm mode="create" />} />
                <Route path="/issues/:id" element={<IssueDetail />} />
                <Route path="/issues/:id/edit" element={<IssueForm mode="edit" />} />

                <Route element={<RoleRoute allowed={["Admin"]} />}> 
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                </Route>
                
                <Route element={<RoleRoute allowed={["Developer"]} />}> 
                  <Route path="/developer" element={<DeveloperPanel />} />
                </Route>
                
                <Route element={<RoleRoute allowed={["User"]} />}> 
                  <Route path="/user" element={<UserPanel />} />
                  <Route path="/user/issues" element={<UserIssuesList />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}