<template>
  <q-page class="q-pa-md">
    <!-- Barra de navegación de pestañas -->
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders small-tabs"
      @update:model-value="onTabChange"
    >
      <q-tab
        name="Especialidades Médicas"
        icon="medical_services"
        label="Especialidades Médicas"
      />
      <q-tab
        name="Tipos de Estudios"
        icon="description"
        label="Tipos de Estudios"
      />
      <q-tab
        name="Tipos de Medicamentos"
        icon="medication"
        label="Tipos de Medicamentos"
      />
      <q-tab
        name="Tipos de Pacientes"
        icon="people"
        label="Tipos de Pacientes"
      />
      <q-tab
        name="Grupos de Contactos"
        icon="group"
        label="Grupos de Contactos"
      />
      <q-tab name="Tipos de Citas" icon="event" label="Tipos de Citas" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <!-- Panel para Especialidades Médicas -->
      <q-tab-panel name="Especialidades Médicas">
        <FormEspecialidadesMedicas />
      </q-tab-panel>

      <q-tab-panel name="Tipos de Estudios">
        <FormTiposEstudios />
      </q-tab-panel>

      <q-tab-panel name="Tipos de Medicamentos">
        <FormTiposMedicamentos />
      </q-tab-panel>

      <q-tab-panel name="Tipos de Pacientes">
        <FormTiposPacientes />
      </q-tab-panel>

      <q-tab-panel name="Grupos de Contactos">
        <FormGruposContactos />
      </q-tab-panel>

      <q-tab-panel name="Tipos de Citas">
        <FormTiposCitas />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify } from "quasar";
// import ListadoEspecialidadesMedicas from "./ListadoEspecialidadesMedicas.vue";
// import ListadoTiposEstudios from "./ListadoTiposEstudios.vue";
// import ListadoTiposMedicamentos from "./ListadoTiposMedicamentos.vue";
// import ListadoTipoPacientes from "./ListadoTipoPacientes.vue";
// import ListadoGruposContactos from "./ListadoGruposContactos.vue";
// import ListadoTiposCitas from "./ListadoTiposCitas.vue";
//Formularios

import FormEspecialidadesMedicas from "./FormEspecialidadesMedicas.vue";
import FormTiposEstudios from "./FormTiposEstudios.vue";
import FormTiposMedicamentos from "./FormTiposMedicamentos.vue";
import FormTiposPacientes from "./FormTiposPacientes.vue";
import FormGruposContactos from "./FormGruposContactos.vue";
import FormTiposCitas from "./FormTiposCitas.vue";

// Importar las stores necesarias
import {
  useEspecialidadMedicaStore,
  useTiposEstudiosStore,
  useTiposMedicamentosStore,
  useTiposPacientesStore,
  useGruposContactosStore,
  useTiposCitasStore,
} from "../stores/ConfiMedicasStores";

// Acceder a la ruta y al router
const route = useRoute();
const router = useRouter();

// Definir las pestañas disponibles
const pestañasDisponibles = [
  "Especialidades Médicas",
  "Tipos de Estudios",
  "Tipos de Medicamentos",
  "Tipos de Pacientes",
  "Grupos de Contactos",
  "Tipos de Citas",
];

// Inicializar la pestaña activa desde el parámetro de consulta o por defecto
const tab = ref("Especialidades Médicas");

const inicializarTab = () => {
  const tabQuery = route.query.tab;
  if (tabQuery && pestañasDisponibles.includes(tabQuery)) {
    tab.value = tabQuery;
  }
};

// Llamar a la función al montar el componente
onMounted(() => {
  inicializarTab();
});

// Función para manejar el cambio de pestaña y actualizar la URL
const onTabChange = (nuevaTab) => {
  router.replace({ query: { ...route.query, tab: nuevaTab } });
};

// Observar cambios en la ruta para actualizar la pestaña si la URL cambia
watch(
  () => route.query.tab,
  (nuevaTab) => {
    if (nuevaTab && pestañasDisponibles.includes(nuevaTab)) {
      tab.value = nuevaTab;
    }
  }
);

// Estado y funciones para cada sección

// 1. Especialidades Médicas
const especialidadData = ref({ descripcion: "" });
const especialidadStore = useEspecialidadMedicaStore();

