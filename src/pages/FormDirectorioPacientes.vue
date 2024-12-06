<template>
  <q-page class="q-pa-md">
    <!-- Barra de pestañas principales -->
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders"
    >
      <q-tab name="Pacientes" label="Pacientes" icon="person" />
      <q-tab
        name="FichaIdentificacion"
        label="Ficha de Identificación"
        icon="assignment_ind"
      />
      <q-tab name="Antecedentes" label="Antecedentes" icon="history" />
    </q-tabs>

    <!-- Contenido de pestañas principales -->
    <q-tab-panels v-model="tab" animated swipeable>
      <q-tab-panel name="Pacientes">
        <ListadoPacientes @cambiar-tab="cambiarTab" />

        <!-- <ListadoPacientes :activeTab="tab" @cambiar-tab="cambiarTab" /> -->
      </q-tab-panel>

      <q-tab-panel name="FichaIdentificacion">
        <div class="row">
          <!-- Lista de subpestañas vertical -->
          <div class="col-12 col-md-3 q-mt-md">
            <q-list bordered>
              <q-item
                clickable
                v-ripple
                @click="subTabFichaIdentificacion = 'infoTecnica'"
                :active="subTabFichaIdentificacion === 'infoTecnica'"
              >
                <q-item-section>Información Técnica</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="subTabFichaIdentificacion = 'infoPersonal'"
                :active="subTabFichaIdentificacion === 'infoPersonal'"
              >
                <q-item-section>Información Personal</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="subTabFichaIdentificacion = 'infoContacto'"
                :active="subTabFichaIdentificacion === 'infoContacto'"
              >
                <q-item-section>Información de Contacto</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="subTabFichaIdentificacion = 'infoFamiliar'"
                :active="subTabFichaIdentificacion === 'infoFamiliar'"
              >
                <q-item-section>Información Familiar</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="subTabFichaIdentificacion = 'masDatos'"
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
                  @click="limiarFormulario"
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
                  <q-card-section class="text-h6 text-primary">
                    Información Técnica
                  </q-card-section>
                  <q-form class="q-gutter-md">
                    <q-input
                      v-model="pacienteSeleccionado.codigo"
                      label="Código"
                      outlined
                      dense
                      :error="!validaciones.codigo"
                      error-message="El código es obligatorio"
                    />
                    <q-checkbox
                      v-model="pacienteSeleccionado.activo"
                      label="Activo"
                      dense
                    />
                    <q-select
                      v-model="pacienteSeleccionado.tipo"
                      :options="tpacientes"
                      label="Tipo"
                      option-value="id"
                      option-label="descripcion"
                      outlined
                      dense
                      :error="!validaciones.tipo"
                      error-message="Debe seleccionar un tipo de paciente"
                    />
                    <q-select
                      v-model="pacienteSeleccionado.medico"
                      :options="medicos"
                      label="Seleccione el medico"
                      option-value="id"
                      option-label="nombre"
                      outlined
                      dense
                      :error="!validaciones.medico"
                      error-message="Debe seleccionar un médico"
                    />
                    <q-select
                      v-model="pacienteSeleccionado.medicoCabecera"
                      :options="medicos"
                      label="Médico de Cabecera"
                      option-value="id"
                      option-label="nombre"
                      outlined
                      dense
                      :error="!validaciones.medicoCabecera"
                      error-message="Debe seleccionar un médico de cabecera"
                    />
                    <q-select
                      v-model="pacienteSeleccionado.referidoPor"
                      :options="medicos"
                      label="Referido Por"
                      option-value="id"
                      option-label="nombre"
                      outlined
                      dense
                    />
                  </q-form>
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="infoPersonal">
                <q-card
                  class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
                >
                  <q-card-section class="text-h6 text-primary">
                    Información Personal
                  </q-card-section>
                  <q-form class="q-gutter-md">
                    <q-input
                      v-model="pacienteSeleccionado.dni"
                      label="DNI"
                      outlined
                      dense
                      :error="!validaciones.dni"
                      error-message="El DNI es obligatorios"
                    />
                    <q-input
                      v-model="pacienteSeleccionado.nombres"
                      label="Nombres"
                      outlined
                      dense
                      :error="!validaciones.nombres"
                      error-message="Los nombres son obligatorios"
                    />
                    <q-input
                      v-model="pacienteSeleccionado.apellidos"
                      label="Apellidos"
                      outlined
                      dense
                      :error="!validaciones.apellidos"
                      error-message="Los apellidos son obligatorios"
                    />
                    <q-input
                      v-model="pacienteSeleccionado.fechaNacimiento"
                      label="Fecha de Nacimiento"
                      outlined
                      dense
                      type="date"
                      :error="!validaciones.fechaNacimiento"
                      error-message="Debe ingresar una fecha válida"
                    />
                    <q-input
                      v-model="pacienteSeleccionado.sexo"
                      label="Sexo"
                      outlined
                      dense
                      :error="!validaciones.sexo"
                      error-message="Debe seleccionar un sexo"
                    />
                    <q-select
                      v-model="pacienteSeleccionado.estadoCivil"
                      :options="estadosCiviles"
                      option-value="id"
                      option-label="descripcion"
                      label="Estado Civil"
                      outlined
                      dense
                      :error="!validaciones.estadoCivil"
                      error-message="Debe seleccionar un estado civil"
                    />
                    <q-input
                      v-model="pacienteSeleccionado.observaciones"
                      label="Observaciones"
                      type="textarea"
                      outlined
                      dense
                      :error="!validaciones.observaciones"
                      error-message="Debe ingresar una observaciones"
                    />
                  </q-form>
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="infoContacto">
                <q-card
                  class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
                >
                  <q-card-section class="text-h6 text-primary">
                    Información de Contacto
                  </q-card-section>
                  <q-form class="q-gutter-md">
                    <q-input
                      v-model="pacienteSeleccionado.direccion"
                      label="Dirección"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="pacienteSeleccionado.telCasa"
                      label="Teléfono Casa"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="pacienteSeleccionado.telPersonal"
                      label="Teléfono Personal"
                      outlined
                      dense
                      :error="!validaciones.telPersonal"
                      error-message="Debe ingresar un numero de telefono"
                    />
                    <q-input
                      v-model="pacienteSeleccionado.email"
                      label="E-mail"
                      outlined
                      dense
                    />
                    <q-select
                      v-model="pacienteSeleccionado.departamento"
                      label="Departamento"
                      :options="departamentos"
                      option-value="id"
                      option-label="descripcion"
                      outlined
                      dense
                      :error="!validaciones.departamento"
                      error-message="Debe seleccionar un departamento"
                    />
                    <q-select
                      v-model="pacienteSeleccionado.municipio"
                      label="Municipio"
                      :options="filteredMunicipios"
                      option-value="id"
                      option-label="descripcion"
                      outlined
                      dense
                      :error="!validaciones.municipio"
                      error-message="Debe seleccionar un municipio"
                    />
                    <q-input
                      v-model="pacienteSeleccionado.organizacion"
                      label="Organización"
                      outlined
                      dense
                    />
                  </q-form>
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="infoFamiliar">
                <q-card
                  class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
                >
                  <q-card-section class="text-h6 text-primary">
                    Información Familiar
                  </q-card-section>
                  <q-form class="q-gutter-md">
                    <q-input
                      v-model="pacienteSeleccionado.conyugue"
                      label="Cónyuge"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="pacienteSeleccionado.madre"
                      label="Madre"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="pacienteSeleccionado.padre"
                      label="Padre"
                      outlined
                      dense
                    />
                  </q-form>
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="masDatos">
                <q-card
                  class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS q-pr-md q-pl-md q-pb-md"
                >
                  <q-card-section class="text-h6 text-primary">
                    Más Datos
                  </q-card-section>
                  <q-form class="q-gutter-md">
                    <q-select
                      v-model="pacienteSeleccionado.escolaridad"
                      :options="escolaridades"
                      option-value="id"
                      option-label="descripcion"
                      label="Escolaridad"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="pacienteSeleccionado.ocupacion"
                      label="Ocupación"
                      outlined
                      dense
                    />
                    <q-select
                      v-model="pacienteSeleccionado.grupoSanguineo"
                      label="Grupo Sanguíneo"
                      :options="gruposSanguineos"
                      option-value="id"
                      option-label="descripcion"
                      outlined
                      dense
                    />
                    <q-input
                      v-model="pacienteSeleccionado.alergias"
                      label="Alergias"
                      type="textarea"
                      outlined
                      dense
                    />
                    <q-checkbox
                      v-model="pacienteSeleccionado.vih"
                      label="VIH"
                      dense
                    />
                  </q-form>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
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

<style scoped>
.grafico-responsivo {
  width: 100%;
  max-width: 300px; /* Tamaño pequeño en pantallas grandes */
  margin: 0 auto;
}

@media (max-width: 768px) {
  .grafico-responsivo {
    max-width: 100%; /* Ocupar el ancho completo en pantallas pequeñas */
    height: 250px; /* Ajustar la altura para pantallas pequeñas */
  }
}

.q-card {
  max-width: 700px;
  margin: 0 auto;
}

.text-primary {
  color: #1976d2;
}

.formS {
  border-top-left-radius: 40px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 25px;
}

.contenedor-boton {
  display: flex;
  justify-content: center;
}

.boton-centrado {
  position: relative;
  left: 23%;
  margin-left: 5px;
  transform: translateX(-50%);
}
.boton-limpiar {
  position: relative;
  left: 26%;
  margin-left: 5px;
  transform: translateX(-50%);
}
</style>
