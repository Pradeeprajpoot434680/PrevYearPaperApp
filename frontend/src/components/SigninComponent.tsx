"use client";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "./ui/spinner";
import { BACKEND_URL } from "../lib/config";

export function SigninComponent() {
  const { signin } = useAuthStore();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle the state
  };

  const handleSignin = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please fill all the fields");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("Password should be at least 6 characters");
        setLoading(false);
        return;
      }
      const response = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
        email,
        password,
      });

      await signin(response.data.token, email!);

      if (response.data.errorMessage) {
        toast.error(response.data.errorMessage);
        return;
      }

      if (!response.data.token) {
        toast.error("Error while signing in");
        return;
      }

      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (error: any) {
      const message =
        error.response?.data.errorMessage ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignin} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email ?? ""}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span
              onClick={() => navigate("/send-otp")}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline cursor-pointer"
            >
              Verify Your Mail?
            </span>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {isPasswordVisible ? (
                <VisibilityOffIcon className="h-4 w-4" />
              ) : (
                <VisibilityIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
