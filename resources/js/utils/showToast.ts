import { Slide, toast, ToastOptions } from "react-toastify";

export const showToast = (message: string, type: "success" | "error" | "info", options?: ToastOptions) => {
  toast[type](message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
    ...options
  });
};
