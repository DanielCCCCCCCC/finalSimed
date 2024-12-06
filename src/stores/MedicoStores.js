// MedicoStores.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../supabaseClient"; // Asegúrate de que este archivo esté configurado correctamente

export const useMedicoStore = defineStore("medicoStore", () => {
  const medicos = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3"; // Reemplaza con tu tenant ID

  // Función para cargar médicos desde Supabase
  // Función para cargar médicos desde Supabase
  async function cargarMedicos() {
    try {
      const { data, error } = await supabase
        .from("medicos")
        .select("*")
        .eq("tenant_Id", tenantId); // Filtra por el tenant_Id
      if (error) {
        console.error("Error al cargar médicos:", error.message);
      } else {
        // Convertir especialidadId a número
        medicos.value = data.map((medico) => ({
          ...medico,
          especialidadId: Number(medico.especialidadId),
        }));
        // console.log("Médicos cargados:", this.medicos); // Agregar este log
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  }

  // Función para agregar un médico a la base de datos de Supabase
  async function agregarMedico(medico) {
    try {
      const { data, error } = await supabase
        .from("medicos")
        .insert([{ ...medico, tenant_Id: tenantId }])
        .select(); // Asegúrate de usar .select() para obtener los datos insertados

      if (error) {
        console.error("Error al agregar médico:", error.message);
        return null;
      } else if (data && data.length > 0) {
        // Convertir especialidadId a número
        const nuevoMedico = {
          ...data[0],
          especialidadId: Number(data[0].especialidadId),
        };
        medicos.value.push(nuevoMedico); // Añade el nuevo médico reactivo
        // console.log("Médico agregado:", nuevoMedico);
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

  // Función para eliminar un médico de la base de datos de Supabase
  async function eliminarMedico(id) {
    try {
      const { error } = await supabase
        .from("medicos")
        .delete()
        .eq("id", id)
        .eq("tenant_Id", tenantId); // Asegura que solo eliminas del tenant actual

      if (error) {
        console.error("Error al eliminar médico:", error.message);
        return false;
      } else {
        medicos.value = medicos.value.filter((medico) => medico.id !== id); // Elimina el médico reactivo
        // console.log("Médico eliminado:", id);
        return true;
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
      return false;
    }
  }

  // Función para actualizar un médico en la base de datos de Supabase
  async function actualizarMedico(medico) {
    if (!medico.id) {
      console.error("Error: el ID del médico es indefinido.");
      return false;
    }
    try {
      const { data, error } = await supabase
        .from("medicos")
        .update({
          nombre: medico.nombre,
          direccion: medico.direccion,
          especialidadId: medico.especialidadId, // Ya es un número
          telefonoCasa: medico.telefonoCasa,
          telefonoPersonal: medico.telefonoPersonal,
          email: medico.email,
        })
        .eq("id", medico.id)
        .eq("tenant_Id", tenantId)
        .select(); // Añade .select() para devolver los datos actualizados

      if (error) {
        console.error("Error al actualizar médico:", error.message);
        return false;
      } else if (data && data.length > 0) {
        // Convertir especialidadId a número
        const medicoActualizado = {
          ...data[0],
          especialidadId: Number(data[0].especialidadId),
        };

        // Actualiza el médico en la lista localmente
        const index = medicos.value.findIndex((item) => item.id === medico.id);
        if (index !== -1) {
          medicos.value[index] = medicoActualizado;
        }

        // console.log("Médico actualizado:", medicoActualizado);
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

  // Llamar a cargarMedicos al montar la store
  cargarMedicos();

  return {
    medicos,
    agregarMedico,
    cargarMedicos,
    eliminarMedico,
    actualizarMedico,
  };
});
