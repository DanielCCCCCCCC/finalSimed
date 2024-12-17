import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../supabaseClient";

const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3"; // Tenant fijo

export const useEspecialidadMedicaStore = defineStore(
  "especialidadesMedicas",
  () => {
    const especialidades = ref([]);

    async function cargarEspecialidades() {
      const { data, error } = await supabase
        .from("especialidadesMedicas")
        .select("*");
      if (error) {
        console.error("Error al cargar especialidades:", error.message);
      } else {
        especialidades.value = data;
        // console.log("Especialidades cargadas:", especialidades.value);
      }
    }

    const agregarEspecialidad = async (descripcion) => {
      const { data, error } = await supabase
        .from("especialidadesMedicas")
        .insert([{ descripcion, tenant_id: tenantId }]);

      if (error) {
        console.error("Error al agregar especialidad:", error);
      } else if (data && data[0]) {
        especialidades.value.push(data[0]);
      }
    };

    const eliminarEspecialidad = async (id) => {
      const { error } = await supabase
        .from("especialidadesMedicas")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar la especialidad:", error);
      } else {
        especialidades.value = especialidades.value.filter(
          (especialidad) => especialidad.id !== id
        );
      }
    };

    // Función para actualizar una especialidad
    const actualizarEspecialidad = async (id, descripcion) => {
      const { data, error } = await supabase
        .from("especialidadesMedicas")
        .update({ descripcion })
        .eq("id", id);

      if (error) {
        console.error("Error al actualizar la especialidad:", error);
      } else if (data && data[0]) {
        const index = especialidades.value.findIndex((e) => e.id === id);
        if (index !== -1) {
          especialidades.value[index] = data[0];
        }
      }
    };

    return {
      especialidades,
      cargarEspecialidades,
      agregarEspecialidad,
      eliminarEspecialidad,
      actualizarEspecialidad, // Agregamos la función al return
    };
  }
);

// Tienda para Tipos de Estudios
export const useTiposEstudiosStore = defineStore("tiposEstudios", () => {
  const estudios = ref([]);

  const cargarEstudios = async () => {
    const { data, error } = await supabase
      .from("tiposEstudios")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar estudios:", error);
    } else {
      estudios.value = data;
    }
  };

  const agregarEstudio = async (descripcion) => {
    const { data, error } = await supabase
      .from("tiposEstudios")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar estudio:", error);
    } else if (data && data[0]) {
      estudios.value.push(data[0]);
    }
  };

  const eliminarEstudio = async (id) => {
    const { error } = await supabase
      .from("tiposEstudios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar el estudio:", error);
    } else {
      estudios.value = estudios.value.filter((estudio) => estudio.id !== id);
    }
  };

  // Función para actualizar un estudio
  const actualizarEstudio = async (id, descripcion) => {
    const { data, error } = await supabase
      .from("tiposEstudios")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar el estudio:", error);
    } else if (data && data[0]) {
      const index = estudios.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        estudios.value[index] = data[0];
      }
    }
  };

  return {
    estudios,
    cargarEstudios,
    agregarEstudio,
    eliminarEstudio,
    actualizarEstudio, // Agregamos la función al return
  };
});

// Tienda para Tipos de Medicamentos
export const useTiposMedicamentosStore = defineStore(
  "tiposMedicamentos",
  () => {
    const medicamentos = ref([]);

    const cargarMedicamentos = async () => {
      const { data, error } = await supabase
        .from("tiposMedicamentos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar medicamentos:", error);
      } else {
        medicamentos.value = data;
        console.log("Tipos de medicamentos ", medicamentos.value);
      }
    };

    const agregarMedicamento = async (descripcion) => {
      const { data, error } = await supabase
        .from("tiposMedicamentos")
        .insert([{ descripcion, tenant_id: tenantId }]);

      if (error) {
        console.error("Error al agregar medicamento:", error);
      } else if (data && data[0]) {
        medicamentos.value.push(data[0]);
      }
    };

    const eliminarMedicamento = async (id) => {
      const { error } = await supabase
        .from("tiposMedicamentos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar el medicamento:", error);
      } else {
        medicamentos.value = medicamentos.value.filter(
          (medicamento) => medicamento.id !== id
        );
      }
    };

    // Función para actualizar un medicamento
    const actualizarMedicamento = async (id, descripcion) => {
      const { data, error } = await supabase
        .from("tiposMedicamentos")
        .update({ descripcion })
        .eq("id", id);

      if (error) {
        console.error("Error al actualizar el medicamento:", error);
      } else if (data && data[0]) {
        const index = medicamentos.value.findIndex((m) => m.id === id);
        if (index !== -1) {
          medicamentos.value[index] = data[0];
        }
      }
    };

    return {
      medicamentos,
      cargarMedicamentos,
      agregarMedicamento,
      eliminarMedicamento,
      actualizarMedicamento, // Agregamos la función al return
    };
  }
);

