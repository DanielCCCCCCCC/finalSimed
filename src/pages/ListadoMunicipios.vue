<template>
  <div id="app-container">
    <DxDataGrid
      id="dataGrid"
      :data-source="municipios"
      key-expr="id"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :allow-column-reordering="true"
      :editing="{
        mode: 'popup',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
        popup: {
          title: 'Editar Municipio',
          showTitle: true,
          width: 700,
          height: 345,
        },
        form: {
          items: [
            {
              dataField: 'descripcion',
              label: { text: 'Municipio' },
              validationRules: [
                { type: 'required', message: 'La descripción es obligatoria' },
              ],
            },
            {
              dataField: 'departamentoId',
              editorType: 'dxSelectBox',
              label: { text: 'Departamento' },
              editorOptions: {
                dataSource: departamentos,
                displayExpr: 'descripcion',
                valueExpr: 'id',
                searchEnabled: true,
              },
              validationRules: [
                { type: 'required', message: 'Seleccione un departamento' },
              ],
            },
          ],
        },
      }"
      @rowInserting="onRowInserting"
      @rowUpdating="onRowUpdating"
      @rowRemoving="onRowRemoving"
    >
      <!-- Agrupación por departamentoId con DxLookup -->
      <DxColumn
        data-field="departamentoId"
        :group-index="0"
        sort-order="asc"
        caption="Departamento"
      >
        <DxLookup
          :data-source="departamentos"
          value-expr="id"
          display-expr="descripcion"
        />
      </DxColumn>

      <!-- Columna para el nombre del municipio -->
      <DxColumn data-field="descripcion" caption="Municipio"> </DxColumn>

      <!-- Columna de botones de acción -->
      <DxColumn type="buttons">
        <DxButton name="edit" />
        <DxButton name="delete" />
      </DxColumn>

      <DxColumnChooser :enabled="true" />
      <DxColumnFixing :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} municipios" />
      </DxSummary>
      <DxGrouping :auto-expand-all="expanded" />
      <DxToolbar>
        <DxItem name="groupPanel" />
        <DxItem location="after" template="button-template" />
        <DxItem name="exportButton" />
        <DxItem name="columnChooserButton" />
        <DxItem name="searchPanel" />
      </DxToolbar>
      <template #button-template>
        <DxButton
          :text="expanded ? 'Contraer Todo' : 'Expandir Todo'"
          :width="136"
          @click="toggleExpand"
        />
      </template>
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxColumnChooser,
  DxColumnFixing,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxSummary,
  DxGroupItem,
  DxGrouping,
  DxToolbar,
  DxItem,
  DxLookup,
} from "devextreme-vue/data-grid";
import { DxButton } from "devextreme-vue/button";
import {
  useMunicipioStore,
  useDepartamentoStore,
} from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { Notify } from "quasar";

export default {
  name: "ListadoMunicipios",
  components: {
    DxDataGrid,
    DxColumn,
    DxColumnChooser,
    DxColumnFixing,
    DxFilterRow,
    DxSearchPanel,
    DxGroupPanel,
    DxSummary,
    DxGroupItem,
    DxGrouping,
    DxToolbar,
    DxItem,
    DxLookup,
    DxButton,
  },
  setup() {
    const municipioStore = useMunicipioStore();
    const departamentoStore = useDepartamentoStore();

    const { municipios } = storeToRefs(municipioStore);
    const { departamentos } = storeToRefs(departamentoStore);
    const expanded = ref(false);

    // Cargar municipios y departamentos cuando el componente se monta
    onMounted(async () => {
      await departamentoStore.cargarDepartamentos();
      await municipioStore.cargarMunicipios();
    });

    // Alternar el estado expandido
    const toggleExpand = () => {
      expanded.value = !expanded.value;
    };

    // Manejar la inserción de un nuevo municipio
    const onRowInserting = async (e) => {
      try {
        const { descripcion, departamentoId } = e.data;
        await municipioStore.agregarMunicipio(descripcion, departamentoId);
        Notify.create({
          type: "positive",
          message: "Municipio agregado exitosamente",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al agregar municipio:", error);
        Notify.create({
          type: "negative",
          message: "Error al agregar municipio",
          position: "top-right",
        });
        e.cancel = true;
      }
    };

    // Manejar la actualización de un municipio
    const onRowUpdating = async (e) => {
      try {
        const id = e.oldData.id;
        const { descripcion, departamentoId } = { ...e.oldData, ...e.newData };
        await municipioStore.actualizarMunicipio(
          id,
          descripcion,
          departamentoId
        );
        Notify.create({
          type: "positive",
          message: "Municipio actualizado exitosamente",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al actualizar municipio:", error);
        Notify.create({
          type: "negative",
          message: "Error al actualizar municipio",
          position: "top-right",
        });
        e.cancel = true;
      }
    };

    // Manejar la eliminación de un municipio
    const onRowRemoving = async (e) => {
      try {
        const id = e.data.id;
        await municipioStore.eliminarMunicipio(id);
        Notify.create({
          type: "positive",
          message: "Municipio eliminado exitosamente",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al eliminar municipio:", error);
        Notify.create({
          type: "negative",
          message: "Error al eliminar municipio",
          position: "top-right",
        });
        e.cancel = true;
      }
    };

    return {
      municipios,
      departamentos,
      expanded,
      toggleExpand,
      onRowInserting,
      onRowUpdating,
      onRowRemoving,
    };
  },
};
</script>
