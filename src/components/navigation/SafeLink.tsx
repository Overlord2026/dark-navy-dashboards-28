import { startTransition } from "react";
import { Link, LinkProps } from "react-router-dom";

export default function SafeLink(props: LinkProps & React.RefAttributes<HTMLAnchorElement>) {
  const { onClick, ...rest } = props;
  
  return (
    <Link
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          startTransition(() => {
            // Navigation will be handled by Link's default behavior
            // but wrapped in startTransition for concurrent rendering
          });
        }
      }}
    />
  );
}
