import React from 'react';
import styles from '../../styles/Panel.module.css';

interface PanelProps {
   children: React.ReactNode;
   title: string;
}

const Panel: React.FC<PanelProps> = ({ children, title }) => {
   return (
      <div className={styles.container}>
         <h2 className={styles.title}>{title}</h2>
         <div className={styles.panelContent}>
            {children}
         </div>
      </div>
   );
};

export default Panel;