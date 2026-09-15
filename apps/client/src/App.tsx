import { BrowserRouter, Route, Routes } from "react-router";
import {
  Home,
  LoginPage,
  NotFound,
  PanelPage,
  UsersPage,
  ExtrasPage,
  CompetitionsPage,
  TimerPage,
} from "./components/pages";
import { spaRoutes } from "./lib/utils/routes";
import { AuthGuard, AuthPass, RoleGuard } from "./components/login/auth";
import PanelLayout from "./layouts/panel";

const { live, competitionId, login, panel, users, extras, competitions, timer } = spaRoutes;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route path={live}>
          <Route index element={<div>live</div>} />

          <Route path={competitionId} element={<div>live competition</div>} />
        </Route>

        <Route path="*" element={<NotFound />} />

        <Route element={<AuthPass />}>
          <Route path={login} element={<LoginPage />} />
        </Route>

        {/* Rutas Protegidas   */}
        <Route element={<AuthGuard />}>
          <Route path={panel} element={<PanelLayout />}>
            <Route index element={<PanelPage />} />

            {/* Solo ADMIN */}
            <Route element={<RoleGuard allowedRoles={["admin"]} />}>
              <Route path={users} element={<UsersPage />} />

              <Route path={extras} element={<ExtrasPage />} />

              <Route path={competitions} element={<CompetitionsPage />} />
            </Route>

            <Route path="*" element={<>Competencias</>} />
          </Route>

          {/* Solo COUNTER */}
          <Route path={timer} element={<RoleGuard allowedRoles={["counter"]} />}>
            <Route index element={<TimerPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
