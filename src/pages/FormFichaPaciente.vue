<template>
  <div class="row">
    <!-- Lista de subpestañas vertical -->
    <div class="col-12 col-md-3 q-mt-md">
      <q-list bordered>
        <q-item
          clickable
          v-ripple
          @click="updateSubTab('infoTecnica')"
          :active="subTabFichaIdentificacion === 'infoTecnica'"
        >
          <q-item-section>Información Técnica</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="updateSubTab('infoPersonal')"
          :active="subTabFichaIdentificacion === 'infoPersonal'"
        >
          <q-item-section>Información Personal</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="updateSubTab('infoContacto')"
          :active="subTabFichaIdentificacion === 'infoContacto'"
        >
          <q-item-section>Información de Contacto</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="updateSubTab('infoFamiliar')"
          :active="subTabFichaIdentificacion === 'infoFamiliar'"
        >
          <q-item-section>Información Familiar</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="updateSubTab('masDatos')"
          :active="subTabFichaIdentificacion === 'masDatos'"
        >
          <q-item-section>Más Datos</q-item-section>
        </q-item>
        <q-item class="contenedor-boton">
          <q-btn
            label="Guardar Paciente"
            color="primary"
            @click="guardarDatosFormulario"
            class="boton-centrado"
          />
          <q-btn
            label="Limpiar Formulario"
            color="danger"
            @click="limpiarFormulario"
            class="boton-limpiar"
          />
          <q-item-section></q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Contenido de subpestañas -->

    <div class="col-12 col-md-9">
      <q-tab-panels v-model="subTabFichaIdentificacion" animated>
        <q-tab-panel name="infoTecnica">
          <q-card
            class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
          >
            <q-card-section class="text-h6 text-primary"
              >Información Técnica</q-card-section
            >

            <q-form class="q-gutter-md">
              <label class="form-label">Codigo</label>

              <q-input
                v-model="pacienteSeleccionado.codigo"
                label="Código"
                dense
                class="form-control"
                :error="!validaciones.codigo"
                error-message="El código es obligatorio"
              />
              <label class="form-label">Estado del Paciente</label>

              <q-checkbox
                v-model="pacienteSeleccionado.activo"
                label="Activo"
                dense
                type="checkbox"
                class="form-check-input"
              />
              <label class="form-label">Tipo de paciente</label>

              <q-select
                v-model="pacienteSeleccionado.tipo"
                :options="tpacientes"
                label="Tipo"
                option-value="id"
                option-label="descripcion"
                dense
                class="form-select"
                :error="!validaciones.tipo"
                error-message="Debe seleccionar un tipo de paciente"
              />
              <label class="form-label">Medico</label>

              <q-select
                v-model="pacienteSeleccionado.medico"
                :options="medicos"
                label="Seleccione el medico"
                option-value="id"
                option-label="nombre"
                dense
                class="form-select"
                :error="!validaciones.medico"
                error-message="Debe seleccionar un médico"
              />
              <label class="form-label">Medico de cabecera</label>

              <q-select
                v-model="pacienteSeleccionado.medicoCabecera"
                :options="medicos"
                label="Médico de Cabecera"
                option-value="id"
                option-label="nombre"
                dense
                class="form-select"
                :error="!validaciones.medicoCabecera"
                error-message="Debe seleccionar un médico de cabecera"
              />
              <label class="form-label">Referido por "Medico"</label>

              <q-select
                v-model="pacienteSeleccionado.referidoPor"
                :options="medicos"
                label="Referido Por"
                option-value="id"
                option-label="nombre"
                dense
                class="form-select"
              />
            </q-form>
          </q-card>
        </q-tab-panel>
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <q-tab-panel name="infoPersonal">
          <q-card
            class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
          >
            <q-card-section class="text-h6 text-primary"
              >Información Personal</q-card-section
            >
            <!-- Contenido de Información Personal -->
            <q-form class="q-gutter-md">
              <label class="form-label">DNI</label>
              <q-input
                v-model="pacienteSeleccionado.dni"
                label="DNI"
                dense
                class="form-control"
                :error="!validaciones.dni"
                error-message="El DNI es obligatorios"
              />

              <label class="form-label">Nombres</label>
              <q-input
                v-model="pacienteSeleccionado.nombres"
                label="Nombres"
                dense
                class="form-control"
                :error="!validaciones.nombres"
                error-message="Los nombres son obligatorios"
              />

              <label class="form-label">Apellidos</label>
              <q-input
                v-model="pacienteSeleccionado.apellidos"
                label="Apellidos"
                dense
                class="form-control"
                :error="!validaciones.apellidos"
                error-message="Los apellidos son obligatorios"
              />

              <label class="form-label">Fecha de Nacimiento</label>
              <q-input
                v-model="pacienteSeleccionado.fechaNacimiento"
                label="Fecha de Nacimiento"
                dense
                class="form-control"
                type="date"
                :error="!validaciones.fechaNacimiento"
                error-message="Debe ingresar una fecha válida"
              />

              <label class="form-label">Sexo</label>
              <q-input
                v-model="pacienteSeleccionado.sexo"
                label="Sexo"
                dense
                class="form-control"
                :error="!validaciones.sexo"
                error-message="Debe seleccionar un sexo"
              />

              <label class="form-label">Estado Civil</label>
              <q-select
                v-model="pacienteSeleccionado.estadoCivil"
                :options="estadosCiviles"
                option-value="id"
                option-label="descripcion"
                label="Estado Civil"
                dense
                class="form-select"
                :error="!validaciones.estadoCivil"
                error-message="Debe seleccionar un estado civil"
              />

              <label class="form-label">Observaciones</label>
              <q-input
                v-model="pacienteSeleccionado.observaciones"
                label="Observaciones"
                type="textarea"
                dense
                class="form-control"
                :error="!validaciones.observaciones"
                error-message="Debe ingresar una observaciones"
              />
            </q-form>
          </q-card>
        </q-tab-panel>
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <q-tab-panel name="infoContacto">
          <q-card
            class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
          >
            <q-card-section class="text-h6 text-primary"
              >Información de Contacto</q-card-section
            >
            <!-- Contenido de Información de Contacto -->
            <q-form class="q-gutter-md">
              <label class="form-label">Direccion</label>
              <q-input
                v-model="pacienteSeleccionado.direccion"
                label="Dirección"
                dense
                class="form-control"
              />

              <label class="form-label">Telefono Hogar</label>

              <q-input
                v-model="pacienteSeleccionado.telCasa"
                label="Teléfono Casa"
                dense
                class="form-control"
              />

              <label class="form-label">Telefono Personal</label>

              <q-input
                v-model="pacienteSeleccionado.telPersonal"
                label="Teléfono Personal"
                dense
                class="form-control"
                :error="!validaciones.telPersonal"
                error-message="Debe ingresar un numero de telefono"
              />

              <label class="form-label">Email @</label>
              <q-input
                v-model="pacienteSeleccionado.email"
                label="E-mail"
                dense
                class="form-control"
              />

              <label class="form-label">Departamento</label>
              <q-select
                v-model="pacienteSeleccionado.departamento"
                label="Departamento"
                :options="departamentos"
                option-value="id"
                option-label="descripcion"
                dense
                class="form-select"
                :error="!validaciones.departamento"
                error-message="Debe seleccionar un departamento"
              />

              <label class="form-label">Municipio</label>
              <q-select
                v-model="pacienteSeleccionado.municipio"
                label="Municipio"
                :options="filteredMunicipios"
                option-value="id"
                option-label="descripcion"
                dense
                class="form-select"
                :error="!validaciones.municipio"
                error-message="Debe seleccionar un municipio"
              />

              <label class="form-label">organizacion</label>
              <q-input
                v-model="pacienteSeleccionado.organizacion"
                label="Organización"
                dense
                class="form-control"
              />
            </q-form>
          </q-card>
        </q-tab-panel>
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->

        <q-tab-panel name="infoFamiliar">
          <q-card
            class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
          >
            <q-card-section class="text-h6 text-primary"
              >Información Familiar</q-card-section
            >
            <!-- Contenido de Información Familiar -->
            <q-form class="q-gutter-md">
              <label class="form-label">Conyugue </label>
              <q-input
                v-model="pacienteSeleccionado.conyugue"
                label="Cónyuge"
                dense
                class="form-control"
              />
              <label class="form-label">Madre</label>
              <q-input
                v-model="pacienteSeleccionado.madre"
                label="Madre"
                dense
                class="form-control"
              />
              <label class="form-label">Padre</label>
              <q-input
                v-model="pacienteSeleccionado.padre"
                label="Padre"
                dense
                class="form-control"
              />
            </q-form>
          </q-card>
        </q-tab-panel>

        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <q-tab-panel name="masDatos">
          <q-card
            class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
          >
            <q-card-section class="text-h6 text-primary"
              >Más Datos</q-card-section
            >
            <!-- Contenido de Más Datos -->
            <q-form class="q-gutter-md">
              <label class="form-label">Escolaridad</label>
              <q-select
                v-model="pacienteSeleccionado.escolaridad"
                :options="escolaridades"
                option-value="id"
                option-label="descripcion"
                label="Escolaridad"
                dense
                class="form-select"
              />

              <label class="form-label">Ocupacion</label>
              <q-input
                v-model="pacienteSeleccionado.ocupacion"
                label="Ocupación"
                dense
                class="form-control"
              />
              <label class="form-label">Grupo Sanguineo</label>
              <q-select
                v-model="pacienteSeleccionado.grupoSanguineo"
                label="Grupo Sanguíneo"
                :options="gruposSanguineos"
                option-value="id"
                option-label="descripcion"
                dense
                class="form-select"
              />
              <label class="form-label">Alergias</label>
              <q-input
                v-model="pacienteSeleccionado.alergias"
                label="Alergias"
                type="textarea"
                dense
                class="form-control"
              />

              <label class="form-label">VIH</label>
              <q-checkbox
                v-model="pacienteSeleccionado.vih"
                label="VIH"
                dense
                class="form-check-input"
              />
            </q-form>
          </q-card>
        </q-tab-panel>
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->

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
import ListadoPacientes from "./ListadoPacientes.vue";
import PacienteActivoGraph from "src/components/PacienteActivoGraph.vue";
import PacientesAggMensualmente from "src/components/PacientesAggMensualmente.vue";
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

