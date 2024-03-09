
export default function List({ children }: { children: React.ReactNode }) {
    return (
        <ul className="flex flex-row items-center justify-between w-full">
            {children}
        </ul>
    );
}