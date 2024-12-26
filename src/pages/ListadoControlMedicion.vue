<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nuevo control de medición -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Controles de Medición</h4>
            <p class="parrafo">
              Catálogo de controles de medición del centro médico
            </p>
          </div>
          <div>
            <q-btn
              label="Nuevo Control"
              flat
              class="btn btn-primary"
              @click="abrirDialogoNuevoControl"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para controles de medición -->
      <DxDataGrid
        :data-source="controles"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="id"
        class="custom-data-grid"
      >
        <DxPaging :enabled="true" :page-size="10" />
        <!-- <DxScrolling mode="virtual" /> -->
        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxColumnChooser :enabled="true" />
        <DxLoadPanel :show-pane="true" />

        <!-- Panel de búsqueda -->
        <DxSearchPanel
          :width="300"
          :visible="true"
          placeholder="Buscar Control"
        />

        <!-- Columna para descripción del control -->
        <DxColumn
          data-field="descripcion"
          caption="Descripción del Control"
          :allow-sorting="true"
          min-width="150"
          width="200"
        >
          <DxRequiredRule />
        </DxColumn>

        <!-- Botones de acción -->
        <DxColumn type="buttons" :width="120">
          <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
          <DxButton icon="trash" hint="Eliminar" @click="eliminarControl" />
        </DxColumn>

        <!-- Paginación -->
        <DxPaging :enabled="true" :page-size="10" />
      </DxDataGrid>

      <!-- Modal de edición/agregación -->
      <q-dialog v-model="mostrarDialogo" persistent max-width="600px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                {{
                  isEditMode
                    ? "Editar Control de Medición"
                    : "Agregar Control de Medición"
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
                <div class="col-12 col-md-6 mb-3">
                  <q-input
                    v-model="controlSeleccionado.descripcion"
                    label="Descripción del Control"
                    outlined
                    :error="!!errores.descripcion"
                    :error-message="errores.descripcion"
                    required
                  />
                </div>
              </div>

              <div class="flex justify-center q-mt-sm">
                <q-btn
                  :label="isEditMode ? 'Actualizar Control' : 'Guardar Control'"
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
  DxScrolling,
  DxSorting,
  DxLoadPanel,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useControlesMedicionStore } from "../stores/DiagnosticosStores";

// Instancia de la tienda
const controlesStore = useControlesMedicionStore();

// Referencias reactivas a los datos de la tienda
const controles = ref([]);

// Estados del modal
const mostrarDialogo = ref(false);
const isEditMode = ref(false);

// Datos del control seleccionado
const controlSeleccionado = ref({
  id: null,
  descripcion: "",
});

// Errores del formulario
const errores = ref({});

// Función para cargar controles de medición
const cargarControles = async () => {
  try {
    await controlesStore.cargarControles();
    controles.value = controlesStore.controles;
    console.log("Controles de medición cargados:", controles.value);
  } catch (error) {
    console.error("Error al cargar controles de medición:", error);
    Notify.create({
      message: "Error al cargar los controles de medición.",
      color: "negative",
      position: "top-right",
    });
  }
};

// Abrir el formulario para agregar un nuevo control
const abrirDialogoNuevoControl = () => {
  isEditMode.value = false;
  resetFormulario();
  mostrarDialogo.value = true;
};

// Abrir el formulario de edición con los datos del control seleccionado
const abrirFormularioEdicion = (e) => {
  const control = e.row.data;
  console.log("Abrir edición con datos:", control); // Log para depuración
  if (!control || !control.id) {
    Notify.create({
      type: "negative",
      message: "Error al abrir el modal: el control no tiene ID.",
      position: "top-right",
    });
    return;
  }
  isEditMode.value = true;
  controlSeleccionado.value = { ...control };
  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario (agregar o actualizar)
const guardarCambios = async () => {
  const id = controlSeleccionado.value.id;
  const descripcion = controlSeleccionado.value.descripcion.trim();

  // Resetear errores
  errores.value = {};

  // Validar campos requeridos
  if (!descripcion) {
    errores.value.descripcion = "La descripción del control es obligatoria.";
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    if (isEditMode.value) {
      // Actualizar control de medición
      await controlesStore.actualizarControl(id, { descripcion });
      Notify.create({
        type: "positive",
        message: "Control de medición actualizado con éxito",
        position: "top-right",
      });
    } else {
      // Agregar nuevo control de medición
      await controlesStore.agregarControl(descripcion);
      Notify.create({
        type: "positive",
        message: "Control de medición agregado con éxito",
        position: "top-right",
      });
    }

    // Recargar controles y cerrar el modal
    await cargarControles();
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar el control de medición",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  resetFormulario();
};

// Resetear el formulario
const resetFormulario = () => {
  controlSeleccionado.value = {
    id: null,
    descripcion: "",
  };
  errores.value = {};
};

// Eliminar control de medición
const eliminarControl = async (e) => {
  const data = e.row.data;
  console.log("Eliminar control con datos:", data); // Log para depuración
  if (!data || !data.id) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar: el control no tiene ID.",
      position: "top-right",
    });
    return;
  }

  try {
    await controlesStore.eliminarControl(data.id);
    Notify.create({
      type: "positive",
      message: "Control eliminado exitosamente",
      position: "top-right",
    });
    await cargarControles();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el control de medición",
      position: "top-right",
    });
    console.error("Error al eliminar control:", error);
  }
};

// Cargar controles al montar el componente
onMounted(cargarControles);
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

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
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
}
</style>