// Tienda para Tipos de Pacientes
export const useTiposPacientesStore = defineStore("tiposPacientes", () => {
  const tpacientes = ref([]);

  const cargarPacientes = async () => {
    const { data, error } = await supabase
      .from("tiposPacientes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar pacientes:", error);
    } else {
      tpacientes.value = data;
    }
  };

  const agregarPaciente = async (descripcion) => {
    const { data, error } = await supabase
      .from("tiposPacientes")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar paciente:", error);
    } else if (data && data[0]) {
      tpacientes.value.push(data[0]);
    }
  };

  const eliminarPaciente = async (id) => {
    const { error } = await supabase
      .from("tiposPacientes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar el paciente:", error);
    } else {
      tpacientes.value = tpacientes.value.filter(
        (paciente) => paciente.id !== id
      );
    }
  };

  // Función para actualizar un tipo de paciente
  const actualizarPaciente = async (id, descripcion) => {
    const { data, error } = await supabase
      .from("tiposPacientes")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar el tipo de paciente:", error);
    } else if (data && data[0]) {
      const index = tpacientes.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        tpacientes.value[index] = data[0];
      }
    }
  };

  return {
    tpacientes,
    cargarPacientes,
    agregarPaciente,
    eliminarPaciente,
    actualizarPaciente, // Agregamos la función al return
  };
});

// Tienda para Grupos de Contactos
export const useGruposContactosStore = defineStore("gruposContactos", () => {
  const grupos = ref([]);

  const cargarGrupos = async () => {
    const { data, error } = await supabase
      .from("gruposContactos")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar grupos:", error);
    } else {
      grupos.value = data;
    }
  };

  const agregarGrupo = async (descripcion) => {
    const { data, error } = await supabase
      .from("gruposContactos")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar grupo:", error);
    } else if (data && data[0]) {
      grupos.value.push(data[0]);
    }
  };

  const eliminarGrupo = async (id) => {
    const { error } = await supabase
      .from("gruposContactos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar el grupo:", error);
    } else {
      grupos.value = grupos.value.filter((grupo) => grupo.id !== id);
    }
  };

  // Función para actualizar un grupo de contacto
  const actualizarGrupo = async (id, descripcion) => {
    const { data, error } = await supabase
      .from("gruposContactos")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar el grupo de contacto:", error);
    } else if (data && data[0]) {
      const index = grupos.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        grupos.value[index] = data[0];
      }
    }
  };

  return {
    grupos,
    cargarGrupos,
    agregarGrupo,
    eliminarGrupo,
    actualizarGrupo, // Agregamos la función al return
  };
});
// Tienda para Tipos de Citas
export const useTiposCitasStore = defineStore("tiposCitas", () => {
  const citas = ref([]);

  const cargarCitas = async () => {
    const { data, error } = await supabase
      .from("tiposCitas")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar citas:", error);
    } else {
      citas.value = data;
    }
  };

  const agregarCita = async (descripcion) => {
    const { data, error } = await supabase
      .from("tiposCitas")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar cita:", error);
    } else if (data && data[0]) {
      citas.value.push(data[0]);
    }
  };

  const eliminarCita = async (id) => {
    const { error } = await supabase.from("tiposCitas").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar la cita:", error);
    } else {
      citas.value = citas.value.filter((cita) => cita.id !== id);
    }
  };

  // Función para actualizar un tipo de cita
  const actualizarCita = async (id, descripcion) => {
    const { data, error } = await supabase
      .from("tiposCitas")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar el tipo de cita:", error);
    } else if (data && data[0]) {
      const index = citas.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        citas.value[index] = data[0];
      }
    }
  };

  return {
    citas,
    cargarCitas,
    agregarCita,
    eliminarCita,
    actualizarCita, // Agregamos la función al return
  };
});
