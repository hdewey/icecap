import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';

interface ReusableModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  noclose?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  noclose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"} isCentered>
      <ModalOverlay  backdropFilter="blur(16px)" />
      <ModalContent>
        <ModalHeader><Text textStyle={"h2"}>{title}</Text></ModalHeader>
        { !noclose && <ModalCloseButton /> }
        <ModalBody py={12} px={6}>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

export default ReusableModal;