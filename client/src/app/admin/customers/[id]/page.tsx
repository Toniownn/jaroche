import { CustomerDetail } from '@/components/admin/sections/CustomerDetail';

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetail id={id} />;
}
