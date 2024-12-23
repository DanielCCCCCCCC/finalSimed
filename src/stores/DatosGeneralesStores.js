// DatosGeneralesStores.js
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

//------------------------------------------
// Tienda para Departamentos
//------------------------------------------
export const useDepartamentoStore = defineStore("departamentos", () => {
  const departamentos = ref([]);
  const authStore = useAuthStore();

  const cargarDepartamentos = async () => {
    if (!authStore.tenant_id) return;
    const { data, error } = await supabase
      .from("departamentos")
      .select("*")
      // .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar departamentos:", error);
    } else {
      departamentos.value = data;
    }
  };

  const agregarDepartamento = async (descripcion) => {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("departamentos")
        .insert([{ descripcion, tenant_id: authStore.tenant_id }])
        .select(); // Para retornar el registro insertado

      if (error) throw error;
      if (data && data[0]) departamentos.value.push(data[0]);
    } catch (error) {
      console.error("Error al agregar departamento:", error);
    }
  };

  const eliminarDepartamento = async (id) => {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { error } = await supabase
        .from("departamentos")
        .delete()
        .eq("id", id)
        .eq("tenant_id", authStore.tenant_id); // Aseguramos el tenant

      if (error) throw error;
      departamentos.value = departamentos.value.filter(
        (depto) => depto.id !== id
      );
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
    }
  };

  const actualizarDepartamento = async (id, descripcion) => {
    if (!verificarRolAdmin(authStore)) return;
    try {
      const { data, error } = await supabase
        .from("departamentos")
        .update({ descripcion })
        .eq("id", id)
        .eq("tenant_id", authStore.tenant_id)
        .select(); // Para retornar el registro actualizado

      if (error) throw error;
      const index = departamentos.value.findIndex((depto) => depto.id === id);
      if (index !== -1 && data && data[0]) {
        departamentos.value[index] = data[0];
      }
    } catch (error) {
      console.error("Error al actualizar departamento:", error);
    }
  };

  watch(
    () => authStore.tenant_id,
    (newTenantId, oldTenantId) => {
      if (newTenantId && newTenantId !== oldTenantId) {
        cargarDepartamentos();
      }
    },
    { immediate: true }
  );

  return {
    departamentos,
    cargarDepartamentos,
    agregarDepartamento,
    eliminarDepartamento,
    actualizarDepartamento,
  };
});

//------------------------------------------
// Tienda para Municipios
//------------------------------------------
export const useMunicipioStore = defineStore("municipios", () => {
  const municipios = ref([]);
  const authStore = useAuthStore();

  const cargarMunicipios = async () => {
    if (!authStore.tenant_id) return;
    const { data, error } = await supabase
      .from("municipios")
      .select("*")
      // .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar municipios:", error);
    } else {
      municipios.value = data;
    }
  };

  const agregarMunicipio = async (descripcion, departamentoId) => {
    if (!verificarRolAdmin(authStore)) return;
    const { data, error } = await supabase.from("municipios").insert([
      {
        descripcion,
        departamentoId,
        tenant_id: authStore.tenant_id,
      },
    ]);

    if (error) {
      console.error("Error al agregar municipio:", error);
      throw error;
    } else if (data && data[0]) {
      municipios.value.push(data[0]);
    }
  };

  const eliminarMunicipio = async (id) => {
    if (!verificarRolAdmin(authStore)) return;
    const { error } = await supabase.from("municipios").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar municipio:", error);
    } else {
      municipios.value = municipios.value.filter((muni) => muni.id !== id);
    }
  };

  const actualizarMunicipio = async (id, descripcion, departamentoId) => {
    if (!verificarRolAdmin(authStore)) return;
    const { data, error } = await supabase
      .from("municipios")
      .update({ descripcion, departamentoId })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar municipio:", error);
    } else if (data && data[0]) {
      const index = municipios.value.findIndex((muni) => muni.id === id);
      if (index !== -1) {
        municipios.value[index] = data[0];
      }
    }
  };

  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarMunicipios();
      }
    },
    { immediate: true }
  );

  return {
    municipios,
    cargarMunicipios,
    agregarMunicipio,
    eliminarMunicipio,
    actualizarMunicipio,
  };
});

