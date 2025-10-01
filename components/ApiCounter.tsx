/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ApiCounter.tsx
"use client";
import React, { useEffect, useState } from "react";

type CounterItem = {
  Id: number;
  Date: string; // "2025-10-01"
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

export default function ApiCounter({
  url = process.env.NEXT_PUBLIC_COUNTER_URL!,
  pollInterval = 5000,
}: {
  url?: string;
  pollInterval?: number;
}) {
  const [items, setItems] = useState<CounterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchOnce = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiResponse;
        const data = Array.isArray(json.data) ? json.data : [];
        // sort desc by Date (safe)
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

  const latest = items[0];

  const latestTotalIn = latest ? latest.CountInMotor + latest.CountInMobil : 0;
  const latestTotalOut = latest
    ? latest.CountOutMotor + latest.CountOutMobil
    : 0;

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Counter (Latest)</h3>
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

      {error && <div className="text-sm text-red-500 mb-2">Error: {error}</div>}

      <div className="mb-4">
        <div className="text-sm text-gray-600">Latest date</div>
        <div className="text-2xl font-bold">{latest ? latest.Date : "—"}</div>
        <div className="mt-2 text-sm">
          <div>
            In (motor + mobil): <strong>{latestTotalIn}</strong>
          </div>
          <div>
            Out (motor + mobil): <strong>{latestTotalOut}</strong>
          </div>
          {latest && (
            <div className="text-sm text-gray-500">
              Updated: {latest.UpdatedAt}
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 my-4">
        NOTE : Motor dapat keluar melalui gate mobil
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="pr-4">Date</th>
              <th>In Motor</th>
              <th>Out Motor</th>
              <th className="pl-4">In Area Motor</th>
              <th>In Mobil</th>
              <th>Out Mobil</th>
              <th className="pl-4">In Area Mobil</th>
              <th className="pl-4">Total In</th>
              <th>Total Out</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 10).map((r) => {
              const totalIn = r.CountInMotor + r.CountInMobil;
              const totalOut = r.CountOutMotor + r.CountOutMobil;
              const totalInareaMotor = r.CountInMotor - r.CountOutMotor;
              const totalInareaMobil = r.CountInMobil - r.CountOutMobil;
              return (
                <tr key={r.Id} className="border-t">
                  <td className="py-2 pr-4">{r.Date}</td>
                  <td>{r.CountInMotor}</td>
                  <td>{r.CountOutMotor}</td>
                  <td className="pl-4 font-semibold text-green-600">
                    {totalInareaMotor}
                  </td>
                  <td>{r.CountInMobil}</td>
                  <td>{r.CountOutMobil}</td>
                  <td className="pl-4 font-semibold text-green-600">
                    {totalInareaMobil}
                  </td>
                  <td className="pl-4 font-semibold">{totalIn}</td>
                  <td className="font-semibold">{totalOut}</td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
