import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../supabaseClient";

export const useStatusExamenEstudiosStore = defineStore(
  "statusExamenEstudiosStore",
  () => {
    const statusExamenEstudios = ref([]);

    const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3"; // Asegúrate de usar el tenantId para filtrar

    const cargarStatusExamenEstudios = async () => {
      try {
        const { data, error } = await supabase
          .from("statusExamenEstudio")
          .select("*")
          .eq("tenant_Id", tenantId) // Filtrar por tenantId
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

    return {
      statusExamenEstudios,
      cargarStatusExamenEstudios,
    };
  }
);
