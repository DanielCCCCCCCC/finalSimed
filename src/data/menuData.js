export let menuData = [
  // Título principal

  {
    path: "/dashboard", // Ruta directa a Dashboard
    title: "Dashboard",
    type: "link",
    icon: "ti-home",
    active: true,
    defaultActive: false,
  },
  {
    path: "/fichapacientes", // Ruta directa a Dashboard
    title: "Ficha de Pacientes",
    type: "link",
    icon: "ti-home",
    active: false,
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
        path: "/listadopacientes",
        title: "Listado de Pacientes",
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
