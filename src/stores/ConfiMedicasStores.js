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

// Tienda para Especialidades Médicas
export const useEspecialidadMedicaStore = defineStore(
  "especialidadesMedicas",
  () => {
    const authStore = useAuthStore();
    const especialidades = ref([]);

    async function cargarEspecialidades() {
      try {
        const { data, error } = await supabase
          .from("especialidadesMedicas")
          .select("*")
          // .eq("tenant_id", authStore.tenant_id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        especialidades.value = data;
      } catch (error) {
        console.error("Error al cargar especialidades:", error.message);
      }
    }

    async function agregarEspecialidad(descripcion) {
      if (!verificarRolAdmin(authStore)) return;
      try {
        const { data, error } = await supabase
          .from("especialidadesMedicas")
          .insert([{ descripcion, tenant_id: authStore.tenant_id }]);
        if (error) throw error;
        if (data && data[0]) especialidades.value.push(data[0]);
      } catch (error) {
        console.error("Error al agregar especialidad:", error.message);
      }
    }

    async function eliminarEspecialidad(id) {
      if (!verificarRolAdmin(authStore)) return;
      try {
        const { error } = await supabase
          .from("especialidadesMedicas")
          .delete()
          .eq("id", id);
        if (error) throw error;
        especialidades.value = especialidades.value.filter(
          (especialidad) => especialidad.id !== id
        );
      } catch (error) {
        console.error("Error al eliminar especialidad:", error.message);
      }
    }

    async function actualizarEspecialidad(id, descripcion) {
      if (!verificarRolAdmin(authStore)) return;
      try {
        const { data, error } = await supabase
          .from("especialidadesMedicas")
          .update({ descripcion })
          .eq("id", id);
        if (error) throw error;
        const index = especialidades.value.findIndex((e) => e.id === id);
        if (index !== -1 && data && data[0]) {
          especialidades.value[index] = data[0];
        }
      } catch (error) {
        console.error("Error al actualizar especialidad:", error.message);
      }
    }
    watch(
      () => authStore.tenant_id,
      (newTenantId, oldTenantId) => {
        if (newTenantId && newTenantId !== oldTenantId) {
          cargarEspecialidades();
        }
      },
      { immediate: true }
    );

    return {
      especialidades,
      cargarEspecialidades,
      agregarEspecialidad,
      eliminarEspecialidad,
      actualizarEspecialidad,
    };
  }
);

