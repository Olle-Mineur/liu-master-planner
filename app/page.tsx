import Link from "next/link";
import scrapeProgram from "./backend/Scrape";
import { Button } from "@/components/ui/button"

import React, { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Link href="/masterplanner">
        <Button variant="outline">Planera Master</Button>
      </Link>
      {scrapeProgram("Datateknik")}
    </main>
  );
}
