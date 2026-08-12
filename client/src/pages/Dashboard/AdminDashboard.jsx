import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      <p className="mt-2">
        Welcome, {user?.name}
      </p>

      <p className="mt-1">
        Role: {user?.role}
      </p>
    </div>
  );
};

export default AdminDashboard;