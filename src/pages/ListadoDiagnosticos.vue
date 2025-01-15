<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nuevo diagnóstico -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Diagnósticos Existentes</h4>
            <p class="parrafo">Catálogo de diagnósticos del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo Diagnóstico"
              flat
              class="btn btn-primary"
              @click="abrirDialogoNuevoDiagnostico"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para diagnósticos -->
      <DxDataGrid
        :data-source="diagnosticos"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="DignosticoId"
        class="custom-data-grid"
      >
        <DxPaging :enabled="true" :page-size="10" />
        <!-- <DxScrolling mode="virtual" /> -->
        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxColumnChooser :enabled="true" />
        <DxLoadPanel :show-pane="true" />
        <!-- <DxSelection
          select-all-mode="allPages"
          show-check-boxes-mode="always"
          mode="multiple"
        /> -->

        <DxSearchPanel
          :width="300"
          :visible="true"
          placeholder="Buscar Estudio"
        />

        <!-- Columna para descripción del diagnóstico -->
        <DxColumn
          data-field="Descripcion"
          caption="Descripción"
          min-width="200"
          width="300"
        >
          <DxRequiredRule />
        </DxColumn>

        <!-- Columna con lookup para mostrar nombre de clasificación -->
        <DxColumn
          data-field="ClasificacionDiagnosticoId"
          caption="Clasificación"
          :lookup="{
            dataSource: clasificaciones,
            valueExpr: 'id',
            displayExpr: 'Descripcion',
          }"
          min-width="150"
          width="200"
        >
          <DxRequiredRule />
        </DxColumn>
        <DxEditing
          mode="popup"
          :allow-updating="true"
          :allow-deleting="true"
          :popup="{
            title: 'Editar Información del Hospital',
            showTitle: true,
            width: 700,
            height: 470,
          }"
        />
        <!-- Botones de acción -->
        <DxColumn type="buttons" width="120">
          <DxButton
            name="edit"
            icon="edit"
            hint="Editar"
            @click="abrirFormularioEdicion"
          />
          <DxButton
            name="delete"
            icon="trash"
            hint="Eliminar"
            @click="eliminarDiagnostico"
          />
        </DxColumn>
      </DxDataGrid>

      <!-- Modal de edición/agregación -->
      <q-dialog v-model="mostrarDialogo" persistent max-width="600px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                {{
                  isEditMode
                    ? "Editar Diagnóstico"
                    : "Agregar Nuevo Diagnóstico"
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
              <div class="mb-3">
                <label for="Descripcion" class="form-label fs-14 text-dark">
                  Descripción<span class="required">*</span>
                </label>
                <div class="input-group">
                  <div class="input-group-text">
                    <i class="ri-text-wrap"></i>
                  </div>
                  <input
                    type="text"
                    id="Descripcion"
                    class="form-control"
                    v-model="diagnosticoSeleccionado.Descripcion"
                    placeholder="Ingrese descripción"
                    required
                  />
                </div>
                <div v-if="errores.Descripcion" class="text-danger fs-13 mt-1">
                  {{ errores.Descripcion }}
                </div>
              </div>

              <div class="mb-3">
                <label
                  for="clasificacionSelect"
                  class="form-label fs-14 text-dark"
                >
                  Clasificación<span class="required">*</span>
                </label>
                <div class="input-group">
                  <div class="input-group-text">
                    <i class="ri-article-line"></i>
                  </div>
                  <select
                    id="clasificacionSelect"
                    class="form-select"
                    v-model="diagnosticoSeleccionado.ClasificacionDiagnosticoId"
                    required
                  >
                    <option disabled value="">
                      Seleccione una clasificación
                    </option>
                    <option
                      v-for="clasificacion in clasificaciones"
                      :key="clasificacion.ClasificacionDiagnosticoId"
                      :value="clasificacion.ClasificacionDiagnosticoId"
                    >
                      {{ clasificacion.Descripcion }}
                    </option>
                  </select>
                </div>
                <div
                  v-if="errores.ClasificacionDiagnosticoId"
                  class="text-danger fs-13 mt-1"
                >
                  {{ errores.ClasificacionDiagnosticoId }}
                </div>
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                style="font-size: 14px; padding: 8px 16px"
              >
                {{
                  isEditMode ? "Actualizar Diagnóstico" : "Guardar Diagnóstico"
                }}
              </button>
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
  DxEditing,
  DxRequiredRule,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
  DxSelection,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { ref, onMounted, watch } from "vue";
import { Notify } from "quasar";
import {
  useDiagnosticosStore,
  useClasificacionDiagnosticosStore,
} from "../stores/DiagnosticosStores";
import { storeToRefs } from "pinia";

// Instancia de las tiendas
const diagnosticosStore = useDiagnosticosStore();
const clasificacionDiagnosticosStore = useClasificacionDiagnosticosStore();

