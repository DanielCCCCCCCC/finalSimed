<template>
  <div>
    <div class="row">
      <h4 class="header-title">Controles de Medición</h4>
    </div>
    <div id="app-container" class="q-mb-xl">
      <DxDataGrid
        :data-source="controles"
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
        <DxFilterRow :visible="true" />

        <!-- Columna para descripción del control -->
        <DxColumn
          data-field="descripcion"
          caption="Descripción del Control"
          :allow-sorting="true"
          min-width="150"
          width="200"
        />

        <!-- Botones de acción -->
        <DxColumn type="buttons">
          <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
          <DxButton icon="trash" hint="Eliminar" @click="eliminarControl" />
        </DxColumn>

        <!-- Paginación -->
        <DxPaging :enabled="true" :page-size="10" />
      </DxDataGrid>
    </div>

    <!-- Modal de edición -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Editar Control de Medición</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="controlSeleccionado.descripcion"
              label="Descripción del Control"
              required
              outlined
            />
            <div class="q-mt-md" align="right">
              <q-btn label="Guardar" color="primary" type="submit" />
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                @click="cerrarDialogo"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import { useControlesMedicionStore } from "../stores/DiagnosticosStores";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { Notify } from "quasar";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxFilterRow,
    DxHeaderFilter,
    DxButton,
    DxColumnChooser,
    DxScrolling,
    DxSorting,
    DxLoadPanel,
  },
  setup() {
    const controlesStore = useControlesMedicionStore();
    const { controles } = storeToRefs(controlesStore);

    // Estado para el modal y control seleccionado
    const mostrarDialogo = ref(false);
    const controlSeleccionado = ref({});

    const abrirFormularioEdicion = (e) => {
      const control = e.row.data;
      controlSeleccionado.value = { ...control };
      mostrarDialogo.value = true;
    };

    const guardarCambios = async () => {
      try {
        const id = controlSeleccionado.value.id;
        const datos = {
          descripcion: controlSeleccionado.value.descripcion,
        };

        if (!id || !datos.descripcion) {
          Notify.create({
            type: "negative",
            message: "La descripción es obligatoria",
            position: "top-right",
          });
          return;
        }

        // Actualizar el control en el store
        await controlesStore.actualizarControl(id, datos);

        // Recargar controles
        await controlesStore.cargarControles();

        // Mostrar notificación de éxito
        Notify.create({
          type: "positive",
          message: "Control de medición actualizado con éxito",
          position: "top-right",
        });

        // Cerrar el diálogo
        cerrarDialogo();
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Error al actualizar el control de medición",
          position: "top-right",
        });
        console.error("Error al guardar cambios:", error);
      }
    };

    const cerrarDialogo = () => {
      mostrarDialogo.value = false;
      controlSeleccionado.value = {};
    };

    const eliminarControl = async (e) => {
      const id = e.row.data.id;
      try {
        await controlesStore.eliminarControl(id);
        // Recargar controles
        await controlesStore.cargarControles();
        Notify.create({
          message: "Control eliminado exitosamente",
          color: "positive",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al eliminar el control:", error);
        Notify.create({
          message: "Error al eliminar el control",
          color: "negative",
          position: "top-right",
        });
      }
    };

    onMounted(async () => {
      await controlesStore.cargarControles();
    });

    return {
      controles,
      mostrarDialogo,
      controlSeleccionado,
      abrirFormularioEdicion,
      guardarCambios,
      cerrarDialogo,
      eliminarControl,
    };
  },
};
</script>

<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #f9f9f9;
  width: 100%;
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 1px 0 1px;
  text-align: center;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
}

.q-mt-md {
  margin-top: 16px;
}
</style>
