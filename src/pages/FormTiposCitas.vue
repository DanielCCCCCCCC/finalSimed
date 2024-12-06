<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
      <q-card-section class="text-h6 text-primary">
        Tipos de Citas
      </q-card-section>
      <q-form @submit.prevent="guardarCita" class="q-gutter-md">
        <q-input
          v-model="citaData.descripcion"
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
            @click="guardarCita"
          />
        </div>
      </q-form>
    </q-card>
    <ListadoTiposCitas />
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Notify } from "quasar";
import ListadoTiposCitas from "./ListadoTiposCitas.vue";
import { useTiposCitasStore } from "../stores/ConfiMedicasStores";

// Datos reactivos
const citaData = ref({ descripcion: "" });
const formErrors = reactive({ descripcion: "" });

// Acceso al store
const tiposCitasStore = useTiposCitasStore();

// Función para guardar el tipo de cita
const guardarCita = async () => {
  formErrors.descripcion = "";

  // Validar el campo
  if (!citaData.value.descripcion.trim()) {
    formErrors.descripcion = "La descripción es obligatoria.";
    return;
  }

  try {
    await tiposCitasStore.agregarCita(citaData.value.descripcion);
    citaData.value.descripcion = ""; // Limpiar el campo
    Notify.create({
      message: "Tipo de cita guardada exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al guardar el tipo de cita",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al guardar el tipo de cita:", error);
  }
};

// Función para eliminar el último tipo de cita
const eliminarCita = async () => {
  try {
    await tiposCitasStore.eliminarUltimaCita();
    Notify.create({
      message: "Último tipo de cita eliminado",
      color: "warning",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al eliminar el tipo de cita",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al eliminar el tipo de cita:", error);
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
