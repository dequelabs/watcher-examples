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

            <div className="mb-10">
                <h2 className="text-2xl mb-4">Counter Component</h2>
                <Counter initialValue={0} label="My Counter" />
            </div>

            <div className="mb-10">
                <h2 className="text-2xl mb-4">Iframe Component</h2>
    {/*            <IframeComponent*/}
    {/*                title="Test iframe"*/}
    {/*                content='<div id="test-content"><h2>Testing Cypress Detection</h2><p>This content is in an isolated iframe context. Cypress detection might not work here as expected.</p><button onclick=\"alert(\"Button inside iframe clicked!\")\">Click Me (Inside Iframe)</button></div>'*/}
    {/*/>*/}
    </div>
</main>
);
}