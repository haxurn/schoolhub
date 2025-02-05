import toast, { ToastOptions } from 'react-hot-toast';

// Default toast options
const defaultToastOptions: ToastOptions = {
  duration: 4000,
};

// Function to get the current theme from localStorage
const getCurrentTheme = () => {
  return localStorage.getItem("theme") || "light"; // Default to "light" if not set
};

// Function to get toast styles based on the current theme
const getToastStyles = () => {
  const theme = getCurrentTheme();
  return theme === "dark"
    ? {
        backgroundColor: '#333', // Dark background
        color: '#fff', // Light text
      }
    : {
        backgroundColor: '#fff', // Light background
        color: '#000', // Dark text
      };
};

export const toastError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...getToastStyles(),
      border: '1px solid #FF0000', // Optional: red border for error
    },
  });
};

export const toastWarning = (message: string, options?: ToastOptions) => {
  toast(message, {
    ...defaultToastOptions,
    ...options,
    icon: '⚠️', // Add an icon for warning
    style: {
      ...getToastStyles(),
      border: '1px solid #FFC107', // Optional: yellow border for warning
    },
  });
};

export const toastInfo = (message: string, options?: ToastOptions) => {
  toast(message, {
    ...defaultToastOptions,
    ...options,
    icon: 'ℹ️', // Add an icon for info
    style: {
      ...getToastStyles(),
     border: '1px solid #007BFF', // Optional: blue border for info
    },
  });
};

export const toastSuccess = (message: string, options?: ToastOptions,) => {
  toast.success(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...getToastStyles(),
      border: '1px solid #28A745', // Optional: green border for success
    },
  });
};