"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "@/services/userApi";
import { setAuth } from "@/lib/store/slices/counter/auth-slice";
import { AppDispatch } from "@/lib/store/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult("");
    try {
      const response = await loginUser({ email, password }).unwrap();
      const { user, token, message } = response;

      // persist auth for interceptors/future sessions
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setAuth({ user, token }));
      setResult(message || "Login successful");
      // router.push("/dashboard"); // optional redirect
    } catch (err: any) {
      const errorMessage =
        err?.data?.error || err?.message || "Login failed";
      setResult(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white py-2 rounded-md" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      {result && <p className="mt-4 text-sm text-red-500">{result}</p>}
    </div>
  );
}
