<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
      <q-card-section class="text-h6 text-primary">
        Tipos de Pacientes
      </q-card-section>
      <q-form @submit.prevent="guardarPaciente" class="q-gutter-md">
        <q-input
          v-model="pacienteData.descripcion"
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
            @click="guardarPaciente"
          />
        </div>
      </q-form>
    </q-card>
    <ListadoTipoPacientes />
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Notify } from "quasar";
import ListadoTipoPacientes from "./ListadoTipoPacientes.vue";
import { useTiposPacientesStore } from "../stores/ConfiMedicasStores";

// Datos reactivos
const pacienteData = ref({ descripcion: "" });
const formErrors = reactive({ descripcion: "" });

// Acceso al store
const tiposPacientesStore = useTiposPacientesStore();

// Función para guardar el tipo de paciente
const guardarPaciente = async () => {
  formErrors.descripcion = "";

  // Validar el campo
  if (!pacienteData.value.descripcion.trim()) {
    formErrors.descripcion = "La descripción es obligatoria.";
    return;
  }

  try {
    await tiposPacientesStore.agregarPaciente(pacienteData.value.descripcion);
    pacienteData.value.descripcion = ""; // Limpiar el campo
    Notify.create({
      message: "Tipo de paciente guardado exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al guardar el tipo de paciente",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al guardar el tipo de paciente:", error);
  }
};

// Función para eliminar el último tipo de paciente
const eliminarPaciente = async () => {
  try {
    await tiposPacientesStore.eliminarUltimoPaciente();
    Notify.create({
      message: "Último tipo de paciente eliminado",
      color: "warning",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al eliminar el tipo de paciente",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al eliminar el tipo de paciente:", error);
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
