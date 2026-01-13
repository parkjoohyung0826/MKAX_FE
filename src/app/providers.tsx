// src/app/providers.tsx
'use client';

import { ThemeProvider } from '@mui/material/styles';
import { Global } from '@emotion/react';
// AppRouterCacheProvider는 layout.tsx로 이동
import { createTheme } from '@/styles/theme/createTheme';
import { globalStyles } from '@/styles/global';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // 기본 모드는 light로 설정
  const [mode] = useState<'light' | 'dark'>('light');
  
  // styles 폴더에 있는 createTheme 함수 사용
  const theme = createTheme(mode);

  return (
      <ThemeProvider theme={theme}>
        {/* styles/global.ts의 글로벌 스타일 적용 */}
        <Global styles={globalStyles(theme as any)} /> 
        {children}
      </ThemeProvider>
  );
}