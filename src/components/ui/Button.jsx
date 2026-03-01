import styles from "./Button.module.scss";

export default function Button({
  children,
  variant = "default",
  type = "button",
  className = "",
  ...props
}) {
  const variantClass = styles[variant] || styles.default;

  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
