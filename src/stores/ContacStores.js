import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../supabaseClient"; // Asegúrate de que este archivo esté configurado correctamente

export const useContactStore = defineStore("contactStore", () => {
  const contactos = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  // Cargar contactos desde la base de datos
  const cargarContactos = async () => {
    try {
      const { data, error } = await supabase.from("contactos").select("*");

      if (error) {
        console.error("Error al cargar contactos:", error.message);
      } else {
        contactos.value = data || [];
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  // Agregar un contacto a la base de datos
  const agregarContacto = async (contacto) => {
    const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

    try {
      const { data, error } = await supabase
        .from("contactos")
        .insert([{ ...contacto, tenant_Id: tenantId }])
        .select();

      if (error) {
        console.error("Error al agregar contacto:", error.message);
      } else if (data && data.length > 0) {
        contactos.value.push(data[0]);
        // console.log("Contacto agregado:", data[0]);
      } else {
        console.warn("Contacto agregado, pero sin datos devueltos.");
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  const actualizarGrupoDescripcion = async (id, nuevaDescripcion) => {
    const exito = await gruposStore.actualizarGrupo(id, nuevaDescripcion);
    if (exito) {
      // console.log("Grupo actualizado exitosamente");
    } else {
      console.error("Error al actualizar el grupo");
    }
  };

  const eliminarContacto = async (contactoId) => {
    try {
      const { error } = await supabase
        .from("contactos")
        .delete()
        .eq("id", contactoId)
        .eq("tenant_Id", tenantId);

      if (error) {
        console.error("Error al eliminar contacto:", error.message);
      } else {
        contactos.value = contactos.value.filter(
          (contacto) => contacto.id !== contactoId
        );
        // console.log("Contacto eliminado:", contactoId);
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  // Actualizar un contacto en la base de datos y en la lista local
  const actualizarContacto = async (contactoActualizado) => {
    if (!contactoActualizado.id) {
      console.error("Error: El id del contacto es undefined o null.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("contactos")
        .update(contactoActualizado)
        .eq("id", contactoActualizado.id)
        .eq("tenant_Id", tenantId)
        .select();

      if (error) {
        console.error("Error al actualizar contacto:", error.message);
      } else if (data && data.length > 0) {
        const index = contactos.value.findIndex(
          (contacto) => contacto.id === contactoActualizado.id
        );
        if (index !== -1) {
          contactos.value[index] = { ...data[0] };
          // console.log("Contacto actualizado:", data[0]);
        }
      } else {
        console.warn("Contacto actualizado, pero sin datos devueltos.");
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  return {
    contactos,
    cargarContactos,
    agregarContacto,
    eliminarContacto,
    actualizarContacto,
    actualizarGrupoDescripcion,
  };
});
