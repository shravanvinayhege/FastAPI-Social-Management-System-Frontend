"use client";

import React from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Confirm",
  description = "Are you sure?",
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  if (typeof document === "undefined") return null;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-slate-900 p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{description}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="vf-btn-secondary px-3 py-1"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="vf-btn-primary px-3 py-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
