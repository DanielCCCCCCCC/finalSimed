<template>
  <div class="row justify-center q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Botón para agregar nuevo médico -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Médicos Existentes</h4>
            <p class="parrafo">Catálogo de médicos del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo Médico"
              flat
              class="btn btn-primary btn-sm btn-wave right-content fsButton fe fe-plus"
              @click="abrirDialogoNuevoMedico"
            />
          </div>
        </div>
      </div>
      <!-- DataGrid: listado de médicos -->
      <!-- <div class="app-container q-mb-xl q-px-md q-pa-xs q-py-md"> -->
      <DxDataGrid
        :data-source="medicosConEspecialidad"
        :allow-column-reordering="true"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="id"
        :column-auto-width="false"
        :column-min-width="50"
        :width="responsiveWidth"
      >
        <DxColumn
          data-field="id"
          caption="ID Médico"
          :allow-sorting="true"
          width="100px"
        />
        <DxColumn
          data-field="nombre"
          caption="Nombre Completo"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="direccion"
          caption="Dirección"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="especialidadDescripcion"
          caption="Especialidad"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="telefonoPersonal"
          caption="Teléfono"
          :allow-sorting="true"
          :visible="true"
          width="100px"
        />
        <DxColumn
          data-field="telefonoCasa"
          caption="Celular"
          :allow-sorting="true"
          :visible="true"
          width="100px"
        />
        <DxColumn
          data-field="email"
          caption="Correo Electrónico"
          :allow-sorting="true"
        />
        <DxEditing
          mode="popup"
          :allow-updating="true"
          :allow-deleting="true"
          :popup="{
            title: 'Editar Información del Contacto',
            showTitle: true,
            width: 700,
            height: 470,
          }"
        />
        <DxPaging :enabled="true" :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />

        <DxColumn type="buttons">
          <DxButton
            name="edit"
            icon="edit"
            @click="(e) => cargarMedicoParaEditar(e.row.data)"
          />
          <DxButton
            name="delete"
            icon="trash"
            @click="(e) => handleDelete(e.row.data.id)"
          />
        </DxColumn>
      </DxDataGrid>
    </div>
    <!-- </div> -->

    <!-- Diálogo Modal para Agregar/Editar Médico -->
    <q-dialog v-model="dialogoMedico" persistent max-width="600px">
      <q-card class="form-card shadow-2 rounded-borders">
        <q-card-section>
          <div class="q-mb-md flex justify-between items-center">
            <h2 class="text-h4 text-primary">
              {{ isEditing ? "Editar Médico" : "Agregar Médico Referente" }}
            </h2>
            <q-btn
              label="Cerrar"
              color="secondary"
              icon="close"
              flat
              @click="cerrarDialogo"
            />
          </div>

          <q-form @submit.prevent="guardarMedico">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-3 flex flex-center q-mb-sm">
                <q-avatar size="96px" class="form-avatar">
                  <q-icon name="person" size="48px" />
                </q-avatar>
              </div>

              <div class="col-12 col-md-9">
                <q-input
                  v-model="formData.nombre"
                  label="Nombre"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.nombre"
                  :error-message="formErrors.nombre"
                />
                <q-input
                  v-model="formData.direccion"
                  label="Dirección"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.direccion"
                  :error-message="formErrors.direccion"
                />
                <q-select
                  v-model="formData.especialidadId"
                  :options="especialidades"
                  label="Especialidad"
                  option-value="id"
                  option-label="descripcion"
                  map-options
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.especialidadId"
                  :error-message="formErrors.especialidadId"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.telefonoPersonal"
                  label="Teléfono"
                  outlined
                  mask="####-####"
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.telefonoPersonal"
                  :error-message="formErrors.telefonoPersonal"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.telefonoCasa"
                  label="Teléfono Casa"
                  outlined
                  mask="####-####"
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.telefonoCasa"
                  :error-message="formErrors.telefonoCasa"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.email"
                  :error-message="formErrors.email"
                />
              </div>
            </div>

            <div class="flex justify-center q-mt-sm">
              <q-btn
                :label="isEditing ? 'Actualizar Médico' : 'Guardar Médico'"
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
  DxEditing,
} from "devextreme-vue/data-grid";

import { useMedicoStore } from "../stores/MedicoStores";
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";

const $q = useQuasar();
const medicoStore = useMedicoStore();
const especialidadMedicaStore = useEspecialidadMedicaStore();

const { medicos } = storeToRefs(medicoStore);
const { especialidades } = storeToRefs(especialidadMedicaStore);

// Dialogo modal
const dialogoMedico = ref(false);
const isEditing = ref(false);
let selectedMedicoId = null;

const formData = ref({
  nombre: "",
  direccion: "",
  especialidadId: null,
  telefonoPersonal: "",
  telefonoCasa: "",
  email: "",
});

const formErrors = ref({});

