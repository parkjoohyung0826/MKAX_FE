import type { Metadata } from "next";
// ... 폰트 import 등
import EmotionRegistry from "@/lib/EmotionRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <EmotionRegistry>
          {children}
        </EmotionRegistry>
      </body>
    </html>
  );
}