// app/page.tsx
import React from "react";
import ApiCounter from "../../components/ApiCounter";

interface DetailProps {
  params: Promise<{ locationCode: string }> | { locationCode: string };
}
// NOTE: CounterRealtime sudah aku buat di canvas. Copy file canvas -> components/CounterRealtime.tsx
// Jika tidak mau pakai CounterRealtime, hapus dynamic import.

export default async function LocationDetailPage({ params }: DetailProps) {
  const { locationCode } = await params;
  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <ApiCounter
          url={process.env.NEXT_PUBLIC_COUNTER_URL!}
          locationCode={locationCode}
        />
        {/* <ApiCounter url={process.env.NEXT_PUBLIC_COUNTER_URL!} /> */}
      </div>
    </main>
  );
}
