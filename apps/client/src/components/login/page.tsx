import Logo from "../app/logo";
import { LoginForm } from "./login-form";

const LoginPage = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10 text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-px w-[200%] -rotate-45 bg-primary/20" />
        <div className="absolute -left-1/3 top-1/4 h-px w-[200%] -rotate-45 bg-primary/20" />
        <div className="absolute -left-1/2 top-1/2 h-px w-[200%] -rotate-45 bg-primary/20" />

        <div className="absolute bottom-0 right-0 h-2/3 w-2/3 opacity-10">
          <img
            alt="Silueta dinamica de ciclismo"
            className="h-full w-full translate-x-1/4 translate-y-1/4 rotate-12 object-contain object-bottom"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuikU4VeHYobivhSDavudoRxDikYj5CJcz9zqheo_UWSBl9eHJe3T7ToiappdF7OTcWSEQfmqX5YljPoGAwgre_hfzU8goMcEoLlNcIJwiQUYsNLkwSlKoN3aVsXMOTcMgev5OC4r8hiBgeF1U51yIcEjnS7EaxFl9l5OANnPjpeBuYVvUDhh9wtLQBWIR25u_IfECJh8j0QM5bKtpGtTYwPNiw8uBL-nh8h5576OdP3crmUpYmvW--tO-kYwxVfwu4WG389OoHPXi"
          />
        </div>
      </div>

      <div className="fixed right-0 top-0 z-0 hidden p-12 opacity-20 lg:block">
        <div className="select-none font-heading text-[120px] font-black italic leading-none text-muted">
          RACE
          <br />
          READY
        </div>
      </div>

      <div className="relative z-10 w-full max-w-110">
        <div className="flex flex-col gap-8">
          <header className="space-y-2 text-center">
            <Logo className="h-40 mx-auto" />
          </header>

          <section className="rounded-xl border border-border/30 bg-background/70 p-8 shadow-[0px_20px_40px_rgba(28,27,27,0.06)] backdrop-blur-2xl">
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
