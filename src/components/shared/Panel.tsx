import React from 'react';
import styles from '../../styles/Panel.module.css';

import { Text } from '@chakra-ui/react';

interface PanelProps {
   children: React.ReactNode;
   title: string;
}

const Panel: React.FC<PanelProps> = ({ children, title }) => {
   return (
      <div className={styles.container}>
         <Text 
            textStyle={"h1"}
            textAlign={"left"}
            width={"90%"}
            fontSize={"3rem"} 
            my={"4vh"}
            textDecorationLine={"underline"}
            lineHeight={"normal"}
            color={"var(--primary-dark)"}
         >{title}</Text>
         <div className={styles.panelContent}>
            {children}
         </div>
      </div>
   );
};

export default Panel;