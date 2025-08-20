import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex relative">
        <Sidebar />
        <main className="flex-1 overflow-hidden w-full md:w-auto">
          {children}
        </main>
      </div>
    </div>
  );
};