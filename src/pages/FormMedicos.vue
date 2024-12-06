<!-- FormMedicos.vue -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <q-form
      class="bg-grey-1 shadow-2 q-pa-md rounded-xl formS"
      style="max-width: 550px; width: 100%"
      @submit.prevent="guardarMedico"
    >
      <div class="text-center q-mb-md">
        <h1 class="text-h5 text-sky-900 uppercase">
          {{ isEditing ? "Editar Médico" : "Agregar Médico Referente" }}
        </h1>
      </div>

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
          style="font-size: 14px; padding: 8px 16px"
        />
      </div>
    </q-form>
    <div class="q-mt-xl flex flex-center">
      <ListadoMedicos @editarMedico="cargarMedicoParaEditar" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMedicoStore } from "../stores/MedicoStores";
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";
import ListadoMedicos from "./ListadoMedicos.vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";

const $q = useQuasar();
const medicoStore = useMedicoStore();
const especialidadMedicaStore = useEspecialidadMedicaStore();

const { especialidades } = storeToRefs(especialidadMedicaStore);

// Datos del formulario
const formData = ref({
  nombre: "",
  direccion: "",
  especialidadId: null, // Almacena solo el ID numérico
  telefonoPersonal: "",
  telefonoCasa: "",
  email: "",
});
const formErrors = ref({});
const isEditing = ref(false);
let selectedMedicoId = null;

onMounted(async () => {
  await especialidadMedicaStore.cargarEspecialidades();
  // console.log("Especialidades cargadas:", especialidades.value);
});

// Cargar médico para editar
function cargarMedicoParaEditar(medico) {
  // console.log("Datos del médico recibidos para edición:", medico);

  // Convertir especialidadId a número
  const especialidadIdNumerico = Number(medico.especialidadId);

  // Encontrar la especialidad completa
  const especialidad = especialidades.value.find(
    (esp) => esp.id === especialidadIdNumerico
  );

  if (!especialidad) {
    console.warn(
      `La especialidad con ID ${medico.especialidadId} no se encontró.`
    );
    $q.notify({
      type: "warning",
      message:
        "La especialidad asociada al médico no se encontró. Por favor, selecciona una especialidad válida.",
      position: "top-right",
    });
    // Asignar null o un valor predeterminado si la especialidad no existe
    formData.value.especialidadId = null;
  } else {
    // Asignar solo el ID de la especialidad
    formData.value.especialidadId = especialidad.id;
  }

  // Asignar otros campos del formulario
  formData.value.nombre = medico.nombre || "";
  formData.value.direccion = medico.direccion || "";
  formData.value.telefonoPersonal = medico.telefonoPersonal || "";
  formData.value.telefonoCasa = medico.telefonoCasa || "";
  formData.value.email = medico.email || "";

  selectedMedicoId = medico.id || null;
  isEditing.value = true;
}

// Función para guardar o actualizar el médico
async function guardarMedico() {
  const medicoData = {
    nombre: formData.value.nombre,
    direccion: formData.value.direccion,
    especialidadId: formData.value.especialidadId.id, // Asignar directamente el ID numérico
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
      // console.log("Actualizado médico con éxito:", medicoData);
      $q.notify({
        type: "positive",
        message: "Médico actualizado exitosamente",
        position: "top-right",
      });
    } else {
      // console.log("Agregando nuevo médico con datos:", medicoData);
      await medicoStore.agregarMedico(medicoData);
      $q.notify({
        type: "positive",
        message: "Médico agregado exitosamente",
        position: "top-right",
      });
    }
    resetFormulario();
  } catch (error) {
    console.error("Error al procesar el médico:", error);
    $q.notify({
      type: "negative",
      message: "Hubo un error al procesar el médico",
      position: "top-right",
    });
  }
}

// Función para reiniciar el formulario
function resetFormulario() {
  formData.value = {
    nombre: "",
    direccion: "",
    especialidadId: null, // Asignar el ID numérico o null
    telefonoPersonal: "",
    telefonoCasa: "",
    email: "",
  };
  isEditing.value = false;
  selectedMedicoId = null;
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
}

.form-avatar {
  background-color: #acb5c7;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

.q-form {
  background-color: #0f6eea;
  margin-top: 10px;
  margin-bottom: -40px;
}

.q-btn {
  font-weight: bold;
}

.formS {
  border-top-left-radius: 40px; /* Esquina superior izquierda */
  border-top-right-radius: 15px; /* Esquina superior derecha */
  border-bottom-right-radius: 40px; /* Esquina inferior derecha */
  border-bottom-left-radius: 25px; /* Esquina inferior izquierda */
}
</style>
