<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nueva clasificación -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Clasificaciones Existentes</h4>
            <p class="parrafo">Catálogo de clasificaciones del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nueva Clasificación"
              flat
              class="btn btn-primary btn-sm btn-wave right-content fsButton fe fe-plus"
              @click="abrirDialogoNuevaClasificacion"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para clasificaciones -->
      <DxDataGrid
        :data-source="clasificaciones"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="ClasificacionDiagnosticoId"
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
        <!-- Columna para Descripcion de clasificación -->
        <DxColumn
          data-field="Descripcion"
          caption="Descripcion de Clasificación"
          :allow-sorting="true"
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
        <DxColumn type="buttons" :width="120">
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
            @click="eliminarClasificacion"
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
                  isEditMode ? "Editar Clasificación" : "Agregar Clasificación"
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
                      v-model="clasificacionSeleccionada.Descripcion"
                      placeholder="Ingrese descripción"
                      required
                    />
                  </div>
                  <div
                    v-if="errores.Descripcion"
                    class="text-danger fs-13 mt-1"
                  >
                    {{ errores.Descripcion }}
                  </div>
                </div>
              </div>

              <div class="flex justify-center q-mt-sm">
                <q-btn
                  :label="
                    isEditMode
                      ? 'Actualizar Clasificación'
                      : 'Guardar Clasificación'
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
  DxEditing,
  DxRequiredRule,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
  DxSelection,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useClasificacionDiagnosticosStore } from "../stores/DiagnosticosStores";

// Instancia de la tienda
const clasificacionStore = useClasificacionDiagnosticosStore();

// Referencias reactivas a los datos de la tienda
const clasificaciones = ref([]);

// Estados del modal
const mostrarDialogo = ref(false);
const isEditMode = ref(false);

// Datos de la clasificación seleccionada
const clasificacionSeleccionada = ref({
  ClasificacionDiagnosticoId: null,
  Descripcion: "",
});

// Errores del formulario
const errores = ref({});

// Función para cargar clasificaciones
const cargarClasificaciones = async () => {
  try {
    await clasificacionStore.cargarClasificaciones();
    clasificaciones.value = clasificacionStore.clasificaciones;
    console.log("Clasificaciones cargadas:", clasificaciones.value);
  } catch (error) {
    console.error("Error al cargar clasificaciones:", error);
    Notify.create({
      message: "Error al cargar las clasificaciones.",
      color: "negative",
      position: "top-right",
    });
  }
};

// Abrir el formulario para agregar una nueva clasificación
const abrirDialogoNuevaClasificacion = () => {
  isEditMode.value = false;
  resetFormulario();
  mostrarDialogo.value = true;
};

// Abrir el formulario de edición con los datos de la clasificación seleccionada
const abrirFormularioEdicion = (e) => {
  const data = e.row.data;
  console.log("Abrir edición con datos:", data);
  if (!data || !data.ClasificacionDiagnosticoId) {
    Notify.create({
      type: "negative",
      message: "Error al abrir el modal: la clasificación no tiene ID.",
      position: "top-right",
    });
    return;
  }
  isEditMode.value = true;
  clasificacionSeleccionada.value = { ...data };
  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario (agregar o actualizar)
const guardarCambios = async () => {
  const id = clasificacionSeleccionada.value.ClasificacionDiagnosticoId;
  const Descripcion = clasificacionSeleccionada.value.Descripcion.trim();

  errores.value = {};

  if (!Descripcion) {
    errores.value.Descripcion =
      " Descripcion de la clasificación es obligatorio.";
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    if (isEditMode.value) {
      await clasificacionStore.actualizarClasificacion(id, {
        Descripcion: Descripcion,
      });
      Notify.create({
        type: "positive",
        message: "Clasificación actualizada con éxito",
        position: "top-right",
      });
    } else {
      await clasificacionStore.agregarClasificacion(Descripcion);
      Notify.create({
        type: "positive",
        message: "Clasificación agregada con éxito",
        position: "top-right",
      });
    }
    await cargarClasificaciones();
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar la clasificación",
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
  clasificacionSeleccionada.value = {
    ClasificacionDiagnosticoId: null,
    Descripcion: "",
  };
  errores.value = {};
};

// Eliminar clasificación
const eliminarClasificacion = async (e) => {
  const data = e.row.data;
  console.log("Eliminar clasificación con datos:", data); // Log para depuración
  if (!data || !data.ClasificacionDiagnosticoId) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar: la clasificación no tiene ID.",
      position: "top-right",
    });
    return;
  }

  try {
    await clasificacionStore.eliminarClasificacion(
      data.ClasificacionDiagnosticoId
    );
    Notify.create({
      type: "positive",
      message: "Clasificación eliminada con éxito",
      position: "top-right",
    });
    await cargarClasificaciones();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar la clasificación",
      position: "top-right",
    });
    console.error("Error al eliminar clasificación:", error);
  }
};

// Cargar clasificaciones al montar el componente
onMounted(cargarClasificaciones);
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
