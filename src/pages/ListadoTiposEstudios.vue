<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nuevo tipo de estudio -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Tipos de Estudios Existentes</h4>
            <p class="parrafo">
              Catálogo de tipos de estudios del centro médico
            </p>
          </div>
          <div>
            <q-btn
              label="Nuevo Tipo de Estudio"
              flat
              class="btn btn-primary"
              @click="abrirDialogoNuevoEstudio"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para Tipos de Estudios -->
      <DxDataGrid
        :data-source="estudios"
        key-expr="id"
        :show-borders="true"
        class="custom-data-grid"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
      >
        <!-- Columnas -->
        <DxColumn
          data-field="descripcion"
          caption="Tipo de Estudio"
          min-width="200"
          width="300"
        >
          <DxRequiredRule />
        </DxColumn>

        <!-- Botones de edición y eliminación -->
        <DxColumn type="buttons" width="120">
          <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
          <DxButton icon="trash" hint="Eliminar" @click="eliminarEstudio" />
        </DxColumn>

        <!-- Opciones adicionales -->
        <DxSummary>
          <DxGroupItem summary-type="count" displayFormat="{0} estudios" />
        </DxSummary>
        <DxPaging :enabled="true" :page-size="10" />
        <DxColumnChooser :enabled="true" />
        <DxFilterRow :visible="true" />
        <DxSearchPanel :visible="true" />
        <DxGroupPanel :visible="true" />
        <DxGrouping :auto-expand-all="false" />
        <DxPaging :enabled="true" :page-size="10" />
        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxLoadPanel :show-pane="true" />
      </DxDataGrid>

      <!-- Formulario de edición/agregación (ventana modal) -->
      <q-dialog v-model="mostrarDialogo" persistent max-width="600px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                {{
                  isEditMode
                    ? "Editar Tipo de Estudio"
                    : "Agregar Nuevo Tipo de Estudio"
                }}
              </h2>
              <q-btn
                label="Cerrar"
                color="secondary"
                icon="close"
                flat
                @click="cerrarDialogo"
                class="btnCerrarModal"
              />
            </div>

            <q-form @submit.prevent="guardarCambios">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-12 mb-3 corridoInput">
                  <q-input
                    v-model="estudioSeleccionado.descripcion"
                    label="Descripción"
                    outlined
                    :error="!!errores.descripcion"
                    :error-message="errores.descripcion"
                    required
                  />
                </div>
              </div>

              <div class="flex justify-center q-mt-sm">
                <q-btn
                  :label="isEditMode ? 'Actualizar Estudio' : 'Guardar Estudio'"
                  color="primary"
                  type="submit"
                  class="btn-primary"
                  style="font-size: 14px; padding: 8px 16px"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
  DxRequiredRule,
  DxColumnChooser,
  DxSearchPanel,
  DxGroupPanel,
  DxGrouping,
  DxSummary,
  DxGroupItem,
  DxSorting,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Instancia de la tienda y referencias reactivas
const tiposEstudiosStore = useTiposEstudiosStore();
const { estudios } = storeToRefs(tiposEstudiosStore);

// Estados del modal
const mostrarDialogo = ref(false);
const isEditMode = ref(false);

// Datos del estudio seleccionado
const estudioSeleccionado = ref({
  id: null,
  descripcion: "",
});

// Errores del formulario
const errores = ref({
  descripcion: "",
});

onMounted(async () => {
  await tiposEstudiosStore.cargarEstudios();
});

// Abrir el formulario para agregar un nuevo estudio
const abrirDialogoNuevoEstudio = () => {
  isEditMode.value = false;
  resetFormulario();
  mostrarDialogo.value = true;
};

// Abrir el formulario de edición con los datos del estudio seleccionado
const abrirFormularioEdicion = (e) => {
  const data = e.row.data;
  console.log("Abrir edición con datos:", data); // Log para depuración
  if (!data || !data.id) {
    Notify.create({
      type: "negative",
      message: "Error al abrir el modal: el estudio no tiene ID.",
      position: "top-right",
    });
    return;
  }
  isEditMode.value = true;
  estudioSeleccionado.value = { ...data };
  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario (agregar o actualizar)
const guardarCambios = async () => {
  const { id, descripcion } = estudioSeleccionado.value;

  // Resetear errores
  errores.value = {
    descripcion: "",
  };

  // Validar campos requeridos
  let valid = true;
  if (!descripcion.trim()) {
    errores.value.descripcion = "La descripción es obligatoria.";
    valid = false;
  }

  if (!valid) {
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    if (isEditMode.value) {
      // Actualizar estudio
      await tiposEstudiosStore.actualizarEstudio(id, {
        descripcion: descripcion.trim(),
      });
      Notify.create({
        type: "positive",
        message: "Estudio actualizado con éxito",
        position: "top-right",
      });
    } else {
      // Agregar nuevo estudio
      await tiposEstudiosStore.agregarEstudio(descripcion.trim());
      Notify.create({
        type: "positive",
        message: "Estudio agregado con éxito",
        position: "top-right",
      });
    }

    // Recargar estudios y cerrar el modal
    await tiposEstudiosStore.cargarEstudios();
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar el estudio",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Eliminar estudio
const eliminarEstudio = async (e) => {
  const data = e.row.data;
  console.log("Eliminar estudio con datos:", data); // Log para depuración
  if (!data || !data.id) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar: el estudio no tiene ID.",
      position: "top-right",
    });
    return;
  }

  try {
    await tiposEstudiosStore.eliminarEstudio(data.id);
    Notify.create({
      type: "positive",
      message: "Estudio eliminado con éxito",
      position: "top-right",
    });
    await tiposEstudiosStore.cargarEstudios();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el estudio",
      position: "top-right",
    });
    console.error("Error al eliminar estudio:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  resetFormulario();
};

// Resetear el formulario
const resetFormulario = () => {
  estudioSeleccionado.value = {
    id: null,
    descripcion: "",
  };
  errores.value = {
    descripcion: "",
  };
};

// Cargar datos al montar el componente
// onMounted(cargarDatos);
</script>
<style scoped>
#app-container {
  padding: 20px;
  background-color: #f9f9f9;
  margin: 0 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 93%;
}

.form-card {
  max-width: 800px;
  width: 100%;
  margin: auto;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.espaciadoLateral {
  margin-left: 70px;
}

.fsButton {
  font-size: 16px;
}

.btnCerrarModal {
  font-size: 16px;
}

.corridoInput {
  padding-left: 30px;
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

.dx-datagrid-header-panel {
  background-color: #1976d2;
  color: #ffffff;
}

.dx-datagrid-row-alternation-enabled .dx-row {
  background-color: #f1f1f1;
}

.dx-datagrid .dx-command-edit .dx-button {
  background-color: transparent;
  border: none;
  color: #1976d2;
}

.dx-datagrid .dx-command-edit .dx-button:hover {
  color: #1565c0;
}

.text-negative {
  color: #f44336;
}

.text-caption {
  font-size: 12px;
}

.header-container {
  display: flex;
  flex-direction: column;
}

.header-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.parrafo {
  margin: 0;
  color: #666666;
}

.btn-primary {
  font-size: 14px;
  padding: 8px 16px;
}

@media (max-width: 1024px) {
  .form-card {
    max-width: 700px;
  }
}

@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }

  .espaciadoLateral {
    margin-left: 20px;
  }
}
</style>
