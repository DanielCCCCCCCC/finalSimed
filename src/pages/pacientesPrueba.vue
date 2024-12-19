<template>
  <div class="row justify-center downCard q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Pacientes Existentes</h4>
            <p class="parrafo">Catálogo de pacientes del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo contacto"
              flat
              class="btn btn-primary btn-sm btn-wave right-content fsButton fe fe-plus"
              @click="handleNuevoContacto"
            />
          </div>
        </div>
      </div>
      <div class="styleModal">
        <q-dialog
          class="styleModal"
          v-model="dialogNuevoContacto"
          persistent
          :no-backdrop-dismiss="true"
          :no-escape-key="true"
        >
          <div class="styleModal main-modal-container">
            <div class="row">
              <div class="col-md-2">
                <ul
                  class="q-ml-md q-mt-md nav nav-tabs flex-column vertical-tabs-2"
                  role="tablist"
                >
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      :class="{
                        active: subTabFichaIdentificacion === 'infoTecnica',
                      }"
                      data-bs-toggle="tab"
                      role="tab"
                      href="#infoTecnica-tab"
                      aria-selected="subTabFichaIdentificacion === 'infoTecnica'"
                      @click="updateSubTab('infoTecnica')"
                    >
                      <p class="mb-1"><i class="ri-home-4-line"></i></p>
                      <p class="mb-0 text-break">Información Técnica</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      :class="{
                        active: subTabFichaIdentificacion === 'infoPersonal',
                      }"
                      data-bs-toggle="tab"
                      role="tab"
                      href="#infoPersonal-tab"
                      aria-selected="subTabFichaIdentificacion === 'infoPersonal'"
                      @click="updateSubTab('infoPersonal')"
                    >
                      <p class="mb-1"><i class="ri-phone-line"></i></p>
                      <p class="mb-0 text-break">Información Personal</p>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      class="nav-link"
                      :class="{
                        active: subTabFichaIdentificacion === 'infoContacto',
                      }"
                      data-bs-toggle="tab"
                      role="tab"
                      href="#infoContacto-tab"
                      aria-selected="subTabFichaIdentificacion === 'infoContacto'"
                      @click="updateSubTab('infoContacto')"
                    >
                      <p class="mb-1">
                        <i class="ri-customer-service-line"></i>
                      </p>
                      <p class="mb-0 text-break">Información de Contacto</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      :class="{
                        active: subTabFichaIdentificacion === 'infoFamiliar',
                      }"
                      data-bs-toggle="tab"
                      role="tab"
                      href="#infoFamiliar-tab"
                      aria-selected="subTabFichaIdentificacion === 'infoFamiliar'"
                      @click="updateSubTab('infoFamiliar')"
                    >
                      <p class="mb-1">
                        <i class="ri-customer-service-line"></i>
                      </p>
                      <p class="mb-0 text-break">Información Familiar</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      :class="{
                        active: subTabFichaIdentificacion === 'masDatos',
                      }"
                      data-bs-toggle="tab"
                      role="tab"
                      href="#masDatos-tab"
                      aria-selected="subTabFichaIdentificacion === 'masDatos'"
                      @click="updateSubTab('masDatos')"
                    >
                      <p class="mb-1">
                        <i class="ri-customer-service-line"></i>
                      </p>
                      <p class="mb-0 text-break">Más Datos</p>
                    </a>
                  </li>
                  <li class="nav-item contenedor-boton">
                    <div class="d-flex flex-column p-2">
                      <q-btn
                        label="Guardar Paciente"
                        color="dark"
                        @click="guardarDatosFormulario"
                        class="mb-2"
                      />
                      <q-btn label="Limpiar Formulario" color="danger" />
                    </div>
                  </li>
                </ul>
              </div>

              <div class="col-12 col-md-10">
                <q-tab-panels v-model="subTabFichaIdentificacion" animated>
                  <q-tab-panel name="infoTecnica">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información Técnica</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Código</label>
                          <q-input
                            v-model="pacienteSeleccionado.codigo"
                            dense
                            class="form-control"
                            :error="!validaciones.codigo"
                            error-message="El código es obligatorio"
                          />
                        </div>

                        <div class="col-md-6 mb-3">
                          <label class="form-label">Paciente activo?</label>
                          <div class="form-check">
                            <q-checkbox
                              v-model="pacienteSeleccionado.activo"
                              dense
                              class="form-check-input"
                            />
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label class="form-label">Tipo de Paciente</label>
                          <q-select
                            v-model="pacienteSeleccionado.tipo"
                            :options="tpacientes"
                            option-value="id"
                            option-label="descripcion"
                            dense
                            class="w-100 form-select"
                            map-options
                            dropdown-icon="ion-md-arrow-dropdown"
                            :error="!validaciones.tipo"
                            error-message="Debe seleccionar un tipo de paciente"
                          />
                        </div>

                        <div class="col-md-6 mb-3">
                          <label class="form-label">Médico</label>
                          <q-select
                            v-model="pacienteSeleccionado.medico"
                            :options="medicos"
                            option-value="id"
                            option-label="nombre"
                            dense
                            class="form-select"
                            :error="!validaciones.medico"
                            error-message="Debe seleccionar un médico"
                          />
                        </div>

                        <div class="col-md-6 mb-3">
                          <label class="form-label">Médico de Cabecera</label>
                          <q-select
                            v-model="pacienteSeleccionado.medicoCabecera"
                            :options="medicos"
                            option-value="id"
                            option-label="nombre"
                            dense
                            class="form-select"
                            :error="!validaciones.medicoCabecera"
                            error-message="Debe seleccionar un médico de cabecera"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label"
                            >Referido por (Médico)</label
                          >
                          <q-select
                            v-model="pacienteSeleccionado.referidoPor"
                            :options="medicos"
                            option-value="id"
                            option-label="nombre"
                            dense
                            class="form-select"
                          />
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="infoPersonal">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información Personal</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">DNI</label>
                          <q-input
                            v-model="pacienteSeleccionado.dni"
                            dense
                            class="form-control"
                            :error="!validaciones.dni"
                            error-message="El DNI es obligatorio"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Nombres</label>
                          <q-input
                            v-model="pacienteSeleccionado.nombres"
                            dense
                            class="form-control"
                            :error="!validaciones.nombres"
                            error-message="Los nombres son obligatorios"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Apellidos</label>
                          <q-input
                            v-model="pacienteSeleccionado.apellidos"
                            dense
                            class="form-control"
                            :error="!validaciones.apellidos"
                            error-message="Los apellidos son obligatorios"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Fecha de Nacimiento</label>
                          <q-input
                            v-model="pacienteSeleccionado.fechaNacimiento"
                            type="date"
                            dense
                            class="form-control"
                            :error="!validaciones.fechaNacimiento"
                            error-message="Debe ingresar una fecha válida"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Sexo</label>
                          <q-input
                            v-model="pacienteSeleccionado.sexo"
                            dense
                            class="form-control"
                            :error="!validaciones.sexo"
                            error-message="Debe seleccionar un sexo"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Estado Civil</label>
                          <q-select
                            v-model="pacienteSeleccionado.estadoCivil"
                            :options="estadosCiviles"
                            option-value="id"
                            option-label="descripcion"
                            dense
                            class="form-select"
                            :error="!validaciones.estadoCivil"
                            error-message="Debe seleccionar un estado civil"
                          />
                        </div>
                        <div class="col-md-12 mb-3">
                          <label class="form-label">Observaciones</label>
                          <q-input
                            v-model="pacienteSeleccionado.observaciones"
                            type="textarea"
                            dense
                            class="form-control"
                            :error="!validaciones.observaciones"
                            error-message="Debe ingresar observaciones"
                          />
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="infoContacto">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información de Contacto</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Dirección</label>
                          <q-input
                            v-model="pacienteSeleccionado.direccion"
                            dense
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Teléfono Hogar</label>
                          <q-input
                            v-model="pacienteSeleccionado.telCasa"
                            dense
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Teléfono Personal</label>
                          <q-input
                            v-model="pacienteSeleccionado.telPersonal"
                            dense
                            class="form-control"
                            :error="!validaciones.telPersonal"
                            error-message="Debe ingresar un número de teléfono"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Email</label>
                          <q-input
                            v-model="pacienteSeleccionado.email"
                            dense
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Departamento</label>
                          <q-select
                            v-model="pacienteSeleccionado.departamento"
                            :options="departamentos"
                            option-value="id"
                            option-label="descripcion"
                            dense
                            class="form-select"
                            :error="!validaciones.departamento"
                            error-message="Debe seleccionar un departamento"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Municipio</label>
                          <q-select
                            v-model="pacienteSeleccionado.municipio"
                            :options="filteredMunicipios"
                            option-value="id"
                            option-label="descripcion"
                            dense
                            class="form-select"
                            :error="!validaciones.municipio"
                            error-message="Debe seleccionar un municipio"
                          />
                        </div>
                        <div class="col-md-12 mb-3">
                          <label class="form-label">Organización</label>
                          <q-input
                            v-model="pacienteSeleccionado.organizacion"
                            dense
                            class="form-control"
                          />
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="infoFamiliar">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información Familiar</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Cónyuge</label>
                          <q-input
                            v-model="pacienteSeleccionado.conyugue"
                            dense
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Madre</label>
                          <q-input
                            v-model="pacienteSeleccionado.madre"
                            dense
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Padre</label>
                          <q-input
                            v-model="pacienteSeleccionado.padre"
                            dense
                            class="form-control"
                          />
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="masDatos">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Más Datos</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Escolaridad</label>
                          <q-select
                            v-model="pacienteSeleccionado.escolaridad"
                            :options="escolaridades"
                            option-value="id"
                            option-label="descripcion"
                            dense
                            class="form-select"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Ocupación</label>
                          <q-input
                            v-model="pacienteSeleccionado.ocupacion"
                            dense
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Grupo Sanguíneo</label>
                          <q-select
                            v-model="pacienteSeleccionado.grupoSanguineo"
                            :options="gruposSanguineos"
                            option-value="id"
                            option-label="descripcion"
                            dense
                            class="form-select"
                          />
                        </div>
                        <div class="col-md-12 mb-3">
                          <label class="form-label">Alergias</label>
                          <q-input
                            v-model="pacienteSeleccionado.alergias"
                            type="textarea"
                            dense
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-12 mb-3">
                          <label class="form-label">VIH</label>
                          <div class="form-check">
                            <q-checkbox
                              v-model="pacienteSeleccionado.vih"
                              dense
                              class="form-check-input"
                            />
                          </div>
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <slot />
                </q-tab-panels>
              </div>
            </div>
            <div class="q-card-actions" style="text-align: right">
              <q-btn
                flat
                label="Cerrar"
                color="primary"
                @click="dialogNuevoContacto = false"
              />
            </div>
          </div>
        </q-dialog>
      </div>
      <DxDataGrid
        ref="dataGrid"
        :data-source="pacientesConDetalles"
        :allow-column-reordering="true"
        :row-alternation-enabled="true"
        :focused-row-enabled="true"
        :focused-row-key="focusedRowKey"
        :key-expr="'id'"
        :show-borders="true"
        class="grid theme-dependent"
        @row-click="rowClick"
      >
        <DxEditing :allow-updating="true" :allow-deleting="true" mode="popup" />
        <DxScrolling mode="virtual" />
        <DxColumnChooser :enabled="true" />
        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxLoadPanel :show-pane="true" />
        <DxSelection
          select-all-mode="allPages"
          show-check-boxes-mode="always"
          mode="multiple"
        />
        <DxSearchPanel
          :width="300"
          :visible="true"
          placeholder="Buscar Paciente"
        />

        <DxColumn
          data-field="codigo"
          caption="Código"
          :allow-editing="false"
          :min-width="80"
        />
        <DxColumn
          data-field="fechaRegistro"
          caption="F. Registro"
          data-type="date"
          :min-width="100"
          :visible="true"
        />
        <DxColumn
          data-field="dni"
          caption="DNI"
          :min-width="120"
          :visible="true"
        />
        <DxColumn
          data-field="tipoDescripcion"
          caption="Tipo"
          :min-width="100"
          :visible="true"
        />
        <DxColumn
          data-field="nombres"
          caption="Nombre"
          sort-order="asc"
          :min-width="130"
        />
        <DxColumn
          data-field="apellidos"
          caption="Apellidos"
          sort-order="asc"
          :min-width="130"
        />
        <DxColumn
          data-field="fechaNacimiento"
          caption="F. Nacimiento"
          data-type="date"
          :min-width="80"
          :visible="false"
        />
        <DxColumn
          data-field="medicoNombre"
          caption="Médico"
          :min-width="120"
          :visible="true"
        />
        <DxColumn
          data-field="medicoCabeceraNombre"
          caption="Médico Cabecera"
          :min-width="120"
          :visible="true"
        />
        <DxColumn
          data-field="referidoPorNombre"
          caption="Referido Por"
          :min-width="120"
          :visible="true"
        />

        <DxColumn
          data-field="activo"
          caption="Activo"
          data-type="boolean"
          :min-width="80"
          :width="90"
          :visible="true"
        >
          <template #cell="{ data }">
            <DxCheckBox
              v-model="data.activo"
              :value="data.activo"
              @value-changed="onCheckboxChange(data)"
            />
          </template>
        </DxColumn>
        <DxColumn type="buttons">
          <DxButton name="edit" icon="edit" @click="onEditButtonClick" />
          <DxButton name="delete" icon="trash" @click="onDeleteButtonClick" />
        </DxColumn>
      </DxDataGrid>
    </div>
    <transition name="slide-fade">
      <div v-if="isPanelOpened" class="paciente-info-panel">
        <button class="close-button" @click="onClose">&times;</button>
        <PacientePanel :paciente="panelData" @close="onClose" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxScrolling,
  DxColumnChooser,
  DxSorting,
  DxHeaderFilter,
  DxLoadPanel,
  DxSelection,
  DxSearchPanel,
  DxEditing,
  DxButton,
} from "devextreme-vue/data-grid";
import DxCheckBox from "devextreme-vue/check-box";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { useTiposPacientesStore } from "../stores/ConfiMedicasStores";
import { useMedicoStore } from "../stores/MedicoStores";
import {
  useEstadoCivilStore,
  useDepartamentoStore,
  useMunicipioStore,
  useGrupoSanguineoStore,
  useEscolaridadStore,
} from "../stores/DatosGeneralesStores";
import PacientePanel from "./PacientePanel.vue";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

