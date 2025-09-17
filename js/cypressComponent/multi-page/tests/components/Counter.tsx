import React, { useState } from 'react';
import Button from './Button';

interface CounterProps {
    initialValue?: number;
    label?: string;
}

const Counter: React.FC<CounterProps> = ({
                                             initialValue = 0,
                                             label = 'Counter'
                                         }) => {
    const [count, setCount] = useState<number>(initialValue);

    const increment = (): void => {
        setCount(count + 1);
    };

    const decrement = (): void => {
        setCount(count - 1);
    };

    return (
        <div className="flex flex-col items-center space-y-4" data-testid="counter-component" id="counter">
            <h2 className="text-xl font-semibold">{label}</h2>
            <div className="text-2xl font-bold" data-testid="counter-value">{count}</div>
            <div className="flex space-x-4">
                <Button label="Decrement" onClick={decrement} />
                <Button label="Increment" onClick={increment} primary />
            </div>
        </div>
    );
};

export default Counter;