// Computed para filtrar los municipios según el departamento seleccionado
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
  // validaciones.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
  //   pacienteSeleccionado.email || ""
  // );
  validaciones.departamento = !!pacienteSeleccionado.departamento;
  validaciones.municipio = !!pacienteSeleccionado.municipio;

  // Retorna `true` si todo es válido
  return Object.values(validaciones).every((valido) => valido);
};

// Watch para limpiar el municipio cuando cambia el departamento
watch(
  () => pacienteSeleccionado.departamento,
  (nuevoDepartamento, antiguoDepartamento) => {
    if (
      antiguoDepartamento &&
      nuevoDepartamento?.id !== antiguoDepartamento?.id
    ) {
      // Limpiar municipio solo si el departamento realmente cambió
      pacienteSeleccionado.municipio = null;
    }
  }
);
// Control de pestañas
const tab = ref("Pacientes");
const subTabFichaIdentificacion = ref("infoTecnica");
const updateSubTab = (tabName) => {
  subTabFichaIdentificacion.value = tabName;
};
// Cambia a la pestaña FichaIdentificacion y asigna los datos del paciente seleccionado
// const cambiarTab = ({ tab: nuevaTab, paciente }) => {
const cambiarTab = ({ tab: nuevaTab, paciente }) => {
  tab.value = nuevaTab;

  // Copiar todos los datos del paciente a pacienteSeleccionado
  Object.assign(pacienteSeleccionado, paciente);

  // Ajustar los campos tipo, estadoCivil, departamento, municipio, escolaridad, grupoSanguineo
  const tipoPacienteSeleccionado = tpacientes.value.find(
    (tipo) => tipo.id === paciente.tipoId
  );
  pacienteSeleccionado.tipo = tipoPacienteSeleccionado
    ? {
        id: tipoPacienteSeleccionado.id,
        descripcion: tipoPacienteSeleccionado.descripcion,
      }
    : null;

  const estadoCivilSeleccionado = estadosCiviles.value.find(
    (estado) => estado.id === paciente.estadoCivilId
  );
  pacienteSeleccionado.estadoCivil = estadoCivilSeleccionado
    ? {
        id: estadoCivilSeleccionado.id,
        descripcion: estadoCivilSeleccionado.descripcion,
      }
    : null;

  const medicoSeleccionado = medicos.value.find(
    (medico) => medico.id === paciente.medicoId
  );
  pacienteSeleccionado.medico = medicoSeleccionado
    ? {
        id: medicoSeleccionado.id,
        nombre: medicoSeleccionado.nombre,
      }
    : null;

  //
  //
  //
  //
  //
  //
  const medicoCabeceraSeleccionado = medicos.value.find(
    (medico) => medico.id === paciente.medicoCabecera
  );
  pacienteSeleccionado.medicoCabecera = medicoCabeceraSeleccionado
    ? {
        id: medicoCabeceraSeleccionado.id,
        nombre: medicoCabeceraSeleccionado.nombre,
      }
    : null;

  // Nuevo: Referido Por
  const referidoPorSeleccionado = medicos.value.find(
    (medico) => medico.id === paciente.referidoPorId
  );
  pacienteSeleccionado.referidoPor = referidoPorSeleccionado
    ? {
        id: referidoPorSeleccionado.id,
        nombre: referidoPorSeleccionado.nombre,
      }
    : null;

  //
  //
  //
  //
  //
  //
  const departamentoSeleccionado = departamentos.value.find(
    (depto) => depto.id === paciente.departamentoId
  );
  pacienteSeleccionado.departamento = departamentoSeleccionado
    ? {
        id: departamentoSeleccionado.id,
        descripcion: departamentoSeleccionado.descripcion,
      }
    : null;

  const municipioSeleccionado = municipios.value.find(
    (muni) => muni.id === paciente.municipioId
  );
  pacienteSeleccionado.municipio = municipioSeleccionado
    ? {
        id: municipioSeleccionado.id,
        descripcion: municipioSeleccionado.descripcion,
      }
    : null;

  const escolaridadSeleccionada = escolaridades.value.find(
    (esc) => esc.id === paciente.escolaridadId
  );
  pacienteSeleccionado.escolaridad = escolaridadSeleccionada
    ? {
        id: escolaridadSeleccionada.id,
        descripcion: escolaridadSeleccionada.descripcion,
      }
    : null;

  const grupoSanguineoSeleccionado = gruposSanguineos.value.find(
    (grupo) => grupo.id === paciente.grupoSanguineoId
  );
  pacienteSeleccionado.grupoSanguineo = grupoSanguineoSeleccionado
    ? {
        id: grupoSanguineoSeleccionado.id,
        descripcion: grupoSanguineoSeleccionado.descripcion,
      }
    : null;
};