const emit = defineEmits(["cambiar-tab"]);

const fichaIdentificacionStore = useFichaIdentificacionStore();
const TiposPacientesStore = useTiposPacientesStore();
const EstadoCivilStore = useEstadoCivilStore();
const DepartamentoStore = useDepartamentoStore();
const MunicipioStore = useMunicipioStore();
const GrupoSanguineoStore = useGrupoSanguineoStore();
const EscolaridadStore = useEscolaridadStore();
const MedicoStore = useMedicoStore();

const { formIdentificacion } = storeToRefs(fichaIdentificacionStore);
const { tpacientes } = storeToRefs(TiposPacientesStore);
const { medicos } = storeToRefs(MedicoStore);
const { estadosCiviles } = storeToRefs(EstadoCivilStore);
const { departamentos } = storeToRefs(DepartamentoStore);
const { municipios } = storeToRefs(MunicipioStore);
const { gruposSanguineos } = storeToRefs(GrupoSanguineoStore);
const { escolaridades } = storeToRefs(EscolaridadStore);

onMounted(async () => {
  await MedicoStore.cargarMedicos();
  await TiposPacientesStore.cargarPacientes();
  await fichaIdentificacionStore.cargarDatos();
  await EstadoCivilStore.cargarEstadosCiviles();
  await DepartamentoStore.cargarDepartamentos();
  await MunicipioStore.cargarMunicipios();
  await GrupoSanguineoStore.cargarGruposSanguineos();
  await EscolaridadStore.cargarEscolaridades();
});

