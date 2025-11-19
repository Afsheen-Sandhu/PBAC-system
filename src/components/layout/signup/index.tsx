"use client";

import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult("");
  
    const form = e.currentTarget;
    const formDataObj = new FormData(form);
  
    const formData = {
      name: formDataObj.get("name") as string,
      email: formDataObj.get("email") as string,
      password: formDataObj.get("password") as string,
    };
  
    try {
      const res = await axios.post("/api/auth/signup", formData);
      setResult(res.data.message);
      form.reset();
    } catch (err: any) {
      setResult(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" className="input" required />
        <input name="email" placeholder="Email" className="input" required />
        <input name="password" type="password" placeholder="Password" className="input" required />
        <button className="w-full bg-black text-white py-2 rounded-md" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {result && <p className="mt-4 text-sm text-red-500">{result}</p>}
    </div>
  );
}
