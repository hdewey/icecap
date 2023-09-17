import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { Children } from 'react';

type ActiveLinkProps = {
  children: React.ReactElement;
  activeClassName: string;
  href: string;
};

const ActiveLink: React.FC<ActiveLinkProps> = ({ children, activeClassName, ...props }) => {
  const { asPath } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || '';

  const isActive = asPath.startsWith(props.href);
  
  const className = isActive 
    ? `${childClassName} ${activeClassName}`.trim()
    : childClassName;

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
};

export default ActiveLink;
