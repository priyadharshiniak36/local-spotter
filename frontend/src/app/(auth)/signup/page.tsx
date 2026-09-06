"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Store, ShoppingBag } from "lucide-react";
import { ConsumerLayout } from "@/layouts/ConsumerLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { UserRole } from "@/types/user";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Vul a.u.b. alle verplichte velden in.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    // Open Role Selection Modal after registration info entered
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role: UserRole) => {
    login(email, role);
    setShowRoleModal(false);
    if (role === "BUSINESS_OWNER") {
      router.push("/onboarding/business");
    } else {
      router.push("/");
    }
  };

  return (
    <ConsumerLayout>
      <div className="max-w-md mx-auto my-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAEAEA] shadow-md space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#FAE2F0] text-[#FA1EFF] flex items-center justify-center font-bold text-xl font-rubik mx-auto mb-3">
            LS
          </div>
          <h1 className="text-2xl font-bold font-rubik text-[#111111]">Hi…</h1>
          <p className="text-xs text-[#B7B7B7]">Let's create an account</p>
        </div>

        {error && (
          <div className="p-3 bg-[#F2D9DE] text-[#E54666] text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

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

        <div className="text-center pt-2">
          <p className="text-xs text-[#B7B7B7]">
            Have an account?{" "}
            <Link href="/login" className="font-bold text-[#FA1EFF] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* ROLE SELECTION MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl text-center space-y-5">
            <h2 className="text-lg font-bold font-rubik text-[#111111]">Kies je account type</h2>
            <p className="text-xs text-[#B7B7B7]">Hoe wil je LocalSpotter.nl gaan gebruiken?</p>

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
                      Ik ben Consument
                    </span>
                    <span className="block text-[11px] text-[#B7B7B7]">
                      Winkels ontdekken, producten kopen & workshops volgen
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
                      Ik ben Winkelier / Ondernemer
                    </span>
                    <span className="block text-[11px] text-[#B7B7B7]">
                      Mijn winkel registreren, producten & workshops verkopen
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
