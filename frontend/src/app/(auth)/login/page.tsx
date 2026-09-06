"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { ConsumerLayout } from "@/layouts/ConsumerLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { isValidIdentifier } from "@/lib/identifier";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidIdentifier(trimmedIdentifier)) {
      setError("Enter a valid email address or phone number.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(trimmedIdentifier, "CONSUMER");
      setIsLoading(false);
      router.push("/");
    }, 350);
  };

  return (
    <ConsumerLayout>
      <div className="mx-auto my-8 max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-[#EAEAEA] shadow-md space-y-6">
        <div className="text-center space-y-1">
          <img
            src="/logo.png"
            alt="LocalSpotter Logo"
            className="h-14 sm:h-16 w-auto object-contain mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold font-rubik text-[#111111]">Hello</h1>
          <p className="text-xs text-[#B7B7B7]">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-3 bg-[#F2D9DE] text-[#E54666] text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Mobile"
            type="text"
            placeholder="naam@voorbeeld.nl or +31..."
            icon={<Mail className="w-4 h-4" />}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-bold text-[#FA1EFF] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
            LOGIN
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#EAEAEA] w-full" />
          <span className="bg-white px-3 text-xs text-[#B7B7B7] uppercase font-bold absolute">
            or
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              login("google@user.com", "CONSUMER");
              router.push("/");
            }}
            className="h-11 border border-[#EAEAEA] rounded-xl text-xs font-bold text-[#111111] hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2"
          >
            Google
          </button>
          <button
            onClick={() => {
              login("facebook@user.com", "CONSUMER");
              router.push("/");
            }}
            className="h-11 border border-[#EAEAEA] rounded-xl text-xs font-bold text-[#111111] hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2"
          >
            Facebook
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-[#B7B7B7]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-[#FA1EFF] hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </ConsumerLayout>
  );
}
