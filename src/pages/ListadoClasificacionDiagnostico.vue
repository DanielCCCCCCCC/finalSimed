<template>
  <div>
    <!-- DataGrid para pantallas grandes -->
    <DxDataGrid
      :data-source="clasificaciones"
      :allow-column-reordering="true"
      :show-borders="true"
      class="custom-data-grid"
      :row-alternation-enabled="true"
      key-expr="id"
    >
      <DxScrolling mode="virtual" />
      <DxColumnChooser :enabled="true" />
      <DxSorting mode="multiple" />
      <DxHeaderFilter :visible="true" />
      <DxLoadPanel :show-pane="true" />

      <!-- Columna para nombre de clasificación -->
      <DxColumn
        data-field="nombre"
        caption="Nombre de Clasificación"
        :allow-sorting="true"
        min-width="150"
        width="200"
      />

      <!-- Botones de acción -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
        <DxButton icon="trash" hint="Eliminar" @click="onDeleteButtonClick" />
      </DxColumn>
    </DxDataGrid>

    <!-- Modal de edición -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Editar Clasificación</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="clasificacionSeleccionada.nombre"
              label="Nombre de Clasificación"
              outlined
              :error="!!errores.nombre"
              :error-message="errores.nombre"
              class="q-mb-md"
            />

            <div class="q-mt-md" align="right">
              <q-btn label="Guardar" color="primary" type="submit" />
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                @click="cerrarDialogo"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxButton,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxHeaderFilter,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useClasificacionDiagnosticosStore } from "../stores/DiagnosticosStores";

// Acceder a la tienda
const clasificacionStore = useClasificacionDiagnosticosStore();
const clasificaciones = ref([]);

// Estados del modal
const mostrarDialogo = ref(false);
const clasificacionSeleccionada = ref({});
const errores = ref({});

// Función para cargar clasificaciones
const cargarClasificaciones = async () => {
  await clasificacionStore.cargarClasificaciones();
  clasificaciones.value = clasificacionStore.clasificaciones;
};

// Abrir el formulario de edición
const abrirFormularioEdicion = ({ row: { data } }) => {
  if (!data || !data.id) {
    Notify.create({
      type: "negative",
      message: "Error al abrir el modal: la clasificación no tiene ID.",
      position: "top-right",
    });
    return;
  }
  clasificacionSeleccionada.value = { ...data };
  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario
const guardarCambios = async () => {
  const id = clasificacionSeleccionada.value.id;
  const datos = { nombre: clasificacionSeleccionada.value.nombre };

  if (!id || !clasificacionSeleccionada.value.nombre) {
    errores.value.nombre = "El nombre de la clasificación es obligatorio.";
    return;
  }

  try {
    await clasificacionStore.actualizarClasificacion(id, datos);
    Notify.create({
      type: "positive",
      message: "Clasificación actualizada con éxito",
      position: "top-right",
    });

    await cargarClasificaciones();
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar la clasificación",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  errores.value.nombre = "";
};

// Eliminar clasificación
const onDeleteButtonClick = async ({ row: { data } }) => {
  try {
    await clasificacionStore.eliminarClasificacion(data.id);
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
.text-primary {
  color: #000000;
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.q-card {
  border-radius: 8px;
}

.q-card-section {
  padding: 16px;
}

.text-h6 {
  margin: 0;
  /* font-weight: bold; */
}

.q-mb-md {
  margin-bottom: 16px;
}

.q-mt-md {
  margin-top: 16px;
}
</style>
