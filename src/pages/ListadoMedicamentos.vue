<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid para medicamentos -->
    <DxDataGrid
      :data-source="medicamentos"
      :allow-column-reordering="true"
      :show-borders="true"
      class="custom-data-grid"
      :row-alternation-enabled="true"
      key-expr="codigo"
    >
      <!-- Columnas -->
      <DxColumn data-field="codigo" caption="Código" />
      <DxColumn data-field="descripcion" caption="Descripción" />
      <!-- Columna con lookup para mostrar descripción del tipo -->
      <DxColumn
        data-field="tipoId"
        caption="Tipo"
        :lookup="{
          dataSource: tiposMedicamentos,
          valueExpr: 'id',
          displayExpr: 'descripcion',
        }"
      />
      <DxColumn data-field="indicaciones" caption="Indicaciones" />
      <DxColumn data-field="precioCosto" caption="Precio Costo" />
      <DxColumn data-field="precioVenta" caption="Precio Venta" />
      <DxColumn data-field="facturar" caption="Facturar" />
      <DxColumn
        data-field="status"
        caption="Status"
        :lookup="{
          dataSource: statuses,
          valueExpr: 'id',
          displayExpr: 'descripcion',
        }"
      />
      <!-- Botones de acción -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarMedicamento" />
      </DxColumn>
    </DxDataGrid>

    <!-- Formulario de edición (ventana modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Editar Medicamento</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="medicamentoSeleccionado.codigo"
              label="Código"
              disable
              outlined
            />
            <q-input
              v-model="medicamentoSeleccionado.descripcion"
              label="Descripción"
              required
              outlined
            />
            <q-select
              v-model="medicamentoSeleccionado.tipoId"
              :options="tiposMedicamentos"
              option-value="id"
              option-label="descripcion"
              label="Tipo de medicamentos"
              outlined
              dense
              required
            />
            <q-input
              v-model="medicamentoSeleccionado.indicaciones"
              label="Indicaciones"
              type="textarea"
              outlined
            />
            <q-input
              v-model="medicamentoSeleccionado.precioCosto"
              label="Precio Costo"
              type="number"
              outlined
            />
            <q-input
              v-model="medicamentoSeleccionado.precioVenta"
              label="Precio Venta"
              type="number"
              outlined
            />
            <q-checkbox
              v-model="medicamentoSeleccionado.facturar"
              label="Facturar"
              outlined
            />
            <q-select
              v-model="medicamentoSeleccionado.status"
              :options="statuses"
              option-value="id"
              option-label="descripcion"
              label="Status"
              outlined
              dense
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
  </q-card>
</template>
<script setup>
import { DxDataGrid, DxColumn, DxButton } from "devextreme-vue/data-grid";
import { useMedicamentoStore } from "../stores/DirectoriosStores";
import { useTiposMedicamentosStore } from "../stores/ConfiMedicasStores";
import { useStatusStore } from "../stores/status";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Acceder a las tiendas
const medicamentoStore = useMedicamentoStore();
const tiposMedicamentosStore = useTiposMedicamentosStore();
const statusStore = useStatusStore();

// Datos de las tiendas
const { medicamentos, medicamentoSeleccionado } = storeToRefs(medicamentoStore);
const { medicamentos: tiposMedicamentos } = storeToRefs(tiposMedicamentosStore);
const { statuses } = storeToRefs(statusStore);

// Estado para el modal
const mostrarDialogo = ref(false);

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    medicamentoStore.cargarMedicamentos(),
    tiposMedicamentosStore.cargarMedicamentos(),
    statusStore.cargarStatuses(),
  ]);
});

// Asignar las descripciones al abrir el modal
const asignarDescripciones = (medicamento) => {
  // console.log("Asignando descripciones para medicamento:", medicamento);

  const tipo = tiposMedicamentos.value.find((t) => t.id === medicamento.tipoId);
  if (!tipo) {
    console.warn(`No se encontró el tipo con id: ${medicamento.tipoId}`);
  } else {
    // console.log(`Tipo asignado:`, tipo);
  }

  const status = statuses.value.find((s) => s.id === medicamento.status);
  if (!status) {
    // console.warn(`No se encontró el status con id: ${medicamento.status}`);
  } else {
    console.log(`Status asignado:`, status);
  }

  return {
    ...medicamento,
    tipoId: tipo || { id: null, descripcion: "Sin tipo asignado" },
    status: status || { id: null, descripcion: "Sin status asignado" },
  };
};

// Abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  const medicamento = e.row.data;

  // Asignar las descripciones de tipoId y status
  console.log("Abriendo formulario para medicamento:", medicamento);
  medicamentoSeleccionado.value = asignarDescripciones(medicamento);

  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario
const guardarCambios = async () => {
  try {
    // Si tipoId o status son objetos, toma solo sus IDs
    medicamentoSeleccionado.value.tipoId =
      typeof medicamentoSeleccionado.value.tipoId === "object"
        ? medicamentoSeleccionado.value.tipoId.id
        : medicamentoSeleccionado.value.tipoId;

    medicamentoSeleccionado.value.status =
      typeof medicamentoSeleccionado.value.status === "object"
        ? medicamentoSeleccionado.value.status.id
        : medicamentoSeleccionado.value.status;

    console.log(
      "Guardando medicamento con los datos:",
      medicamentoSeleccionado.value
    );

    // Actualizar el medicamento en el store
    await medicamentoStore.actualizarMedicamento(medicamentoSeleccionado.value);

    // Recargar medicamentos
    await medicamentoStore.cargarMedicamentos();

    // Mostrar notificación de éxito
    Notify.create({
      type: "positive",
      message: "Medicamento actualizado con éxito",
      position: "top-right",
    });

    // Cerrar el diálogo
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el medicamento",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  console.log("Cerrando diálogo de edición.");
  mostrarDialogo.value = false;
  medicamentoStore.setMedicamentoSeleccionado(null);
};

// Eliminar medicamento
const eliminarMedicamento = async (e) => {
  try {
    console.log("Eliminando medicamento con id:", e.row.data.id);
    await medicamentoStore.eliminarMedicamento(e.row.data.id);
    Notify.create({
      type: "negative",
      message: "Medicamento eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el medicamento",
      position: "top-right",
    });
    console.error("Error al eliminar medicamento:", error);
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
