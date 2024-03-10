import Link from "next/link";

export default function Listitem({ children } : { children: React.ReactNode }) {
    return (
        <li className="border-solid border-2 hover:border-dotted">
            {children}
        </li>
    );
}