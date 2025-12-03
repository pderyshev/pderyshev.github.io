import type { Metadata } from "next";
import "./main.scss";
import Header from "@/components/header/header";

export const metadata: Metadata = {
  title: "Тестовое задание",
  description: "Тестовое задание на вакансию",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <main>
          <Header/>
          {children}
        </main>
      </body>
    </html>
  );
}
