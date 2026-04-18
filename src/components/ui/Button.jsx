const variantClasses = {
  primary: 'bg-scarlet hover:bg-scarlet-dark text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  outline: 'border border-scarlet text-scarlet hover:bg-scarlet hover:text-white',
};

export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  ...rest
}) {
  const classes = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${classes} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
