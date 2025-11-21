"use client";

import { useState } from "react";
import { useSignupUserMutation } from "@/services/user-api";
import { AuthCard } from "@/components/auth/shared/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [result, setResult] = useState("");
  const [signupUser, { isLoading }] = useSignupUserMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult("");

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    const formData = {
      name: formDataObj.get("name") as string,
      email: formDataObj.get("email") as string,
      password: formDataObj.get("password") as string,
    };

    try {
      await signupUser(formData).unwrap();
      setResult("User created successfully");
      form.reset();
    } catch (err: any) {
      setResult(err.data?.message || "Something went wrong");
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Get started with your new dashboard in minutes."
      footerText="Already have an account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        method="post"
        autoComplete="off"
      >
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Your Name"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Creating account..." : "Create Account"}
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
