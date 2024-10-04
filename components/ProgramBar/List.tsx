import React from 'react';

export default function List({ children }: { children: React.ReactNode }) {
    return (
        <ul className="flex flex-col justify-between">
            {React.Children.map(children, (child, index) => 
                React.isValidElement(child) ? React.cloneElement(child, { key: index }) : child
            )}
        </ul>
    );
}