"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/app/actions/auth/login.action";
import { setAuth } from "@/lib/store/slices/counter/auth-slice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [result, setResult] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const res = await login(
      formData.get("email") as string,
      formData.get("password") as string
    );

    if (res.error) {
      setResult(res.error);
    } else {
      dispatch(setAuth(res));
      router.push("/dashboard");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      <form action={handleSubmit} className="space-y-4">
        <input name="email" placeholder="Email" className="input" required />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          required
        />

        <button className="w-full bg-black text-white py-2 rounded-md">
          Login
        </button>
      </form>

      {result && <p className="mt-4 text-sm text-red-500">{result}</p>}
    </div>
  );
}
