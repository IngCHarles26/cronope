import { cn } from "../../lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return <img src="/logo-png.png" alt="main-logo" className={cn("h-16", className)} />;
};

export default Logo;
