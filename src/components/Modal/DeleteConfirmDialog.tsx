import React from "react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  itemName,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-sm w-full p-6 text-center border">
        <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
          <i className="fa fa-trash-can-xmark text-destructive text-2xl  "></i>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          {message}
          {itemName && (
            <>
              <br />
              <span className="font-medium text-foreground">{itemName}</span>
            </>
          )}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-md text-white bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-tr focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2 text-center leading-5"
          >
            {" "}
            <i className="fa fa-times me-2"></i>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md text-white bg-gradient-to-b from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-tr focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2 text-center leading-5"
          >
            <i className="fa fa-check me-2"></i>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
