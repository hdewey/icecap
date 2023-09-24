import React, { useState, useEffect } from 'react';
import styles from '../../styles/Header.module.css';
import ActiveLink from './ActiveLink';
import Link from 'next/link';

const pages = [
  { name: 'create', path: '/create' },
  { name: 'upload', path: '/upload' },
  { name: 'properties', path: '/properties' }
];

const Header = ({ title }: { title: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
      const handleScroll = () => {
          const offsetY = window.scrollY;
          if (offsetY > 60) {
              setIsScrolled(true);
          } else {
              setIsScrolled(false);
          }
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
<>
    <div className={`${styles.container} ${isScrolled ? styles.containerScrolled : ''}`}>
      <div className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`} ref={headerRef} >
        <Link href="/"><h1 className={styles.title}>{title}</h1></Link>
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
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
      {isScrolled && <div style={{ height: (headerHeight * 1.1) + "px", width: "100%", background: 'var(--primary-white)'}}></div>}
    </>
  );
};

export default Header;
