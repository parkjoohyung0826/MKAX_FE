/** @jsxImportSource @emotion/react */
'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ArchiveDeleteDialog = ({ open, isDeleting, onClose, onConfirm }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 800, color: '#1e293b' }}>
      문서를 삭제할까요?
    </DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: '#475569' }}>
        삭제된 문서는 복구할 수 없습니다. 그래도 삭제하시겠습니까?
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} sx={{ color: '#64748b' }}>
        취소
      </Button>
      <Button variant="contained" color="error" onClick={onConfirm} disabled={isDeleting}>
        삭제
      </Button>
    </DialogActions>
  </Dialog>
);

export default ArchiveDeleteDialog;
