<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid -->
    <DxDataGrid
      :data-source="contactosConDetalles"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="nombre" caption="Nombre del Hospital">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="direccion" caption="Dirección">
        <DxRequiredRule />
      </DxColumn>

      <!-- Departamento Column con Descripción -->
      <DxColumn
        data-field="departamentoDescripcion"
        caption="Departamento"
        :visible="true"
      >
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="municipioDescripcion"
        caption="Municipio"
        :visible="true"
      >
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="telefono" caption="Teléfono">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="email"
        caption="Correo Electrónico"
        :visible="false"
      >
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="web" caption="Sitio Web" width="120px">
        <DxRequiredRule />
      </DxColumn>

      <!-- Botones de edición y eliminación -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarHospital" />
      </DxColumn>
    </DxDataGrid>

    <!-- Formulario de edición (modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Editar Hospital</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="hospitalSeleccionado.nombre"
              label="Nombre del Hospital"
              required
            />
            <q-input
              v-model="hospitalSeleccionado.direccion"
              label="Dirección"
              required
            />
            <q-select
              v-model="hospitalSeleccionado.departamento_id"
              :options="departamentos"
              label="Departamento"
              option-value="id"
              option-label="descripcion"
              emit-value
              map-options
              required
            />
            <q-select
              v-model="hospitalSeleccionado.municipio_id"
              :options="filteredMunicipios"
              label="Municipio"
              option-value="id"
              option-label="descripcion"
              emit-value
              map-options
              required
            />
            <q-input
              v-model="hospitalSeleccionado.telefono"
              label="Teléfono"
              required
            />
            <q-input
              v-model="hospitalSeleccionado.email"
              label="Correo Electrónico"
              type="email"
              required
            />
            <q-input
              v-model="hospitalSeleccionado.web"
              label="Sitio Web"
              type="url"
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
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxButton,
} from "devextreme-vue/data-grid";
import { useHospitalStore } from "../stores/DirectoriosStores";
import { useDepartamentoStore } from "src/stores/DatosGeneralesStores";
import { useMunicipioStore } from "src/stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted, computed } from "vue";

// Acceder a las tiendas
const hospitalStore = useHospitalStore();
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();

// Acceder a las propiedades reactivas de las tiendas
const { hospitales, hospitalSeleccionado } = storeToRefs(hospitalStore);
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);

// Estado para el modal
const mostrarDialogo = ref(false);

// Computed para construir contactosConDetalles sin alterar hospitales.value
const contactosConDetalles = computed(() => {
  return (hospitales.value || []).map((hospital) => {
    const departamento = (departamentos.value || []).find(
      (dept) => dept.id === Number(hospital.departamento_id)
    );
    const municipio = (municipios.value || []).find(
      (mun) => mun.id === Number(hospital.municipio_id)
    );
    return {
      ...hospital,
      departamentoDescripcion: departamento
        ? departamento.descripcion
        : "Departamento no encontrado",
      municipioDescripcion: municipio
        ? municipio.descripcion
        : "Municipio no encontrado",
    };
  });
});

// Computed para filtrar municipios según el departamento seleccionado
const filteredMunicipios = computed(() => {
  if (!hospitalSeleccionado.value) return [];
  const departamentoId = hospitalSeleccionado.value.departamento_id; // Acceso correcto
  return municipios.value.filter(
    (mun) => mun.departamentoId === departamentoId
  );
});

// Computed para verificar que solo se envían los campos necesarios
const hospitalParaActualizar = computed(() => {
  if (!hospitalSeleccionado.value) return {};
  const { departamentoDescripcion, municipioDescripcion, ...actualizarInfo } =
    hospitalSeleccionado.value;
  return actualizarInfo;
});

// Cargar datos al montar el componente
onMounted(async () => {
  await departamentoStore.cargarDepartamentos();
  // console.log("Departamentos cargados:", departamentos.value);
  await municipioStore.cargarMunicipios();
  // console.log("Municipios cargados:", municipios.value);
  await hospitalStore.cargarHospitales();
  // console.log("Hospitales cargados:", hospitales.value);
});

// Abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  // console.log("Datos seleccionados para edición:", e.row.data);
  // Extraer solo los campos necesarios antes de setHospitalSeleccionado
  const { departamentoDescripcion, municipioDescripcion, ...hospitalData } =
    e.row.data;
  hospitalStore.setHospitalSeleccionado(hospitalData); // Actualiza el hospital seleccionado sin campos adicionales
  // console.log(
  //   "Hospital Seleccionado para edición:",
  //   hospitalSeleccionado.value
  // );
  mostrarDialogo.value = true; // Abre el modal
};

// Guardar los cambios del formulario
const guardarCambios = async () => {
  try {
    await hospitalStore.actualizarHospital(hospitalParaActualizar.value);
    Notify.create({
      type: "positive",
      message: "Hospital actualizado con éxito",
      position: "top-right",
    });
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el hospital",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  hospitalStore.setHospitalSeleccionado(null); // Limpia el hospital seleccionado
};

// Eliminar hospital
const eliminarHospital = async (e) => {
  const hospitalId = e.row.data.id;
  try {
    await hospitalStore.eliminarHospital(hospitalId);
    Notify.create({
      type: "negative",
      message: "Hospital eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el hospital",
      position: "top-right",
    });
    console.error("Error al eliminar hospital:", error);
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