onMounted(async () => {
  try {
    await especialidadMedicaStore.cargarEspecialidades();
    await medicoStore.cargarMedicos();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
});

const medicosConEspecialidad = computed(() => {
  return (medicos.value || []).map((medico) => {
    const esp = (especialidades.value || []).find(
      (e) => e.id === medico.especialidadId
    );
    return {
      ...medico,
      especialidadDescripcion: esp
        ? esp.descripcion
        : "Especialidad no encontrada",
    };
  });
});

// Manejo de responsive en el ancho del DataGrid
const responsiveWidth = ref(window.innerWidth < 600 ? "100%" : "auto");
const updateWidth = () => {
  responsiveWidth.value = window.innerWidth < 600 ? "100%" : "auto";
};
window.addEventListener("resize", updateWidth);

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// Funciones para el modal
function abrirDialogoNuevoMedico() {
  isEditing.value = false;
  resetFormulario();
  dialogoMedico.value = true;
}

function cerrarDialogo() {
  dialogoMedico.value = false;
  resetFormulario();
}

function resetFormulario() {
  formData.value = {
    nombre: "",
    direccion: "",
    especialidadId: null,
    telefonoPersonal: "",
    telefonoCasa: "",
    email: "",
  };
  formErrors.value = {};
  isEditing.value = false;
  selectedMedicoId = null;
}

// Cargar datos para editar
function cargarMedicoParaEditar(medico) {
  const espIdNumerico = Number(medico.especialidadId);
  const esp = especialidades.value.find((e) => e.id === espIdNumerico);

  if (!esp) {
    $q.notify({
      type: "warning",
      message:
        "La especialidad asociada no se encontró. Selecciona una válida.",
      position: "top-right",
    });
    formData.value.especialidadId = null;
  } else {
    formData.value.especialidadId = esp.id;
  }

  formData.value.nombre = medico.nombre || "";
  formData.value.direccion = medico.direccion || "";
  formData.value.telefonoPersonal = medico.telefonoPersonal || "";
  formData.value.telefonoCasa = medico.telefonoCasa || "";
  formData.value.email = medico.email || "";

  selectedMedicoId = medico.id || null;
  isEditing.value = true;
  dialogoMedico.value = true;
}

// Guardar o actualizar médico
async function guardarMedico() {
  const medicoData = {
    nombre: formData.value.nombre,
    direccion: formData.value.direccion,
    especialidadId:
      formData.value.especialidadId?.id || formData.value.especialidadId,
    telefonoCasa: formData.value.telefonoCasa,
    telefonoPersonal: formData.value.telefonoPersonal,
    email: formData.value.email,
  };

  try {
    if (isEditing.value && selectedMedicoId) {
      await medicoStore.actualizarMedico({
        id: selectedMedicoId,
        ...medicoData,
      });
      $q.notify({
        type: "positive",
        message: "Médico actualizado exitosamente",
        position: "top-right",
      });
    } else {
      await medicoStore.agregarMedico(medicoData);
      $q.notify({
        type: "positive",
        message: "Médico agregado exitosamente",
        position: "top-right",
      });
    }
    await medicoStore.cargarMedicos(); // Actualizar el listado
    cerrarDialogo();
  } catch (error) {
    console.error("Error al procesar el médico:", error);
    $q.notify({
      type: "negative",
      message: "Hubo un error al procesar el médico",
      position: "top-right",
    });
  }
}

// Eliminar médico
async function handleDelete(medicoId) {
  try {
    const success = await medicoStore.eliminarMedico(medicoId);
    if (success) {
      Notify.create({
        message: "Médico eliminado exitosamente",
        color: "green",
        position: "top-right",
      });
      await medicoStore.cargarMedicos();
    } else {
      Notify.create({
        message: "Error al eliminar el médico",
        color: "red",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error al eliminar el médico:", error);
    Notify.create({
      message: "Error al eliminar el médico",
      color: "red",
      position: "top-right",
    });
  }
}
</script>

<style scoped>
/* src/styles/sharedStyles.css */

/* Contenedor principal */
#app-container {
  padding: 20px;
  background-color: #f9f9f9;
  margin: 0 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* position: relative;
  margin-left: 100px;
  margin-right: 100px; */
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
.fsButton {
  font-size: 16px;
}

/* .justify-center {
  position: relative;
  top: -90px;
} */

/*
.text-primary {
  color: #1976d2 !important;
}

.form-card h2 {
  font-weight: bold;
}

.btn-primary {
  background-color: #1976d2;
  color: #ffffff;
}

.btn-secondary {
  background-color: #9e9e9e;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-secondary:hover {
  background-color: #757575;
}

.form-avatar {
  border: 2px solid #1976d2;
  background-color: #acb5c7;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

.dx-datagrid {
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
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
} */

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
/*
.header-container {
  display: flex;
  flex-direction: column;
  margin-right: auto;
}

.parrafo {
  font-size: 1rem;
  color: #555;
  margin: 5px 20px 25px 20px;
}

.header-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 20px 20px 0px;
}

.bajarbtn {
  margin-bottom: -40px;
}

.card .q-input,
.card .q-select {
  margin-bottom: 1rem;
} */
</style>
