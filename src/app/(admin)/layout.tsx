export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin sidebar will be added later */}
      <main className="p-8">{children}</main>
    </div>
  );
}
