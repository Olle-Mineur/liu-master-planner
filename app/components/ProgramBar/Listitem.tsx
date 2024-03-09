import Link from "next/link";

export default function Listitem({ href, children } : { href: string, children: React.ReactNode }) {
    return (
        <li className="flex flex-col items-center justify-center w-1/3 h-24 bg-gray-200 m-2 p-4 rounded-lg">
            <Link href={href}>
                {children}
            </Link>
        </li>
    );
}