//------------------------------------------
// Tienda para Grupo Sanguíneo
//------------------------------------------
export const useGrupoSanguineoStore = defineStore("grupoSanguineo", () => {
  const gruposSanguineos = ref([]);
  const authStore = useAuthStore();

  const cargarGruposSanguineos = async () => {
    const { data, error } = await supabase
      .from("grupoSanguineo")
      .select("*")
      // .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar los grupos sanguíneos:", error);
    } else {
      gruposSanguineos.value = data;
    }
  };

  const agregarGrupoSanguineo = async (descripcion) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para agregar grupos sanguineos."
      );
      return;
    }

    const { data, error } = await supabase
      .from("grupoSanguineo")
      .insert([{ descripcion, tenant_id: authStore.tenant_id }]);

    if (error) {
      console.error("Error al agregar grupo sanguíneo:", error);
    } else if (data && data[0]) {
      gruposSanguineos.value.push(data[0]);
    }
  };

  const eliminarGrupoSanguineo = async (id) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para eliminar grupos sanguineos."
      );
      return;
    }
    const { error } = await supabase
      .from("grupoSanguineo")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error al eliminar grupo sanguíneo:", error);
    } else {
      gruposSanguineos.value = gruposSanguineos.value.filter(
        (grupo) => grupo.id !== id
      );
    }
  };

  const actualizarGrupoSanguineo = async (id, descripcion) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para actualizar grupos sanguineos."
      );
      return;
    }
    const { data, error } = await supabase
      .from("grupoSanguineo")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar grupo sanguíneo:", error);
    } else if (data && data[0]) {
      const index = gruposSanguineos.value.findIndex(
        (grupo) => grupo.id === id
      );
      if (index !== -1) {
        gruposSanguineos.value[index] = data[0];
      }
    }
  };

  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarGruposSanguineos();
      }
    },
    { immediate: true }
  );

  return {
    gruposSanguineos,
    cargarGruposSanguineos,
    agregarGrupoSanguineo,
    eliminarGrupoSanguineo,
    actualizarGrupoSanguineo,
  };
});

//------------------------------------------
// Tienda para Escolaridad
//------------------------------------------
export const useEscolaridadStore = defineStore("escolaridad", () => {
  const escolaridades = ref([]);
  const authStore = useAuthStore();

  const cargarEscolaridades = async () => {
    const { data, error } = await supabase
      .from("escolaridad")
      .select("*")
      // .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar escolaridades:", error);
    } else {
      escolaridades.value = data;
    }
  };

  const agregarEscolaridad = async (descripcion) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error("El usuario no tiene permisos para agregar escolaridades.");
      return;
    }

    const { data, error } = await supabase
      .from("escolaridad")
      .insert([{ descripcion, tenant_id: authStore.tenant_id }]);

    if (error) {
      console.error("Error al agregar escolaridad:", error);
    } else if (data && data[0]) {
      escolaridades.value.push(data[0]);
    }
  };

  const eliminarEscolaridad = async (id) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para eliminar una escolaridad."
      );
      return;
    }
    const { error } = await supabase.from("escolaridad").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar escolaridad:", error);
    } else {
      escolaridades.value = escolaridades.value.filter((esc) => esc.id !== id);
    }
  };

  const actualizarEscolaridad = async (id, descripcion) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para actualizar una escolaridad."
      );
      return;
    }
    const { data, error } = await supabase
      .from("escolaridad")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar escolaridad:", error);
    } else if (data && data[0]) {
      const index = escolaridades.value.findIndex((esc) => esc.id === id);
      if (index !== -1) {
        escolaridades.value[index] = data[0];
      }
    }
  };

  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarEscolaridades();
      }
    },
    { immediate: true }
  );

  return {
    escolaridades,
    cargarEscolaridades,
    agregarEscolaridad,
    eliminarEscolaridad,
    actualizarEscolaridad,
  };
});

//------------------------------------------
// Tienda para Estado Civil
//------------------------------------------
export const useEstadoCivilStore = defineStore("estadoCivil", () => {
  const estadosCiviles = ref([]);
  const authStore = useAuthStore();

  const cargarEstadosCiviles = async () => {
    const { data, error } = await supabase
      .from("estadoCivil")
      .select("*")
      // .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar estados civiles:", error);
    } else {
      estadosCiviles.value = data;
    }
  };

  const agregarEstadoCivil = async (descripcion) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para agregar estados civiles."
      );
      return;
    }
    const { data, error } = await supabase
      .from("estadoCivil")
      .insert([{ descripcion, tenant_id: authStore.tenant_id }]);

    if (error) {
      console.error("Error al agregar estado civil:", error);
    } else if (data && data[0]) {
      estadosCiviles.value.push(data[0]);
    }
  };

  const eliminarEstadoCivil = async (id) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para eliminar un estado civil."
      );
      return;
    }
    const { error } = await supabase.from("estadoCivil").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar estado civil:", error);
    } else {
      estadosCiviles.value = estadosCiviles.value.filter(
        (estado) => estado.id !== id
      );
    }
  };

  const actualizarEstadoCivil = async (id, descripcion) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para actualizar un estado civil."
      );
      return;
    }
    const { data, error } = await supabase
      .from("estadoCivil")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar estado civil:", error);
    } else if (data && data[0]) {
      const index = estadosCiviles.value.findIndex(
        (estado) => estado.id === id
      );
      if (index !== -1) {
        estadosCiviles.value[index] = data[0];
      }
    }
  };

  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarEstadosCiviles();
      }
    },
    { immediate: true }
  );

  return {
    estadosCiviles,
    cargarEstadosCiviles,
    agregarEstadoCivil,
    eliminarEstadoCivil,
    actualizarEstadoCivil,
  };
});
