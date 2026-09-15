import { cn, style } from "../../lib/utils";

const PanelPage = () => {
  return (
    <div className={cn(style.page, "flex-1 flex items-center justify-center")}>
      <div className="">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent/70 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-sidebar-foreground/80">
            Bike Chrono
          </p>
        </div>

        <h1 className="text-2xl font-heading font-bold uppercase tracking-[0.08em] text-foreground md:text-4xl">
          Bienvenido al panel de control
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Gestiona competencias, participantes y tiempos desde una sola vista. Todo el flujo esta
          preparado para que trabajes rapido y con claridad.
        </p>
      </div>
    </div>
  );
};

export default PanelPage;
