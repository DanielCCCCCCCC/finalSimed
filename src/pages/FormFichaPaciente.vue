<template>
  <div class="row row-sm cardFichaPaciente q-ml-xl">
    <div class="col-md-1">
      <!-- Lista de subpestañas vertical con clases copiadas del ejemplo -->
      <ul class="nav nav-tabs flex-column vertical-tabs-2" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: subTabFichaIdentificacion === 'infoTecnica' }"
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
            :class="{ active: subTabFichaIdentificacion === 'infoPersonal' }"
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
            :class="{ active: subTabFichaIdentificacion === 'infoContacto' }"
            data-bs-toggle="tab"
            role="tab"
            href="#infoContacto-tab"
            aria-selected="subTabFichaIdentificacion === 'infoContacto'"
            @click="updateSubTab('infoContacto')"
          >
            <p class="mb-1"><i class="ri-customer-service-line"></i></p>
            <p class="mb-0 text-break">Información de Contacto</p>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: subTabFichaIdentificacion === 'infoFamiliar' }"
            data-bs-toggle="tab"
            role="tab"
            href="#infoFamiliar-tab"
            aria-selected="subTabFichaIdentificacion === 'infoFamiliar'"
            @click="updateSubTab('infoFamiliar')"
          >
            <p class="mb-1"><i class="ri-customer-service-line"></i></p>
            <p class="mb-0 text-break">Información Familiar</p>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: subTabFichaIdentificacion === 'masDatos' }"
            data-bs-toggle="tab"
            role="tab"
            href="#masDatos-tab"
            aria-selected="subTabFichaIdentificacion === 'masDatos'"
            @click="updateSubTab('masDatos')"
          >
            <p class="mb-1"><i class="ri-customer-service-line"></i></p>
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
            <q-btn
              label="Limpiar Formulario"
              color="danger"
              @click="limiarFormulario"
            />
          </div>
        </li>
      </ul>
    </div>

    <!-- Contenido de subpestañas -->
    <div class="col-md-7">
      <q-tab-panels v-model="subTabFichaIdentificacion" animated>
        <!-- Información Técnica -->
        <q-tab-panel name="infoTecnica">
          <q-card class="card card-body p-3">
            <q-card-section>
              <h6 class="text-primary mb-3">Información Técnica</h6>
            </q-card-section>
            <q-form class="row gx-3 gy-2">
              <div class="col-md-6">
                <label class="form-label">Código</label>
                <q-input
                  v-model="pacienteSeleccionado.codigo"
                  dense
                  class="form-control"
                  :error="!validaciones.codigo"
                  error-message="El código es obligatorio"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Paciente activo?</label>
                <div class="form-check">
                  <q-checkbox v-model="pacienteSeleccionado.activo" dense />
                </div>
              </div>
              <!-- label="Activo" -->

              <div class="col-md-6">
                <label class="form-label">Tipo de Paciente</label>
                <q-select
                  v-model="pacienteSeleccionado.tipo"
                  :options="tpacientes"
                  option-value="id"
                  option-label="descripcion"
                  dense
                  class="form-select"
                  :error="!validaciones.tipo"
                  error-message="Debe seleccionar un tipo de paciente"
                />
              </div>

              <div class="col-md-6">
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

              <div class="col-md-6">
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

              <div class="col-md-6">
                <label class="form-label"
                  >Referido por: <span class="text-muted"> Médico</span>
                </label>
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
          </q-card>
        </q-tab-panel>

        <!-- Información Personal -->
        <q-tab-panel name="infoPersonal">
          <q-card class="card card-body p-3">
            <q-card-section>
              <h6 class="text-primary mb-3">Información Personal</h6>
            </q-card-section>
            <q-form class="row gx-3 gy-2">
              <div class="col-md-6">
                <label class="form-label">DNI</label>
                <q-input
                  v-model="pacienteSeleccionado.dni"
                  dense
                  class="form-control"
                  :error="!validaciones.dni"
                  error-message="El DNI es obligatorio"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Nombres</label>
                <q-input
                  v-model="pacienteSeleccionado.nombres"
                  dense
                  class="form-control"
                  :error="!validaciones.nombres"
                  error-message="Los nombres son obligatorios"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Apellidos</label>
                <q-input
                  v-model="pacienteSeleccionado.apellidos"
                  dense
                  class="form-control"
                  :error="!validaciones.apellidos"
                  error-message="Los apellidos son obligatorios"
                />
              </div>
              <div class="col-md-6">
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
              <div class="col-md-6">
                <label class="form-label">Sexo</label>
                <q-input
                  v-model="pacienteSeleccionado.sexo"
                  dense
                  class="form-control"
                  :error="!validaciones.sexo"
                  error-message="Debe seleccionar un sexo"
                />
              </div>
              <div class="col-md-6">
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
              <div class="col-md-12">
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
          </q-card>
        </q-tab-panel>

        <!-- Información de Contacto -->
        <q-tab-panel name="infoContacto">
          <q-card class="card card-body p-3">
            <q-card-section>
              <h6 class="text-primary mb-3">Información de Contacto</h6>
            </q-card-section>
            <q-form class="row gx-3 gy-2">
              <div class="col-md-6">
                <label class="form-label">Dirección</label>
                <q-input
                  v-model="pacienteSeleccionado.direccion"
                  dense
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Teléfono Hogar</label>
                <q-input
                  v-model="pacienteSeleccionado.telCasa"
                  dense
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Teléfono Personal</label>
                <q-input
                  v-model="pacienteSeleccionado.telPersonal"
                  dense
                  class="form-control"
                  :error="!validaciones.telPersonal"
                  error-message="Debe ingresar un número de teléfono"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <q-input
                  v-model="pacienteSeleccionado.email"
                  dense
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
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
              <div class="col-md-6">
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
              <div class="col-md-12">
                <label class="form-label">Organización</label>
                <q-input
                  v-model="pacienteSeleccionado.organizacion"
                  dense
                  class="form-control"
                />
              </div>
            </q-form>
          </q-card>
        </q-tab-panel>

        <!-- Información Familiar -->
        <q-tab-panel name="infoFamiliar">
          <q-card class="card card-body p-3">
            <q-card-section>
              <h6 class="text-primary mb-3">Información Familiar</h6>
            </q-card-section>
            <q-form class="row gx-3 gy-2">
              <div class="col-md-6">
                <label class="form-label">Cónyuge</label>
                <q-input
                  v-model="pacienteSeleccionado.conyugue"
                  dense
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Madre</label>
                <q-input
                  v-model="pacienteSeleccionado.madre"
                  dense
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Padre</label>
                <q-input
                  v-model="pacienteSeleccionado.padre"
                  dense
                  class="form-control"
                />
              </div>
            </q-form>
          </q-card>
        </q-tab-panel>

        <!-- Más Datos -->
        <q-tab-panel name="masDatos">
          <q-card class="card card-body p-3">
            <q-card-section>
              <h6 class="text-primary mb-3">Más Datos</h6>
            </q-card-section>
            <q-form class="row gx-3 gy-2">
              <div class="col-md-6">
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
              <div class="col-md-6">
                <label class="form-label">Ocupación</label>
                <q-input
                  v-model="pacienteSeleccionado.ocupacion"
                  dense
                  class="form-control"
                />
              </div>
              <div class="col-md-6">
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
              <div class="col-md-12">
                <label class="form-label">Alergias</label>
                <q-input
                  v-model="pacienteSeleccionado.alergias"
                  type="textarea"
                  dense
                  class="form-control"
                />
              </div>
              <div class="col-md-12">
                <label class="form-label">VIH</label>
                <div class="form-check">
                  <q-checkbox v-model="pacienteSeleccionado.vih" dense />
                </div>
              </div>
            </q-form>
          </q-card>
        </q-tab-panel>

        <slot />
      </q-tab-panels>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { useTiposPacientesStore } from "../stores/ConfiMedicasStores";
