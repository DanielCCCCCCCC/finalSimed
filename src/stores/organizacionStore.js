// import { defineStore } from "pinia";
// import { supabase } from "../supabaseClient";
// import { ref } from "vue";

// export const useOrganizacionStore = defineStore("organizacion", () => {
//   const cargando = ref(false);
//   const error = ref(null);
//   const mensajeExito = ref(null);

//   const registrarOrganizacion = async (datosOrganizacion, datosAdmin) => {
//     cargando.value = true;
//     error.value = null;
//     mensajeExito.value = null;

//     try {
//       // Paso 1: Crear un usuario en Supabase Auth
//       const { data: authUser, error: authError } = await supabase.auth.signUp({
//         email: datosAdmin.email,
//         password: datosAdmin.password,
//       });

//       if (authError) {
//         throw new Error(`Error al crear usuario: ${authError.message}`);
//       }

//       // console.log("Usuario creado en Auth:", authUser.user);

//       // Paso 2: Crear el tenant
//       const { data: tenantData, error: tenantError } = await supabase
//         .from("tenants")
//         .insert([
//           {
//             nombre: datosOrganizacion.nombre,
//           },
//         ])
//         .select("id")
//         .single();

//       if (tenantError) {
//         throw new Error(`Error al crear tenant: ${tenantError.message}`);
//       }

//       const tenantId = tenantData.id;
//       // console.log("Tenant creado con ID:", tenantId);

//       // Paso 3: Crear la organización utilizando el ID del tenant
//       const { data: orgData, error: orgError } = await supabase
//         .from("organizacion")
//         .insert([
//           {
//             id: tenantId, // Asegúrate de que este ID coincida con la clave primaria de 'tenants'
//             nombre: datosOrganizacion.nombre,
//             direccion: datosOrganizacion.direccion,
//             email_contacto: datosOrganizacion.email_contacto,
//             numero_telefono: datosOrganizacion.numero_telefono || null,
//             sitio_web: datosOrganizacion.sitio_web || null,
//           },
//         ])
//         .select()
//         .single();

//       if (orgError) {
//         throw new Error(`Error al crear organización: ${orgError.message}`);
//       }

//       // console.log("Organización creada:", orgData);

//       // Paso 4: Asociar el usuario creado con el tenant en la tabla 'users'
//       const { error: userError } = await supabase
//         .from("users")
//         .insert([
//           {
//             id: authUser.user.id, // ID del usuario creado en Supabase Auth
//             email: datosAdmin.email,
//             tenantId: tenantId,
//             role: "admin",
//           },
//         ])
//         .select()
//         .single();

//       if (userError) {
//         throw new Error(`Error al asociar usuario: ${userError.message}`);
//       }

//       mensajeExito.value =
//         "Organización y usuario administrador registrados exitosamente.";
//       return { tenantId };
//     } catch (err) {
//       console.error("Error al registrar la organización:", err);
//       error.value = err.message || "Ocurrió un error inesperado.";
//       throw err;
//     } finally {
//       cargando.value = false;
//     }
//   };

//   return {
//     cargando,
//     error,
//     mensajeExito,
//     registrarOrganizacion,
//   };
// });

// src/stores/organizacion.js

import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Importación de Supabase
import { useAuthStore } from "./auth"; // Importar el store de autenticación
import { ref, watch } from "vue";

