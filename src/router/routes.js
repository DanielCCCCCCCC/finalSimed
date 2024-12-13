// src/router/routes.js

import MainLayout from "../layouts/MainLayout.vue";
import ErrorNotFound from "pages/ErrorNotFound.vue";

import DashboardIndicadores from "../pages/DashboardIndicadores.vue";
import SchedulerControlCitaCopy from "../pages/SchedulerControlCitacopy.vue";
import ListadoContactos from "../pages/ListadoContactos.vue";
import ListadoMedicos from "../pages/ListadoMedicos.vue";
import FormDirectorios from "../pages/FormDirectorios.vue";
import FormDiagnosticos from "../pages/FormDiagnosticos.vue";
import FormConfiMedicas from "../pages/FormConfiMedicas.vue";
import FormDatosGenerales from "../pages/FormDatosGenerales.vue";
import Login from "../pages/loginOrganizaciones.vue";
import RegistrarOrganizacion from "../pages/RegistrarOrganizacion.vue";
import AdminPanel from "../pages/AdminPanel.vue";
import NotAuthorized from "../pages/NotAuthorized.vue";
import ForgotPassword from "../pages/ForgotPassword.vue";
import FormFichaPaciente from "../pages/FormFichaPaciente.vue";
import ListadoPacientes from "../pages/ListadoPacientes.vue";
const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardIndicadores,
        meta: { requiresAuth: true, roles: ["admin", "medico"] },
      },

      {
        path: "fichapacientes",
        name: "fichapacientes",
        component: FormFichaPaciente,
        meta: { requiresAuth: true, roles: ["admin", "medico"] },
      },
      {
        path: "controlCitasv2",
        name: "controlCitasv2",
        component: SchedulerControlCitaCopy,
        meta: { requiresAuth: true, roles: ["admin", "medico"] },
      },

      {
        path: "listadoContactos",
        name: "listadoContactos",
        component: ListadoContactos,
        meta: { requiresAuth: true, roles: ["admin", "medico"] },
      },

      {
        path: "listamedicos",
        name: "listamedicos",
        component: ListadoMedicos,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "directorios",
        name: "directorios",
        component: FormDirectorios,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "diagnosticos",
        name: "diagnosticos",
        component: FormDiagnosticos,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "configuracionesMedicas",
        name: "configuracionesMedicas",
        component: FormConfiMedicas,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "listadopacientes",
        name: "listadopacientes",
        component: ListadoPacientes,
        meta: { requiresAuth: true, roles: ["admin", "medico"] },
      },

      {
        path: "datosGenerales",
        name: "datosGenerales",
        component: FormDatosGenerales,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "admin",
        name: "AdminPanel",
        component: AdminPanel,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "not-authorized",
        name: "NotAuthorized",
        component: NotAuthorized,
      },
      {
        path: "forgotpassword",
        name: "forgotPassword",
        component: ForgotPassword,
        meta: { requiresAuth: false },
      },
    ],
  },
  // Rutas fuera del MainLayout
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/registrarOrganizacion",
    name: "registrarOrganizacion",
    component: RegistrarOrganizacion,
  },
  {
    path: "/:catchAll(.*)*",
    component: ErrorNotFound,
  },
];

export default routes;