const pacienteSeleccionado = reactive({
  fechaRegistro: "",
  codigo: "",
  activo: false,
  tipo: null,
  medico: "",
  medicoCabecera: null,
  referidoPor: null,
  dni: "",
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  sexo: "",
  estadoCivil: null,
  observaciones: "",
  direccion: "",
  telCasa: "",
  telPersonal: "",
  email: "",
  departamento: null,
  municipio: null,
  organizacion: "",
  conyugue: "",
  madre: "",
  padre: "",
  escolaridad: "",
  ocupacion: "",
  grupoSanguineo: "",
  alergias: "",
  vih: false,
});

const filteredMunicipios = computed(() => {
  if (!pacienteSeleccionado.departamento) return [];
  return municipios.value.filter(
    (municipio) =>
      municipio.departamentoId === pacienteSeleccionado.departamento.id
  );
});

const validaciones = reactive({
  codigo: true,
  tipo: true,
  medico: true,
  medicoCabecera: true,
  dni: true,
  nombres: true,
  apellidos: true,
  fechaNacimiento: true,
  sexo: true,
  estadoCivil: true,
  observaciones: true,
  telPersonal: true,
  departamento: true,
  municipio: true,
});

const validarFormulario = () => {
  validaciones.codigo = !!pacienteSeleccionado.codigo?.trim();
  validaciones.tipo = !!pacienteSeleccionado.tipo;
  validaciones.medico = !!pacienteSeleccionado.medico;
  validaciones.dni = !!pacienteSeleccionado.dni?.trim();
  validaciones.medicoCabecera = !!pacienteSeleccionado.medicoCabecera;
  validaciones.nombres = !!pacienteSeleccionado.nombres?.trim();
  validaciones.apellidos = !!pacienteSeleccionado.apellidos?.trim();
  validaciones.fechaNacimiento = !!pacienteSeleccionado.fechaNacimiento?.trim();
  validaciones.estadoCivil = !!pacienteSeleccionado.estadoCivil;
  validaciones.telPersonal = !!pacienteSeleccionado.telPersonal?.trim();
  validaciones.sexo = !!pacienteSeleccionado.sexo?.trim();
  validaciones.departamento = !!pacienteSeleccionado.departamento;
  validaciones.municipio = !!pacienteSeleccionado.municipio;

  return Object.values(validaciones).every((valido) => valido);
};