// Cargar datos al montar el componente
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

// Función para guardar los datos del formulario
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
    // Si el paciente ya existe, actualiza sus datos
    fichaIdentificacionStore.actualizarPaciente({
      id: pacienteSeleccionado.id,
      fechaRegistro: pacienteSeleccionado.fechaRegistro,
      codigo: pacienteSeleccionado.codigo,
      activo: pacienteSeleccionado.activo,
      tipoId: pacienteSeleccionado.tipo?.id || null,
      // tipoDescripcion: pacienteSeleccionado.tipo?.descripcion || "",

      // Guardar tanto el ID como el nombre del médico
      medicoId: pacienteSeleccionado.medico?.id || null,
      medicoCabecera: pacienteSeleccionado.medicoCabecera?.id || null, // Nuevo campo
      referidoPorId: pacienteSeleccionado.referidoPor?.id || null, // Nuevo campo
      // medicoNombre: pacienteSeleccionado.medico?.nombre || null,

      dni: pacienteSeleccionado.dni,
      nombres: pacienteSeleccionado.nombres,
      apellidos: pacienteSeleccionado.apellidos,
      fechaNacimiento: pacienteSeleccionado.fechaNacimiento,
      sexo: pacienteSeleccionado.sexo,
      estadoCivilId: pacienteSeleccionado.estadoCivil?.id || null,
      // estadoCivilDescripcion:
      //   pacienteSeleccionado.estadoCivil?.descripcion || "",
      observaciones: pacienteSeleccionado.observaciones,
      direccion: pacienteSeleccionado.direccion,
      telCasa: pacienteSeleccionado.telCasa,
      telPersonal: pacienteSeleccionado.telPersonal,
      email: pacienteSeleccionado.email,
      departamentoId: pacienteSeleccionado.departamento?.id || null,
      // departamentoDescripcion:
      //   pacienteSeleccionado.departamento?.descripcion || "",
      municipioId: pacienteSeleccionado.municipio?.id || null,
      // municipioDescripcion: pacienteSeleccionado.municipio?.descripcion || "",
      organizacion: pacienteSeleccionado.organizacion,
      conyugue: pacienteSeleccionado.conyugue,
      madre: pacienteSeleccionado.madre,
      padre: pacienteSeleccionado.padre,
      escolaridadId: pacienteSeleccionado.escolaridad?.id || null,
      // escolaridadDescripcion:
      //   pacienteSeleccionado.escolaridad?.descripcion || "",
      ocupacion: pacienteSeleccionado.ocupacion,
      grupoSanguineoId: pacienteSeleccionado.grupoSanguineo?.id || null,
      // grupoSanguineoDescripcion:
      //   pacienteSeleccionado.grupoSanguineo?.descripcion || "",
      alergias: pacienteSeleccionado.alergias,
      vih: pacienteSeleccionado.vih ?? false, // Nuevo campo

      tenantId: pacienteSeleccionado.tenant_id,
    });
    Notify.create({
      message: "Paciente actualizado",
      color: "positive",
      position: "top-right",
    });
  } else {
    // Crear un nuevo paciente si no hay id
    fichaIdentificacionStore.guardarDatos({
      fechaRegistro: pacienteSeleccionado.fechaRegistro,
      codigo: pacienteSeleccionado.codigo,
      activo: pacienteSeleccionado.activo,
      tipoId: pacienteSeleccionado.tipo?.id || null,
      // tipoDescripcion: pacienteSeleccionado.tipo?.descripcion || "",

      // Guardar tanto el ID como el nombre del médico
      medicoId: pacienteSeleccionado.medico?.id || null,
      medicoCabecera: pacienteSeleccionado.medicoCabecera?.id || null, // Nuevo campo
      referidoPorId: pacienteSeleccionado.referidoPor?.id || null, // Nuevo campo

      // medicoNombre: pacienteSeleccionado.medico?.nombre || null,

      dni: pacienteSeleccionado.dni,
      nombres: pacienteSeleccionado.nombres,
      apellidos: pacienteSeleccionado.apellidos,
      fechaNacimiento: pacienteSeleccionado.fechaNacimiento,
      sexo: pacienteSeleccionado.sexo,
      estadoCivilId: pacienteSeleccionado.estadoCivil?.id || null,
      // estadoCivilDescripcion:
      //   pacienteSeleccionado.estadoCivil?.descripcion || "",
      observaciones: pacienteSeleccionado.observaciones,
      direccion: pacienteSeleccionado.direccion,
      telCasa: pacienteSeleccionado.telCasa,
      telPersonal: pacienteSeleccionado.telPersonal,
      email: pacienteSeleccionado.email,
      departamentoId: pacienteSeleccionado.departamento?.id || null,
      // departamentoDescripcion:
      //   pacienteSeleccionado.departamento?.descripcion || "",
      municipioId: pacienteSeleccionado.municipio?.id || null,
      // municipioDescripcion: pacienteSeleccionado.municipio?.descripcion || "",
      organizacion: pacienteSeleccionado.organizacion,
      conyugue: pacienteSeleccionado.conyugue,
      madre: pacienteSeleccionado.madre,
      padre: pacienteSeleccionado.padre,
      escolaridadId: pacienteSeleccionado.escolaridad?.id || null,
      // escolaridadDescripcion:
      //   pacienteSeleccionado.escolaridad?.descripcion || "",
      ocupacion: pacienteSeleccionado.ocupacion,
      grupoSanguineoId: pacienteSeleccionado.grupoSanguineo?.id || null,
      // grupoSanguineoDescripcion:
      //   pacienteSeleccionado.grupoSanguineo?.descripcion || "",
      alergias: pacienteSeleccionado.alergias,
      vih: pacienteSeleccionado.vih ?? false, // Nuevo campo

      tenantId: pacienteSeleccionado.tenant_id,
    });
    Notify.create({
      message: "Paciente guradado",
      color: "positive",
      position: "top-right",
    });
  }

  // Limpiar el formulario después de guardar
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
