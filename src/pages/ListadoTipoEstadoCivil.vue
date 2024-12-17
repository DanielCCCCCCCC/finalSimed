<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nuevo estado civil -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Estados Civiles Existentes</h4>
            <p class="parrafo">Catálogo de estados civiles del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo Estado Civil"
              flat
              class="btn btn-primary btn-sm btn-wave right-content fsButton fe fe-plus"
              @click="abrirDialogoNuevoEstadoCivil"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para Estados Civiles -->
      <DxDataGrid
        :data-source="estadosCiviles"
        key-expr="id"
        :show-borders="true"
        class="custom-data-grid"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
        height="400px"
      >
        <!-- Columnas -->
        <DxColumn
          data-field="descripcion"
          caption="Descripción"
          min-width="200"
          width="300"
        >
          <DxRequiredRule />
        </DxColumn>

        <!-- Botones de edición y eliminación -->
        <DxColumn type="buttons" width="120">
          <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
          <DxButton icon="trash" hint="Eliminar" @click="eliminarEstadoCivil" />
        </DxColumn>

        <!-- Opciones adicionales -->
        <DxSummary>
          <DxGroupItem
            summary-type="count"
            displayFormat="{0} estados civiles"
          />
        </DxSummary>
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
                    ? "Editar Estado Civil"
                    : "Agregar Nuevo Estado Civil"
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
                    v-model="estadoCivilSeleccionado.descripcion"
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
                  :label="
                    isEditMode
                      ? 'Actualizar Estado Civil'
                      : 'Guardar Estado Civil'
                  "
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
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
  DxRequiredRule,
  DxSummary,
  DxGroupItem,
} from "devextreme-vue/data-grid";
import { useEstadoCivilStore } from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Instancia de la tienda y referencias reactivas
const estadoCivilStore = useEstadoCivilStore();
const { estadosCiviles } = storeToRefs(estadoCivilStore);

// Estados del modal
const mostrarDialogo = ref(false);
const isEditMode = ref(false);

// Datos del estado civil seleccionado
const estadoCivilSeleccionado = ref({
  id: null,
  descripcion: "",
});

// Errores del formulario
const errores = ref({
  descripcion: "",
});

onMounted(async () => {
  await estadoCivilStore.cargarEstadosCiviles();
});

// Función para cargar estados civiles al montar el componente
// const cargarDatos = async () => {
//   try {
//     await estadoCivilStore.cargarEstadosCiviles();
//     console.log("Estados civiles cargados:", estadosCiviles.value);
//   } catch (error) {
//     console.error("Error al cargar estados civiles:", error);
//     Notify.create({
//       message: "Error al cargar los estados civiles.",
//       color: "negative",
//       position: "top-right",
//     });
//   }
// };

// Abrir el formulario para agregar un nuevo estado civil
const abrirDialogoNuevoEstadoCivil = () => {
  isEditMode.value = false;
  resetFormulario();
  mostrarDialogo.value = true;
};

// Abrir el formulario de edición con los datos del estado civil seleccionado
const abrirFormularioEdicion = (e) => {
  const data = e.row.data;
  console.log("Abrir edición con datos:", data); // Log para depuración
  if (!data || !data.id) {
    Notify.create({
      type: "negative",
      message: "Error al abrir el modal: el estado civil no tiene ID.",
      position: "top-right",
    });
    return;
  }
  isEditMode.value = true;
  estadoCivilSeleccionado.value = { ...data };
  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario (agregar o actualizar)
const guardarCambios = async () => {
  const { id, descripcion } = estadoCivilSeleccionado.value;

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
      // Actualizar estado civil
      await estadoCivilStore.actualizarEstadoCivil(id, descripcion.trim());
      Notify.create({
        type: "positive",
        message: "Estado Civil actualizado con éxito",
        position: "top-right",
      });
    } else {
      // Agregar nuevo estado civil
      await estadoCivilStore.agregarEstadoCivil(descripcion.trim());
      Notify.create({
        type: "positive",
        message: "Estado Civil agregado con éxito",
        position: "top-right",
      });
    }

    // Recargar estados civiles y cerrar el modal
    await estadoCivilStore.cargarEstadosCiviles();
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar el estado civil",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Eliminar estado civil
const eliminarEstadoCivil = async (e) => {
  try {
    const estadoCivilId = e.row.data.id;
    await estadoCivilStore.eliminarEstadoCivil(estadoCivilId);
    Notify.create({
      type: "positive",
      message: "Estado Civil eliminado con éxito",
      position: "top-right",
    });
    await estadoCivilStore.cargarEstadosCiviles();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el estado civil",
      position: "top-right",
    });
    console.error("Error al eliminar estado civil:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  resetFormulario();
};

// Resetear el formulario
const resetFormulario = () => {
  estadoCivilSeleccionado.value = {
    id: null,
    descripcion: "",
  };
  errores.value = {
    descripcion: "",
  };
};

// Validador para el campo de descripción
const validador = (val) => !!val || "La descripción es obligatoria";

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
