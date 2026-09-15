import { Activity, Globe, Trophy } from "lucide-react";
import Logo from "../app/logo";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-400 w-full items-center justify-between px-6 lg:px-4">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <p className="font-heading text-2xl font-bold uppercase italic">
                CRONO<span className="text-primary">PE</span>
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            {/* <a className="text-sm font-semibold uppercase tracking-[0.24em] text-primary" href="#features">
              Funciones
            </a> */}
            <a
              className="text-sm uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
              href="#competitions">
              <p>Competiciones en vivos</p>
              <div className=" rounded-full size-2 bg-destructive/80 animate-pulse duration-50" />
            </a>
            {/* <a
              className="text-sm uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
              href="#platform">
              Plataforma
            </a> */}
          </nav>

          {/* <div className="flex items-center gap-4 sm:gap-6">
            <a
              className="hidden text-sm uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground sm:block"
              href="/login">
              Iniciar sesión
            </a>
            <a
              className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-primary/85"
              href="#competitions">
              Comenzar
              <ArrowRight className="size-4" />
            </a>
          </div> */}
        </div>
      </header>

      <main className="overflow-hidden pt-20">
        <section className="relative isolate min-h-[90vh] border-b border-border/50 bg-foreground text-background flex items-end">
          <img
            alt="Acción de downhill en bicicleta de montaña dentro de un bosque denso, con tierra saltando desde los neumáticos."
            className="absolute inset-0 h-full w-full z-10 object-cover opacity-25 mix-blend-luminosity"
            src="https://lh3.googleusercontent.com/aida/AP1WRLv0RcV78Uay6zeHaH9GVfevefTeBxZWhmlKtSikI9lYkih7Maf-YoWGBQxKPtiTfrPYU5-iiPdLtmQ2xsTudntv1-hzXBFbzDwQg7t5-xBoHtpssveHjP0LZha1-MdlRKMksGrrgAnJ_wJm4EMlzVbb6K7x4ZgkmdlqryQNPmJupWqCC-kw101Qa2IHSIwU3oLYneDt2A2_INW9lULOLQ1Qpd8u176j7aUeOQeYYgkcVGP89EOAM_JO_Fwf"
          />
          <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/60 to-foreground/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.primary/.18),transparent_28%),radial-gradient(circle_at_left_center,theme(colors.secondary/.12),transparent_24%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-px rotate-25 bg-primary/50 lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-0.5 rotate-25 bg-primary/35 lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-[30%] hidden w-px rotate-25 bg-primary/25 lg:block" />

          <div className="relative z-10 mx-auto w-full max-w-450 flex flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:px-12 lg:py-24">
            <div className="flex w-full flex-col items-start gap-8 lg:w-3/5">
              {/* <div className="inline-flex items-center gap-3 rounded-full border border-background/15 bg-background/10 px-4 py-2 backdrop-blur-md">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs uppercase tracking-[0.28em] text-background/80">
                  Estado del sistema: óptimo
                </span>
              </div> */}

              <div className="space-y-6">
                <h1 className="font-heading text-5xl font-bold uppercase leading-[0.88] tracking-[-0.08em] md:text-7xl lg:text-8xl">
                  Precisión
                  <br />
                  <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    cinética
                  </span>
                  <br />
                  para la élite.
                </h1>
                <p className="max-w-xl text-lg font-light text-background/72 md:text-xl">
                  La plataforma de cronometraje y gestión para competencias MTB y downhill que
                  combina operación en vivo, telemetría y precisión al milisegundo.
                </p>
              </div>

              {/* <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  className="group relative inline-flex items-center gap-3 overflow-hidden bg-primary px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.24em] text-primary-foreground shadow-[0_0_40px_rgba(152,218,0,0.18)] transition-colors hover:bg-primary/85"
                  href="#competitions">
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-background/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  Comenzar
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  className="inline-flex items-center gap-3 border-b-2 border-primary px-2 py-4 font-heading text-sm font-bold uppercase tracking-[0.24em] text-background transition-colors hover:text-primary"
                  href="#platform">
                  Ver demos en vivo
                  <Activity className="size-4" />
                </a>
              </div> */}
            </div>

            {/* <div className="hidden w-full justify-end lg:flex lg:w-2/5">
              <div className="relative w-full max-w-md border border-border/60 bg-background/92 p-6 text-foreground shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
                <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
                  <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Competencias en vivo
                  </span>
                  <span className="rounded-full size-2 bg-destructive/80 animate-pulse duration-75" />
                </div>
                <div className="space-y-4">
                  {liveCompetitions.map((row, ix) => (
                    <div
                      key={ix + "competition" + row.title}
                      className="flex items-center justify-between bg-card p-3 transition-colors hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-card-foreground">{row.title}</p>
                          <p className="text-xs text-muted-foreground">{row.location}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">(Logo Competencia)</span>
                        <row.Icon className="size-5 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </section>

        <section className="border-b border-border/50 bg-background py-12 w-full ">
          <div className="mx-auto flex max-w-400 w-full flex-col items-start gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Confían en nosotros circuitos globales
            </span>
            <div className="flex flex-wrap items-center gap-8 text-xl font-bold uppercase tracking-[-0.06em] text-foreground/65 transition-opacity md:gap-16">
              <span>DH</span>
              <span>ENDURO</span>
            </div>
          </div>
        </section>

        {/* <section className="relative bg-background py-24" id="competitions">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/8 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4" id="features">
                <h2 className="font-heading text-4xl font-bold uppercase tracking-[-0.06em] md:text-5xl">
                  Centro de control
                </h2>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Sigue eventos globales en tiempo real con actualizaciones de alta frecuencia desde la salida
                  hasta la meta.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-2 bg-card px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-card-foreground transition-colors hover:bg-muted"
                href="#">
                Ver todos los eventos
                <ArrowRight className="size-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <article
                  key={event.title}
                  className="group overflow-hidden bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(28,27,27,0.08)]">
                  <div className={`h-1 w-full ${event.accent}`} />
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={event.image}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.24em]">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 ${
                          event.status === "En vivo"
                            ? "bg-destructive text-white"
                            : event.status === "Próximo"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}>
                        {event.status === "En vivo" ? (
                          <span className="size-1.5 rounded-full bg-white animate-pulse" />
                        ) : null}
                        {event.status}
                      </span>
                      <span className="bg-background/90 px-2 py-1 text-foreground backdrop-blur">
                        {event.discipline}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold uppercase tracking-[-0.04em] text-card-foreground">
                      {event.title}
                    </h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-6">
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {event.meta}
                      </span>
                      <a
                        className={`inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.18em] ${event.ctaClass}`}
                        href="#">
                        {event.cta}
                        <ArrowUpRight className="size-4" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section> */}

        {/* <section className="relative overflow-hidden bg-foreground py-32 text-background" id="platform">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_55%,theme(colors.primary/.12)_100%)]" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-20 max-w-3xl space-y-4">
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                Infraestructura central
              </span>
              <h2 className="font-heading text-4xl font-bold uppercase tracking-[-0.06em] md:text-6xl">
                Arquitectura para velocidad. Diseño para precisión.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px bg-background/10 md:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.title}
                    className="group flex flex-col bg-foreground px-8 py-10 transition-colors hover:bg-background/5">
                    <div className="mb-8 flex size-16 -skew-x-12 items-center justify-center bg-primary/10 transition-colors group-hover:bg-primary">
                      <Icon className="size-7 skew-x-12 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-[-0.04em]">
                      {service.title}
                    </h3>
                    <p className="mb-8 mt-4 grow text-sm leading-7 text-background/70">{service.body}</p>
                    <ul className="space-y-3 text-sm text-background/78">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <Check className="size-4 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section> */}
      </main>

      <footer className="bg-card py-20 text-card-foreground">
        {/* <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4 lg:px-12"> */}
        <div className="md:col-span-2 w-full mx-auto max-w-400 flex justify-between items-center">
          <div className="mb-6 flex items-center gap-3">
            <Logo className="h-30" />
          </div>
          <div className="flex flex-col items-end">
            <p className="mb-8 max-w-sm text-muted-foreground text-right">
              Cronometraje y gestión de competencias con precisión de carrera y operación en vivo.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Globe className="size-5 transition-colors hover:text-primary" />
              <Trophy className="size-5 transition-colors hover:text-primary" />
              <Activity className="size-5 transition-colors hover:text-primary" />
            </div>
          </div>
        </div>

        {/* <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.24em]">Plataforma</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>Cronometraje en vivo</li>
              <li>Analítica de carrera</li>
              <li>Inscripciones</li>
              <li>API para broadcast</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.24em]">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>Política de privacidad</li>
              <li>Términos del servicio</li>
              <li>Contactar soporte</li>
            </ul>
          </div> */}
        {/* </div> */}

        <div className="mx-auto mt-16 flex max-w-450 flex-col items-center justify-between gap-4 border-t border-border/60 px-6 pt-8 text-xs uppercase tracking-[0.24em] text-muted-foreground md:flex-row lg:px-12">
          <span>© 2026 CRONOPE. Diseñado para la velocidad.</span>
          <div className="flex gap-8">
            <span>Hecho en los Alpes</span>
            <span>Cronometraje verificado</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
