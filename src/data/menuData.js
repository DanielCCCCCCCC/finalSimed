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
        title: "Listado de Pacientes",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/pacientes",
        title: "Pacientes",
        type: "link",
        active: false,
        defaultActive: false,
      },
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
        title: "Listado Contactos",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
  // Sección de médicos
  {
    title: "Médicos",
    icon: "ti-briefcase",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin"],
    children: [
      {
        path: "/listamedicos",
        title: "Listado Médicos",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
  // Sección de directorios
  {
    title: "Directorios",
    icon: "ti-folder",
    type: "sub",
    active: false,
    defaultActive: false,
    roles: ["admin"],
    children: [
      {
        path: "/listadohospitales",
        title: "Listado Hospitales",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadomedicamentos",
        title: "Listado Medicamentos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadoestudios",
        title: "Listado Examenes y Estudios",
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
        title: "Listado de Clasificacion de Diagnosticos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadodiagnosticos",
        title: "Listado de Diagnosticos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadocontrolmedicion",
        title: "Listado de Controles de medicion",
        type: "link",
        active: false,
        defaultActive: false,
      },
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
        title: "Listado de Especialidaes Medicas",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotiposestudios",
        title: "Listado de Tipos de Estudios",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotipomedicamentos",
        title: "Listado de Tipos de Medicamentos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotipopacientes",
        title: "Listado de Tipos de Pacientes",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadogruposcontactos",
        title: "Listado de Grupos de Contactos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotiposcitas",
        title: "Listado de Tipos de Citas",
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
        title: "Listado de Municipios & Departamentos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadogruposanguineo",
        title: "Listado de Grupos Sanguineos",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadoescolaridad",
        title: "Listado de Niveles de Educacion",
        type: "link",
        active: false,
        defaultActive: false,
      },
      {
        path: "/listadotipoestadocivil",
        title: "Listado de Tipos de Estado Civil",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
];
