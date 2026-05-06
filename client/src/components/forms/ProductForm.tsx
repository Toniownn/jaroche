'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { productCreateSchema, type ProductCreateInput, type Product } from '@jaroche/shared';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  initial?: Product;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

export function ProductForm({ initial, onClose, onSaved }: Props) {
  const form = useForm<ProductCreateInput>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      price: Number(initial?.price ?? 0),
      stock: initial?.stock ?? 0,
      imageUrl: initial?.imageUrl ?? '',
      category: initial?.category ?? '',
    },
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function onSubmit(data: ProductCreateInput) {
    try {
      if (initial) {
        await api.put(`/products/${initial.id}`, data);
        toast.success('Product updated.');
      } else {
        await api.post('/products', data);
        toast.success('Product created.');
      }
      await onSaved();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Save failed';
      toast.error(msg);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl">
          {initial ? 'Edit product' : 'New product'}
        </h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Field label="Name" error={form.formState.errors.name?.message}>
            <Input {...form.register('name')} />
          </Field>
          <Field label="Category" error={form.formState.errors.category?.message}>
            <Input {...form.register('category')} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (USD)" error={form.formState.errors.price?.message}>
              <Input
                type="number"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
              />
            </Field>
            <Field label="Stock" error={form.formState.errors.stock?.message}>
              <Input
                type="number"
                step="1"
                {...form.register('stock', { valueAsNumber: true })}
              />
            </Field>
          </div>
          <Field label="Image URL" error={form.formState.errors.imageUrl?.message}>
            <Input {...form.register('imageUrl')} />
          </Field>
          <Field label="Description" error={form.formState.errors.description?.message}>
            <textarea
              {...form.register('description')}
              rows={4}
              className="flex w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </Field>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving…' : initial ? 'Save changes' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
