import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";

function loadFromLocalStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Tienda para Clasificación de Diagnósticos
export const useClasificacionDiagnosticosStore = defineStore(
  "clasificacionDiagnosticos",
  () => {
    const clasificaciones = ref([]);
    const authStore = useAuthStore();

    const cargarClasificaciones = async () => {
      if (!authStore.tenant_id) return;
      const { data, error } = await supabase
        .from("clasificacionDiagnosticos")
        .select("*")
        .eq("tenant_id", authStore.tenant_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar clasificaciones:", error);
      } else if (data) {
        clasificaciones.value = data;
        saveToLocalStorage("clasificaciones", clasificaciones.value);
      }
    };

    const agregarClasificacion = async (nombre) => {
      if (!authStore.tenant_id) {
        console.warn("No hay tenant_id disponible");
        return;
      }
      if (authStore.role !== "admin") {
        console.error(
          "El usuario no tiene permisos para agregar clasificaciones."
        );
        return;
      }

      const { data, error } = await supabase
        .from("clasificacionDiagnosticos")
        .insert([{ nombre, tenant_id: authStore.tenant_id }]);

      if (error) {
        console.error("Error al agregar clasificación:", error);
      } else if (data && data.length > 0) {
        clasificaciones.value.push(data[0]);
        saveToLocalStorage("clasificaciones", clasificaciones.value);
      }
    };

    const actualizarClasificacion = async (id, datos) => {
      if (!authStore.tenant_id) {
        console.warn("No hay tenant_id disponible");
        return;
      }
      if (authStore.role !== "admin") {
        console.error(
          "El usuario no tiene permisos para actualizar clasificaciones."
        );
        return;
      }

      const { data, error } = await supabase
        .from("clasificacionDiagnosticos")
        .update(datos)
        .eq("id", id);

      if (error) {
        console.error("Error al actualizar clasificación:", error);
      } else if (data) {
        const index = clasificaciones.value.findIndex(
          (clasificacion) => clasificacion.id === id
        );
        if (index !== -1 && data[0]) {
          clasificaciones.value[index] = {
            ...clasificaciones.value[index],
            ...data[0],
          };
          saveToLocalStorage("clasificaciones", clasificaciones.value);
        }
      }
    };

    const eliminarClasificacion = async (id) => {
      if (!authStore.tenant_id) {
        console.warn("No hay tenant_id disponible");
        return;
      }
      if (authStore.role !== "admin") {
        console.error(
          "El usuario no tiene permisos para eliminar clasificaciones."
        );
        return;
      }

      const { error } = await supabase
        .from("clasificacionDiagnosticos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar la clasificación:", error);
      } else {
        clasificaciones.value = clasificaciones.value.filter(
          (clasificacion) => clasificacion.id !== id
        );
        saveToLocalStorage("clasificaciones", clasificaciones.value);
      }
    };

    // Colocamos el watch después de haber definido la función
    watch(
      () => authStore.tenant_id,
      (newTenantId) => {
        if (newTenantId) {
          cargarClasificaciones();
        }
      },
      { immediate: true }
    );

    return {
      clasificaciones,
      cargarClasificaciones,
      agregarClasificacion,
      actualizarClasificacion,
      eliminarClasificacion,
    };
  }
);