const guardarEspecialidad = async () => {
  const error = validarCampo(especialidadData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await especialidadStore.agregarEspecialidad(
    especialidadData.value.descripcion
  );
  especialidadData.value.descripcion = "";
  Notify.create({
    message: "Especialidad guardada exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarEspecialidad = async () => {
  await especialidadStore.eliminarUltimaEspecialidad();
  Notify.create({
    message: "Última especialidad eliminada",
    color: "warning",
    position: "top-right",
  });
};

// 2. Tipos de Estudios
const estudioData = ref({ descripcion: "" });
const tiposEstudiosStore = useTiposEstudiosStore();

const guardarEstudio = async () => {
  const error = validarCampo(estudioData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposEstudiosStore.agregarEstudio(estudioData.value.descripcion);
  estudioData.value.descripcion = "";
  Notify.create({
    message: "Tipo de estudio guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarEstudio = async () => {
  await tiposEstudiosStore.eliminarUltimoEstudio();
  Notify.create({
    message: "Último tipo de estudio eliminado",
    color: "warning",
    position: "top-right",
  });
};

// 3. Tipos de Medicamentos
const medicamentoData = ref({ descripcion: "" });
const tiposMedicamentosStore = useTiposMedicamentosStore();

const guardarMedicamento = async () => {
  const error = validarCampo(medicamentoData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposMedicamentosStore.agregarMedicamento(
    medicamentoData.value.descripcion
  );
  medicamentoData.value.descripcion = "";
  Notify.create({
    message: "Tipo de medicamento guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarMedicamento = async () => {
  await tiposMedicamentosStore.eliminarUltimoMedicamento();
  Notify.create({
    message: "Último tipo de medicamento eliminado",
    color: "warning",
    position: "top-right",
  });
};

// 4. Tipos de Pacientes
const pacienteData = ref({ descripcion: "" });
const tiposPacientesStore = useTiposPacientesStore();

const guardarPaciente = async () => {
  const error = validarCampo(pacienteData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposPacientesStore.agregarPaciente(pacienteData.value.descripcion);
  pacienteData.value.descripcion = "";
  Notify.create({
    message: "Tipo de paciente guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarPaciente = async () => {
  await tiposPacientesStore.eliminarUltimoPaciente();
  Notify.create({
    message: "Último tipo de paciente eliminado",
    color: "warning",
    position: "top-right",
  });
};

// 5. Grupos de Contactos
const grupoContactoData = ref({ descripcion: "" });
const gruposContactosStore = useGruposContactosStore();

const guardarGrupoContacto = async () => {
  const error = validarCampo(grupoContactoData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await gruposContactosStore.agregarGrupo(grupoContactoData.value.descripcion);
  grupoContactoData.value.descripcion = "";
  Notify.create({
    message: "Grupo de contacto guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarGrupoContacto = async () => {
  await gruposContactosStore.eliminarUltimoGrupo();
  Notify.create({
    message: "Último grupo de contacto eliminado",
    color: "warning",
    position: "top-right",
  });
};

// 6. Tipos de Citas
const citaData = ref({ descripcion: "" });
const tiposCitasStore = useTiposCitasStore();

const guardarCita = async () => {
  const error = validarCampo(citaData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposCitasStore.agregarCita(citaData.value.descripcion);
  citaData.value.descripcion = "";
  Notify.create({
    message: "Tipo de cita guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarCita = async () => {
  await tiposCitasStore.eliminarUltimaCita();
  Notify.create({
    message: "Último tipo de cita eliminado",
    color: "warning",
    position: "top-right",
  });
};

// Función de validación genérica
const validarCampo = (data, campo) => {
  return data[campo].trim() ? "" : `El campo ${campo} es obligatorio.`;
};
</script>

<style scoped>
.q-card {
  max-width: 1100px;
  margin: 0 auto;
}

.wide-card {
  max-width: 700px;
  width: 100%;
  margin-bottom: 50px;
}

.q-tab-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listado-componente {
  max-width: 1800px;
  width: 100%;
  margin: 50px auto;
}

.text-primary {
  color: #1976d2;
}
.formS {
  border-top-left-radius: 40px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 25px;
}
</style>
