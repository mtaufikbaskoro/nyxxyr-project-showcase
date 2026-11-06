"use client";

import { useActionState, type FormEvent, type ReactNode } from "react";
import type { AdminAction } from "@/lib/admin/types";

type AdminFormProps = {
  action: AdminAction;
  children: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  confirmText?: string;
  className?: string;
  submitTone?: "primary" | "secondary" | "danger";
};

export function AdminForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Saving...",
  confirmText,
  className = "admin-form",
  submitTone = "primary",
}: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (confirmText && !window.confirm(confirmText)) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} className={className} onSubmit={handleSubmit}>
      {children}
      <div
        className={`admin-form__message${
          state.status ? ` admin-form__message--${state.status}` : ""
        }`}
        role={state.status === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {state.message}
      </div>
      <div className="admin-form__actions">
        <button
          className={`button button--${submitTone}`}
          type="submit"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
