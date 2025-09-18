import Swal, { SweetAlertIcon } from "sweetalert2";

interface ConfirmOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const confirmDelete = async (
  options: ConfirmOptions = {}
): Promise<boolean> => {
  const {
    title = "Are you sure?",
    text = "This action cannot be undone.",
    icon = "warning",
    confirmButtonText = "Delete",
    cancelButtonText = "Cancel",
  } = options;

  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export const confirmDialog = async (
  options: ConfirmOptions = {}
): Promise<boolean> => {
  const {
    title = "Are you sure?",
    text = "Do you want to continue this action?",
    icon = "question",
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
  } = options;

  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#6c757d",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};