// Tienda para Diagnósticos
export const useDiagnosticosStore = defineStore("diagnosticos", () => {
  const diagnosticos = ref([]);
  const authStore = useAuthStore();

  const cargarDiagnosticos = async () => {
    if (!authStore.tenant_id) return;
    const { data, error } = await supabase
      .from("diagnosticos")
      .select("*")
      .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar diagnósticos:", error);
    } else if (data) {
      diagnosticos.value = data;
    }
  };

  const agregarDiagnostico = async (descripcion, clasificacionId) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para agregar un diagnóstico."
      );
      return;
    }

    const { data, error } = await supabase.from("diagnosticos").insert([
      {
        descripcion,
        clasificacionId: clasificacionId,
        tenant_id: authStore.tenant_id,
      },
    ]);

    if (error) {
      console.error("Error al agregar diagnóstico:", error);
    } else if (data && data.length > 0) {
      diagnosticos.value.push(data[0]);
    }
  };

  const actualizarDiagnostico = async (id, datos) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para actualizar un diagnóstico."
      );
      return;
    }

    const { data, error } = await supabase
      .from("diagnosticos")
      .update(datos)
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar diagnóstico:", error);
    } else if (data && data[0]) {
      const index = diagnosticos.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        diagnosticos.value[index] = {
          ...diagnosticos.value[index],
          ...data[0],
        };
      }
    }
  };

  const eliminarDiagnostico = async (id) => {
    if (!authStore.tenant_id) {
      console.warn("No hay tenant_id disponible");
      return;
    }
    if (authStore.role !== "admin") {
      console.error(
        "El usuario no tiene permisos para eliminar un diagnóstico."
      );
      return;
    }

    const { error } = await supabase.from("diagnosticos").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar el diagnóstico:", error);
    } else {
      diagnosticos.value = diagnosticos.value.filter((d) => d.id !== id);
    }
  };

  // Watch después de definir la función cargarDiagnosticos
  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarDiagnosticos();
      }
    },
    { immediate: true }
  );

  return {
    diagnosticos,
    cargarDiagnosticos,
    agregarDiagnostico,
    actualizarDiagnostico,
    eliminarDiagnostico,
  };
});

// Tienda para Controles de Medición
export const useControlesMedicionStore = defineStore(
  "controlesMedicion",
  () => {
    const controles = ref([]);
    const authStore = useAuthStore();

    const cargarControles = async () => {
      if (!authStore.tenant_id) return;
      const { data, error } = await supabase
        .from("controles")
        .select("*")
        .eq("tenant_id", authStore.tenant_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar controles:", error);
      } else if (data) {
        controles.value = data;
        saveToLocalStorage("controles", controles.value);
      }
    };

    const agregarControl = async (descripcion) => {
      if (!authStore.tenant_id) {
        console.warn("No hay tenant_id disponible");
        return;
      }
      if (authStore.role !== "admin") {
        console.error(
          "El usuario no tiene permisos para agregar un control de medición."
        );
        return;
      }

      const { data, error } = await supabase
        .from("controles")
        .insert([{ descripcion, tenant_id: authStore.tenant_id }]);

      if (error) {
        console.error("Error al agregar control:", error);
      } else if (data && data.length > 0) {
        controles.value.push(data[0]);
        saveToLocalStorage("controles", controles.value);
      }
    };

    const actualizarControl = async (id, datos) => {
      if (!authStore.tenant_id) {
        console.warn("No hay tenant_id disponible");
        return;
      }
      if (authStore.role !== "admin") {
        console.error(
          "El usuario no tiene permisos para actualizar un control de medición."
        );
        return;
      }

      const { data, error } = await supabase
        .from("controles")
        .update(datos)
        .eq("id", id);

      if (error) {
        console.error("Error al actualizar control:", error);
      } else if (data && data[0]) {
        const index = controles.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          controles.value[index] = { ...controles.value[index], ...data[0] };
          saveToLocalStorage("controles", controles.value);
        }
      }
    };

    const eliminarControl = async (id) => {
      if (!authStore.tenant_id) {
        console.warn("No hay tenant_id disponible");
        return;
      }
      if (authStore.role !== "admin") {
        console.error(
          "El usuario no tiene permisos para eliminar un control de medición."
        );
        return;
      }

      const { error } = await supabase.from("controles").delete().eq("id", id);

      if (error) {
        console.error("Error al eliminar el control:", error);
      } else {
        controles.value = controles.value.filter(
          (control) => control.id !== id
        );
        saveToLocalStorage("controles", controles.value);
      }
    };

    // Watch después de definir las funciones
    watch(
      () => authStore.tenant_id,
      (newTenantId) => {
        if (newTenantId) {
          cargarControles();
        }
      },
      { immediate: true }
    );

    return {
      controles,
      cargarControles,
      agregarControl,
      actualizarControl,
      eliminarControl,
    };
  }
);