import {
  useEstadoCivilStore,
  useDepartamentoStore,
  useMunicipioStore,
  useGrupoSanguineoStore,
  useEscolaridadStore,
} from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { useMedicoStore } from "../stores/MedicoStores";
import { Notify } from "quasar";

// Inicialización de las tiendas
const TiposPacientesStore = useTiposPacientesStore();
const fichaIdentificacionStore = useFichaIdentificacionStore();
const EstadoCivilStore = useEstadoCivilStore();
const DepartamentoStore = useDepartamentoStore();
const MunicipioStore = useMunicipioStore();
const GrupoSanguineoStore = useGrupoSanguineoStore();
const EscolaridadStore = useEscolaridadStore();
const MedicoStore = useMedicoStore();

// Acceso a las propiedades de la tienda
const { tpacientes } = storeToRefs(TiposPacientesStore);
const { estadosCiviles } = storeToRefs(EstadoCivilStore);
const { departamentos } = storeToRefs(DepartamentoStore);
const { municipios } = storeToRefs(MunicipioStore);
const { gruposSanguineos } = storeToRefs(GrupoSanguineoStore);
const { escolaridades } = storeToRefs(EscolaridadStore);
const { medicos } = storeToRefs(MedicoStore);

// Objeto reactivo para almacenar los datos del paciente seleccionado
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

// Función de validación
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

  // Retorna `true` si todo es válido
  return Object.values(validaciones).every((valido) => valido);
};

watch(
  () => pacienteSeleccionado.departamento,
  (nuevoDepartamento, antiguoDepartamento) => {
    if (
      antiguoDepartamento &&
      nuevoDepartamento?.id !== antiguoDepartamento?.id
    ) {
      pacienteSeleccionado.municipio = null;
    }
  }
);

const tab = ref("Pacientes");
const subTabFichaIdentificacion = ref("infoTecnica");
const updateSubTab = (tabName) => {
  subTabFichaIdentificacion.value = tabName;
};

