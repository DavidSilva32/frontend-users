import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { endpoints } from "@/utils/endpoints";

export default function Register() {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !inputData.name ||
      !inputData.email ||
      !inputData.password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (inputData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(endpoints.createUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
        return;
      }

      toast.success("Account successfully created!");
      navigate("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Create Your Account
        </h1>

        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full p-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={inputData.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={inputData.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={inputData.password}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-hover transition-colors text-sm font-medium"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registering...
            </div>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
}
