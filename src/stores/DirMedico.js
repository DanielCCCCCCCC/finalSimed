import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { supabase } from "../supabaseClient"; // Asegúrate de que este archivo esté configurado correctamente
import { useAuthStore } from "./auth";

export const useMedicoStore = defineStore("medicoStore", () => {
  const medicos = ref([]);
  const authStore = useAuthStore();

  // Cargar médicos desde la base de datos
  async function cargarMedicos() {
    try {
      const { data, error } = await supabase.from("DirMedico").select("*");
      if (error) {
        console.error("Error al cargar médicos:", error.message);
      } else {
        // Convertir EspecialidadId a número
        medicos.value = data.map((medico) => ({
          ...medico,
          EspecialidadId: Number(medico.EspecialidadId), // PascalCase
        }));
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  }

  // Agregar un médico a la base de datos
  async function agregarMedico(medico) {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para agregar un médico.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("DirMedico")
        .insert([
          {
            ...medico,
            tenant_id: authStore.tenant_id,
            EspecialidadId: medico.EspecialidadId, // PascalCase
          },
        ])
        .select();

      if (error) {
        console.error("Error al agregar médico:", error.message);
        return null;
      } else if (data && data.length > 0) {
        // Convertir EspecialidadId a número
        const nuevoMedico = {
          ...data[0],
          EspecialidadId: Number(data[0].EspecialidadId),
        };
        medicos.value.push(nuevoMedico);
        return nuevoMedico;
      } else {
        console.warn("Médico agregado, pero sin datos devueltos.");
        return null;
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
      return null;
    }
  }

  // Eliminar un médico de la base de datos
  async function eliminarMedico(MedicoId) {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para eliminar un médico.");
      return;
    }
    try {
      const { error } = await supabase
        .from("DirMedico")
        .delete()
        .eq("MedicoId", MedicoId)
        .eq("tenant_id", authStore.tenant_id);

      if (error) {
        console.error("Error al eliminar médico:", error.message);
        return false;
      } else {
        medicos.value = medicos.value.filter(
          (medico) => medico.MedicoId !== MedicoId
        );
        return true;
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
      return false;
    }
  }

  // Actualizar un médico en la base de datos
  async function actualizarMedico(medico) {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para actualizar un médico.");
      return;
    }
    if (!medico.MedicoId) {
      console.error("Error: el ID del médico es indefinido.");
      return false;
    }
    try {
      const { data, error } = await supabase
        .from("DirMedico")
        .update({
          nombre: medico.nombre,
          direccion: medico.direccion,
          EspecialidadId: medico.EspecialidadId, // PascalCase
          telefonoCasa: medico.telefonoCasa,
          telefonoPersonal: medico.telefonoPersonal,
          email: medico.email,
        })
        .eq("MedicoId", medico.MedicoId)
        .eq("tenant_id", authStore.tenant_id)
        .select();

      if (error) {
        console.error("Error al actualizar médico:", error.message);
        return false;
      } else if (data && data.length > 0) {
        const medicoActualizado = {
          ...data[0],
          EspecialidadId: Number(data[0].EspecialidadId),
        };

        // Actualizar en el estado reactivo
        const index = medicos.value.findIndex(
          (item) => item.MedicoId === medico.MedicoId
        );
        if (index !== -1) {
          medicos.value[index] = medicoActualizado;
        }

        return true;
      } else {
        console.warn("Médico actualizado, pero sin datos devueltos.");
        return false;
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
      return false;
    }
  }

  // Cargar médicos automáticamente al detectar cambios en tenant_id
  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarMedicos();
      }
    },
    { immediate: true }
  );

  return {
    medicos,
    agregarMedico,
    cargarMedicos,
    eliminarMedico,
    actualizarMedico,
  };
});
