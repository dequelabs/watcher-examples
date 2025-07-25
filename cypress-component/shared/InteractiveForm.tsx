import React, { useState } from 'react';

const InteractiveForm: React.FC = () => {
  const [text, setText] = useState('');
  const [option, setOption] = useState('');
  const [dblClickMessage, setDblClickMessage] = useState('');

  const handleDoubleClick = () => {
    setDblClickMessage('Double-clicked!');
  };

  return (
    <div data-testid="form-container">
      {/* ❌ Label not associated with input */}
      <label>Name (required):</label>
      <input
        type="text"
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        data-testid="name-input"
        placeholder="Enter your name"
        /* ❌ Missing id, label not associated */
      />

      {/* ❌ Select without label */}
      <select
        value={option}
        onChange={(e) => setOption(e.target.value)}
        data-testid="select-input"
        /* ❌ No label associated */
      >
        <option value="">-- Select one --</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </select>

      {/* ❌ Interactive div without role or tabindex */}
      <div
        data-testid="scroll-target"
        style={{ marginTop: '200vh', padding: '1rem', backgroundColor: '#e5e7eb' }}
        onDoubleClick={handleDoubleClick}
      >
        Double-click here
      </div>

      {/* ❌ Color contrast issue */}
      <div data-testid="dblclick-message" style={{ color: '#e5e7eb', backgroundColor: '#ffffff' }}>
        {dblClickMessage}
      </div>
    </div>
  );
};

export default InteractiveForm;
