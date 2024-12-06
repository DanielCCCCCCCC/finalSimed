// src/router/routes.js
import MainLayout from "../layouts/MainLayout.vue";
import ErrorNotFound from "pages/ErrorNotFound.vue";

import DashboardIndicadores from "../pages/DashboardIndicadores.vue";
import SchedulerControlCitaCopy from "../pages/SchedulerControlCitacopy.vue";
import FormContactos from "../pages/FormContactos.vue";
import ListadoContactos from "../pages/ListadoContactos.vue";
import FormMedicos from "../pages/FormMedicos.vue";
import ListadoMedicos from "../pages/ListadoMedicos.vue";
import FormDirectorios from "../pages/FormDirectorios.vue";
import FormDiagnosticos from "../pages/FormDiagnosticos.vue";
import FormConfiMedicas from "../pages/FormConfiMedicas.vue";
import FormDirectorioPacientes from "../pages/FormDirectorioPacientes.vue";
import FormDatosGenerales from "../pages/FormDatosGenerales.vue";

import Login from "../pages/loginOrganizaciones.vue"; // Importar el componente de login
import RegistrarOrganizacion from "../pages/RegistrarOrganizacion.vue"; // Importar el componente de registro

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
        meta: { requiresAuth: true },
      },
      {
        path: "controlCitasv2",
        name: "controlCitasv2",
        component: SchedulerControlCitaCopy,
        meta: { requiresAuth: true },
      },
      {
        path: "contactos",
        name: "contactos",
        component: FormContactos,
        meta: { requiresAuth: true },
      },
      {
        path: "listadoContactos",
        name: "listadoContactos",
        component: ListadoContactos,
        meta: { requiresAuth: true },
      },
      {
        path: "medicos",
        name: "medicos",
        component: FormMedicos,
        meta: { requiresAuth: true },
      },
      {
        path: "listamedicos",
        name: "listamedicos",
        component: ListadoMedicos,
        meta: { requiresAuth: true },
      },
      {
        path: "directorios",
        name: "directorios",
        component: FormDirectorios,
        meta: { requiresAuth: true },
      },
      {
        path: "diagnosticos",
        name: "diagnosticos",
        component: FormDiagnosticos,
        meta: { requiresAuth: true },
      },
      {
        path: "configuracionesMedicas",
        name: "configuracionesMedicas",
        component: FormConfiMedicas,
        meta: { requiresAuth: true },
      },
      {
        path: "directoriopacientes",
        name: "directoriopacientes",
        component: FormDirectorioPacientes,
        meta: { requiresAuth: true },
      },
      {
        path: "datosGenerales",
        name: "datosGenerales",
        component: FormDatosGenerales,
        meta: { requiresAuth: true },
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