export const useOrganizacionStore = defineStore("organizacion", () => {
  const cargando = ref(false);
  const error = ref(null);
  const mensajeExito = ref(null);
  const organizaciones = ref([]); // Nuevo estado reactivo para las organizaciones

  const authStore = useAuthStore(); // Acceder al store de autenticación

  async function cargarOrganizaciones() {
    const tenantId = authStore.tenantId; // Obtener tenantId del store de autenticación
    console.log("LN254 tenantId :", tenantId);
    try {
      // const tenantId = authStore.tenantId; // Obtener tenantId del store de autenticación
      console.log("LN254 tenantId :", tenantId);
      if (!tenantId) {
        throw new Error("No se pudo obtener el tenantId del usuario.");
      }

      const { data, error: fetchError } = await supabase
        .from("organizacion")
        .select("*")
        .eq("id", tenantId); // Filtrar por tenantId

      if (fetchError) {
        throw new Error(
          `Error al cargar organizaciones: ${fetchError.message}`
        );
      } else {
        // Convertir especialidadId a número
        organizaciones.value = data.map((organizaciones) => ({
          ...organizaciones,
          // especialidadId: Number(medico.especialidadId),
        }));
        // console.log("Médicos cargados:", this.medicos); // Agregar este log
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  }

  /**
   * Registra una nueva organización y su usuario administrador.
   * @param {Object} datosOrganizacion - Datos de la organización.
   * @param {Object} datosAdmin - Datos del administrador (email y password).
   * @returns {Object} - Objeto con el tenantId.
   */
  const registrarOrganizacion = async (datosOrganizacion, datosAdmin) => {
    cargando.value = true;
    error.value = null;
    mensajeExito.value = null;

    try {
      // Paso 1: Crear un usuario en Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: datosAdmin.email,
        password: datosAdmin.password,
      });

      if (authError) {
        throw new Error(`Error al crear usuario: ${authError.message}`);
      }

      // Paso 2: Crear el tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .insert([
          {
            nombre: datosOrganizacion.nombre,
          },
        ])
        .select("id")
        .single();

      if (tenantError) {
        throw new Error(`Error al crear tenant: ${tenantError.message}`);
      }

      const tenantId = tenantData.id;

      // Paso 3: Crear la organización utilizando el ID del tenant
      const { data: orgData, error: orgError } = await supabase
        .from("organizacion")
        .insert([
          {
            id: tenantId, // Asegúrate de que este ID coincida con la clave primaria de 'tenants'
            nombre: datosOrganizacion.nombre,
            direccion: datosOrganizacion.direccion,
            email_contacto: datosOrganizacion.email_contacto,
            numero_telefono: datosOrganizacion.numero_telefono || null,
            sitio_web: datosOrganizacion.sitio_web || null,
          },
        ])
        .select()
        .single();

      if (orgError) {
        throw new Error(`Error al crear organización: ${orgError.message}`);
      }

      // Paso 4: Asociar el usuario creado con el tenant en la tabla 'users'
      const { error: userError } = await supabase
        .from("users")
        .insert([
          {
            id: authUser.user.id, // ID del usuario creado en Supabase Auth
            email: datosAdmin.email,
            tenantId: tenantId,
            role: "admin",
          },
        ])
        .select()
        .single();

      if (userError) {
        throw new Error(`Error al asociar usuario: ${userError.message}`);
      }

      mensajeExito.value =
        "Organización y usuario administrador registrados exitosamente.";

      // Opcional: Cargar las organizaciones después de registrar una nueva
      await cargarOrganizaciones();

      return { tenantId };
    } catch (err) {
      console.error("Error al registrar la organización:", err);
      error.value = err.message || "Ocurrió un error inesperado.";
      throw err;
    } finally {
      cargando.value = false;
    }
  };

  /**
   * Carga las organizaciones asociadas al tenant actual.
   * @returns {Array} - Lista de organizaciones.
   */
  // const cargarOrganizaciones = async () => {
  //   cargando.value = true;
  //   error.value = null;

  //   try {
  //     const tenantId = authStore?.tenantId; // Obtener tenantId del store de autenticación

  //     if (!tenantId) {
  //       throw new Error("No se pudo obtener el tenantId del usuario.");
  //     }

  //     const { data, error: fetchError } = await supabase
  //       .from("organizacion")
  //       .select("*")
  //       .eq("id", tenantId); // Filtrar por tenantId

  //     if (fetchError) {
  //       throw new Error(
  //         `Error al cargar organizaciones: ${fetchError.message}`
  //       );
  //     }
  //     organizaciones.value = data || [];
  //     console.log("Organizaciones cargadas:", organizaciones.value);
  //     return organizaciones.value;
  //   } catch (err) {
  //     console.error("Error al cargar las organizaciones:", err);
  //     error.value =
  //       err.message || "Ocurrió un error al cargar las organizaciones.";
  //     return [];
  //   } finally {
  //     cargando.value = false;
  //   }
  // };

  /**
   * Observa cambios en el tenantId para recargar las organizaciones.
   */
  watch(
    () => authStore.tenantId,
    (newTenantId) => {
      if (newTenantId) {
        cargarOrganizaciones();
      } else {
        organizaciones.value = [];
      }
    },
    { immediate: true }
  );

  return {
    cargando,
    error,
    mensajeExito,
    organizaciones, // Exponer el estado de organizaciones
    registrarOrganizacion,
    cargarOrganizaciones, // Exponer la función para cargar organizaciones
  };
});
