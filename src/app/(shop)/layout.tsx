export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation will be added later */}
      <main className="container mx-auto px-4 py-8">{children}</main>
      {/* Footer will be added later */}
    </div>
  );
}
