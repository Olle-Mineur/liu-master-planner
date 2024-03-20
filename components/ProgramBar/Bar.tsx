export default function Bar({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-24 border-solid border-2 overflow-y-scroll" >
            {children}
        </div>
    );
}