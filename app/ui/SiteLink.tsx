import type { AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

export default function SiteLink({ href, children, ...props }: Props) {
  return <a href={href} {...props}>{children}</a>;
}
