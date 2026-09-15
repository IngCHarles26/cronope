import { type APIResponse } from "@cronope/schemas";
import axios, { type AxiosRequestConfig } from "axios";

const server = import.meta.env.VITE_SERVER || "http://localhost:3000"; //"http://192.168.1.54:3000" para testeo

const axiosAPI = axios.create({
  baseURL: `${server}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) =>
    await axiosAPI.get<APIResponse<T>>(url, config),
  post: async <T, K>(url: string, body: K, config?: AxiosRequestConfig) =>
    await axiosAPI.post<APIResponse<T>>(url, body, config),
  patch: async <T, K>(url: string, body?: K, config?: AxiosRequestConfig) =>
    await axiosAPI.patch<APIResponse<T>>(url, body, config),
  delete: async <T>(url: string, config?: AxiosRequestConfig) =>
    await axiosAPI.delete<APIResponse<T>>(url, config),
};

export const apiRoutes = {
  post: {
    user: "/users/new-user",
    categories: "/others/categories",
    teams: "/others/teams",
    competitor: "/competitor",
    competition: "/competition",
  },
  get: {
    categories: "/others/categories",
    teams: "/others/teams",
    competitors: "/competitor",
    competitions: "/competition",
    todayCompetition: "/competition/today",
    competitionResults: "/competition/results/",
  },
  put: {
    team: "/others/team/",
    competitor: "/competitor/",
    editCompetition: "/competition/",
    toggleCompetitor: "/competitor/toggle-ban/",
    toggleCompetition: "/competition/toggle/",
    updateCompetitionCounters: "/competition/update-counters/",
    updateCompetitionParticipants: "/competition/update-participants/",
    updateCompetitionCategories: "/competition/update-categories/",
    addParticipantTime: "/competition/add-participant-time/",
  },
  delete: {
    competition: "/competition/",
  },
};
