"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
      style={{ backgroundColor: "#1a1a2e" }}
    >
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ backgroundColor: "#f8f7f4" }}
    >
      <div
        className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        <h1
          className="mb-1 text-xl font-semibold"
          style={{ color: "#1a1a2e" }}
        >
          Fincas Pro
        </h1>
        <p className="mb-6 text-sm text-destructive" style={{ color: "#5a5a6e" }}>
          Accede con tu cuenta de administración.
        </p>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: "#1a1a2e" }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", color: "#1a1a2e" }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "#1a1a2e" }}
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", color: "#1a1a2e" }}
            />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
