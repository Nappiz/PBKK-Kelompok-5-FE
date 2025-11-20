import { ComponentProps } from "react";

export default function Button(props: ComponentProps<"button">) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center rounded-xl px-16 py-3 shadow-sm",
        className,
      ].join(" ")}
    />
  );
}
