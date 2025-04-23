import { toast } from 'react-toastify';

export const handleError = (message) => {
  toast.error(message);
};

export const handleSuccess = (message) => {
  toast.success(message);
};