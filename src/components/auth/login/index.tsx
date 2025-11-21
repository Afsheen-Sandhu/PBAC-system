"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "@/services/user-api";
import { setAuth } from "@/lib/store/slices/auth-slice";
import { AppDispatch } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/shared/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult("");
    try {
      const response = await loginUser({ email, password }).unwrap();
      const { user, message } = response;

      // persist auth for interceptors/future sessions
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setAuth({ user, token: null as string | null }));
      setResult(message || "Login successful");
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err?.data?.error || err?.message || "Login failed";
      setResult(errorMessage);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to access your personalized dashboard."
      footerText="Don't have an account?"
      footerLinkHref="/signup"
      footerLinkLabel="Create one"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        method="post"
        autoComplete="off"
      >
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      {result && (
        <p className="mt-4 text-sm text-error" role="alert">
          {result}
        </p>
      )}
    </AuthCard>
  );
}
