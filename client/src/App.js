import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import EventDetail from './pages/EventDetail';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateEvent from './pages/CreateEvent';
import EventList from './pages/EventList';
import RegisterAdmin from './pages/RegisterAdmin';
import RegisterStudent from './pages/RegisterStudent';
import SelectRole from './pages/SelectRole';

const ProtectedRoute = ({ requiredRole, children }) => {
  const { role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (role === null) return <Navigate to="/login" />;
  if (role !== requiredRole) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/register/admin" element={<RegisterAdmin />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/register-student/:eventId" element={<RegisterStudent />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
