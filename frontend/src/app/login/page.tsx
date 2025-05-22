"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

// Define form interface
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Custom form validation
  const validate = (values: LoginForm) => {
    const errors: Partial<Record<keyof LoginForm, string>> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    return errors;
  };

  const onSubmit = async (data: LoginForm) => {
    // Manually validate
    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        form.setError(field as keyof LoginForm, {
          type: "manual",
          message,
        });
      });
      return;
    }
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      // Redirect happens in the auth context
    } catch {
      // Error handling is in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center h-screen px-4 relative"
        style={{
          background:
            "linear-gradient(180deg, #87CEEB 0%, #D4F1F9 50%, #E8F8FF 100%)",
          overflow: "hidden",
        }}
      >
        {/* Small clouds floating animation */}

        <div className="w-full max-w-md relative z-10">
          {/* Card container with translucent background */}
          <div className="bg-white/50 backdrop-blur-md border border-white/40 shadow-lg rounded-3xl max-h-[calc(100vh-84px)] overflow-y-auto p-6">
            {/* Logo/icon in circle */}
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Sign in to continue your reading journey
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          type="email"
                          disabled={isLoading}
                          {...field}
                          className="h-11 bg-white border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            {...field}
                            className="h-11 bg-white border-gray-200 rounded-lg shadow-sm focus:ring-1 focus:ring-primary focus:border-primary pr-10"
                          />
                          <div
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                            role="button"
                            tabIndex={0}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {showPassword ? (
                                <>
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </>
                              ) : (
                                <>
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </>
                              )}
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-2 bg-gray-900 hover:bg-black rounded-lg text-white font-medium shadow-sm transition-colors"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