watch(
  () => pacienteSeleccionado.departamento,
  (nuevo, antiguo) => {
    if (antiguo && nuevo?.id !== antiguo?.id) {
      pacienteSeleccionado.municipio = null;
    }
  }
);

const tab = ref("Pacientes");
const subTabFichaIdentificacion = ref("infoTecnica");
const updateSubTab = (tabName) => {
  subTabFichaIdentificacion.value = tabName;
};

const pacientesConDetalles = computed(() => {
  return (formIdentificacion.value || []).map((paciente) => {
    const medico = (medicos.value || []).find(
      (medic) => medic.id === Number(paciente.medicoId)
    );
    const medicoCabecera = (medicos.value || []).find(
      (medic) => medic.id === Number(paciente.medicoCabecera)
    );
    const referidoPor = (medicos.value || []).find(
      (medic) => medic.id === Number(paciente.referidoPorId)
    );
    const tipoPaciente = (tpacientes.value || []).find(
      (tipo) => tipo.id === Number(paciente.tipoId)
    );

    return {
      ...paciente,
      medicoNombre: medico ? medico.nombre : "Médico no encontrado",
      medicoCabeceraNombre: medicoCabecera
        ? medicoCabecera.nombre
        : "No asignado",
      referidoPorNombre: referidoPor ? referidoPor.nombre : "No asignado",
      tipoDescripcion: tipoPaciente
        ? tipoPaciente.descripcion
        : "Tipo no encontrado",
    };
  });
});

