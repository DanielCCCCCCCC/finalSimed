<!-- ListadoMedicos.vue -->
<template>
  <!-- Botones de edición y eliminación para vista de tarjetas -->
  <div v-if="isMobileView" class="card-container">
    <div
      v-for="medico in medicosConEspecialidad"
      :key="medico.id"
      class="medico-card"
    >
      <h5>{{ medico.nombre }}</h5>
      <p><strong>Especialidad:</strong> {{ medico.especialidadDescripcion }}</p>
      <p><strong>Teléfono Casa:</strong> {{ medico.telefonoCasa }}</p>
      <p><strong>Email:</strong> {{ medico.email }}</p>
      <div class="card-actions">
        <q-btn
          icon="edit"
          label="Editar"
          color="primary"
          @click="$emit('editarMedico', medico)"
        />
        <q-btn
          icon="delete"
          label="Eliminar"
          color="negative"
          @click="handleDelete(medico.id)"
        />
      </div>
    </div>
  </div>

  <!-- DataGrid para pantallas grandes -->
  <div v-else id="app-container" class="q-mb-xl q-px-md q-pa-xs q-py-md">
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
        :allow-adding="true"
        :allow-deleting="true"
        :popup="{
          title: 'Editar Información del Médico',
          showTitle: true,
          width: 700,
          height: 400,
        }"
      />

      <DxPaging :enabled="true" :page-size="10" />
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />

      <DxColumn type="buttons">
        <DxButton
          name="edit"
          icon="edit"
          @click="
            (e) => {
              console.log('Emitir evento editarMedico con datos:', e.row.data);
              $emit('editarMedico', e.row.data);
            }
          "
        />
        <DxButton
          name="delete"
          icon="trash"
          @click="(e) => handleDelete(e.row.data.id)"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";
import { Notify } from "quasar";
import { useMedicoStore } from "../stores/MedicoStores";
import { useEspecialidadMedicaStore } from "src/stores/ConfiMedicasStores";
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
  DxEditing,
} from "devextreme-vue/data-grid";
import { storeToRefs } from "pinia";

// Inicializa las tiendas
const MedicoStore = useMedicoStore();
const EspecialidadMedicaStore = useEspecialidadMedicaStore();

const { medicos } = storeToRefs(MedicoStore);
const { especialidades } = storeToRefs(EspecialidadMedicaStore);

// Detecta si es vista móvil
const isMobileView = computed(() => window.innerWidth < 600);

// Cargar los datos al montar el componente
onMounted(async () => {
  try {
    await EspecialidadMedicaStore.cargarEspecialidades();
    await MedicoStore.cargarMedicos();
    console.log("Médicos cargados:", medicos.value);
    console.log("Especialidades cargadas:", especialidades.value);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
});

// Propiedad computada con comprobaciones de seguridad
const medicosConEspecialidad = computed(() => {
  return (medicos.value || []).map((medico) => {
    const especialidad = (especialidades.value || []).find(
      (esp) => esp.id === medico.especialidadId // ya es número
    );
    return {
      ...medico,
      especialidadDescripcion: especialidad
        ? especialidad.descripcion
        : "Especialidad no encontrada",
    };
  });
});

// Verifica el estado de los datos
watchEffect(() => {
  console.log("Médicos:", medicos.value);
  console.log("Especialidades:", especialidades.value);
  console.log("Médicos con Especialidad:", medicosConEspecialidad.value);
});

// Manejar eliminación de médico
const handleDelete = async (medicoId) => {
  try {
    const success = await MedicoStore.eliminarMedico(medicoId);
    if (success) {
      Notify.create({
        message: "Médico eliminado exitosamente",
        color: "green",
        position: "top-right",
      });
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
};

// Configuración del ancho del DataGrid
const responsiveWidth = ref(window.innerWidth < 600 ? "100%" : "auto");
const updateWidth = () => {
  responsiveWidth.value = window.innerWidth < 600 ? "100%" : "auto";
};

window.addEventListener("resize", updateWidth);
onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #ffffff;
  width: 100%;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: -10px;
}

/* Estilos para la vista de tarjetas en móvil */
.card-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.medico-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.medico-card h5 {
  margin: 0 0 8px;
  font-size: 1.2em;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
