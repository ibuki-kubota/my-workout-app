import type { Metadata, Viewport } from "next";

// 【重要: コピペ後の作業】
// VS Codeに貼り付けた後、以下の2行の先頭にある「// 」を消して有効にしてください
import { Inter } from "next/font/google";
import "./globals.css";

// ↓この行もコメントアウトを外してください
const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "my-workout", // 青テーマに合わせてタイトル変更
  description: "Personal Training Logger",
  // ▼ ここが重要：アイコンの設定を追加
  icons: {
    icon: "/icon.png",       // ブラウザのタブ用
    apple: "/icon.png",      // iPhoneのホーム画面用
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "my-workout",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* ローカル環境では className={inter.className} を有効にしてください */}
      <body /* className={inter.className} */ >
        {children}
      </body>
    </html>
  );
}