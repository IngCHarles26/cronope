import { toast as appToast, type ToasterProps } from "sonner";

export const genToastProps = (id: string) =>
  ({
    position: "top-right",
    duration: 3000,
    id,
  }) as ToasterProps;

export const toast = appToast;
