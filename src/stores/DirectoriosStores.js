// src/stores/ConfiMedicasStores.js
import { defineStore } from "pinia";
import { ref, reactive, watch, onMounted } from "vue";
import { supabase } from "../supabaseClient";
import { Notify } from "quasar";

// Helper para cargar y guardar en localStorage
function loadFromLocalStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

//

// Tienda para Hospitales

// DirectoriosStores.js

export const useHospitalStore = defineStore("hospitalStore", () => {
  const hospitales = ref([]);
  const hospitalSeleccionado = ref(null); // Para manejar el hospital que se está editando

  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3"; // Asegúrate de que este es el valor correcto

  const setHospitalSeleccionado = (hospital) => {
    hospitalSeleccionado.value = { ...hospital }; // Clonamos el objeto para evitar mutaciones no deseadas
    // console.log("Hospital Seleccionado:", hospitalSeleccionado.value);
  };

  const cargarHospitales = async () => {
    try {
      const { data, error } = await supabase
        .from("hospitales")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar hospitales:", error);
      } else {
        hospitales.value = data || [];
      }
      // console.log("Datos de hospitales cargados:", hospitales.value);
    } catch (err) {
      console.error("Error en cargarHospitales:", err.message);
    }
  };

  const agregarHospital = async (hospitalInfo) => {
    const hospitalConTenant = { ...hospitalInfo, tenant_Id: tenantId }; // Asegúrate de usar 'tenant_id' en minúsculas

    // console.log("Hospital Con Tenant:", hospitalConTenant); // Para depuración

    try {
      const { data, error } = await supabase
        .from("hospitales")
        .insert([hospitalConTenant], { returning: "representation" });

      if (error) {
        console.error("Error al agregar hospital:", error);
        throw error; // Propagar el error para manejarlo en el componente
      } else if (data && data[0]) {
        hospitales.value.push(data[0]);
      }
    } catch (err) {
      console.error("Error en agregarHospital:", err.message);
      throw err; // Propagar el error
    }
  };
  const eliminarHospital = async (id) => {
    try {
      const { data, error } = await supabase
        .from("hospitales")
        .delete()
        .eq("id", id);
      console.log("Supabase Response:", { data, error });

      if (error) {
        console.error("Error al eliminar hospital:", error);
        return false; // Retorna false si hay un error
      } else {
        // Filtra el hospital eliminado de la lista local
        hospitales.value = hospitales.value.filter((h) => h.id !== id);
        return true; // Retorna true si la eliminación fue exitosa
      }
    } catch (err) {
      console.error("Error en eliminarHospital:", err.message);
      return false; // Captura cualquier error inesperado
    }
  };

  const actualizarHospital = async (hospitalInfo) => {
    // console.log("Datos enviados para actualizar:", hospitalInfo);
    try {
      const { data, error } = await supabase
        .from("hospitales")
        .update(hospitalInfo)
        .eq("id", hospitalInfo.id);
      if (error) {
        console.error("Error al actualizar hospital:", error);
        throw error; // Propagar el error
      } else if (data && data[0]) {
        const index = hospitales.value.findIndex(
          (h) => h.id === hospitalInfo.id
        );
        if (index !== -1) {
          hospitales.value[index] = { ...hospitalInfo };
        }
        hospitalSeleccionado.value = null;
      }
    } catch (err) {
      console.error("Error en actualizarHospital:", err.message);
      throw err; // Propagar el error
    }
  };

  return {
    hospitales,
    hospitalSeleccionado,
    setHospitalSeleccionado,
    cargarHospitales,
    agregarHospital,
    eliminarHospital,
    actualizarHospital,
  };
});

