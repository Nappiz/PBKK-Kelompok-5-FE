"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const PasswordField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", ...rest }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <label className="block">
        <div className="mb-1 font-inter text-sm text-neutral-700">{label}</div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M7 10V8a5 5 0 1 1 10 0v2" fill="none" stroke="#7C7C7C" strokeWidth="2" />
              <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="#7C7C7C" strokeWidth="2" />
            </svg>
          </span>
          <input
            ref={ref}
            {...rest}
            type={show ? "text" : "password"}
            className={[
              "w-full rounded-2xl border bg-white/90 px-4 py-3 pl-10 pr-11 outline-none text-black",
              "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200",
              className,
            ].join(" ")}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
      </label>
    );
  }
);

PasswordField.displayName = "PasswordField";
export default PasswordField;
