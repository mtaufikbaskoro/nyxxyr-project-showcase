"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/admin-auth-actions";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, {});

  return (
    <form action={action} className="admin-access-form">
      <div className="admin-access-form__field">
        <label htmlFor="admin-nik">Authorized NIK</label>
        <input
          id="admin-nik"
          name="password"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          minLength={16}
          maxLength={16}
          pattern="[0-9]{16}"
          placeholder="16-digit access key"
          required
          autoFocus
          spellCheck={false}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={
            state.error ? "admin-login-error" : "admin-login-hint"
          }
        />
      </div>

      {state.error ? (
        <div
          id="admin-login-error"
          className="notice notice--error admin-access-form__error"
          role="alert"
        >
          <strong>Access denied</strong>
          <span>{state.error}</span>
        </div>
      ) : (
        <p id="admin-login-hint" className="admin-access-form__hint">
          This page accepts one credential. The NIK is verified on the server.
        </p>
      )}

      <button
        className="button button--primary admin-access-form__submit"
        type="submit"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? (
          <>
            <span className="loading-mark" aria-hidden="true" />
            Verifying
          </>
        ) : (
          <>
            Enter dashboard <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}
