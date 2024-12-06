import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../supabaseClient";

// Tienda para Departamentos
export const useDepartamentoStore = defineStore("departamentos", () => {
  const departamentos = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarDepartamentos = async () => {
    const { data, error } = await supabase
      .from("departamentos")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar departamentos:", error);
    } else {
      departamentos.value = data;
    }
  };

  const agregarDepartamento = async (descripcion) => {
    const { data, error } = await supabase
      .from("departamentos")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar departamento:", error);
    } else if (data && data[0]) {
      departamentos.value.push(data[0]);
    }
  };

  const eliminarDepartamento = async (id) => {
    const { error } = await supabase
      .from("departamentos")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error al eliminar departamento:", error);
    } else {
      departamentos.value = departamentos.value.filter(
        (depto) => depto.id !== id
      );
    }
  };

  // Nueva función para actualizar un departamento
  const actualizarDepartamento = async (id, descripcion) => {
    const { data, error } = await supabase
      .from("departamentos")
      .update({ descripcion })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar departamento:", error);
    } else if (data && data[0]) {
      const index = departamentos.value.findIndex((depto) => depto.id === id);
      if (index !== -1) {
        departamentos.value[index] = data[0];
      }
    }
  };

  return {
    departamentos,
    cargarDepartamentos,
    agregarDepartamento,
    eliminarDepartamento,
    actualizarDepartamento, // Asegúrate de exportar la función
  };
});

// Tienda para Municipios
export const useMunicipioStore = defineStore("municipios", () => {
  const municipios = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarMunicipios = async () => {
    const { data, error } = await supabase
      .from("municipios")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar municipios:", error);
    } else {
      municipios.value = data;
    }
  };

  const agregarMunicipio = async (descripcion, departamentoId) => {
    const { data, error } = await supabase.from("municipios").insert([
      {
        descripcion,
        departamentoId,
        tenant_id: tenantId,
      },
    ]);

    if (error) {
      console.error("Error al agregar municipio:", error);
      throw error; // Opcional: para manejar el error en el componente
    } else if (data && data[0]) {
      municipios.value.push(data[0]);
    }
  };

  const eliminarMunicipio = async (id) => {
    const { error } = await supabase.from("municipios").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar municipio:", error);
    } else {
      municipios.value = municipios.value.filter((muni) => muni.id !== id);
    }
  };

  // Nueva función para actualizar un municipio
  const actualizarMunicipio = async (id, descripcion, departamentoId) => {
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

  return {
    municipios,
    cargarMunicipios,
    agregarMunicipio,
    eliminarMunicipio,
    actualizarMunicipio, // Exportar la función
  };
});

// Tienda para Grupo Sanguíneo
export const useGrupoSanguineoStore = defineStore("grupoSanguineo", () => {
  const gruposSanguineos = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarGruposSanguineos = async () => {
    const { data, error } = await supabase
      .from("grupoSanguineo")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar los grupos sanguíneos:", error);
    } else {
      gruposSanguineos.value = data;
    }
  };

  const agregarGrupoSanguineo = async (descripcion) => {
    const { data, error } = await supabase
      .from("grupoSanguineo")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar grupo sanguíneo:", error);
    } else if (data && data[0]) {
      gruposSanguineos.value.push(data[0]);
    }
  };

  const eliminarGrupoSanguineo = async (id) => {
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

  // Nueva función para actualizar un grupo sanguíneo
  const actualizarGrupoSanguineo = async (id, descripcion) => {
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

  return {
    gruposSanguineos,
    cargarGruposSanguineos,
    agregarGrupoSanguineo,
    eliminarGrupoSanguineo,
    actualizarGrupoSanguineo, // Exportar la función
  };
});

// Tienda para Escolaridad
export const useEscolaridadStore = defineStore("escolaridad", () => {
  const escolaridades = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarEscolaridades = async () => {
    const { data, error } = await supabase
      .from("escolaridad")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar escolaridades:", error);
    } else {
      escolaridades.value = data;
    }
  };

  const agregarEscolaridad = async (descripcion) => {
    const { data, error } = await supabase
      .from("escolaridad")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar escolaridad:", error);
    } else if (data && data[0]) {
      escolaridades.value.push(data[0]);
    }
  };

  const eliminarEscolaridad = async (id) => {
    const { error } = await supabase.from("escolaridad").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar escolaridad:", error);
    } else {
      escolaridades.value = escolaridades.value.filter((esc) => esc.id !== id);
    }
  };

  // Nueva función para actualizar una escolaridad
  const actualizarEscolaridad = async (id, descripcion) => {
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

  return {
    escolaridades,
    cargarEscolaridades,
    agregarEscolaridad,
    eliminarEscolaridad,
    actualizarEscolaridad, // Exportar la función
  };
});

// Tienda para Estado Civil
export const useEstadoCivilStore = defineStore("estadoCivil", () => {
  const estadosCiviles = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarEstadosCiviles = async () => {
    const { data, error } = await supabase
      .from("estadoCivil")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar estados civiles:", error);
    } else {
      estadosCiviles.value = data;
    }
  };

  const agregarEstadoCivil = async (descripcion) => {
    const { data, error } = await supabase
      .from("estadoCivil")
      .insert([{ descripcion, tenant_id: tenantId }]);

    if (error) {
      console.error("Error al agregar estado civil:", error);
    } else if (data && data[0]) {
      estadosCiviles.value.push(data[0]);
    }
  };

  const eliminarEstadoCivil = async (id) => {
    const { error } = await supabase.from("estadoCivil").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar estado civil:", error);
    } else {
      estadosCiviles.value = estadosCiviles.value.filter(
        (estado) => estado.id !== id
      );
    }
  };

  // Nueva función para actualizar un estado civil
  const actualizarEstadoCivil = async (id, descripcion) => {
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

  return {
    estadosCiviles,
    cargarEstadosCiviles,
    agregarEstadoCivil,
    eliminarEstadoCivil,
    actualizarEstadoCivil, // Exportar la función
  };
});
