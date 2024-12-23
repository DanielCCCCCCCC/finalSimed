import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";

export const useStatusExamenEstudiosStore = defineStore(
  "statusExamenEstudiosStore",
  () => {
    const statusExamenEstudios = ref([]);

    const authStore = useAuthStore();

    const cargarStatusExamenEstudios = async () => {
      try {
        const { data, error } = await supabase
          .from("statusExamenEstudio")
          .select("*")
          .eq("tenant_id", authStore.tenant_id) // Filtrar por tenant_id
          .order("created_at", { ascending: true }); // Ordenar por fecha de creación

        if (error) {
          console.error("Error al cargar status de examen estudios:", error);
          return;
        }

        statusExamenEstudios.value = data || [];
        console.log(
          "Datos cargados de statusExamenEstudios:",
          statusExamenEstudios.value
        );
      } catch (err) {
        console.error(
          "Error inesperado al cargar status de examen estudios:",
          err
        );
      }
    };
    watch(
      () => authStore.tenant_id,
      (newTenantId) => {
        if (newTenantId) {
          cargarStatusExamenEstudios();
        }
      },
      { immediate: true }
    );
    return {
      statusExamenEstudios,
      cargarStatusExamenEstudios,
    };
  }
);