// Tienda para Tipos de Estudios
export const useTiposEstudiosStore = defineStore("tiposEstudios", () => {
  const estudios = ref([]);
  const authStore = useAuthStore();

  async function cargarEstudios() {
    try {
      const { data, error } = await supabase
        .from("tiposEstudios")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      estudios.value = data;
    } catch (error) {
      console.error("Error al cargar estudios:", error.message);
    }
  }

  async function agregarEstudio(descripcion) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("tiposEstudios")
        .insert([{ descripcion, tenant_id: authStore.tenant_id }]);
      if (error) throw error;
      if (data && data[0]) estudios.value.push(data[0]);
    } catch (error) {
      console.error("Error al agregar estudio:", error.message);
    }
  }

  async function eliminarEstudio(id) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { error } = await supabase
        .from("tiposEstudios")
        .delete()
        .eq("id", id);
      if (error) throw error;
      estudios.value = estudios.value.filter((estudio) => estudio.id !== id);
    } catch (error) {
      console.error("Error al eliminar estudio:", error.message);
    }
  }

  async function actualizarEstudio(id, descripcion) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("tiposEstudios")
        .update({ descripcion })
        .eq("id", id);
      if (error) throw error;
      const index = estudios.value.findIndex((e) => e.id === id);
      if (index !== -1 && data && data[0]) {
        estudios.value[index] = data[0];
      }
    } catch (error) {
      console.error("Error al actualizar estudio:", error.message);
    }
  }

  watch(
    () => authStore.tenant_id,
    (newTenantId, oldTenantId) => {
      if (newTenantId && newTenantId !== oldTenantId) {
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

// Tienda para Tipos de Medicamentos
export const useTiposMedicamentosStore = defineStore(
  "tiposMedicamentos",
  () => {
    const medicamentos = ref([]);
    const authStore = useAuthStore();

    async function cargarMedicamentos() {
      try {
        const { data, error } = await supabase
          .from("tiposMedicamentos")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        medicamentos.value = data;
      } catch (error) {
        console.error("Error al cargar medicamentos:", error.message);
      }
    }

    async function agregarMedicamento(descripcion) {
      if (!verificarRolAdmin(authStore)) return;
      try {
        const { data, error } = await supabase
          .from("tiposMedicamentos")
          .insert([{ descripcion, tenant_id: authStore.tenant_id }]);
        if (error) throw error;
        if (data && data[0]) medicamentos.value.push(data[0]);
      } catch (error) {
        console.error("Error al agregar medicamento:", error.message);
      }
    }

    async function eliminarMedicamento(id) {
      if (!verificarRolAdmin(authStore)) return;
      try {
        const { error } = await supabase
          .from("tiposMedicamentos")
          .delete()
          .eq("id", id);
        if (error) throw error;
        medicamentos.value = medicamentos.value.filter(
          (medicamento) => medicamento.id !== id
        );
      } catch (error) {
        console.error("Error al eliminar medicamento:", error.message);
      }
    }

    async function actualizarMedicamento(id, descripcion) {
      if (!verificarRolAdmin(authStore)) return;
      try {
        const { data, error } = await supabase
          .from("tiposMedicamentos")
          .update({ descripcion })
          .eq("id", id);
        if (error) throw error;
        const index = medicamentos.value.findIndex((m) => m.id === id);
        if (index !== -1 && data && data[0]) {
          medicamentos.value[index] = data[0];
        }
      } catch (error) {
        console.error("Error al actualizar medicamento:", error.message);
      }
    }
    watch(
      () => authStore.tenant_id,
      (newTenantId, oldTenantId) => {
        if (newTenantId && newTenantId !== oldTenantId) {
          cargarMedicamentos();
        }
      },
      { immediate: true }
    );

    return {
      medicamentos,
      cargarMedicamentos,
      agregarMedicamento,
      eliminarMedicamento,
      actualizarMedicamento,
    };
  }
);

// Tienda para Tipos de Pacientes

export const useTiposPacientesStore = defineStore("tiposPacientes", () => {
  const tpacientes = ref([]); // Inicialización de la referencia reactiva
  const authStore = useAuthStore();

  const cargarPacientes = async () => {
    if (!authStore.tenant_id) return;
    try {
      const { data, error } = await supabase
        .from("tiposPacientes")
        .select("*")
        // .eq("tenant_id", authStore.tenant_id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      tpacientes.value = data || [];
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    }
  };

  const agregarPaciente = async (descripcion) => {
    if (!authStore.tenant_id) return;
    try {
      const { data, error } = await supabase
        .from("tiposPacientes")
        .insert([{ descripcion, tenant_id: authStore.tenant_id }]);

      if (error) throw error;
      if (data) tpacientes.value.push(data[0]);
    } catch (err) {
      console.error("Error al agregar paciente:", err);
    }
  };

  const eliminarPaciente = async (id) => {
    if (!authStore.tenant_id) return;
    try {
      const { error } = await supabase
        .from("tiposPacientes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      tpacientes.value = tpacientes.value.filter((p) => p.id !== id);
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
    }
  };

  const actualizarPaciente = async (id, descripcion) => {
    if (!authStore.tenant_id) return;
    try {
      const { data, error } = await supabase
        .from("tiposPacientes")
        .update({ descripcion })
        .eq("id", id);

      if (error) throw error;
      const index = tpacientes.value.findIndex((p) => p.id === id);
      if (index !== -1 && data) {
        tpacientes.value[index] = { ...tpacientes.value[index], ...data[0] };
      }
    } catch (err) {
      console.error("Error al actualizar paciente:", err);
    }
  };

  return {
    tpacientes,
    cargarPacientes,
    agregarPaciente,
    eliminarPaciente,
    actualizarPaciente,
  };
});

// Tienda para Grupos de Contactos
export const useGruposContactosStore = defineStore("gruposContactos", () => {
  const grupos = ref([]);
  const authStore = useAuthStore();

  async function cargarGrupos() {
    try {
      const { data, error } = await supabase
        .from("gruposContactos")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      grupos.value = data;
    } catch (error) {
      console.error("Error al cargar grupos:", error.message);
    }
  }

  async function agregarGrupo(descripcion) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("gruposContactos")
        .insert([{ descripcion, tenant_id: authStore.tenant_id }]);
      if (error) throw error;
      if (data && data[0]) grupos.value.push(data[0]);
    } catch (error) {
      console.error("Error al agregar grupo:", error.message);
    }
  }

  async function eliminarGrupo(id) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { error } = await supabase
        .from("gruposContactos")
        .delete()
        .eq("id", id);
      if (error) throw error;
      grupos.value = grupos.value.filter((grupo) => grupo.id !== id);
    } catch (error) {
      console.error("Error al eliminar grupo:", error.message);
    }
  }

  async function actualizarGrupo(id, descripcion) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("gruposContactos")
        .update({ descripcion })
        .eq("id", id);
      if (error) throw error;
      const index = grupos.value.findIndex((g) => g.id === id);
      if (index !== -1 && data && data[0]) {
        grupos.value[index] = data[0];
      }
    } catch (error) {
      console.error("Error al actualizar grupo:", error.message);
    }
  }
  watch(
    () => authStore.tenant_id,
    (newTenantId, oldTenantId) => {
      if (newTenantId && newTenantId !== oldTenantId) {
        cargarGrupos();
      }
    },
    { immediate: true }
  );

  return {
    grupos,
    cargarGrupos,
    agregarGrupo,
    eliminarGrupo,
    actualizarGrupo,
  };
});