const guardarDatosFormulario = () => {
  if (!validarFormulario()) {
    Notify.create({
      message: "Por favor corrige los campos con errores",
      color: "negative",
      position: "top-right",
    });
    return;
  }
  if (pacienteSeleccionado.id) {
    fichaIdentificacionStore.actualizarPaciente({
      ...pacienteSeleccionado,
      tipoId: pacienteSeleccionado.tipo?.id || null,
      medicoId: pacienteSeleccionado.medico?.id || null,
      medicoCabecera: pacienteSeleccionado.medicoCabecera?.id || null,
      referidoPorId: pacienteSeleccionado.referidoPor?.id || null,
      departamentoId: pacienteSeleccionado.departamento?.id || null,
      municipioId: pacienteSeleccionado.municipio?.id || null,
      escolaridadId: pacienteSeleccionado.escolaridad?.id || null,
      grupoSanguineoId: pacienteSeleccionado.grupoSanguineo?.id || null,
    });
    Notify.create({
      message: "Paciente actualizado",
      color: "positive",
      position: "top-right",
    });
  } else {
    fichaIdentificacionStore.guardarDatos({
      ...pacienteSeleccionado,
      tipoId: pacienteSeleccionado.tipo?.id || null,
      medicoId: pacienteSeleccionado.medico?.id || null,
      medicoCabecera: pacienteSeleccionado.medicoCabecera?.id || null,
      referidoPorId: pacienteSeleccionado.referidoPor?.id || null,
      departamentoId: pacienteSeleccionado.departamento?.id || null,
      municipioId: pacienteSeleccionado.municipio?.id || null,
      escolaridadId: pacienteSeleccionado.escolaridad?.id || null,
      grupoSanguineoId: pacienteSeleccionado.grupoSanguineo?.id || null,
    });
    Notify.create({
      message: "Paciente guardado",
      color: "positive",
      position: "top-right",
    });
  }

  Object.keys(pacienteSeleccionado).forEach((key) => {
    if (typeof pacienteSeleccionado[key] === "boolean") {
      pacienteSeleccionado[key] = false;
    } else if (Array.isArray(pacienteSeleccionado[key])) {
      pacienteSeleccionado[key] = [];
    } else {
      pacienteSeleccionado[key] = "";
    }
  });
};

