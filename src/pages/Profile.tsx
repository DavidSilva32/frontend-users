import { User } from "@/types";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const data = await apiRequest<User>(
          endpoints.getProfile,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (data) {
          setUser(data);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unexpected error"
        );

        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (!user) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-lg p-8 space-y-6">
        <h1 className="text-3xl text-primary font-bold text-center">User Profile</h1>
        <div className="space-y-4">
          <p className="text-lg text-text">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p className="text-lg text-text">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            navigate("/login");
          }}
          className="w-full mt-6 bg-danger text-white py-2 rounded-md hover:bg-danger-hover transition-colors text-sm font-medium"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
