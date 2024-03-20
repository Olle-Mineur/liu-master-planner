
export default function List({ children }: { children: React.ReactNode }) {
    return (
        <ul className="flex flex-col justify-between">
            {children}
        </ul>
    );
}