<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid para estudios -->
    <DxDataGrid
      :data-source="estudios"
      :allow-column-reordering="true"
      :show-borders="true"
      class="custom-data-grid"
      :row-alternation-enabled="true"
      key-expr="id"
    >
      <!-- Columnas -->
      <DxColumn data-field="codigo" caption="Código" />
      <DxColumn data-field="descripcion" caption="Descripción" />
      <!-- Columna con lookup para mostrar descripción del tipo -->
      <DxColumn
        data-field="tipoId"
        caption="Tipo"
        :lookup="{
          dataSource: tiposEstudios,
          valueExpr: 'id',
          displayExpr: 'descripcion',
        }"
      />
      <DxColumn data-field="indicaciones" caption="Indicaciones" />
      <DxColumn data-field="precioCosto" caption="Precio Costo" />
      <DxColumn data-field="precioVenta" caption="Precio Venta" />
      <!-- Columna con lookup para mostrar descripción del status -->
      <DxColumn
        data-field="status"
        caption="Status"
        :lookup="{
          dataSource: statusExamenEstudios,
          valueExpr: 'id',
          displayExpr: 'descripcion',
        }"
      />
      <!-- Botones de acción -->
      <DxColumn type="buttons">
        <DxButton
          icon="edit"
          hint="Editar"
          @click="abrirFormularioEdicion($event.row.data)"
        />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarEstudio" />
      </DxColumn>
    </DxDataGrid>

    <!-- Formulario de edición (ventana modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Editar Estudio</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="estudioSeleccionado.codigo"
              label="Código"
              disable
              outlined
            />
            <q-input
              v-model="estudioSeleccionado.descripcion"
              label="Descripción"
              required
              outlined
            />
            <q-select
              v-model="estudioSeleccionado.tipoId"
              :options="tiposEstudios"
              option-value="id"
              option-label="descripcion"
              label="Tipo de estudio"
              outlined
              dense
              required
            />
            <q-input
              v-model="estudioSeleccionado.indicaciones"
              label="Indicaciones"
              type="textarea"
              outlined
            />
            <q-input
              v-model="estudioSeleccionado.precioCosto"
              label="Precio Costo"
              type="number"
              outlined
            />
            <q-input
              v-model="estudioSeleccionado.precioVenta"
              label="Precio Venta"
              type="number"
              outlined
            />
            <q-select
              v-model="estudioSeleccionado.status"
              :options="statusExamenEstudios"
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
import { useEstudioStore } from "../stores/DirectoriosStores";
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";
import { useStatusExamenEstudiosStore } from "../stores/statusExamenEstudio";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { Notify } from "quasar";

// Acceder a las tiendas
const estudioStore = useEstudioStore();
const tiposEstudiosStore = useTiposEstudiosStore();
const statusExamenEstudiosStore = useStatusExamenEstudiosStore();

// Datos de las tiendas
const { estudios } = storeToRefs(estudioStore);
const { estudios: tiposEstudios } = storeToRefs(tiposEstudiosStore);
const { statusExamenEstudios } = storeToRefs(statusExamenEstudiosStore);

// Estado para el modal
const mostrarDialogo = ref(false);
const estudioSeleccionado = ref({});

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    estudioStore.cargarEstudios(),
    tiposEstudiosStore.cargarEstudios(),
    statusExamenEstudiosStore.cargarStatusExamenEstudios(),
  ]);
});

// Abrir el formulario de edición
const abrirFormularioEdicion = (estudio) => {
  // console.log("Abriendo modal con datos:", estudio);

  estudioSeleccionado.value = { ...estudio };

  // Si `tipoId` y `status` son valores, asegúrate de que sean objetos al abrir el modal
  const tipo = tiposEstudios.value.find((t) => t.id === estudio.tipoId);
  const status = statusExamenEstudios.value.find(
    (s) => s.id === estudio.status
  );

  estudioSeleccionado.value.tipoId = tipo ? tipo : estudio.tipoId;
  estudioSeleccionado.value.status = status ? status : estudio.status;

  // console.log("Datos para el modal:", estudioSeleccionado.value);

  mostrarDialogo.value = true;
};

// Guardar los cambios del formulario
const guardarCambios = async () => {
  try {
    // console.log("Guardando cambios:", estudioSeleccionado.value);

    estudioSeleccionado.value.tipoId =
      typeof estudioSeleccionado.value.tipoId === "object"
        ? estudioSeleccionado.value.tipoId.id
        : estudioSeleccionado.value.tipoId;

    estudioSeleccionado.value.status =
      typeof estudioSeleccionado.value.status === "object"
        ? estudioSeleccionado.value.status.id
        : estudioSeleccionado.value.status;

    await estudioStore.actualizarEstudio(estudioSeleccionado.value);

    await estudioStore.cargarEstudios();

    Notify.create({
      type: "positive",
      message: "Estudio actualizado con éxito",
      position: "top-right",
    });

    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el estudio",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
};

// Eliminar estudio
const eliminarEstudio = async (e) => {
  try {
    await estudioStore.eliminarEstudio(e.row.data.id);
    Notify.create({
      type: "negative",
      message: "Estudio eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el estudio",
      position: "top-right",
    });
    console.error("Error al eliminar estudio:", error);
  }
};
</script>
