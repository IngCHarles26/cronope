import { CircleAlert, CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { Toaster } from "sonner";

export const AppToaster = () => {
  return (
    <Toaster
      expand={true}
      visibleToasts={4}
      icons={{
        success: <CircleCheck className="size-5 text-success" />,
        warning: <CircleAlert className="size-5 text-warning" />,
        error: <CircleX className="size-5 text-error" />,
        loading: <LoaderCircle className="size-5 animate-spin text-loading" />,
      }}
      toastOptions={{
        style: {
          fontSize: "0.8rem",
          borderWidth: "1px",
          borderStyle: "solid",
          padding: "0.5rem 1rem",
        },
        classNames: {
          content: "text-chart-2",
        },
      }}
    />
  );
};
