import Image from "next/image";
import Link from "next/link";
import scrapeProgram from "./backend/Scrape";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Link href="/masterplanner">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Planera Master </button>
        {scrapeProgram("Datateknik")}
      </Link>
    </main>
  );
}
