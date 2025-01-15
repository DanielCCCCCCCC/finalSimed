<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nueva especialidad -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Especialidades Médicas Existentes</h4>
            <p class="parrafo">Catálogo de especialidades médicas del centro</p>
          </div>
          <div>
            <q-btn
              label="Nueva Especialidad"
              flat
              class="btn btn-primary"
              @click="abrirFormularioNuevaEspecialidad"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para Especialidades Médicas -->
      <DxDataGrid
        :data-source="especialidades"
        key-expr="EspecialidadId"
        :show-borders="true"
        class="custom-data-grid"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
      >
        <!-- Columnas -->
        <DxColumn
          data-field="Descripcion"
          caption="Especialidad Médica"
          min-width="200"
          width="300"
        />

        <!-- Botones de edición y eliminación -->
        <DxColumn type="buttons" width="120">
          <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
          <DxButton
            icon="trash"
            hint="Eliminar"
            @click="eliminarEspecialidad"
          />
        </DxColumn>

        <!-- Opciones adicionales -->
        <DxSummary>
          <DxGroupItem
            summary-type="count"
            displayFormat="{0} especialidades"
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
                    ? "Editar Especialidad Médica"
                    : "Agregar Nueva Especialidad"
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
                      v-model="especialidadSeleccionada.Descripcion"
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
                <button
                  type="submit"
                  class="btn btn-primary"
                  style="font-size: 14px; padding: 8px 16px"
                >
                  {{
                    isEditMode
                      ? "Actualizar Especialidad"
                      : "Guardar Especialidad"
                  }}
                </button>
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
  DxSummary,
  DxGroupItem,
  DxGroupPanel,
  DxGrouping,
} from "devextreme-vue/data-grid";
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Instancia de la tienda y referencias reactivas
const especialidadesStore = useEspecialidadMedicaStore();
const { especialidades } = storeToRefs(especialidadesStore);

// Estado para el modal y la especialidad seleccionada
const mostrarDialogo = ref(false);
const isEditMode = ref(false);
const especialidadSeleccionada = ref({
  id: null,
  Descripcion: "",
});

// Errores del formulario
const errores = ref({
  Descripcion: "",
});

// Cargar especialidades al montar el componente
onMounted(async () => {
  await especialidadesStore.cargarGruposSanguineos();
});

// Función para abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  const especialidad = e.row.data;
  especialidadSeleccionada.value = { ...especialidad };
  isEditMode.value = true;
  mostrarDialogo.value = true;
};

// Función para abrir el formulario de agregar nueva especialidad
const abrirFormularioNuevaEspecialidad = () => {
  isEditMode.value = false;
  especialidadSeleccionada.value = {
    id: null,
    Descripcion: "",
  };
  errores.value = {
    Descripcion: "",
  };
  mostrarDialogo.value = true;
};

// Función para guardar los cambios
const guardarCambios = async () => {
  const { id, Descripcion } = especialidadSeleccionada.value;

  // Resetear errores
  errores.value = {
    Descripcion: "",
  };

  // Validar campos requeridos
  let valid = true;
  if (!Descripcion.trim()) {
    errores.value.Descripcion = "La descripción es obligatoria.";
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
      // Actualizar especialidad
      await especialidadesStore.actualizarEspecialidad(id, Descripcion.trim());
      Notify.create({
        type: "positive",
        message: "Especialidad actualizada con éxito",
        position: "top-right",
      });
    } else {
      // Agregar nueva especialidad
      await especialidadesStore.agregarEspecialidad(Descripcion.trim());
      Notify.create({
        type: "positive",
        message: "Especialidad agregada con éxito",
        position: "top-right",
      });
    }

    // Recargar especialidades y cerrar el modal
    await especialidadesStore.cargarEspecialidades();
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar la especialidad",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Función para eliminar especialidad
const eliminarEspecialidad = async (e) => {
  try {
    const especialidadId = e.row.data.EspecialidadId;
    await especialidadesStore.eliminarEspecialidad(especialidadId);
    Notify.create({
      type: "positive",
      message: "Especialidad eliminada con éxito",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar la especialidad",
      position: "top-right",
    });
    console.error("Error al eliminar especialidad:", error);
  }
};

// Función para cerrar el diálogo
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  especialidadSeleccionada.value = {
    id: null,
    Descripcion: "",
  };
  errores.value = {
    Descripcion: "",
  };
};
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
