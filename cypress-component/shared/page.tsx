"use client";

import React from 'react';
import Button from './Button';
import Counter from './Counter';

export default function Home(): React.ReactNode {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Testing Components with Cypress</h1>

            <div className="mb-10">
                <h2 className="text-2xl mb-4">Button Component</h2>
                <div className="flex space-x-4">
                    <Button label="Regular Button" onClick={() => alert('Regular button clicked!')} />
                    <Button label="Primary Button" primary onClick={() => alert('Primary button clicked!')} />
                </div>
            </div>

            
</main>
);
}