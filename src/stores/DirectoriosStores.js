// src/stores/ConfiMedicasStores.js
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";

// -----------------------------------------------------------------------------
// Tienda para Hospitales
// -----------------------------------------------------------------------------
export const useHospitalStore = defineStore("hospitalStore", () => {
  const hospitales = ref([]);
  const hospitalSeleccionado = ref(null);
  const authStore = useAuthStore();

  const setHospitalSeleccionado = (hospital) => {
    hospitalSeleccionado.value = { ...hospital };
  };

  const cargarHospitales = async () => {
    if (!authStore.tenant_id) return;

    const { data, error } = await supabase
      .from("hospitales")
      .select("*")
      .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar hospitales:", error);
    } else if (data) {
      hospitales.value = data;
    }
  };

  const agregarHospital = async (hospitalInfo) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para agregar hospitales.");
      return;
    }

    const hospitalConTenant = {
      ...hospitalInfo,
      tenant_id: authStore.tenant_id,
    };

    const { data, error } = await supabase
      .from("hospitales")
      .insert([hospitalConTenant], { returning: "representation" });

    if (error) {
      console.error("Error al agregar un hospital:", error);
    } else if (data && data.length > 0) {
      hospitales.value.push(data[0]);
    }
  };

  const eliminarHospital = async (id) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return false;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para eliminar hospitales.");
      return false;
    }

    try {
      const { error } = await supabase.from("hospitales").delete().eq("id", id);

      if (error) {
        console.error("Error al eliminar hospital:", error);
        return false;
      } else {
        hospitales.value = hospitales.value.filter((h) => h.id !== id);
        return true;
      }
    } catch (err) {
      console.error("Error en eliminarHospital:", err.message);
      return false;
    }
  };

  const actualizarHospital = async (hospitalInfo) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para actualizar hospitales.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("hospitales")
        .update(hospitalInfo)
        .eq("id", hospitalInfo.id);
      if (error) {
        console.error("Error al actualizar hospital:", error);
        throw error;
      } else if (data && data[0]) {
        const index = hospitales.value.findIndex(
          (h) => h.id === hospitalInfo.id
        );
        if (index !== -1) {
          hospitales.value[index] = { ...data[0] };
        }
        hospitalSeleccionado.value = null;
      }
    } catch (err) {
      console.error("Error en actualizarHospital:", err.message);
      throw err;
    }
  };

  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarHospitales();
      }
    },
    { immediate: true }
  );

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

// -----------------------------------------------------------------------------
// Tienda para Medicamentos
// -----------------------------------------------------------------------------
export const useMedicamentoStore = defineStore("medicamentoStore", () => {
  const medicamentos = ref([]);
  const medicamentoSeleccionado = ref(null);
  const authStore = useAuthStore();

  const cargarMedicamentos = async () => {
    if (!authStore.tenant_id) return;
    try {
      const { data, error } = await supabase
        .from("medicamentos")
        .select("*")
        .eq("tenant_id", authStore.tenant_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar medicamentos:", error);
      } else {
        medicamentos.value = data || [];
      }
    } catch (err) {
      console.error("Error en cargarMedicamentos:", err.message);
    }
  };

  const agregarMedicamento = async (medicamento) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para agregar medicamentos.");
      return;
    }

    // Verifica si el medicamento ya existe
    if (medicamentos.value.some((m) => m.codigo === medicamento.codigo)) {
      console.warn("Este medicamento ya existe.");
      return;
    }

    const { data, error } = await supabase
      .from("medicamentos")
      .insert([{ ...medicamento, tenant_id: authStore.tenant_id }])
      .select();

    if (error) {
      console.error("Error al agregar medicamento:", error);
      return;
    }

    if (data && data.length > 0) {
      medicamentos.value.push(data[0]);
    } else {
      console.warn("No se devolvieron datos después de la inserción.");
    }
  };

  const eliminarMedicamento = async (id) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para eliminar medicamentos.");
      return;
    }

    const { error } = await supabase.from("medicamentos").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar medicamento:", error);
    } else {
      medicamentos.value = medicamentos.value.filter((m) => m.id !== id);
    }
  };

  const actualizarMedicamento = async (medicamento) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para actualizar medicamentos."
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("medicamentos")
        .update(medicamento)
        .eq("id", medicamento.id);
      if (error) {
        console.error("Error al actualizar medicamento:", error);
      } else if (data && data[0]) {
        const index = medicamentos.value.findIndex(
          (m) => m.id === medicamento.id
        );
        if (index !== -1) {
          medicamentos.value[index] = { ...data[0] };
        }
      }
    } catch (err) {
      console.error("Error en actualizarMedicamento:", err.message);
    }
  };

  const setMedicamentoSeleccionado = (medicamento) => {
    medicamentoSeleccionado.value = { ...medicamento };
  };
  // Cargar medicamentos cuando haya tenant_id
  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarMedicamentos();
      }
    },
    { immediate: true }
  );

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

// -----------------------------------------------------------------------------
// Tienda para Estudios
// -----------------------------------------------------------------------------
export const useEstudioStore = defineStore("examenesEstudios", () => {
  const estudios = ref([]);
  const authStore = useAuthStore();

  const cargarEstudios = async () => {
    if (!authStore.tenant_id) return;
    try {
      const { data, error } = await supabase
        .from("examenesEstudios")
        .select("*")
        .eq("tenant_id", authStore.tenant_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar estudios:", error);
      } else {
        estudios.value = data || [];
      }
    } catch (err) {
      console.error("Error en cargarEstudios:", err.message);
    }
  };

  const agregarEstudio = async (estudioInfo) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para agregar estudios.");
      return;
    }

    const { data, error } = await supabase.from("examenesEstudios").insert([
      {
        ...estudioInfo,
        tenant_id: authStore.tenant_id,
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
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para eliminar estudios.");
      return;
    }

    const { error } = await supabase
      .from("examenesEstudios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar el estudio:", error);
    } else {
      estudios.value = estudios.value.filter((e) => e.id !== id);
    }
  };

  const actualizarEstudio = async (estudioInfo) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para actualizar estudios.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("examenesEstudios")
        .update({
          ...estudioInfo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", estudioInfo.id);

      if (error) {
        console.error("Error al actualizar estudio:", error);
        return;
      }

      if (data && data.length > 0) {
        const index = estudios.value.findIndex((e) => e.id === estudioInfo.id);
        if (index !== -1) {
          estudios.value[index] = { ...data[0] };
        }
      }
    } catch (err) {
      console.error("Error en actualizarEstudio:", err.message);
    }
  };
  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarEstudios();
      }
    },
    { immediate: true }
  );
  return {
    estudios,
    cargarEstudios,
    agregarEstudio,
    eliminarEstudio,
    actualizarEstudio,
  };
});
