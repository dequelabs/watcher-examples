import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  primary = false,
  type = 'button',
  ...rest
}) => {
  const baseStyles = {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    outline: 'none',
    transition: 'colors 0.3s ease',
    cursor: 'pointer',
    display: 'inline-block',
  };

  // Intentionally low contrast to fail WCAG AAA
  const colorStyles = primary
    ? {
        backgroundColor: '#93c5fd', // bg-blue-300
        color: '#ffffff',           // white
        border: 'none',
      }
    : {
        backgroundColor: '#e5e7eb', // bg-gray-200
        color: '#9ca3af',           // gray on gray
        border: 'none',
      };

  const combinedStyles = {
    ...baseStyles,
    ...colorStyles,
  };

  return (
    <div>
      {/* ✅ Normal styled button (clean default test target) */}
      <button
        id="buttonID"
        style={combinedStyles}
        onClick={onClick}
        data-testid="button-component"
        type={type}
        {...rest}
      >
        {label}
      </button>

      {/* ⚠️ A11y issues for manual test */}
      <div style={{ marginTop: '1rem' }}>
        {/*  Nested interactive element */}
        <button>
          Save
          <a href="#">More options</a>
        </button>

      </div>
    </div>
  );
};

export default Button;

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};