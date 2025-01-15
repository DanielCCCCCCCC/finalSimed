import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";

// Helper para validar roles y tenant_id
function verificarRolAdmin(authStore) {
  if (!authStore.tenant_id) {
    console.warn("No hay tenant_id disponible");
    return false;
  }
  if (authStore.role?.toLowerCase() !== "admin") {
    console.error("Permisos insuficientes.");
    return false;
  }
  return true;
}

export const useContactStore = defineStore("contactStore", () => {
  const contactos = ref([]);
  const authStore = useAuthStore();

  // Cargar contactos
  const cargarContactos = async () => {
    try {
      const { data, error } = await supabase
        .from("DirContactos")
        .select("*")
        // .eq("tenant_id", authStore.tenant_id)
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error al cargar contactos:", error.message);
      } else {
        contactos.value = data || [];
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  // Agregar contacto
  const agregarContacto = async (contacto) => {
    if (!verificarRolAdmin(authStore)) return;

    try {
      const { data, error } = await supabase
        .from("DirContactos")
        .insert([{ ...contacto, tenant_id: authStore.tenant_id }])
        .select();

      if (error) {
        console.error("Error al agregar contacto:", error.message);
      } else if (data && data.length > 0) {
        contactos.value.push(data[0]);
      } else {
        console.warn("Contacto agregado, pero sin datos devueltos.");
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  // Eliminar contacto
  const eliminarContacto = async (contactoId) => {
    if (!verificarRolAdmin(authStore)) return;

    try {
      const { error } = await supabase
        .from("DirContactos")
        .delete()
        .eq("id", contactoId)
        .eq("tenant_id", authStore.tenant_id);

      if (error) {
        console.error("Error al eliminar contacto:", error.message);
      } else {
        contactos.value = contactos.value.filter(
          (contacto) => contacto.id !== contactoId
        );
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };

  // Actualizar contacto
  const actualizarContacto = async (contactoActualizado) => {
    if (!verificarRolAdmin(authStore)) return;

    if (!contactoActualizado || !contactoActualizado.id) {
      console.error("Error: contactoActualizado es undefined o no tiene id.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("DirContactos")
        .update(contactoActualizado)
        .eq("id", contactoActualizado.id)
        .eq("tenant_id", authStore.tenant_id);

      if (error) {
        console.error("Error al actualizar contacto:", error.message);
      } else if (data && data.length > 0) {
        const index = contactos.value.findIndex(
          (contacto) => contacto.id === contactoActualizado.id
        );
        if (index !== -1) {
          contactos.value[index] = { ...data[0] };
        }
      } else {
        console.warn("Contacto actualizado, pero sin datos devueltos.");
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  };
  // Observar cambios en tenant_id
  watch(
    () => authStore.tenant_id,
    (newTenantId, oldTenantId) => {
      if (newTenantId && newTenantId !== oldTenantId) {
        cargarContactos();
      }
    },
    { immediate: true }
  );
  return {
    contactos,
    cargarContactos,
    agregarContacto,
    eliminarContacto,
    actualizarContacto,
  };
});
