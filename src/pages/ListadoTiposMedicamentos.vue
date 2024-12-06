<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid para Tipos de Medicamentos -->
    <DxDataGrid
      :data-source="medicamentos"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Tipo de Medicamento">
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
        <DxButton icon="trash" hint="Eliminar" @click="eliminarMedicamento" />
      </DxColumn>

      <!-- Opciones adicionales -->
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} medicamentos" />
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
          <div class="text-h6">Editar Tipo de Medicamento</div>
          <q-space />
          <q-btn icon="close" flat round @click="cerrarDialogo" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="medicamentoSeleccionado.descripcion"
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
import { useTiposMedicamentosStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Instancia de la tienda y referencias reactivas
const medicamentosStore = useTiposMedicamentosStore();
const { medicamentos } = storeToRefs(medicamentosStore);

// Estado para el modal y el medicamento seleccionado
const mostrarDialogo = ref(false);
const medicamentoSeleccionado = ref({});

// Cargar medicamentos al montar el componente
onMounted(async () => {
  await medicamentosStore.cargarMedicamentos();
});

// Función para abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  const medicamento = e.row.data;
  medicamentoSeleccionado.value = { ...medicamento };
  mostrarDialogo.value = true;
};

// Función para guardar los cambios
const guardarCambios = async () => {
  try {
    // Validar que la descripción no esté vacía
    if (!medicamentoSeleccionado.value.descripcion.trim()) {
      Notify.create({
        type: "negative",
        message: "La descripción es obligatoria",
        position: "top-right",
      });
      return;
    }

    // Actualizar el medicamento en la tienda
    await medicamentosStore.actualizarMedicamento(
      medicamentoSeleccionado.value.id,
      medicamentoSeleccionado.value.descripcion
    );

    // Mostrar notificación de éxito
    Notify.create({
      type: "positive",
      message: "Medicamento actualizado con éxito",
      position: "top-right",
    });

    // Cerrar el diálogo
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el medicamento",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Función para eliminar medicamento
const eliminarMedicamento = async (e) => {
  try {
    const medicamentoId = e.row.data.id;
    await medicamentosStore.eliminarMedicamento(medicamentoId);
    Notify.create({
      type: "negative",
      message: "Medicamento eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el medicamento",
      position: "top-right",
    });
    console.error("Error al eliminar medicamento:", error);
  }
};

// Función para cerrar el diálogo
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  medicamentoSeleccionado.value = {};
};

// Validador para el campo de descripción
const validador = (val) => !!val || "La descripción es obligatoria";
</script>
<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #f9f9f9;
  width: 100%; /* Ajuste para que ocupe el 100% del ancho disponible */
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* Hacer que el DataGrid ocupe el 100% del ancho del contenedor */
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 1px 0 1px;
  text-align: center;
}
</style>
