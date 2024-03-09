export default function Bar({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center" >
            {children}
        </div>
    );
}