const focusedRowKey = ref(null);
const isPanelOpened = ref(false);
const panelData = ref(null);

const openPanel = (paciente) => {
  panelData.value = paciente;
  isPanelOpened.value = true;
};

const onEditButtonClick = (e) => {
  emit("cambiar-tab", { tab: "FichaIdentificacion", paciente: e.row.data });
};

const onDeleteButtonClick = async (e) => {
  const id = e.row.data.id;
  try {
    const success = await fichaIdentificacionStore.eliminarPaciente(id);
    if (success) {
      Notify.create({
        message: "Paciente eliminado exitosamente",
        color: "positive",
        position: "top-right",
      });
    } else {
      Notify.create({
        message: "Error al eliminar el paciente",
        color: "negative",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error al eliminar el paciente:", error);
    Notify.create({
      message: "Error al eliminar el paciente",
      color: "negative",
      position: "top-right",
    });
  }
};

const rowClick = (e) => {
  focusedRowKey.value = e.key;
  panelData.value = e.data;
  isPanelOpened.value = true;
};

const onClose = () => {
  isPanelOpened.value = false;
};

const onCheckboxChange = async (data) => {
  try {
    const success = await fichaIdentificacionStore.actualizarPaciente({
      id: data.id,
      activo: data.activo,
    });
    if (success) {
      Notify.create({
        message: "Estado del paciente actualizado",
        color: "positive",
        position: "top-right",
      });
    } else {
      Notify.create({
        message: "Error al actualizar el estado del paciente",
        color: "negative",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error al actualizar el estado del paciente:", error);
    Notify.create({
      message: "Error al actualizar el estado del paciente",
      color: "negative",
      position: "top-right",
    });
  }
};

const dialogNuevoContacto = ref(false);
const handleNuevoContacto = () => {
  dialogNuevoContacto.value = true;
};
</script>
<style scoped>
#app-container {
  padding: 20px;
  background-color: #ffffff;
  margin: 0 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
}

.styleModal {
  max-width: 90%;
  max-height: 90%;
}

.main-modal-container {
  background-color: #ffffff;
  padding: 20px;
}

/* Mantener las clases existentes y globales sin q-card */
.card.card-body {
  padding: 20px !important;
}

.form-container {
  max-width: 800px;
  margin: 0 25px;
}

h6.text-primary {
  margin-bottom: 20px !important;
}

.row > div {
  margin-bottom: 15px;
}

.downCard {
  position: relative;
  left: 40px;
}

.form-label {
  font-weight: 500;
}

.fsButton {
  font-size: 16px;
}

.btnCerrarModal {
  font-size: 16px;
}

.no-arrow .q-select__dropdown-icon {
  display: none;
}

.right-content {
  justify-self: end;
}

.q-card-section {
  margin-bottom: 20px;
}

.q-card-actions {
  margin-top: 20px;
}

.vertical-tabs-2 {
  margin-right: 20px;
}
.paciente-info-panel {
  position: fixed;
  top: 0px;
  right: 0;
  width: 320px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}
.close-button {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
