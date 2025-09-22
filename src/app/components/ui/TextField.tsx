import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  iconLeft?: React.ReactNode;
};

const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, iconLeft, className = "", ...rest }, ref) => {
    return (
      <label className="block">
        <div className="mb-1 font-inter text-sm text-neutral-700">{label}</div>
        <div className="relative">
          {iconLeft ? (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              {iconLeft}
            </span>
          ) : null}
          <input
            ref={ref}
            {...rest}
            className={[
              "w-full rounded-2xl border bg-white/90 px-4 py-3 outline-none",
              iconLeft ? "pl-10" : "",
              "border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200",
              className,
            ].join(" ")}
          />
        </div>
        {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
      </label>
    );
  }
);

TextField.displayName = "TextField";
export default TextField;
