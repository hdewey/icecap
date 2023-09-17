import React, { useState, useEffect } from 'react';
import styles from '../../styles/Header.module.css';
import ActiveLink from './ActiveLink';

const pages = [
  { name: 'create', path: '/create' },
  { name: 'upload', path: '/upload' },
  { name: 'generate', path: '/generate'},
  { name: 'log', path: '/log' }
];

const Header = ({ title }: { title: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.menu} ref={menuRef}>
          {isMenuOpen ? (
            <ul className={styles.mobileNav}>
              {pages.map((page) => (
                <li key={page.path}>
                  <ActiveLink href={page.path} activeClassName={styles.activeLink}>
                    <a>{page.name}</a>
                  </ActiveLink>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.desktopNav}>
              {pages.map((page, index) => (
                <React.Fragment key={page.path}>
                  <ActiveLink href={page.path} activeClassName={styles.activeLink}>
                    <span>{page.name}</span>
                  </ActiveLink>
                  {index !== pages.length - 1 && " - "}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
