<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nuevo hospital -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Hospitales Existentes</h4>
            <p class="parrafo">Catálogo de hospitales del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo Hospital"
              flat
              class="btn btn-primary btn-sm btn-wave right-content fsButton fe fe-plus"
              @click="abrirDialogoNuevoHospital"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid de hospitales -->
      <DxDataGrid
        :data-source="hospitalesConDetalles"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="id"
        class="custom-data-grid"
      >
        <DxColumn data-field="id" caption="ID Hospital" width="100px" />
        <DxColumn data-field="nombre" caption="Nombre del Hospital">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="direccion" caption="Dirección">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="departamentoDescripcion" caption="Departamento">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="municipioDescripcion" caption="Municipio">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="telefono" caption="Teléfono" width="100px">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="email" caption="Correo Electrónico" />
        <DxColumn data-field="web" caption="Sitio Web" width="120px" />

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
        <DxPaging :enabled="true" :page-size="10" />
        <!-- <DxScrolling mode="virtual" /> -->
        <DxFilterRow :visible="false" />
        <DxHeaderFilter :visible="true" />
        <DxSearchPanel
          :width="300"
          :visible="true"
          placeholder="Buscar Contacto"
        />
        <DxColumn type="buttons">
          <DxButton
            name="edit"
            icon="edit"
            @click="(e) => cargarHospitalParaEditar(e.row.data)"
          />
          <DxButton
            name="delete"
            icon="trash"
            @click="(e) => handleDelete(e.row.data.id)"
          />
        </DxColumn>
      </DxDataGrid>
    </div>

    <!-- Diálogo Modal para Agregar/Editar Hospital -->
    <q-dialog v-model="dialogoHospital" persistent max-width="600px">
      <q-card class="form-card shadow-2 rounded-borders">
        <q-card-section>
          <div class="q-mb-md flex justify-between items-center">
            <h2 class="text-h4 text-primary">
              {{ isEditing ? "Editar Hospital" : "Agregar Hospital" }}
            </h2>
            <q-btn
              label="Cerrar"
              color="secondary"
              icon="close"
              flat
              @click="cerrarDialogo"
            />
          </div>

          <q-form @submit.prevent="guardarHospital">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-3 flex flex-center q-mb-sm">
                <q-avatar size="96px" class="form-avatar">
                  <q-icon name="medical_services" size="48px" />
                </q-avatar>
              </div>

              <div class="col-12 col-md-9">
                <q-input
                  v-model="formData.nombre"
                  label="Nombre del Hospital"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.nombre"
                  :error-message="formErrors.nombre"
                  required
                />
                <q-input
                  v-model="formData.direccion"
                  label="Dirección"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.direccion"
                  :error-message="formErrors.direccion"
                  required
                />
                <q-select
                  v-model="formData.departamento_id"
                  :options="departamentos"
                  option-value="id"
                  option-label="descripcion"
                  placeholder="Seleccione un departamento"
                  dense
                  required
                  class="form-select"
                  @update:model-value="onDepartamentoChange"
                  :error="!!formErrors.departamento_id"
                  :error-message="formErrors.departamento_id"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Municipio</label>
                <q-select
                  v-model="formData.municipio_id"
                  :options="filteredMunicipios"
                  option-value="id"
                  option-label="descripcion"
                  placeholder="Seleccione un municipio"
                  dense
                  required
                  class="form-select"
                  :disable="!formData.departamento_id"
                  :error="!!formErrors.municipio_id"
                  :error-message="formErrors.municipio_id"
                  emit-value
                  map-options
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.telefono"
                  label="Teléfono"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.telefono"
                  :error-message="formErrors.telefono"
                  required
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.email"
                  label="Correo Electrónico"
                  type="email"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                  :error="!!formErrors.email"
                  :error-message="formErrors.email"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input
                  v-model="formData.web"
                  label="Sitio Web"
                  type="url"
                  outlined
                  dense
                  style="font-size: 14px; height: auto"
                />
              </div>
            </div>

            <div class="flex justify-center q-mt-sm">
              <q-btn
                :label="isEditing ? 'Actualizar Hospital' : 'Guardar Hospital'"
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
import { ref, computed, onMounted } from "vue";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxSorting,
  DxLoadPanel,
  DxColumnChooser,
  DxEditing,
  DxSearchPanel,
  DxButton,
  DxSelection,
} from "devextreme-vue/data-grid";

import { useHospitalStore } from "../stores/DirectoriosStores";
import { useDepartamentoStore } from "../stores/DatosGeneralesStores";
import { useMunicipioStore } from "../stores/DatosGeneralesStores";

const $q = useQuasar();
const hospitalStore = useHospitalStore();
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();

const { hospitales } = storeToRefs(hospitalStore);
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);

// Diálogo modal
const dialogoHospital = ref(false);
const isEditing = ref(false);
let selectedHospitalId = null;

const formData = ref({
  nombre: "",
  direccion: "",
  departamento_id: null,
  municipio_id: null,
  telefono: "",
  email: "",
  web: "",
  tenant_Id: null, // se puede asignar si es necesario, o dejarlo null
});

const formErrors = ref({});