onMounted(async () => {
  await EstadoCivilStore.cargarEstadosCiviles();
  await TiposPacientesStore.cargarPacientes();
  await DepartamentoStore.cargarDepartamentos();
  await MunicipioStore.cargarMunicipios();
  await GrupoSanguineoStore.cargarGruposSanguineos();
  await EscolaridadStore.cargarEscolaridades();
  await fichaIdentificacionStore.cargarDatos();
  await MedicoStore.cargarMedicos();
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
      id: pacienteSeleccionado.id,
      fechaRegistro: pacienteSeleccionado.fechaRegistro,
      codigo: pacienteSeleccionado.codigo,
      activo: pacienteSeleccionado.activo,
      tipoId: pacienteSeleccionado.tipo?.id || null,
      medicoId: pacienteSeleccionado.medico?.id || null,
      medicoCabecera: pacienteSeleccionado.medicoCabecera?.id || null,
      referidoPorId: pacienteSeleccionado.referidoPor?.id || null,
      dni: pacienteSeleccionado.dni,
      nombres: pacienteSeleccionado.nombres,
      apellidos: pacienteSeleccionado.apellidos,
      fechaNacimiento: pacienteSeleccionado.fechaNacimiento,
      sexo: pacienteSeleccionado.sexo,
      estadoCivilId: pacienteSeleccionado.estadoCivil?.id || null,
      observaciones: pacienteSeleccionado.observaciones,
      direccion: pacienteSeleccionado.direccion,
      telCasa: pacienteSeleccionado.telCasa,
      telPersonal: pacienteSeleccionado.telPersonal,
      email: pacienteSeleccionado.email,
      departamentoId: pacienteSeleccionado.departamento?.id || null,
      municipioId: pacienteSeleccionado.municipio?.id || null,
      organizacion: pacienteSeleccionado.organizacion,
      conyugue: pacienteSeleccionado.conyugue,
      madre: pacienteSeleccionado.madre,
      padre: pacienteSeleccionado.padre,
      escolaridadId: pacienteSeleccionado.escolaridad?.id || null,
      ocupacion: pacienteSeleccionado.ocupacion,
      grupoSanguineoId: pacienteSeleccionado.grupoSanguineo?.id || null,
      alergias: pacienteSeleccionado.alergias,
      vih: pacienteSeleccionado.vih ?? false,
      tenantId: pacienteSeleccionado.tenant_id,
    });
    Notify.create({
      message: "Paciente actualizado",
      color: "positive",
      position: "top-right",
    });
  } else {
    fichaIdentificacionStore.guardarDatos({
      fechaRegistro: pacienteSeleccionado.fechaRegistro,
      codigo: pacienteSeleccionado.codigo,
      activo: pacienteSeleccionado.activo,
      tipoId: pacienteSeleccionado.tipo?.id || null,
      medicoId: pacienteSeleccionado.medico?.id || null,
      medicoCabecera: pacienteSeleccionado.medicoCabecera?.id || null,
      referidoPorId: pacienteSeleccionado.referidoPor?.id || null,
      dni: pacienteSeleccionado.dni,
      nombres: pacienteSeleccionado.nombres,
      apellidos: pacienteSeleccionado.apellidos,
      fechaNacimiento: pacienteSeleccionado.fechaNacimiento,
      sexo: pacienteSeleccionado.sexo,
      estadoCivilId: pacienteSeleccionado.estadoCivil?.id || null,
      observaciones: pacienteSeleccionado.observaciones,
      direccion: pacienteSeleccionado.direccion,
      telCasa: pacienteSeleccionado.telCasa,
      telPersonal: pacienteSeleccionado.telPersonal,
      email: pacienteSeleccionado.email,
      departamentoId: pacienteSeleccionado.departamento?.id || null,
      municipioId: pacienteSeleccionado.municipio?.id || null,
      organizacion: pacienteSeleccionado.organizacion,
      conyugue: pacienteSeleccionado.conyugue,
      madre: pacienteSeleccionado.madre,
      padre: pacienteSeleccionado.padre,
      escolaridadId: pacienteSeleccionado.escolaridad?.id || null,
      ocupacion: pacienteSeleccionado.ocupacion,
      grupoSanguineoId: pacienteSeleccionado.grupoSanguineo?.id || null,
      alergias: pacienteSeleccionado.alergias,
      vih: pacienteSeleccionado.vih ?? false,
      tenantId: pacienteSeleccionado.tenant_id,
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

const limiarFormulario = () => {
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
</script>
<style scoped>
.vertical-tabs-2 {
  /* Ajusta los estilos para que las pestañas estén más cerca */
  margin-right: 20px;
}

.card.card-body {
  /* Reduce el padding para que no se vea tan grande */
  padding: 65px !important;
}

h6.text-primary.mb-3 {
  margin-bottom: 20px !important;
}

.row.gx-3.gy-2 > div {
  /* Ajusta el margen entre elementos del formulario */
  margin-bottom: 15px;
}

.form-label {
  font-weight: 500;
}
.cardFichaPaciente {
  position: relative;
  left: 15%;
}
</style>
