"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";
import { ConsumerLayout } from "@/layouts/ConsumerLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, setRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Vul a.u.b. alle velden in.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, "CONSUMER");
      setIsLoading(false);
      router.push("/");
    }, 400);
  };

  return (
    <ConsumerLayout>
      <div className="max-w-md mx-auto my-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAEAEA] shadow-md space-y-6">
        {/* Header Graphic / Welcome */}
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
            type="email"
            placeholder="naam@voorbeeld.nl"
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-[#FA1EFF] hover:underline"
            >
              Wachtwoord vergeten?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
            LOGIN
          </Button>
        </form>

        {/* OAuth Separator */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#EAEAEA] w-full" />
          <span className="bg-white px-3 text-xs text-[#B7B7B7] uppercase font-bold absolute">
            or
          </span>
        </div>

        {/* Social Buttons */}
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

        {/* Signup Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#B7B7B7]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-[#FA1EFF] hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </ConsumerLayout>
  );
}
