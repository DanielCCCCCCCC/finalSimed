<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid para Especialidades Médicas -->
    <DxDataGrid
      :data-source="especialidades"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Especialidad Médica" />
      <DxColumn
        data-field="created_at"
        caption="Fecha de Creación"
        data-type="date"
        :format="{ type: 'shortDate' }"
      />

      <!-- Botones de edición y eliminación -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarEspecialidad" />
      </DxColumn>

      <!-- Opciones adicionales -->
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} especialidades" />
      </DxSummary>
      <DxColumnChooser :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxGrouping :auto-expand-all="false" />
    </DxDataGrid>

    <!-- Formulario de edición (ventana modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Editar Especialidad Médica</div>
          <q-space />
          <q-btn icon="close" flat round @click="cerrarDialogo" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="especialidadSeleccionada.descripcion"
              label="Descripción"
              outlined
              :rules="[validador]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Guardar" color="primary" @click="guardarCambios" />
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarDialogo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxSummary,
  DxGroupItem,
  DxColumnChooser,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxGrouping,
  DxButton,
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
const especialidadSeleccionada = ref({});

// Cargar especialidades al montar el componente
onMounted(async () => {
  await especialidadesStore.cargarEspecialidades();
});

// Función para abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  const especialidad = e.row.data;
  especialidadSeleccionada.value = { ...especialidad };
  mostrarDialogo.value = true;
};

// Función para guardar los cambios
const guardarCambios = async () => {
  try {
    // Validar que la descripción no esté vacía
    if (!especialidadSeleccionada.value.descripcion.trim()) {
      Notify.create({
        type: "negative",
        message: "La descripción es obligatoria",
        position: "top-right",
      });
      return;
    }

    // Actualizar la especialidad en la tienda
    await especialidadesStore.actualizarEspecialidad(
      especialidadSeleccionada.value.id,
      especialidadSeleccionada.value.descripcion
    );

    // Mostrar notificación de éxito
    Notify.create({
      type: "positive",
      message: "Especialidad actualizada con éxito",
      position: "top-right",
    });

    // Cerrar el diálogo
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar la especialidad",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Función para eliminar especialidad
const eliminarEspecialidad = async (e) => {
  try {
    const especialidadId = e.row.data.id;
    await especialidadesStore.eliminarEspecialidad(especialidadId);
    Notify.create({
      type: "negative",
      message: "Especialidad eliminada",
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
  especialidadSeleccionada.value = {};
};

// Validador para el campo de descripción
const validador = (val) => !!val || "La descripción es obligatoria";
</script>
