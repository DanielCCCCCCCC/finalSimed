<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid para diagnósticos -->
    <DxDataGrid
      :data-source="diagnosticos"
      :allow-column-reordering="true"
      :show-borders="true"
      class="custom-data-grid"
      :row-alternation-enabled="true"
      key-expr="id"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Descripción" />
      <!-- Columna con lookup para mostrar nombre de clasificación -->
      <DxColumn
        data-field="clasificacionId"
        caption="Clasificación"
        :lookup="{
          dataSource: clasificaciones,
          valueExpr: 'id',
          displayExpr: 'nombre',
        }"
      />
      <!-- Botones de acción -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarDiagnostico" />
      </DxColumn>
    </DxDataGrid>

    <!-- Formulario de edición (ventana modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Editar Diagnóstico</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="diagnosticoSeleccionado.descripcion"
              label="Descripción"
              required
              outlined
            />
            <q-select
              v-model="diagnosticoSeleccionado.clasificacionId"
              :options="clasificaciones"
              option-value="id"
              option-label="nombre"
              label="Clasificación"
              outlined
              required
              emit-value
              map-options
            />

            <div class="row justify-end q-mt-md">
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
  </q-card>
</template>

<script setup>
import { DxDataGrid, DxColumn, DxButton } from "devextreme-vue/data-grid";
import { useDiagnosticosStore } from "../stores/DiagnosticosStores";
import { useClasificacionDiagnosticosStore } from "../stores/DiagnosticosStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Acceder a las tiendas
const diagnosticosStore = useDiagnosticosStore();
const clasificacionStore = useClasificacionDiagnosticosStore();

// Datos de las tiendas
const { diagnosticos } = storeToRefs(diagnosticosStore);
const { clasificaciones } = storeToRefs(clasificacionStore);

// Estado para el modal y diagnóstico seleccionado
const mostrarDialogo = ref(false);
const diagnosticoSeleccionado = ref({});

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    diagnosticosStore.cargarDiagnosticos(),
    clasificacionStore.cargarClasificaciones(),
  ]);
});

// Asignar las descripciones al abrir el modal
const asignarDescripciones = (diagnostico) => {
  return { ...diagnostico };
};

// diagnosticoSeleccionado.value = { ...diagnostico };

// Abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  const diagnostico = e.row.data;

  // Asignar las descripciones de clasificacionId
  // console.log("Abriendo formulario para diagnóstico:", diagnostico);
  diagnosticoSeleccionado.value = asignarDescripciones(diagnostico);

  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario
const guardarCambios = async () => {
  try {
    // Si clasificacionId es un objeto, toma solo su ID
    // diagnosticoSeleccionado.value.clasificacionId =
    //   typeof diagnosticoSeleccionado.value.clasificacionId === "object"
    //     ? diagnosticoSeleccionado.value.clasificacionId.id
    //     : diagnosticoSeleccionado.value.clasificacionId;

    // console.log(
    //   "Guardando diagnóstico con los datos:",
    //   diagnosticoSeleccionado.value
    // );

    // Extraer el id y los datos a actualizar
    const id = diagnosticoSeleccionado.value.id;
    const datos = {
      descripcion: diagnosticoSeleccionado.value.descripcion,
      clasificacionId: diagnosticoSeleccionado.value.clasificacionId,
    };

    // Verificar que tenemos un id y una descripción antes de continuar
    if (!id || !datos.descripcion) {
      Notify.create({
        type: "negative",
        message: "La descripción es obligatoria",
        position: "top-right",
      });
      return;
    }

    // Actualizar el diagnóstico en el store
    await diagnosticosStore.actualizarDiagnostico(id, datos);

    // Recargar diagnósticos
    await diagnosticosStore.cargarDiagnosticos();

    // Mostrar notificación de éxito
    Notify.create({
      type: "positive",
      message: "Diagnóstico actualizado con éxito",
      position: "top-right",
    });

    // Cerrar el diálogo
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el diagnóstico",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  // console.log("Cerrando diálogo de edición.");
  mostrarDialogo.value = false;
  diagnosticoSeleccionado.value = {}; // Resetear el diagnóstico seleccionado
};

// Eliminar diagnóstico
const eliminarDiagnostico = async (e) => {
  try {
    // console.log("Eliminando diagnóstico con id:", e.row.data.id);
    await diagnosticosStore.eliminarDiagnostico(e.row.data.id);
    // Recargar diagnósticos
    await diagnosticosStore.cargarDiagnosticos();
    Notify.create({
      type: "negative",
      message: "Diagnóstico eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el diagnóstico",
      position: "top-right",
    });
    // console.error("Error al eliminar diagnóstico:", error);
  }
};
</script>

<style scoped>
.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.q-card {
  margin: auto;
}
</style>