///Tienda para Medicamentos
export const useMedicamentoStore = defineStore("medicamentoStore", () => {
  const medicamentos = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";
  const medicamentoSeleccionado = ref(null); // Estado para el medicamento seleccionado

  const cargarMedicamentos = async () => {
    try {
      const { data, error } = await supabase

        .from("medicamentos")
        .select("*")

        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error al cargar medicamentos:", error);
      } else {
        medicamentos.value = data || []; // Asigna el array completo a `hospitales.value`
      }
      // console.log("Medicamentos:", medicamentos.value); // Para depurar
    } catch (err) {
      console.error("Error en cargarmMdicamentos:", err.message);
    }
  };

  const agregarMedicamento = async (medicamento) => {
    // Verifica si el medicamento ya existe
    if (!medicamentos.value.some((m) => m.codigo === medicamento.codigo)) {
      const { data, error } = await supabase
        .from("medicamentos")
        .insert([{ ...medicamento, tenant_Id: tenantId }])
        .select(); // Asegura que siempre intente devolver los datos insertados

      if (error) {
        console.error("Error al agregar medicamento:", error);
        return;
      }

      if (data && data.length > 0) {
        medicamentos.value.push(data[0]);
      } else {
        console.warn("No se devolvieron datos después de la inserción.");
      }
    } else {
      console.warn("Este medicamento ya existe.");
    }
  };

  const eliminarMedicamento = async (id) => {
    const { error } = await supabase.from("medicamentos").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar medicamento:", error);
    } else {
      medicamentos.value = medicamentos.value.filter((m) => m.id !== id);
    }
  };
  const actualizarMedicamento = async (medicamento) => {
    try {
      const { data, error } = await supabase
        .from("medicamentos")
        .update(medicamento)
        .eq("id", medicamento.id);
      if (error) {
        console.error("Error al actualizar medicamento:", error);
      } else if (data) {
        // Actualiza el estado local
        const index = medicamentos.value.findIndex(
          (m) => m.id === medicamento.id
        );
        if (index !== -1) {
          medicamentos.value[index] = { ...medicamento };
        }
      }
    } catch (err) {
      console.error("Error en actualizarMedicamento:", err.message);
    }
  };

  const setMedicamentoSeleccionado = (medicamento) => {
    medicamentoSeleccionado.value = { ...medicamento }; // Clona el medicamento
  };

  return {
    medicamentos,
    medicamentoSeleccionado,
    cargarMedicamentos,
    agregarMedicamento,
    eliminarMedicamento,
    actualizarMedicamento,
    setMedicamentoSeleccionado,
  };
});

///
///
///
///
//
///
// Tienda para Estudios
export const useEstudioStore = defineStore("examenesEstudios", () => {
  const estudios = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarEstudios = async () => {
    try {
      const { data, error } = await supabase

        .from("examenesEstudios")
        .select("*")

        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar hospitales:", error);
      } else {
        estudios.value = data || []; // Asigna el array completo a `hospitales.value`
      }
      // console.log("Medicamentos:", estudios.value); // Para depurar
    } catch (err) {
      console.error("Error en cargarmMdicamentos:", err.message);
    }
  };

  const agregarEstudio = async (estudioInfo) => {
    const { data, error } = await supabase.from("examenesEstudios").insert([
      {
        ...estudioInfo,
        tenant_id: tenantId,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error al agregar estudio:", error);
    } else if (data && data.length > 0) {
      estudios.value.push(data[0]);
    }
  };

  const eliminarEstudio = async (id) => {
    const { error } = await supabase
      .from("examenesEstudios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar la cita:", error);
    } else {
      estudios.value = estudios.value.filter((estudios) => estudios.id !== id);
    }
    onMounted(cargarEstudios);
  };
  const actualizarEstudio = async (estudioInfo) => {
    try {
      const { data, error } = await supabase
        .from("examenesEstudios")
        .update({
          ...estudioInfo,
          updated_at: new Date().toISOString(), // Actualizamos la fecha de modificación
        })
        .eq("id", estudioInfo.id);

      if (error) {
        console.error("Error al actualizar estudio:", error);
        return;
      }

      if (data && data.length > 0) {
        // Actualiza el array local con los datos modificados
        const index = estudios.value.findIndex((e) => e.id === estudioInfo.id);
        if (index !== -1) {
          estudios.value[index] = { ...data[0] };
        }
      }

      // console.log("Estudio actualizado:", data);
    } catch (err) {
      console.error("Error en actualizarEstudio:", err.message);
    }
  };
  return {
    estudios,
    cargarEstudios,
    agregarEstudio,
    eliminarEstudio,
    actualizarEstudio,
  };
});
