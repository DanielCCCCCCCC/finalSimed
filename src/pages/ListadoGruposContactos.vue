<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid para Grupos de Contactos -->
    <DxDataGrid
      :data-source="grupos"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Grupo de Contacto">
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
        <DxButton icon="trash" hint="Eliminar" @click="eliminarGrupo" />
      </DxColumn>

      <!-- Opciones adicionales -->
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} grupos" />
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
          <div class="text-h6">Editar Grupo de Contacto</div>
          <q-space />
          <q-btn icon="close" flat round @click="cerrarDialogo" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="grupoSeleccionado.descripcion"
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
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Instancia de la tienda y referencias reactivas
const gruposStore = useGruposContactosStore();
const { grupos } = storeToRefs(gruposStore);

// Estado para el modal y el grupo seleccionado
const mostrarDialogo = ref(false);
const grupoSeleccionado = ref({});

// Cargar grupos al montar el componente
onMounted(async () => {
  await gruposStore.cargarGrupos();
});

// Función para abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  const grupo = e.row.data;
  grupoSeleccionado.value = { ...grupo };
  mostrarDialogo.value = true;
};

// Función para guardar los cambios
const guardarCambios = async () => {
  try {
    // Validar que la descripción no esté vacía
    if (!grupoSeleccionado.value.descripcion.trim()) {
      Notify.create({
        type: "negative",
        message: "La descripción es obligatoria",
        position: "top-right",
      });
      return;
    }

    // Actualizar el grupo en la tienda
    await gruposStore.actualizarGrupo(
      grupoSeleccionado.value.id,
      grupoSeleccionado.value.descripcion
    );

    // Mostrar notificación de éxito
    Notify.create({
      type: "positive",
      message: "Grupo actualizado con éxito",
      position: "top-right",
    });

    // Cerrar el diálogo
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el grupo",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Función para eliminar grupo
const eliminarGrupo = async (e) => {
  try {
    const grupoId = e.row.data.id;
    await gruposStore.eliminarGrupo(grupoId);
    Notify.create({
      type: "negative",
      message: "Grupo eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el grupo",
      position: "top-right",
    });
    console.error("Error al eliminar grupo:", error);
  }
};

// Función para cerrar el diálogo
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  grupoSeleccionado.value = {};
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
