<template>
  <div>
    <!-- Título -->
    <div class="row">
      <h4 class="header-title">Escolaridades</h4>
    </div>
    <!-- DataGrid -->
    <div id="app-container" class="q-mb-xl">
      <DxDataGrid
        :data-source="escolaridades"
        :allow-column-reordering="true"
        :show-borders="true"
        class="custom-data-grid"
        :row-alternation-enabled="true"
        key-expr="id"
      >
        <!-- Configuraciones del DataGrid -->
        <DxScrolling mode="virtual" />
        <DxColumnChooser :enabled="true" />
        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxLoadPanel :show-pane="true" />

        <!-- Columna para descripción -->
        <DxColumn
          data-field="descripcion"
          caption="Descripción"
          :allow-sorting="true"
          min-width="150"
          width="200"
        ></DxColumn>

        <!-- Botones de acción -->
        <DxColumn type="buttons">
          <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
          <DxButton icon="trash" hint="Eliminar" @click="eliminarEscolaridad" />
        </DxColumn>

        <!-- Paginación y filtros -->
        <DxPaging :enabled="true" :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
      </DxDataGrid>
    </div>

    <!-- Formulario de edición (modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Editar Escolaridad</div>
          <q-space />
          <q-btn icon="close" flat round @click="cerrarDialogo" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="escolaridadSeleccionada.descripcion"
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
import { useEscolaridadStore } from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
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
    // Instancia de la tienda y referencias reactivas
    const escolaridadStore = useEscolaridadStore();
    const { escolaridades } = storeToRefs(escolaridadStore);

    // Estado para el modal y la escolaridad seleccionada
    const mostrarDialogo = ref(false);
    const escolaridadSeleccionada = ref({});

    // Cargar las escolaridades al montar el componente
    onMounted(async () => {
      await escolaridadStore.cargarEscolaridades();
    });

    // Función para abrir el formulario de edición
    const abrirFormularioEdicion = (e) => {
      const escolaridad = e.row.data;
      escolaridadSeleccionada.value = { ...escolaridad };
      mostrarDialogo.value = true;
    };

    // Función para guardar los cambios
    const guardarCambios = async () => {
      try {
        // Validar que la descripción no esté vacía
        if (!escolaridadSeleccionada.value.descripcion.trim()) {
          Notify.create({
            type: "negative",
            message: "La descripción es obligatoria",
            position: "top-right",
          });
          return;
        }

        // Actualizar la escolaridad en la tienda
        await escolaridadStore.actualizarEscolaridad(
          escolaridadSeleccionada.value.id,
          escolaridadSeleccionada.value.descripcion
        );

        // Mostrar notificación de éxito
        Notify.create({
          type: "positive",
          message: "Escolaridad actualizada con éxito",
          position: "top-right",
        });

        // Cerrar el diálogo
        cerrarDialogo();
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Error al actualizar la escolaridad",
          position: "top-right",
        });
        console.error("Error al guardar cambios:", error);
      }
    };

    // Función para eliminar una escolaridad
    const eliminarEscolaridad = async (e) => {
      const id = e.row.data.id;
      try {
        await escolaridadStore.eliminarEscolaridad(id);
        Notify.create({
          message: "Escolaridad eliminada exitosamente",
          color: "positive",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al eliminar escolaridad:", error);
        Notify.create({
          message: "Error al eliminar escolaridad",
          color: "negative",
          position: "top-right",
        });
      }
    };

    // Función para cerrar el diálogo
    const cerrarDialogo = () => {
      mostrarDialogo.value = false;
      escolaridadSeleccionada.value = {};
    };

    // Validador para el campo de descripción
    const validador = (val) => !!val || "La descripción es obligatoria";

    return {
      escolaridades,
      mostrarDialogo,
      escolaridadSeleccionada,
      abrirFormularioEdicion,
      guardarCambios,
      eliminarEscolaridad,
      cerrarDialogo,
      validador,
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
</style>
