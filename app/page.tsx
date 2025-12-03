/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatWIB } from "@/components/formatDate";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type CounterItem = {
  Id: number;
  Date: string;
  LocationCode: string;
  LocationName: string;
  CodeGate: string | null;
  CountInMotor: number;
  CountOutMotor: number;
  CountInMobil: number;
  CountOutMobil: number;
  CreatedAt: string;
  UpdatedAt: string;
};

type ApiResponse = {
  code: number;
  message: string;
  data: CounterItem[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
};

export default function LocationLandingPage() {
  const [items, setItems] = useState<CounterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url = process.env.NEXT_PUBLIC_COUNTER_URL!;
  const pollInterval = 5000;

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchOnce = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${url}/bylocation`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiResponse;
        const data = Array.isArray(json.data) ? json.data : [];

        // Sort DESC by Date (ambil yang terbaru)
        data.sort((a, b) => b.Date.localeCompare(a.Date));

        if (mounted) setItems(data);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOnce();
    const id = setInterval(fetchOnce, pollInterval);

    return () => {
      mounted = false;
      controller.abort();
      clearInterval(id);
    };
  }, [url, pollInterval]);

  return (
    <div className="min-h-screen bg-gray-700 p-20">
      <h1 className="text-3xl font-bold mb-20 text-center text-white">
        SKY Parking Counting Area
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((loc) => {
          // Hitung total IN/OUT untuk masing-masing lokasi
          const totalIn = loc.CountInMotor + loc.CountInMobil;
          const totalOut = loc.CountOutMotor + loc.CountOutMobil;

          return (
            <div
              key={loc.Id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4"
            >
              <Image
                src={
                  loc.LocationCode === "004SK"
                    ? "/UPH-University.jpeg"
                    : "/helipad.png"
                }
                alt={loc.LocationName}
                className="w-full h-40 object-cover rounded-xl"
                height={100}
                width={100}
              />

              <h2 className="text-xl font-semibold mt-3">{loc.LocationName}</h2>
              <div className="text-lg text-gray-400 font-bold">
                <span className="text-xs mr-2 font-light">Last Update</span>
                {loc ? formatWIB(loc.UpdatedAt) : "—"}
              </div>

              <div className="flex justify-between items-center mb-5 mt-10">
                <div className="flex flex-col items-center justify-center">
                  <label className="text-slate-400 text-sm">Status</label>
                  <div
                    className={`text-xl ${
                      loading
                        ? "text-yellow-400"
                        : error
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {loading ? "loading..." : error ? "error" : "live"}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <label className="text-slate-400 text-sm">Total In</label>
                  <p className="text-lg text-green-700">{totalIn}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <label className="text-slate-400 text-sm">Total Out</label>
                  <p className="text-lg text-green-700">{totalOut}</p>
                </div>
              </div>

              <Link
                href={`/${loc.LocationCode}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Lihat Detail
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
