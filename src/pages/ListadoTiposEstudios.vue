<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid para Tipos de Estudios -->
    <DxDataGrid
      :data-source="estudios"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Tipo de Estudio">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="created_at"
        caption="Fecha de Creación"
        data-type="date"
        :format="{ type: 'shortDate' }"
      >
        <DxRequiredRule />
      </DxColumn>

      <!-- Botones de edición y eliminación -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarEstudio" />
      </DxColumn>

      <!-- Opciones adicionales -->
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} estudios" />
      </DxSummary>
      <DxColumnChooser :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxGrouping :auto-expand-all="false" />
    </DxDataGrid>

    <!-- Formulario de edición (ventana modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Editar Tipo de Estudio</div>
          <q-space />
          <q-btn icon="close" flat round @click="cerrarDialogo" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="estudioSeleccionado.descripcion"
              label="Descripción"
              outlined
              :rules="[validador]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Guardar" color="primary" @click="guardarCambios" />
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarDialogo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxSummary,
  DxGroupItem,
  DxColumnChooser,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxGrouping,
  DxButton,
} from "devextreme-vue/data-grid";
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Instancia de la tienda y referencias reactivas
const estudiosStore = useTiposEstudiosStore();
const { estudios } = storeToRefs(estudiosStore);

// Estado para el modal y el estudio seleccionado
const mostrarDialogo = ref(false);
const estudioSeleccionado = ref({});

// Cargar estudios al montar el componente
onMounted(async () => {
  await estudiosStore.cargarEstudios();
});

// Función para abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  const estudio = e.row.data;
  estudioSeleccionado.value = { ...estudio };
  mostrarDialogo.value = true;
};

// Función para guardar los cambios
const guardarCambios = async () => {
  try {
    // Validar que la descripción no esté vacía
    if (!estudioSeleccionado.value.descripcion.trim()) {
      Notify.create({
        type: "negative",
        message: "La descripción es obligatoria",
        position: "top-right",
      });
      return;
    }

    // Actualizar el estudio en la tienda
    await estudiosStore.actualizarEstudio(
      estudioSeleccionado.value.id,
      estudioSeleccionado.value.descripcion
    );

    // Mostrar notificación de éxito
    Notify.create({
      type: "positive",
      message: "Estudio actualizado con éxito",
      position: "top-right",
    });

    // Cerrar el diálogo
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el estudio",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Función para eliminar estudio
const eliminarEstudio = async (e) => {
  try {
    const estudioId = e.row.data.id;
    await estudiosStore.eliminarEstudio(estudioId);
    Notify.create({
      type: "negative",
      message: "Estudio eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el estudio",
      position: "top-right",
    });
    console.error("Error al eliminar estudio:", error);
  }
};

// Función para cerrar el diálogo
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  estudioSeleccionado.value = {};
};

// Validador para el campo de descripción
const validador = (val) => !!val || "La descripción es obligatoria";
</script>
<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #f9f9f9;
  width: 100%;
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 1px 0 1px;
  text-align: center;
}
</style>