// Referencias reactivas a los datos de las tiendas
const { diagnosticos } = storeToRefs(diagnosticosStore);
const { clasificaciones } = storeToRefs(clasificacionDiagnosticosStore);

// Estados del modal
const mostrarDialogo = ref(false);
const isEditMode = ref(false);

// Datos del diagnóstico seleccionado
const diagnosticoSeleccionado = ref({
  id: null,
  Descripcion: "",
  ClasificacionDiagnosticoId: null,
});

// Errores del formulario
const errores = ref({
  Descripcion: "",
  ClasificacionDiagnosticoId: "",
});

// Función para cargar diagnósticos y clasificaciones
const cargarDatos = async () => {
  try {
    await Promise.all([
      diagnosticosStore.cargarDiagnosticos(),
      clasificacionDiagnosticosStore.cargarClasificaciones(),
    ]);
    console.log("Diagnósticos cargados:", diagnosticos.value);
    console.log("Clasificaciones cargadas:", clasificaciones.value);
  } catch (error) {
    console.error("Error al cargar datos:", error);
    Notify.create({
      message: "Error al cargar los datos.",
      color: "negative",
      position: "top-right",
    });
  }
};

// Abrir el formulario para agregar un nuevo diagnóstico
const abrirDialogoNuevoDiagnostico = () => {
  isEditMode.value = false;
  resetFormulario();
  mostrarDialogo.value = true;
};

// Abrir el formulario de edición con los datos del diagnóstico seleccionado
const abrirFormularioEdicion = (e) => {
  const data = e.row.data;
  console.log("Abrir edición con datos:", data); // Log para depuración
  if (!data || !data.id) {
    Notify.create({
      type: "negative",
      message: "Error al abrir el modal: el diagnóstico no tiene ID.",
      position: "top-right",
    });
    return;
  }
  isEditMode.value = true;
  diagnosticoSeleccionado.value = { ...data };
  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario (agregar o actualizar)
const guardarCambios = async () => {
  const { id, Descripcion, ClasificacionDiagnosticoId } =
    diagnosticoSeleccionado.value;

  // Resetear errores
  errores.value = {
    Descripcion: "",
    ClasificacionDiagnosticoId: "",
  };

  // Validar campos requeridos
  let valid = true;
  if (!Descripcion.trim()) {
    errores.value.Descripcion = "La descripción es obligatoria.";
    valid = false;
  }
  if (!ClasificacionDiagnosticoId) {
    errores.value.ClasificacionDiagnosticoId =
      "La clasificación es obligatoria.";
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
      // Actualizar diagnóstico
      await diagnosticosStore.actualizarDiagnostico(id, {
        Descripcion: Descripcion.trim(),
        ClasificacionDiagnosticoId,
      });
      Notify.create({
        type: "positive",
        message: "Diagnóstico actualizado con éxito",
        position: "top-right",
      });
    } else {
      // Agregar nuevo diagnóstico
      await diagnosticosStore.agregarDiagnostico(
        Descripcion.trim(),
        ClasificacionDiagnosticoId
      );
      Notify.create({
        type: "positive",
        message: "Diagnóstico agregado con éxito",
        position: "top-right",
      });
    }

    // Recargar diagnósticos y cerrar el modal
    await diagnosticosStore.cargarDiagnosticos();
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar el diagnóstico",
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
  diagnosticoSeleccionado.value = {
    id: null,
    Descripcion: "",
    ClasificacionDiagnosticoId: null,
  };
  errores.value = {
    Descripcion: "",
    ClasificacionDiagnosticoId: "",
  };
};

// Eliminar diagnóstico
const eliminarDiagnostico = async (e) => {
  const data = e.row.data;
  console.log("Eliminar diagnóstico con datos:", data); // Log para depuración
  if (!data || !data.DignosticoId) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar: el diagnóstico no tiene ID.",
      position: "top-right",
    });
    return;
  }

  try {
    await diagnosticosStore.eliminarDiagnostico(data.DignosticoId);
    Notify.create({
      type: "positive",
      message: "Diagnóstico eliminado con éxito",
      position: "top-right",
    });
    await diagnosticosStore.cargarDiagnosticos();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el diagnóstico",
      position: "top-right",
    });
    console.error("Error al eliminar diagnóstico:", error);
  }
};
watch(
  () => diagnosticoSeleccionado.value.ClasificacionDiagnosticoId,
  (nuevoValor) => {
    console.log("Clasificación seleccionada:", nuevoValor);
  }
);

// Cargar datos al montar el componente
onMounted(cargarDatos);
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
  border-radius: 8px;
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

.text-negative {
  color: #f44336;
}

.text-caption {
  font-size: 12px;
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
