"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Phone, FileText, ArrowRight } from "lucide-react";
import { ConsumerLayout } from "@/layouts/ConsumerLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function BusinessOnboardingPage() {
  const router = useRouter();

  const [storeName, setStoreName] = useState("Bag Shop Horn Center");
  const [state, setState] = useState("Limburg");
  const [city, setCity] = useState("Horn");
  const [street, setStreet] = useState("Mussenberg 128");
  const [phone, setPhone] = useState("+31 475 123456");
  const [kvkNumber, setKvkNumber] = useState("12345678");
  const [shopDescription, setShopDescription] = useState("Ambachtelijke leren tassen en accessoires.");
  const [shopType, setShopType] = useState("Bag Shop");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to subscription selection
    router.push("/onboarding/subscription");
  };

  return (
    <ConsumerLayout>
      <div className="max-w-xl mx-auto my-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAEAEA] shadow-md space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#121F3E] text-white flex items-center justify-center font-bold text-xl font-rubik mx-auto mb-2">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-rubik text-[#111111]">
            Complete information about your store
          </h1>
          <p className="text-xs text-[#B7B7B7]">
            Stap 1 van 3: Vul je winkelgegevens in voor registratie op LocalSpotter.nl
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Store Name"
            placeholder="Bijv. Bag Shop Horn Center"
            icon={<Store className="w-4 h-4 text-[#B7B7B7]" />}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="State / Provincie"
              placeholder="Limburg"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <Input
              label="City / Stad"
              placeholder="Horn"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <Input
            label="Street & House Number"
            placeholder="Mussenberg 128"
            icon={<MapPin className="w-4 h-4 text-[#54D1CA]" />}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+31 475 123456"
              icon={<Phone className="w-4 h-4 text-[#B7B7B7]" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="KVK Number"
              placeholder="12345678"
              icon={<FileText className="w-4 h-4 text-[#B7B7B7]" />}
              value={kvkNumber}
              onChange={(e) => setKvkNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">Shop Description</label>
            <textarea
              rows={3}
              className="w-full bg-[#EAEAEA] text-[#111111] text-base p-4 rounded-xl font-normal focus:outline-none focus:ring-2 focus:ring-[#FA1EFF] focus:bg-white border border-transparent"
              placeholder="Beschrijf je winkel en aanbod..."
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              required
            />
          </div>

          <Input
            label="Shop Type / Categorie"
            placeholder="Bag Shop, Fashion Boutique, Craft Store..."
            value={shopType}
            onChange={(e) => setShopType(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth className="gap-2 mt-4">
            NEXT <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </ConsumerLayout>
  );
}