onMounted(async () => {
  try {
    await departamentoStore.cargarDepartamentos();
    await municipioStore.cargarMunicipios();
    await hospitalStore.cargarHospitales();
  } catch (error) {
    console.error("Error al cargar datos:", error);
    Notify.create({
      message: "Error al cargar los datos iniciales.",
      color: "negative",
      position: "top-right",
    });
  }
});

// Computed para construir hospitales con descripciones de departamento y municipio
const hospitalesConDetalles = computed(() => {
  return (hospitales.value || []).map((hospital) => {
    const depto = (departamentos.value || []).find(
      (d) => d.id === hospital.departamento_id
    );
    const muni = (municipios.value || []).find(
      (m) => m.id === hospital.municipio_id
    );
    return {
      ...hospital,
      departamentoDescripcion: depto
        ? depto.descripcion
        : "Departamento no encontrado",
      municipioDescripcion: muni ? muni.descripcion : "Municipio no encontrado",
    };
  });
});

// Computed para filtrar municipios basados en el departamento seleccionado
const filteredMunicipios = computed(() => {
  if (!formData.value.departamento_id) return [];
  const deptId =
    formData.value.departamento_id.id || formData.value.departamento_id;
  return municipios.value.filter(
    (municipio) => municipio.departamentoId === deptId
  );
});

// Función para manejar el cambio de departamento
function onDepartamentoChange() {
  formData.value.municipio_id = null; // Resetear el municipio al cambiar de departamento
}

// Función para abrir el diálogo de nuevo hospital
function abrirDialogoNuevoHospital() {
  isEditing.value = false;
  resetFormulario();
  dialogoHospital.value = true;
}

// Función para cerrar el diálogo
function cerrarDialogo() {
  dialogoHospital.value = false;
  resetFormulario();
}

// Función para resetear el formulario
function resetFormulario() {
  formData.value = {
    nombre: "",
    direccion: "",
    departamento_id: null,
    municipio_id: null,
    telefono: "",
    email: "",
    web: "",
    tenant_Id: null,
  };
  formErrors.value = {};
  isEditing.value = false;
  selectedHospitalId = null;
}

// Función para cargar hospital para editar
function cargarHospitalParaEditar(hospital) {
  formData.value.nombre = hospital.nombre || "";
  formData.value.direccion = hospital.direccion || "";
  formData.value.departamento_id = hospital.departamento_id || null;
  formData.value.municipio_id = hospital.municipio_id || null;
  formData.value.telefono = hospital.telefono || "";
  formData.value.email = hospital.email || "";
  formData.value.web = hospital.web || "";
  formData.value.tenant_Id = hospital.tenant_Id || null;

  selectedHospitalId = hospital.id || null;
  isEditing.value = true;
  dialogoHospital.value = true;
}

// Función para guardar o actualizar hospital
async function guardarHospital() {
  // Validar campos requeridos
  formErrors.value = {};
  if (!formData.value.nombre)
    formErrors.value.nombre = "El nombre es obligatorio";
  if (!formData.value.direccion)
    formErrors.value.direccion = "La dirección es obligatoria";
  if (!formData.value.departamento_id)
    formErrors.value.departamento_id = "Seleccione un departamento";
  if (!formData.value.municipio_id)
    formErrors.value.municipio_id = "Seleccione un municipio";
  if (!formData.value.telefono)
    formErrors.value.telefono = "El teléfono es obligatorio";

  if (Object.keys(formErrors.value).length > 0) {
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return; // Si hay errores, no continuar
  }

  const hospitalData = {
    nombre: formData.value.nombre,
    direccion: formData.value.direccion,
    departamento_id: formData.value.departamento_id,
    municipio_id: formData.value.municipio_id,
    telefono: formData.value.telefono,
    email: formData.value.email,
    web: formData.value.web,
    tenant_Id: formData.value.tenant_Id,
  };

  try {
    if (isEditing.value && selectedHospitalId) {
      await hospitalStore.actualizarHospital({
        id: selectedHospitalId,
        ...hospitalData,
      });
      $q.notify({
        type: "positive",
        message: "Hospital actualizado exitosamente",
        position: "top-right",
      });
    } else {
      await hospitalStore.agregarHospital(hospitalData);
      $q.notify({
        type: "positive",
        message: "Hospital agregado exitosamente",
        position: "top-right",
      });
    }
    await hospitalStore.cargarHospitales(); // Actualizar el listado
    cerrarDialogo();
  } catch (error) {
    console.error("Error al procesar el hospital:", error);
    $q.notify({
      type: "negative",
      message: "Hubo un error al procesar el hospital",
      position: "top-right",
    });
  }
}

// Función para eliminar hospital
async function handleDelete(hospitalId) {
  try {
    const success = await hospitalStore.eliminarHospital(hospitalId);
    console.log("Resultado de eliminarHospital:", success); // Depuración

    if (success) {
      $q.notify({
        type: "positive",
        message: "Hospital eliminado exitosamente",
        position: "top-right",
      });
      await hospitalStore.cargarHospitales(); // Recargar lista actualizada
    } else {
      $q.notify({
        type: "negative",
        message: "Error al eliminar el hospital",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error al eliminar el hospital:", error);
    $q.notify({
      type: "negative",
      message: "Error inesperado al eliminar el hospital",
      position: "top-right",
    });
  }
}
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
  padding: 1% 2% 1% 3%;
  /* padding-left: 25px; */
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
