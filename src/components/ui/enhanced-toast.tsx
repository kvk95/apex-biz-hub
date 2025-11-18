import { useToast } from "@/hooks/use-toast";
import { API_CONFIG } from "@/config/api.config";

export const useEnhancedToast = () => {
  const { toast } = useToast();

  const showSuccess = (description: React.ReactNode, title: string = "Success") => {
    toast({
      title: title,
      description: (
        <div className="flex items-center gap-2">
          <i className="fa fa-check-circle text-green-500"></i>
          <span>{description}</span>
        </div>
      ),
      variant: "default",
      duration: API_CONFIG.toast.successDuration,
    });
  };

  const showError = (description: React.ReactNode, title: string = "Error") => {
    toast({
      title,
      description: (
        <div className="flex items-center gap-2">
          <i className="fa fa-alert-circle text-red-500"></i>
          {description}
        </div>
      ),
      variant: "destructive",
      duration: API_CONFIG.toast.errorDuration,
    });
  };

  const showInfo = (description: React.ReactNode, title: string = "Info") => {
    toast({
      title,
      description: (
        <div className="flex items-center gap-2">
          <i className="fa fa-info text-blue-500"></i>
          {description}
        </div>
      ),
      variant: "default",
      duration: API_CONFIG.toast.infoDuration,
    });
  };

  const handleApiError = (error: any, customMessage?: string) => {
    console.error("API Error:", error);

    const isServerError =
      error?.response?.status >= 500 || error?.status >= 500;
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred";

    if (isServerError && API_CONFIG.showDetailedErrors) {
      // Show detailed error for 500 errors when flag is enabled
      showError(errorMessage, "Server Error");
    } else {
      // Show general error message
      showError(
        customMessage ||
          (isServerError
            ? "Server error occurred. Please try again later."
            : errorMessage)
      );
    }
  };

  return {
    showSuccess,
    showError,
    showInfo,
    handleApiError,
  };
};
