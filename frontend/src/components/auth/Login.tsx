import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!email || !password) {
        alert("Please enter both email and password");
        return;
      }
      const baseUrl = import.meta.env.VITE_BASE_BACKEND_URL || "";
      const response = await axios.post(`${baseUrl}/api/messages/login/`, {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      const userData = {
        email,
        password,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/messages");
    },
  });

  return (
    <Card className="mx-auto max-w-sm h-fit my-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin mr-2" />} Login
          </Button>
          <Button variant="outline" className="w-full" disabled>
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
