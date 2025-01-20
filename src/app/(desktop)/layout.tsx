import ClientLayout from '@/components/layout/ClientLayout'

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
} 