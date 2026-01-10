import type { Metadata, Viewport } from "next";

// 【重要: コピペ後の作業 1/2】
// VS Codeに貼り付けた後、以下の2行の先頭にある「// 」を消して有効にしてください
import { Inter } from "next/font/google";
import "./globals.css";

// 【重要: コピペ後の作業 2/2】
// 以下の行も同様にコメントアウトを外してください
const inter = Inter({ subsets: ["latin"] });

// スマホでアプリっぽく見せるための画面設定
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 勝手にズームされないようにする
};

// アプリのタイトルやiOS向けの設定
export const metadata: Metadata = {
  title: "Red Workout Log",
  description: "Personal Training Logger",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // ステータスバーを透明に
    title: "Workout",
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