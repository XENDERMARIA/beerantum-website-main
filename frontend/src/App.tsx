
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";


import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";


import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTeamPage from "@/pages/admin/AdminTeamPage";
import AdminEventsPage from "@/pages/admin/AdminEventsPage";
import AdminPartnersPage from "@/pages/admin/AdminPartnersPage";
import AdminContactsPage from "@/pages/admin/AdminContactsPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}


function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="partners" element={<AdminPartnersPage />} />
        <Route path="contacts" element={<AdminContactsPage />} />
        <Route path="content" element={<AdminContentPage />} />

        {}
        <Route
          path="users"
          element={
            <AdminOnlyRoute>
              <AdminUsersPage />
            </AdminOnlyRoute>
          }
        />
      </Route>

      {}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}