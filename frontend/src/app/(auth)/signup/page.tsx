"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Store, ShoppingBag, CheckCircle2 } from "lucide-react";
import { ConsumerLayout } from "@/layouts/ConsumerLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { buildVerificationCode, isValidIdentifier } from "@/lib/identifier";
import { UserRole } from "@/types/user";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms">("email");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !identifier.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isValidIdentifier(identifier)) {
      setError("Use a valid email address or phone number.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const code = buildVerificationCode(identifier);
    setVerificationCode(code);
    setVerificationMethod(identifier.includes("@") ? "email" : "sms");
    setVerificationStep(true);
  };

  const handleVerify = () => {
    if (enteredCode.trim() !== verificationCode) {
      setError("Incorrect verification code. Please try again.");
      return;
    }

    setShowRoleModal(true);
  };

  const handleRoleSelect = (role: UserRole) => {
    login(identifier, role);
    setShowRoleModal(false);
    if (role === "BUSINESS_OWNER") {
      router.push("/onboarding/business");
    } else {
      router.push("/");
    }
  };

  return (
    <ConsumerLayout>
      <div className="mx-auto my-8 max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-[#EAEAEA] shadow-md space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#FAE2F0] text-[#FA1EFF] flex items-center justify-center font-bold text-xl font-rubik mx-auto mb-3">
            LS
          </div>
          <h1 className="text-2xl font-bold font-rubik text-[#111111]">Hi…</h1>
          <p className="text-xs text-[#B7B7B7]">Let&apos;s create an account</p>
        </div>

        {error && (
          <div className="p-3 bg-[#F2D9DE] text-[#E54666] text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {!verificationStep ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Sanne de Jong"
              icon={<User className="w-4 h-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" size="lg" fullWidth>
              SIGN UP
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#EAEAEA] bg-[#F9F9F9] p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E3F8EB] text-[#1AAA5B]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-[#111111]">
                {verificationMethod === "email" ? "Check your email" : "Enter your OTP"}
              </h2>
              <p className="mt-1 text-xs text-[#B7B7B7]">
                {verificationMethod === "email"
                  ? `We sent a verification code to ${identifier}.`
                  : `We sent a 6-digit code to ${identifier}.`}
              </p>
            </div>

            <Input
              label={verificationMethod === "email" ? "Verification code" : "OTP code"}
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
            />

            <Button type="button" variant="primary" size="lg" fullWidth onClick={handleVerify}>
              VERIFY
            </Button>

            <button
              type="button"
              onClick={() => {
                setEnteredCode("");
                setVerificationCode(buildVerificationCode(identifier));
                setError("A new code has been sent.");
              }}
              className="w-full text-center text-xs font-bold text-[#FA1EFF] hover:underline"
            >
              Resend code
            </button>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-[#B7B7B7]">
            Have an account?{" "}
            <Link href="/login" className="font-bold text-[#FA1EFF] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl text-center space-y-5">
            <h2 className="text-lg font-bold font-rubik text-[#111111]">Choose your account type</h2>
            <p className="text-xs text-[#B7B7B7]">How do you want to use LocalSpotter.nl?</p>

            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect("CONSUMER")}
                className="w-full p-4 rounded-2xl border-2 border-[#FAE2F0] bg-[#F9F9F9] hover:bg-[#FAE2F0] hover:border-[#FA1EFF] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FA1EFF] text-white flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-[#111111] group-hover:text-[#FA1EFF]">
                      I am a Consumer
                    </span>
                    <span className="block text-[11px] text-[#B7B7B7]">
                      Discover stores, buy products, and follow workshops
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("BUSINESS_OWNER")}
                className="w-full p-4 rounded-2xl border-2 border-[#121F3E]/20 bg-[#F9F9F9] hover:bg-[#121F3E]/10 hover:border-[#121F3E] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#121F3E] text-white flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-[#111111]">
                      I am a Business Owner
                    </span>
                    <span className="block text-[11px] text-[#B7B7B7]">
                      Register my shop, sell products, and manage workshops
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}
