import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";

export const useStatusStore = defineStore("statusStore", () => {
  const statuses = ref([]);

  const authStore = useAuthStore();

  const cargarStatuses = async () => {
    const { data, error } = await supabase
      .from("statusMedicamento")
      .select("*")
      .eq("tenant_id", authStore.tenant_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error al cargar medicamentos:", error);
    } else {
      statuses.value = data;
    }
  };
  watch(
    () => authStore.tenant_id,
    (newTenantId) => {
      if (newTenantId) {
        cargarStatuses();
      }
    },
    { immediate: true }
  );
  return {
    statuses,
    cargarStatuses,
  };
});
