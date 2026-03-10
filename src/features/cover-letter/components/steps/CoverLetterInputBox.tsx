import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface CompanyLimitInfo {
  hasLimit: boolean;
  limit: number | null;
}

interface Props {
  title: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minRows?: number;
  disabled?: boolean;
  actions?: React.ReactNode;
  maxLength?: number;
  companyLimitInfo?: CompanyLimitInfo;
}

const glassSectionSx = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '24px',
  p: 4,
  pb: 2,
  mb: 3,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
  },
};

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1px' },
    },
  },
  '& .MuiInputBase-input': {
    lineHeight: 1.6,
    color: '#334155',
  },
};

const CoverLetterInputBox = ({
  title,
  description,
  value,
  onChange,
  placeholder,
  minRows = 8,
  disabled = false,
  actions,
  maxLength,
  companyLimitInfo,
}: Props) => {
  return (
    <Box sx={glassSectionSx}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.25, sm: 0 },
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#334155', mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {description}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, flexWrap: 'wrap' }}>
          {companyLimitInfo && (
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
              글자수 제한: {companyLimitInfo.hasLimit ? `있음${companyLimitInfo.limit ? ` (${companyLimitInfo.limit}자)` : ''}` : '없음'}
            </Typography>
          )}
          {actions}
        </Box>
      </Box>

      <TextField
        fullWidth
        multiline
        minRows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputProps={maxLength ? { maxLength } : undefined}
        sx={glassInputSx}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
          {maxLength ? `${value.length} / ${maxLength}자` : `${value.length}자`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CoverLetterInputBox;
