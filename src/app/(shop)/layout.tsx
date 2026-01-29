import { Header } from '@/components/layout/Header';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      {/* Footer will be added later */}
    </div>
  );
}
