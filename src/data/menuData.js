export let menuData = [
  // Título principal

  {
    path: "/dashboard", // Ruta directa a Dashboard
    title: "Dashboard",
    type: "link",
    icon: "ti-home",
    active: true,
    defaultActive: false,
    roles: ["admin", "medico"],
  },

  // Sección de utilidades
  {
    title: "Control de Citas",
    icon: "ti-calendar",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin", "medico"],
    children: [
      {
        path: "/controlCitasv2",
        title: "Agendar Cita",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/solicitudesCitasPendientes",
        title: " Solicitudes de citas",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
  // Sección de pacientes
  {
    title: "Pacientes",
    icon: "ti-heart",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin", "medico"],
    children: [
      {
        path: "/listadopacientes",
        title: " Pacientes",
        type: "link",
        active: false,
        defaultActive: false,
      },
      // {
      //   path: "/pacientes",
      //   title: "Pacientes",
      //   type: "link",
      //   active: false,
      //   defaultActive: false,
      // },
    ],
  },
  // Sección de contactos
  {
    title: "Contactos",
    icon: "ti-user",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin", "medico"],
    children: [
      {
        path: "/listadoContactos",
        title: "Contactos",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
  // Sección de médicos
  // {
  //   title: "Médicos",
  //   icon: "ti-briefcase",
  //   type: "sub",
  //   active: false,
  //   defaultActive: false,
  //   roles: ["admin"],
  //   children: [
  //     {
  //       path: "/listamedicos",
  //       title: "Médicos",
  //       type: "link",
  //       active: false,
  //       defaultActive: false,
  //     },
  //   ],
  // },
  // Sección de directorios
  {
    title: "Directorios",
    icon: "ti-folder",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin"],
    children: [
      // {
      //   path: "/listadohospitales",
      //   title: "Hospitales",
      //   type: "link",
      //   active: false,
      //   defaultActive: false,
      // },
      {
        path: "/listamedicos",
        title: "Médicos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadomedicamentos",
        title: "Medicamentos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadoestudios",
        title: "Examenes y Estudios",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
  // Sección de diagnósticos
  {
    title: "Diagnósticos",
    icon: "ti-notepad",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin"],
    children: [
      {
        path: "/listadoclasificaciondiagnosticos",
        title: " Clasificacion de Diagnosticos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadodiagnosticos",
        title: " Diagnosticos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      // {
      //   path: "/listadocontrolmedicion",
      //   title: " Controles de medicion",
      //   type: "link",
      //   active: false,
      //   defaultActive: false,
      // },
    ],
  },
  // Sección de configuraciones médicas
  {
    title: "Configuraciones Médicas",
    icon: "ti-settings",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin"],
    children: [
      // {
      //   path: "/configuracionesMedicas",
      //   title: "Formulario Configuraciones",
      //   type: "link",
      //   active: false,
      //   defaultActive: false,
      // },
      {
        path: "/listadoespecialidadesmedicas",
        title: " Especialidaes Medicas",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotiposestudios",
        title: " Tipos de Estudios",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotipomedicamentos",
        title: " Tipos de Medicamentos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      // {
      //   path: "/listadotipopacientes",
      //   title: " Tipos de Pacientes",
      //   type: "link",
      //   active: false,
      //   defaultActive: false,
      // },
      // {
      //   path: "/listadogruposcontactos",
      //   title: " Grupos de Contactos",
      //   type: "link",
      //   active: false,
      //   defaultActive: false,
      // },
      {
        path: "/listadotiposcitas",
        title: " Tipos de Citas",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },

  // Sección de datos generales
  {
    title: "Datos Generales",
    icon: "ti-info",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin"],
    children: [
      // {
      //   path: "/datosGenerales",
      //   title: "Formulario Datos Generales",
      //   type: "link",
      //   active: false,
      //   defaultActive: false,
      // },
      {
        path: "/listadomunicipios",
        title: " Municipios & Departamentos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadogruposanguineo",
        title: " Grupos Sanguineos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadoescolaridad",
        title: " Niveles de Educacion",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotipoestadocivil",
        title: " Tipos de Estado Civil",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
  {
    title: "Organización",
    icon: "ri-organization-chart",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin"],
    children: [
      {
        path: "/configuraciones",
        title: " Configuraciones",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
];
