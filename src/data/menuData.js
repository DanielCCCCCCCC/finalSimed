export let menuData = [
  // Título principal
  {
    headTitle: "Dashboard",
  },
  {
    path: "/dashboard", // Ruta directa a Dashboard
    title: "Dashboard",
    type: "link",
    icon: "ti-home",
    active: true,
    defaultActive: false,
  },
  // Sección de utilidades
  {
    title: "Control de Citas",
    icon: "ti-calendar",
    type: "sub",
    active: false,
    defaultActive: false,
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
  // Sección de contactos
  {
    title: "Contactos",
    icon: "ti-user",
    type: "sub",
    active: false,
    defaultActive: false,
    children: [
      {
        path: "/contactos",
        title: "Formulario Contactos",
        type: "link",
        active: false,
        defaultActive: false,
      },
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
    children: [
      {
        path: "/medicos",
        title: "Formulario Médicos",
        type: "link",
        active: false,
        defaultActive: false,
      },
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
    children: [
      {
        path: "/directorios",
        title: "Formulario Directorios",
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
    children: [
      {
        path: "/diagnosticos",
        title: "Formulario Diagnósticos",
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
    children: [
      {
        path: "/configuracionesMedicas",
        title: "Formulario Configuraciones",
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
    children: [
      {
        path: "/directoriopacientes",
        title: "Directorio de Pacientes",
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
    children: [
      {
        path: "/datosGenerales",
        title: "Formulario Datos Generales",
        type: "link",
        active: false,
        defaultActive: false,
      },
    ],
  },
];
