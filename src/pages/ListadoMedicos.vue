<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Botón para agregar nuevo médico -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Directorio Medicos</h4>
            <p class="parrafo">Catálogo de médicos del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo Médico"
              flat
              class="btn btn-primary"
              @click="abrirDialogoNuevoMedico"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid: listado de médicos -->
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

          <!-- Reemplazamos q-form por form nativo -->
          <form @submit.prevent="guardarMedico">
            <div class="row q-col-gutter-sm">
              <!-- Avatar (opcional, no es un input) -->
              <div class="col-12 col-md-3 flex flex-center q-mb-sm">
                <q-avatar size="96px" class="form-avatar">
                  <q-icon name="person" size="48px" />
                </q-avatar>
              </div>

              <!-- Campos de la parte superior -->
              <div class="col-12 col-md-9">
                <!-- Nombre -->
                <label class="form-label">Nombre</label>
                <input
                  v-model="formData.nombre"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.nombre }"
                  placeholder="Nombre"
                />
                <div v-if="formErrors.nombre" class="invalid-feedback">
                  {{ formErrors.nombre }}
                </div>

                <!-- Dirección -->
                <label class="form-label">Dirección</label>
                <input
                  v-model="formData.direccion"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.direccion }"
                  placeholder="Dirección"
                />
                <div v-if="formErrors.direccion" class="invalid-feedback">
                  {{ formErrors.direccion }}
                </div>

                <!-- Especialidad -->
                <label class="form-label">Especialidad</label>
                <select
                  v-model="formData.especialidadId"
                  class="form-select"
                  :class="{ 'is-invalid': formErrors.especialidadId }"
                >
                  <option disabled value="">Seleccione una especialidad</option>
                  <option
                    v-for="esp in especialidades"
                    :key="esp.id"
                    :value="esp.id"
                  >
                    {{ esp.descripcion }}
                  </option>
                </select>
                <div v-if="formErrors.especialidadId" class="invalid-feedback">
                  {{ formErrors.especialidadId }}
                </div>
              </div>
            </div>

            <!-- Campos de la parte inferior (Teléfonos y Email) -->
            <div class="row q-col-gutter-sm">
              <!-- Teléfono Personal -->
              <div class="col-12 col-md-6">
                <label class="form-label">Teléfono</label>
                <input
                  v-model="formData.telefonoPersonal"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.telefonoPersonal }"
                  placeholder="####-####"
                />
                <div
                  v-if="formErrors.telefonoPersonal"
                  class="invalid-feedback"
                >
                  {{ formErrors.telefonoPersonal }}
                </div>
              </div>

              <!-- Teléfono Casa -->
              <div class="col-12 col-md-6">
                <label class="form-label">Teléfono Casa</label>
                <input
                  v-model="formData.telefonoCasa"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.telefonoCasa }"
                  placeholder="####-####"
                />
                <div v-if="formErrors.telefonoCasa" class="invalid-feedback">
                  {{ formErrors.telefonoCasa }}
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <label class="form-label">Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': formErrors.email }"
                  placeholder="Correo electrónico"
                />
                <div v-if="formErrors.email" class="invalid-feedback">
                  {{ formErrors.email }}
                </div>
              </div>
            </div>

            <!-- Botón de Guardar/Actualizar -->
            <div class="flex justify-center q-mt-sm">
              <button
                class="btn btn-primary"
                style="font-size: 14px; padding: 8px 16px"
                type="submit"
              >
                {{ isEditing ? "Actualizar Médico" : "Guardar Médico" }}
              </button>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

// DevExtreme DataGrid
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
  DxEditing,
} from "devextreme-vue/data-grid";

// Stores
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

// Datos del formulario
const formData = ref({
  nombre: "",
  direccion: "",
  especialidadId: null,
  telefonoPersonal: "",
  telefonoCasa: "",
  email: "",
});

// Errores de validación
const formErrors = ref({});

// Al montar el componente cargamos datos
onMounted(async () => {
  try {
    await especialidadMedicaStore.cargarEspecialidades();
    await medicoStore.cargarMedicos();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
});

// Computed para mostrar la especialidad por su descripción
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

// Responsividad del DataGrid
const responsiveWidth = ref(window.innerWidth < 600 ? "100%" : "auto");
const updateWidth = () => {
  responsiveWidth.value = window.innerWidth < 600 ? "100%" : "auto";
};
window.addEventListener("resize", updateWidth);

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// ----------------------------------------------------------
// Funciones para el modal
// ----------------------------------------------------------
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

// ----------------------------------------------------------
// Función para cargar datos y editar
// ----------------------------------------------------------
function cargarMedicoParaEditar(medico) {
  // Verificamos la especialidad
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

// ----------------------------------------------------------
// Guardar o actualizar médico
// ----------------------------------------------------------
async function guardarMedico() {
  // Puedes agregar validaciones personalizadas
  formErrors.value = {};
  if (!formData.value.nombre.trim()) {
    formErrors.value.nombre = "El nombre es obligatorio";
  }
  if (!formData.value.direccion.trim()) {
    formErrors.value.direccion = "La dirección es obligatoria";
  }
  if (!formData.value.especialidadId) {
    formErrors.value.especialidadId = "La especialidad es obligatoria";
  }
  // Teléfonos no siempre son obligatorios, depende de tu lógica
  // Email también, si lo deseas
  // if (!formData.value.email.trim()) {
  //   formErrors.value.email = "El email es obligatorio";
  // }

  // Si hay errores, mostrarlos y detener
  if (Object.keys(formErrors.value).length > 0) {
    $q.notify({
      type: "negative",
      message: "Corrige los errores del formulario",
      position: "top-right",
    });
    return;
  }

  const medicoData = {
    nombre: formData.value.nombre,
    direccion: formData.value.direccion,
    especialidadId:
      typeof formData.value.especialidadId === "object"
        ? formData.value.especialidadId.id
        : formData.value.especialidadId,
    telefonoCasa: formData.value.telefonoCasa,
    telefonoPersonal: formData.value.telefonoPersonal,
    email: formData.value.email,
  };

  try {
    if (isEditing.value && selectedMedicoId) {
      // Actualizar
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
      // Agregar
      await medicoStore.agregarMedico(medicoData);
      $q.notify({
        type: "positive",
        message: "Médico agregado exitosamente",
        position: "top-right",
      });
    }
    await medicoStore.cargarMedicos(); // Refrescar el listado
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

// ----------------------------------------------------------
// Eliminar médico
// ----------------------------------------------------------
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
/* Contenedor principal */
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

/* Clases de error estilo Bootstrap */
.is-invalid {
  border: 1px solid #dc3545 !important;
}
.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Responsivo */
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
