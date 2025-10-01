"use client";

// app/page.tsx
import React from "react";
import dynamic from "next/dynamic";

const CounterRealtime = dynamic(() => import("../components/ApiCounter"), {
  ssr: false,
});
// NOTE: CounterRealtime sudah aku buat di canvas. Copy file canvas -> components/CounterRealtime.tsx
// Jika tidak mau pakai CounterRealtime, hapus dynamic import.

export default function Page() {
  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        Sky Parking — Counter Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <CounterRealtime url={process.env.NEXT_PUBLIC_COUNTER_URL!} />
        {/* <ApiCounter url={process.env.NEXT_PUBLIC_COUNTER_URL!} /> */}
      </div>
    </main>
  );
}
