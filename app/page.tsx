'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button"

import React, { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/programs", {
        headers: {
          Accept: "application/json",
          method: "GET",
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Link href="/masterplanner">
        <Button variant="outline">Planera Master</Button>
      </Link>
    </main>
  );
}
