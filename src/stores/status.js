import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../supabaseClient";

export const useStatusStore = defineStore("statusStore", () => {
  const statuses = ref([]);

  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarStatuses = async () => {
    const { data, error } = await supabase
      .from("statusMedicamento")
      .select("*")
      .order("created_at", { ascending: true }); // Ordenar por descripción

    if (error) {
      console.error("Error al cargar medicamentos:", error);
    } else {
      statuses.value = data;
    }
  };
  return {
    statuses,
    cargarStatuses,
  };
});
