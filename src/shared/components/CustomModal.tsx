// src/components/common/CustomModal.tsx
import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '600px',
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const CustomModal = ({ open, onClose, title, children }: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="custom-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close modal">
            <XMarkIcon width={24} />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;