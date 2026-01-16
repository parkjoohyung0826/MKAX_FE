import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Providers from "./providers";

export const metadata: Metadata = {
  title: "시니어 AI 이력서",
  description: "AI를 이용하여 시니어 구직자분들의 이력서와 자기소개서를 생성하고, 맞춤형 채용 공고를 추천해주는 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}