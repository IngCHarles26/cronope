import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router";

const NotFound = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-foreground">
      <div className="absolute inset-0 z-0">
        <img
          alt="Accion de downhill en bicicleta de montana dentro de un bosque, con tierra saltando desde los neumaticos."
          className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida/AP1WRLv0RcV78Uay6zeHaH9GVfevefTeBxZWhmlKtSikI9lYkih7Maf-YoWGBQxKPtiTfrPYU5-iiPdLtmQ2xsTudntv1-hzXBFbzDwQg7t5-xBoHtpssveHjP0LZha1-MdlRKMksGrrgAnJ_wJm4EMlzVbb6K7x4ZgkmdlqryQNPmJupWqCC-kw101Qa2IHSIwU3oLYneDt2A2_INW9lULOLQ1Qpd8u176j7aUeOQeYYgkcVGP89EOAM_JO_Fwf"
        />

        <div className="absolute inset-0 bg-linear-to-b from-foreground via-transparent to-foreground" />

        <div className="pointer-events-none absolute right-[10%] top-[-20%] h-[150%] w-px rotate-25 bg-primary/60 mix-blend-screen opacity-30" />
        <div className="pointer-events-none absolute right-[15%] top-[-20%] h-[150%] w-0.5 rotate-25 bg-primary mix-blend-screen opacity-30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-background">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-background/20 bg-background/10 px-4 py-2 backdrop-blur-md">
          <span className="size-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs uppercase tracking-[0.24em] text-background/85">
            Estado del sistema: desconectado
          </span>
        </div>

        <h1 className="mb-4 font-heading text-[7rem] font-bold uppercase leading-none tracking-[-0.08em] text-primary md:text-[12rem]">
          404
        </h1>

        <h2 className="mb-6 font-heading text-3xl font-bold uppercase tracking-tighter text-background md:text-5xl">
          Senal GPS perdida:
          <br />
          <span className="text-primary">sector no encontrado</span>
        </h2>

        <p className="mb-12 max-w-xl text-lg font-light text-background/70 md:text-xl">
          Parece que te pasaste de la cinta y saliste del recorrido. Esta URL no existe en nuestros
          datos de telemetria.
        </p>

        <div className="flex flex-col gap-6 sm:flex-row">
          <NavLink
            className="group relative inline-flex items-center gap-3 overflow-hidden bg-primary px-10 py-5 font-heading text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-[0_0_40px_rgba(160,229,0,0.3)] transition-colors hover:bg-primary/85"
            to="/">
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </NavLink>

          {/* <button
            className="inline-flex items-center gap-3 border-b-2 border-primary bg-transparent px-10 py-5 font-heading text-sm font-bold uppercase tracking-[0.22em] text-background transition-colors hover:text-primary"
            type="button">
            <Flag className="size-4" />
            Reportar problema
          </button> */}
        </div>
      </div>
    </main>
  );
};

export default NotFound;
