import Link from "next/link";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div>
        <p className="kicker kicker--accent">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="admin-page-header__action">{action}</div> : null}
    </header>
  );
}

export function AdminPanel({
  id,
  title,
  description,
  action,
  children,
  tone = "paper",
}: {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: "paper" | "reverse" | "danger";
}) {
  return (
    <section
      id={id}
      className={`admin-panel admin-panel--${tone}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className="admin-panel__header">
        <div>
          <h2 id={id ? `${id}-title` : undefined}>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {action}
      </header>
      <div className="admin-panel__body">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  className?: string;
};

export function TextField({
  label,
  name,
  hint,
  className,
  ...inputProps
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`admin-field ${className ?? ""}`}>
      <span>{label}</span>
      <input name={name} {...inputProps} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  hint,
  className,
  ...inputProps
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`admin-field ${className ?? ""}`}>
      <span>{label}</span>
      <textarea name={name} {...inputProps} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function SelectField({
  label,
  name,
  hint,
  className,
  children,
  ...inputProps
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`admin-field ${className ?? ""}`}>
      <span>{label}</span>
      <select name={name} {...inputProps}>
        {children}
      </select>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  hint,
  defaultChecked,
}: {
  label: string;
  name: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="admin-checkbox">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      <span>
        <strong>{label}</strong>
        {hint ? <small>{hint}</small> : null}
      </span>
    </label>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-empty">
      <span aria-hidden="true">00</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span className={`admin-status admin-status--${tone}`}>{children}</span>
  );
}

export function AdminBackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="admin-back-link" href={href}>
      <span aria-hidden="true">←</span> {children}
    </Link>
  );
}
