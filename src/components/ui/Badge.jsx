const variantClasses = {
  discount: 'bg-green-500 text-white',
  urgent: 'bg-amber-500 text-white',
  default: 'bg-gray-100 text-gray-700',
};

export default function Badge({ children, variant = 'default' }) {
  const classes = variantClasses[variant] || variantClasses.default;

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${classes}`}
    >
      {children}
    </span>
  );
}