// Tienda para Tipos de Citas
export const useTiposCitasStore = defineStore("tiposCitas", () => {
  const citas = ref([]);
  const authStore = useAuthStore();

  async function cargarCitas() {
    try {
      const { data, error } = await supabase
        .from("tiposCitas")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      citas.value = data;
    } catch (error) {
      console.error("Error al cargar citas:", error.message);
    }
  }

  async function agregarCita(descripcion) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("tiposCitas")
        .insert([{ descripcion, tenant_id: authStore.tenant_id }]);
      if (error) throw error;
      if (data && data[0]) citas.value.push(data[0]);
    } catch (error) {
      console.error("Error al agregar cita:", error.message);
    }
  }

  async function eliminarCita(id) {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { error } = await supabase.from("tiposCitas").delete().eq("id", id);
      if (error) throw error;
      citas.value = citas.value.filter((cita) => cita.id !== id);
    } catch (error) {
      console.error("Error al eliminar cita:", error.message);
    }
  }

  // Función para actualizar un tipo de cita
  const actualizarCita = async (id, descripcion) => {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("tiposCitas")
        .update({ descripcion })
        .eq("id", id);

      if (error) throw error;
      const index = citas.value.findIndex((c) => c.id === id);
      if (index !== -1 && data && data[0]) {
        citas.value[index] = data[0];
      }
    } catch (error) {
      console.error("Error al actualizar grupo:", error.message);
    }
  };

  watch(
    () => authStore.tenant_id,
    (newTenantId, oldTenantId) => {
      if (newTenantId && newTenantId !== oldTenantId) {
        cargarCitas();
      }
    },
    { immediate: true }
  );

  return {
    citas,
    cargarCitas,
    agregarCita,
    eliminarCita,
    actualizarCita, // Agregamos la función al return
  };
});
