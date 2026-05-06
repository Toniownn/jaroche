'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export type ModalVariant = 'info' | 'success' | 'error' | 'confirm';

interface ModalProps {
  open: boolean;
  variant?: ModalVariant;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function AdminModal({
  open,
  variant = 'info',
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  danger,
  onConfirm,
  onCancel,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') (onClose ?? onCancel ?? onConfirm)?.();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="amodal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) (onClose ?? onCancel ?? onConfirm)?.();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="amodal">
        <div className={`amodal-icon ${variant}`}>
          {variant === 'success' && <Icon name="check" size={22} />}
          {variant === 'confirm' && <Icon name="bell" size={22} />}
          {variant === 'error' && <Icon name="x" size={22} />}
          {variant === 'info' && <Icon name="bell" size={22} />}
        </div>
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        <div className="amodal-actions">
          {variant === 'confirm' && (
            <button className="btn btn-ghost" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModalState {
  open: boolean;
  variant?: ModalVariant;
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export interface UseModalReturn {
  modal: ReactNode;
  success: (title: string, message?: ReactNode, label?: string) => Promise<true>;
  error: (title: string, message?: ReactNode, label?: string) => Promise<false>;
  info: (title: string, message?: ReactNode, label?: string) => Promise<true>;
  confirm: (
    title: string,
    message?: ReactNode,
    confirmLabel?: string,
    cancelLabel?: string,
    danger?: boolean
  ) => Promise<boolean>;
}

export function useAdminModal(): UseModalReturn {
  const [s, setS] = useState<ModalState>({ open: false });

  const close = () => setS((x) => ({ ...x, open: false }));
  const show = (o: Omit<ModalState, 'open'>) => setS({ ...o, open: true });

  return {
    modal: (
      <AdminModal
        open={s.open}
        variant={s.variant}
        title={s.title ?? ''}
        message={s.message}
        confirmLabel={s.confirmLabel}
        cancelLabel={s.cancelLabel}
        danger={s.danger}
        onConfirm={s.onConfirm}
        onCancel={s.onCancel}
        onClose={s.onClose}
      />
    ),
    success: (title, message, label = 'OK') =>
      new Promise<true>((res) =>
        show({
          variant: 'success',
          title,
          message,
          confirmLabel: label,
          onConfirm: () => {
            close();
            res(true);
          },
          onClose: () => {
            close();
            res(true);
          },
        })
      ),
    error: (title, message, label = 'OK') =>
      new Promise<false>((res) =>
        show({
          variant: 'error',
          title,
          message,
          confirmLabel: label,
          onConfirm: () => {
            close();
            res(false);
          },
          onClose: () => {
            close();
            res(false);
          },
        })
      ),
    info: (title, message, label = 'OK') =>
      new Promise<true>((res) =>
        show({
          variant: 'info',
          title,
          message,
          confirmLabel: label,
          onConfirm: () => {
            close();
            res(true);
          },
          onClose: () => {
            close();
            res(true);
          },
        })
      ),
    confirm: (title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false) =>
      new Promise<boolean>((res) =>
        show({
          variant: 'confirm',
          title,
          message,
          confirmLabel,
          cancelLabel,
          danger,
          onConfirm: () => {
            close();
            res(true);
          },
          onCancel: () => {
            close();
            res(false);
          },
          onClose: () => {
            close();
            res(false);
          },
        })
      ),
  };
}
