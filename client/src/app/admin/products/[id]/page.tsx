import { ProductEditor } from '@/components/admin/sections/ProductEditor';

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductEditor id={id} />;
}
