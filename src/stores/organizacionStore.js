import { defineStore } from "pinia";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";
import { ref, watch } from "vue";

export const useOrganizacionStore = defineStore("organizacion", () => {
  const cargando = ref(false);
  const error = ref(null);
  const mensajeExito = ref(null);
  const organizaciones = ref([]);

  const authStore = useAuthStore();

  async function cargarOrganizaciones() {
    const tenant_id = authStore.tenant_id;
    try {
      if (!tenant_id) {
        throw new Error("No se pudo obtener el tenant_id del usuario.");
      }

      const { data, error: fetchError } = await supabase
        .from("organizacion")
        .select("*")
        .eq("id", tenant_id);
      console.log("ORGANIZACIONES: ", organizaciones);
      if (fetchError) {
        throw new Error(
          `Error al cargar organizaciones: ${fetchError.message}`
        );
      } else {
        organizaciones.value = data.map((org) => ({ ...org }));
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  }

  /**
   * Registra una nueva organización y su usuario administrador.
   * Ahora solo:
   * 1. Crea el usuario en Supabase Auth
   * 2. Inserta la organización (incluyendo campos para el trigger)
   * El trigger se encarga de crear el tenant y el usuario en la tabla 'users'.
   */
  const registrarOrganizacion = async (datosOrganizacion, datosAdmin) => {
    cargando.value = true;
    error.value = null;
    mensajeExito.value = null;

    try {
      // Paso 1: Crear el usuario en Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: datosAdmin.email,
        password: datosAdmin.password,
      });

      if (authError) {
        throw new Error(`Error al crear usuario: ${authError.message}`);
      }

      // Paso 2: Insertar la organización (el trigger hará el resto)
      const { data: orgData, error: orgError } = await supabase
        .from("organizacion")
        .insert([
          {
            nombre: datosOrganizacion.nombre,
            direccion: datosOrganizacion.direccion,
            email_contacto: datosOrganizacion.email_contacto,
            numero_telefono: datosOrganizacion.numero_telefono || null,
            admin_user_id: authUser.user.id,
            admin_email: datosAdmin.email,
            admin_password: datosAdmin.password,
          },
        ])
        .select()
        .single();

      if (orgError) {
        throw new Error(`Error al crear organización: ${orgError.message}`);
      }

      mensajeExito.value =
        "Organización y usuario administrador registrados exitosamente.";

      // Opción: cargar las organizaciones si lo requieres.
      await cargarOrganizaciones();

      return { tenant_id: orgData.id };
    } catch (err) {
      console.error("Error al registrar la organización:", err);
      error.value = err.message || "Ocurrió un error inesperado.";
      throw err;
    } finally {
      cargando.value = false;
    }
  };

  watch(
    () => authStore.tenant_id,
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
    organizaciones,
    registrarOrganizacion,
    cargarOrganizaciones,
  };
});
