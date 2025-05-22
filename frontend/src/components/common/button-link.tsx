import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonLinkProps extends ButtonProps {
  href: string;
  children: ReactNode;
  external?: boolean;
}

export function ButtonLink({
  href,
  children,
  external,
  ...props
}: ButtonLinkProps) {
  if (external) {
    return (
      <Button asChild {...props}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    );
  }
  
  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
