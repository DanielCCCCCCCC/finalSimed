// src/router/routes.js

import MainLayout from "../layouts/MainLayout.vue";
import ErrorNotFound from "pages/ErrorNotFound.vue";

import DashboardIndicadores from "../pages/DashboardIndicadores.vue";
import SchedulerControlCitaCopy from "../pages/SchedulerControlCitacopy.vue";
import ListadoContactos from "../pages/ListadoContactos.vue";
import ListadoMedicos from "../pages/ListadoMedicos.vue";
import ListadoHospitales from "../pages/ListadoHospitales.vue";
import ListadoMedicamentos from "../pages/ListadoMedicamentos.vue";
import ListadoClasificacionDiagnostico from "../pages/ListadoClasificacionDiagnostico.vue";
import ListadoControlMedicion from "../pages/ListadoControlMedicion.vue";
import ListadoEspecialidadesMedicas from "../pages/ListadoEspecialidadesMedicas.vue";
import ListadoTiposEstudios from "../pages/ListadoTiposEstudios.vue";
import ListadoPacientes from "../pages/ListadoPacientes.vue";
import ListadoExamenesEstudios from "../pages/ListadoExamenesEstudios.vue";
import ListadoDiagnosticos from "../pages/ListadoDiagnosticos.vue";
import ListadoMunicipios from "../pages/ListadoMunicipios.vue";
import ListadoTiposMedicamentos from "../pages/ListadoTiposMedicamentos.vue";
import ListadoTipoPacientes from "../pages/ListadoTipoPacientes.vue";
import ListadoGruposContactos from "../pages/ListadoGruposContactos.vue";
import ListadoTiposCitas from "../pages/ListadoTiposCitas.vue";
import ListadoGrupoSanguineo from "../pages/ListadoGrupoSanguineo.vue";
import ListadoTipoEscolaridad from "../pages/ListadoTipoEscolaridad.vue";
import FormDiagnosticos from "../pages/FormDiagnosticos.vue";
import FormConfiMedicas from "../pages/FormConfiMedicas.vue";
import FormDatosGenerales from "../pages/FormDatosGenerales.vue";
import Login from "../pages/loginOrganizaciones.vue";
import RegistrarOrganizacion from "../pages/RegistrarOrganizacion.vue";
import AdminPanel from "../pages/AdminPanel.vue";
import NotAuthorized from "../pages/NotAuthorized.vue";
import ListadoTipoEstadoCivil from "../pages/ListadoTipoEstadoCivil.vue";
import pacientesPrueba from "../pages/pacientesPrueba.vue";
import Configuraciones from "../pages/Configuraciones.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import RecoverPassword from "../pages/RecoverPassword.vue";
import PerfilMedico from "../pages/PerfilMedico.vue";
import PacientesScheduleAppointment from "../pages/PacientesScheduleAppointment.vue";
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
        meta: { requiresAuth: true, roles: ["admin", "medico", "secretario"] },
      },
      {
        path: "controlCitasv2",
        name: "controlCitasv2",
        component: SchedulerControlCitaCopy,
        meta: {
          requiresAuth: true,
          roles: ["admin", "medico", "paciente", "secretario"],
        },
      },
      {
        path: "listadoContactos",
        name: "listadoContactos",
        component: ListadoContactos,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listamedicos",
        name: "listamedicos",
        component: ListadoMedicos,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },

      {
        path: "listadomedicamentos",
        name: "listadomedicamentos",
        component: ListadoMedicamentos,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadoestudios",
        name: "listadoestudios",
        component: ListadoExamenesEstudios,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "diagnosticos",
        name: "diagnosticos",
        component: FormDiagnosticos,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadoclasificaciondiagnosticos",
        name: "listadoclasificaciondiagnosticos",
        component: ListadoClasificacionDiagnostico,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadodiagnosticos",
        name: "listadodiagnosticos",
        component: ListadoDiagnosticos,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      // Otras rutas protegidas...
      {
        path: "configuracionesMedicas",
        name: "configuracionesMedicas",
        component: FormConfiMedicas,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadoespecialidadesmedicas",
        name: "listadoespecialidadesmedicas",
        component: ListadoEspecialidadesMedicas,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadotiposestudios",
        name: "listadotiposestudios",
        component: ListadoTiposEstudios,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadotipomedicamentos",
        name: "listadotipomedicamentos",
        component: ListadoTiposMedicamentos,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadotipopacientes",
        name: "listadotipopacientes",
        component: ListadoTipoPacientes,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "pacientes",
        name: "pacientes",
        component: pacientesPrueba,
        meta: { requiresAuth: true, roles: ["admin", "medico", "secretario"] },
      },

      {
        path: "listadotiposcitas",
        name: "listadotiposcitas",
        component: ListadoTiposCitas,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadopacientes",
        name: "listadopacientes",
        component: ListadoPacientes,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "datosGenerales",
        name: "datosGenerales",
        component: FormDatosGenerales,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadomunicipios",
        name: "listadomunicipios",
        component: ListadoMunicipios,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadogruposanguineo",
        name: "listadogruposanguineo",
        component: ListadoGrupoSanguineo,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadoescolaridad",
        name: "listadoescolaridad",
        component: ListadoTipoEscolaridad,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "listadotipoestadocivil",
        name: "listadotipoestadocivil",
        component: ListadoTipoEstadoCivil,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "configuraciones",
        name: "configuraciones",
        component: Configuraciones,
        meta: { requiresAuth: true, roles: ["admin", "secretario", "medico"] },
      },
      {
        path: "admin",
        name: "AdminPanel",
        component: AdminPanel,
        meta: { requiresAuth: true, roles: ["admin", "secretario"] },
      },
      {
        path: "not-authorized",
        name: "NotAuthorized",
        component: NotAuthorized,
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
    path: "/schedule/:tenant_id",
    name: "PublicScheduleAppointment",
    component: PacientesScheduleAppointment,
    meta: { requiresAuth: false },
  },
  {
    path: "/recover-password",
    name: "RecoverPassword",
    component: RecoverPassword,
    meta: { requiresAuth: false },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
    meta: { requiresAuth: false },
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
