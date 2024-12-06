<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
      <q-card-section class="text-h6 text-primary">
        Tipos de Medicamentos
      </q-card-section>
      <q-form @submit.prevent="guardarMedicamento" class="q-gutter-md">
        <q-input
          v-model="medicamentoData.descripcion"
          label="Descripción"
          outlined
          dense
          :error="!!formErrors.descripcion"
          :error-message="formErrors.descripcion"
        />
        <div class="row justify-end q-mt-md">
          <q-btn
            label="Crear"
            color="primary"
            icon="add"
            @click="guardarMedicamento"
          />
        </div>
      </q-form>
    </q-card>
    <ListadoTiposMedicamentos />
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Notify } from "quasar";
import ListadoTiposMedicamentos from "./ListadoTiposMedicamentos.vue";
import { useTiposMedicamentosStore } from "../stores/ConfiMedicasStores";

// Datos reactivos
const medicamentoData = ref({ descripcion: "" });
const formErrors = reactive({ descripcion: "" });

// Acceso al store
const tiposMedicamentosStore = useTiposMedicamentosStore();

// Función para guardar el tipo de medicamento
const guardarMedicamento = async () => {
  formErrors.descripcion = "";

  // Validar el campo
  if (!medicamentoData.value.descripcion.trim()) {
    formErrors.descripcion = "La descripción es obligatoria.";
    return;
  }

  try {
    await tiposMedicamentosStore.agregarMedicamento(
      medicamentoData.value.descripcion
    );
    medicamentoData.value.descripcion = ""; // Limpiar el campo
    Notify.create({
      message: "Tipo de medicamento guardado exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al guardar el tipo de medicamento",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al guardar el tipo de medicamento:", error);
  }
};

// Función para eliminar el último tipo de medicamento
const eliminarMedicamento = async () => {
  try {
    await tiposMedicamentosStore.eliminarUltimoMedicamento();
    Notify.create({
      message: "Último tipo de medicamento eliminado",
      color: "warning",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al eliminar el tipo de medicamento",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al eliminar el tipo de medicamento:", error);
  }
};
</script>

<style scoped>
/* Estilos consistentes con otros formularios */
.q-page {
  background-color: #f9f9f9;
}

.wide-card {
  max-width: 800px; /* Asegura el mismo ancho */
  margin: auto; /* Centra el formulario */
}

.text-primary {
  color: #1976d2; /* Azul primario para encabezados */
}

.q-mt-md {
  margin-top: 16px; /* Espaciado consistente */
}

.q-pa-md {
  padding: 16px; /* Relleno consistente */
}

.formS {
  padding: 16px; /* Relleno interno uniforme */
}

.q-ml-sm {
  margin-left: 8px; /* Espaciado entre botones */
}
</style>
