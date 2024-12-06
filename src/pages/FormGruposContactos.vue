<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
      <q-card-section class="text-h6 text-primary">
        Grupos de Contactos
      </q-card-section>
      <q-form @submit.prevent="guardarGrupoContacto" class="q-gutter-md">
        <q-input
          v-model="grupoContactoData.descripcion"
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
            @click="guardarGrupoContacto"
          />
        </div>
      </q-form>
    </q-card>
    <ListadoGruposContactos />
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Notify } from "quasar";
import ListadoGruposContactos from "./ListadoGruposContactos.vue";
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";

// Datos reactivos
const grupoContactoData = ref({ descripcion: "" });
const formErrors = reactive({ descripcion: "" });

// Acceso al store
const gruposContactosStore = useGruposContactosStore();

// Función para guardar el grupo de contacto
const guardarGrupoContacto = async () => {
  formErrors.descripcion = "";

  // Validar el campo
  if (!grupoContactoData.value.descripcion.trim()) {
    formErrors.descripcion = "La descripción es obligatoria.";
    return;
  }

  try {
    await gruposContactosStore.agregarGrupo(
      grupoContactoData.value.descripcion
    );
    grupoContactoData.value.descripcion = ""; // Limpiar el campo
    Notify.create({
      message: "Grupo de contacto guardado exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al guardar el grupo de contacto",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al guardar el grupo de contacto:", error);
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
</style>
