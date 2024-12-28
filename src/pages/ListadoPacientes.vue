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
              label="Nuevo paciente"
              flat
              class="btn btn-primary"
              @click="handleNuevoContacto"
            />
          </div>
        </div>
      </div>

      <!-- Modal Ficha de Identificación -->
      <div>
        <q-dialog
          class="styleModal"
          v-model="dialogNuevoContacto"
          persistent
          :no-backdrop-dismiss="true"
          :no-escape-key="true"
        >
          <div class="styleModal main-modal-container">
            <div class="row">
              <!-- Menú lateral de tabs -->
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
                      <q-btn
                        label="Limpiar Formulario"
                        color="danger"
                        @click="limpiarFormulario"
                      />
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Contenido de cada tab -->
              <div class="col-12 col-md-9 q-ml-xl">
                <q-tab-panels v-model="subTabFichaIdentificacion" animated>
                  <!-- Información Técnica -->
                  <q-tab-panel name="infoTecnica">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información Técnica</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Código</label>
                          <input
                            v-model="pacienteSeleccionado.codigo"
                            class="form-control"
                            :class="{ 'is-invalid': !validaciones.codigo }"
                            placeholder="Ingresa código"
                          />
                          <!--
                          <div v-if="!validaciones.codigo" class="text-danger mt-1">
                            El código es obligatorio
                          </div>
                          -->
                        </div>

                        <!-- Paciente activo? -->
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Paciente activo?</label>
                          <div class="form-check">
                            <input
                              type="checkbox"
                              v-model="pacienteSeleccionado.activo"
                              class="form-check-input"
                            />
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label for="medicoSelect" class="form-label"
                            >Médico</label
                          >
                          <select
                            id="medicoSelect"
                            v-model="pacienteSeleccionado.medicoId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateMedico"
                          >
                            <option disabled value="">
                              Seleccione un médico
                            </option>
                            <option
                              v-for="medico in medicos"
                              :key="medico.id"
                              :value="medico.id"
                            >
                              {{ medico.nombre }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.medico"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un médico
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label for="medicoCabeceraSelect" class="form-label"
                            >Médico de Cabecera</label
                          >
                          <select
                            id="medicoCabeceraSelect"
                            v-model="pacienteSeleccionado.medicoCabecera"
                            class="form-select custom-select-height"
                            required
                            @blur="validateMedicoCabecera"
                          >
                            <option disabled value="">
                              Seleccione un médico de cabecera
                            </option>
                            <option
                              v-for="medico in medicos"
                              :key="medico.id"
                              :value="medico.id"
                            >
                              {{ medico.nombre }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.medicoCabecera"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un médico de cabecera
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label for="referidoPorSelect" class="form-label"
                            >Referido por (Médico)</label
                          >
                          <select
                            id="referidoPorSelect"
                            v-model="pacienteSeleccionado.referidoPorId"
                            class="form-select custom-select-height"
                          >
                            <option disabled value="">
                              Seleccione un médico
                            </option>
                            <option
                              v-for="medico in medicos"
                              :key="medico.id"
                              :value="medico.id"
                            >
                              {{ medico.nombre }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.referidoPorId"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un médico
                          </div>
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <!-- Información Personal -->
                  <q-tab-panel name="infoPersonal">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información Personal</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">DNI</label>
                          <input
                            v-model="pacienteSeleccionado.dni"
                            class="form-control"
                            :class="{ 'is-invalid': !validaciones.dni }"
                            placeholder="Ingrese DNI"
                          />
                          <div
                            v-if="!validaciones.dni"
                            class="text-danger mt-1"
                          >
                            El DNI es obligatorio
                          </div>
                        </div>
                        <!-- Nombres -->
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Nombres</label>
                          <input
                            v-model="pacienteSeleccionado.nombres"
                            class="form-control"
                            :class="{ 'is-invalid': !validaciones.nombres }"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Apellidos</label>
                          <input
                            v-model="pacienteSeleccionado.apellidos"
                            class="form-control"
                            :class="{ 'is-invalid': !validaciones.apellidos }"
                            placeholder="Ingrese los apellidos"
                          />
                          <div
                            v-if="!validaciones.apellidos"
                            class="invalid-feedback"
                          >
                            Los apellidos son obligatorios
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Fecha de Nacimiento</label>
                          <input
                            v-model="pacienteSeleccionado.fechaNacimiento"
                            type="date"
                            class="form-control"
                            :class="{
                              'is-invalid': !validaciones.fechaNacimiento,
                            }"
                          />
                          <div
                            v-if="!validaciones.fechaNacimiento"
                            class="invalid-feedback"
                          >
                            Debe ingresar una fecha válida
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Sexo</label>
                          <select
                            v-model="pacienteSeleccionado.sexo"
                            class="form-select custom-select-height"
                            :class="{ 'is-invalid': !validaciones.sexo }"
                          >
                            <option disabled value="">
                              Seleccione el sexo
                            </option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                          </select>
                          <div
                            v-if="!validaciones.sexo"
                            class="invalid-feedback"
                          >
                            Debe seleccionar un sexo
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label for="estadoCivilSelect" class="form-label"
                            >Estado Civil</label
                          >
                          <select
                            id="estadoCivilSelect"
                            v-model="pacienteSeleccionado.estadoCivilId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateEstadoCivil"
                          >
                            <option disabled value="">
                              Seleccione un estado civil
                            </option>
                            <option
                              v-for="estado in estadosCiviles"
                              :key="estado.id"
                              :value="estado.id"
                            >
                              {{ estado.descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.estadoCivil"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un estado civil
                          </div>
                        </div>

                        <div class="col-md-12 mb-3">
                          <label class="form-label">Observaciones</label>
                          <textarea
                            v-model="pacienteSeleccionado.observaciones"
                            class="form-control"
                            :class="{
                              'is-invalid': !validaciones.observaciones,
                            }"
                            placeholder="Ingrese observaciones"
                          ></textarea>
                          <div
                            v-if="!validaciones.observaciones"
                            class="invalid-feedback"
                          >
                            Debe ingresar observaciones
                          </div>
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <!-- Información de Contacto -->
                  <q-tab-panel name="infoContacto">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información de Contacto</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Dirección</label>
                          <input
                            v-model="pacienteSeleccionado.direccion"
                            class="form-control"
                            placeholder="Ingrese la dirección"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Teléfono Hogar</label>
                          <input
                            v-model="pacienteSeleccionado.telCasa"
                            class="form-control"
                            placeholder="Ingrese el teléfono del hogar"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Teléfono Personal</label>
                          <input
                            v-model="pacienteSeleccionado.telPersonal"
                            class="form-control"
                            :class="{ 'is-invalid': !validaciones.telPersonal }"
                            placeholder="Ingrese el teléfono personal"
                          />
                          <div
                            v-if="!validaciones.telPersonal"
                            class="invalid-feedback"
                          >
                            Debe ingresar un número de teléfono
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Email</label>
                          <input
                            v-model="pacienteSeleccionado.email"
                            type="email"
                            class="form-control"
                            placeholder="Ingrese el correo electrónico"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label for="departamentoSelect" class="form-label"
                            >Departamento</label
                          >
                          <select
                            id="departamentoSelect"
                            v-model="pacienteSeleccionado.departamentoId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateDepartamento"
                          >
                            <option disabled value="">
                              Seleccione un departamento
                            </option>
                            <option
                              v-for="departamento in departamentos"
                              :key="departamento.id"
                              :value="departamento.id"
                            >
                              {{ departamento.descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.departamentoId"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un departamento
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label for="municipioSelect" class="form-label"
                            >Municipio</label
                          >
                          <select
                            id="municipioSelect"
                            v-model="pacienteSeleccionado.municipioId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateMunicipio"
                          >
                            <option disabled value="">
                              Seleccione un municipio
                            </option>
                            <option
                              v-for="municipio in filteredMunicipios"
                              :key="municipio.id"
                              :value="municipio.id"
                            >
                              {{ municipio.descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.municipio"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un municipio
                          </div>
                        </div>

                        <div class="col-md-12 mb-3">
                          <label class="form-label">Organización</label>
                          <input
                            v-model="pacienteSeleccionado.organizacion"
                            class="form-control"
                            placeholder="Ingrese la organización"
                          />
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <!-- Información Familiar -->
                  <q-tab-panel name="infoFamiliar">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Información Familiar</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Cónyuge</label>
                          <input
                            v-model="pacienteSeleccionado.conyugue"
                            class="form-control"
                            placeholder="Ingrese el nombre del cónyuge"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Madre</label>
                          <input
                            v-model="pacienteSeleccionado.madre"
                            class="form-control"
                            placeholder="Ingrese el nombre de la madre"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Padre</label>
                          <input
                            v-model="pacienteSeleccionado.padre"
                            class="form-control"
                            placeholder="Ingrese el nombre del padre"
                          />
                        </div>
                      </q-form>
                    </div>
                  </q-tab-panel>

                  <!-- Más Datos -->
                  <q-tab-panel name="masDatos">
                    <div class="card card-body p-4 form-container">
                      <div class="q-card-section">
                        <h6 class="text-primary">Más Datos</h6>
                      </div>
                      <q-form class="row">
                        <div class="col-md-6 mb-3">
                          <label for="escolaridadSelect" class="form-label"
                            >Escolaridad</label
                          >
                          <select
                            id="escolaridadSelect"
                            v-model="pacienteSeleccionado.escolaridadId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateEscolaridad"
                          >
                            <option disabled value="">
                              Seleccione una escolaridad
                            </option>
                            <option
                              v-for="escolaridad in escolaridades"
                              :key="escolaridad.id"
                              :value="escolaridad.id"
                            >
                              {{ escolaridad.descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.escolaridadId"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar la escolaridad
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label class="form-label">Ocupación</label>
                          <input
                            v-model="pacienteSeleccionado.ocupacion"
                            class="form-control"
                            placeholder="Ingrese la ocupación"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label for="grupoSanguineoSelect" class="form-label"
                            >Grupo Sanguíneo</label
                          >
                          <select
                            id="grupoSanguineoSelect"
                            v-model="pacienteSeleccionado.grupoSanguineoId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateGrupoSanguineo"
                          >
                            <option disabled value="">
                              Seleccione un grupo sanguíneo
                            </option>
                            <option
                              v-for="grupo in gruposSanguineos"
                              :key="grupo.id"
                              :value="grupo.id"
                            >
                              {{ grupo.descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.grupoSanguineoId"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un grupo sanguíneo
                          </div>
                        </div>

                        <div class="col-md-12 mb-3">
                          <label class="form-label">Alergias</label>
                          <textarea
                            v-model="pacienteSeleccionado.alergias"
                            class="form-control"
                            placeholder="Ingrese las alergias del paciente"
                          ></textarea>
                        </div>
                        <div class="col-md-12 mb-3">
                          <label class="form-label">VIH</label>
                          <div class="form-check">
                            <input
                              type="checkbox"
                              v-model="pacienteSeleccionado.vih"
                              class="form-check-input"
                            />
                            <label class="form-check-label">Positivo</label>
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

      <!-- DataGrid de Pacientes -->
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

        <!-- Botones de Editar y Eliminar -->
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
import { ref, reactive, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

// Para emitir eventos (si fuera necesario)
const emit = defineEmits(["cambiar-tab"]);

// Almacenes Pinia
const fichaIdentificacionStore = useFichaIdentificacionStore();
const TiposPacientesStore = useTiposPacientesStore();
const EstadoCivilStore = useEstadoCivilStore();
const DepartamentoStore = useDepartamentoStore();
const MunicipioStore = useMunicipioStore();
const GrupoSanguineoStore = useGrupoSanguineoStore();
const EscolaridadStore = useEscolaridadStore();
const MedicoStore = useMedicoStore();

// Referencias de los stores
const { formIdentificacion } = storeToRefs(fichaIdentificacionStore);
// const { tpacientes } = storeToRefs(TiposPacientesStore);
const { medicos } = storeToRefs(MedicoStore);
const { estadosCiviles } = storeToRefs(EstadoCivilStore);
const { departamentos } = storeToRefs(DepartamentoStore);
const { municipios } = storeToRefs(MunicipioStore);
const { gruposSanguineos } = storeToRefs(GrupoSanguineoStore);
const { escolaridades } = storeToRefs(EscolaridadStore);

// Lifecycle
onMounted(async () => {
  await MedicoStore.cargarMedicos();
  // await TiposPacientesStore.cargarPacientes();
  await fichaIdentificacionStore.cargarDatos();
  await EstadoCivilStore.cargarEstadosCiviles();
  await DepartamentoStore.cargarDepartamentos();
  await MunicipioStore.cargarMunicipios();
  await GrupoSanguineoStore.cargarGruposSanguineos();
  await EscolaridadStore.cargarEscolaridades();
});

// Modelo reactivo para el paciente seleccionado
const pacienteSeleccionado = reactive({
  id: null, // Se recomienda llevar un "id" para saber si estamos editando
  fechaRegistro: "",
  codigo: "",
  activo: false,
  medicoId: null,
  medicoCabecera: null,
  referidoPorId: null,
  dni: "",
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  sexo: "",
  estadoCivilId: null,
  observaciones: "",
  direccion: "",
  telCasa: "",
  telPersonal: "",
  email: "",
  departamentoId: null,
  municipioId: null,
  organizacion: "",
  conyugue: "",
  madre: "",
  padre: "",
  escolaridadId: null,
  ocupacion: "",
  grupoSanguineoId: null,
  alergias: "",
  vih: false,
});

const dialogNuevoContacto = ref(false);
const tab = ref("Pacientes");
const subTabFichaIdentificacion = ref("infoTecnica");

// Computed para filtrar municipios en base al departamento seleccionado
const filteredMunicipios = computed(() => {
  if (!pacienteSeleccionado.departamentoId) return [];
  return municipios.value.filter(
    (municipio) =>
      municipio.departamentoId === pacienteSeleccionado.departamentoId
  );
});

// Validaciones
const validaciones = reactive({
  codigo: true,
  medico: true,
  medicoCabecera: true,
  dni: true,
  nombres: true,
  apellidos: true,
  fechaNacimiento: true,
  sexo: true,
  estadoCivil: true,
  observaciones: true, // si decides hacer obligatorio "observaciones"
  telPersonal: true,
  departamentoId: true,
  municipio: true,
  referidoPorId: true,
  escolaridadId: true,
  grupoSanguineoId: true,
});

// Cambio de sub tab en el modal
const updateSubTab = (tabName) => {
  subTabFichaIdentificacion.value = tabName;
};

// Limpiar formulario
const limpiarFormulario = () => {
  Object.keys(pacienteSeleccionado).forEach((key) => {
    if (typeof pacienteSeleccionado[key] === "boolean") {
      pacienteSeleccionado[key] = false;
    } else if (Array.isArray(pacienteSeleccionado[key])) {
      pacienteSeleccionado[key] = [];
    } else {
      pacienteSeleccionado[key] = "";
    }
  });
  // Campos numéricos en null
  pacienteSeleccionado.id = null;
  pacienteSeleccionado.medicoId = null;
  pacienteSeleccionado.medicoCabecera = null;
  pacienteSeleccionado.referidoPorId = null;
  pacienteSeleccionado.estadoCivilId = null;
  pacienteSeleccionado.departamentoId = null;
  pacienteSeleccionado.municipioId = null;
  pacienteSeleccionado.escolaridadId = null;
  pacienteSeleccionado.grupoSanguineoId = null;
  pacienteSeleccionado.vih = false;
};

// Validación del formulario
const validarFormulario = () => {
  validaciones.codigo = !!pacienteSeleccionado.codigo?.trim();
  validaciones.medico = !!pacienteSeleccionado.medicoId;
  validaciones.dni = !!pacienteSeleccionado.dni?.trim();
  validaciones.medicoCabecera = !!pacienteSeleccionado.medicoCabecera;
  validaciones.nombres = !!pacienteSeleccionado.nombres?.trim();
  validaciones.apellidos = !!pacienteSeleccionado.apellidos?.trim();
  validaciones.fechaNacimiento = !!pacienteSeleccionado.fechaNacimiento?.trim();
  validaciones.estadoCivil = !!pacienteSeleccionado.estadoCivilId;
  validaciones.telPersonal = !!pacienteSeleccionado.telPersonal?.trim();
  validaciones.sexo = !!pacienteSeleccionado.sexo?.trim();
  validaciones.departamentoId = !!pacienteSeleccionado.departamentoId;
  validaciones.municipio = !!pacienteSeleccionado.municipioId;
  validaciones.referidoPorId = !!pacienteSeleccionado.referidoPorId;
  validaciones.escolaridadId = !!pacienteSeleccionado.escolaridadId;
  validaciones.grupoSanguineoId = !!pacienteSeleccionado.grupoSanguineoId;
  // Aquí podrías agregar validaciones específicas para cada campo requerido

  return Object.values(validaciones).every((valido) => valido);
};

// Guardar / Actualizar Paciente
const guardarDatosFormulario = () => {
  if (!validarFormulario()) {
    Notify.create({
      message: "Por favor corrige los campos con errores",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  const payload = {
    id: pacienteSeleccionado.id,
    fechaRegistro:
      pacienteSeleccionado.fechaRegistro || new Date().toISOString(),
    codigo: pacienteSeleccionado.codigo,
    activo: pacienteSeleccionado.activo,
    medicoId: pacienteSeleccionado.medicoId,
    medicoCabecera: pacienteSeleccionado.medicoCabecera,
    referidoPorId: pacienteSeleccionado.referidoPorId,
    dni: pacienteSeleccionado.dni,
    nombres: pacienteSeleccionado.nombres,
    apellidos: pacienteSeleccionado.apellidos,
    fechaNacimiento: pacienteSeleccionado.fechaNacimiento,
    sexo: pacienteSeleccionado.sexo,
    estadoCivilId: pacienteSeleccionado.estadoCivilId,
    observaciones: pacienteSeleccionado.observaciones,
    direccion: pacienteSeleccionado.direccion,
    telCasa: pacienteSeleccionado.telCasa,
    telPersonal: pacienteSeleccionado.telPersonal,
    email: pacienteSeleccionado.email,
    departamentoId: pacienteSeleccionado.departamentoId,
    municipioId: pacienteSeleccionado.municipioId,
    organizacion: pacienteSeleccionado.organizacion,
    conyugue: pacienteSeleccionado.conyugue,
    madre: pacienteSeleccionado.madre,
    padre: pacienteSeleccionado.padre,
    escolaridadId: pacienteSeleccionado.escolaridadId,
    ocupacion: pacienteSeleccionado.ocupacion,
    grupoSanguineoId: pacienteSeleccionado.grupoSanguineoId,
    alergias: pacienteSeleccionado.alergias,
    vih: pacienteSeleccionado.vih,
  };

  // Si tiene id, es edición
  if (pacienteSeleccionado.id) {
    fichaIdentificacionStore
      .actualizarPaciente(payload)
      .then(() => {
        Notify.create({
          message: "Paciente actualizado",
          color: "positive",
          position: "top-right",
        });
        limpiarFormulario();
        dialogNuevoContacto.value = false;
      })
      .catch((error) => {
        Notify.create({
          message: "Error al actualizar el paciente",
          color: "negative",
          position: "top-right",
        });
        console.error("Error actualizando el paciente:", error);
      });
  } else {
    // Nuevo registro
    fichaIdentificacionStore
      .guardarDatos(payload)
      .then(() => {
        Notify.create({
          message: "Paciente guardado",
          color: "positive",
          position: "top-right",
        });
        limpiarFormulario();
        dialogNuevoContacto.value = false;
      })
      .catch((error) => {
        Notify.create({
          message: "Error al guardar el paciente",
          color: "negative",
          position: "top-right",
        });
        console.error("Error guardando el paciente:", error);
      });
  }
};

// Computed con datos adicionales (nombres de médicos, etc.)
const pacientesConDetalles = computed(() => {
  return (formIdentificacion.value || []).map((paciente) => {
    const medicoEncontrado = (medicos.value || []).find(
      (medic) => medic.id === Number(paciente.medicoId)
    );
    const medicoCabeceraEncontrado = (medicos.value || []).find(
      (medic) => medic.id === Number(paciente.medicoCabecera)
    );
    const referidoPorEncontrado = (medicos.value || []).find(
      (medic) => medic.id === Number(paciente.referidoPorId)
    );

    return {
      ...paciente,
      medicoNombre: medicoEncontrado
        ? medicoEncontrado.nombre
        : "Médico no encontrado",
      medicoCabeceraNombre: medicoCabeceraEncontrado
        ? medicoCabeceraEncontrado.nombre
        : "No asignado",
      referidoPorNombre: referidoPorEncontrado
        ? referidoPorEncontrado.nombre
        : "No asignado",
    };
  });
});

// Para mostrar el panel lateral (no afecta el modal)
const focusedRowKey = ref(null);
const isPanelOpened = ref(false);
const panelData = ref(null);
const openPanel = (paciente) => {
  panelData.value = paciente;
  isPanelOpened.value = true;
};
const onClose = () => {
  isPanelOpened.value = false;
};

// Eventos del grid
const rowClick = (e) => {
  focusedRowKey.value = e.key;
  panelData.value = e.data;
  isPanelOpened.value = true;
};

// Checkbox para actualizar el estado "activo"
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

// Botón para crear nuevo paciente (abrir modal en blanco)
const handleNuevoContacto = () => {
  limpiarFormulario();
  dialogNuevoContacto.value = true;
};

// Llenar el formulario para edición
const llenarFormulario = (data) => {
  // Primero limpiamos para evitar "basura" de otro paciente
  limpiarFormulario();
  // Asignamos todos los valores que lleguen en 'data'
  Object.keys(pacienteSeleccionado).forEach((key) => {
    if (data.hasOwnProperty(key)) {
      pacienteSeleccionado[key] = data[key];
    }
  });
};

// Evento click del botón Editar en la columna de acciones
const onEditButtonClick = (e) => {
  // Llenar el formulario con la data seleccionada
  llenarFormulario(e.row.data);
  // Cambiamos de tab a la información técnica, por ejemplo
  subTabFichaIdentificacion.value = "infoTecnica";
  // Abrimos el diálogo
  dialogNuevoContacto.value = true;
};

// Evento click del botón Eliminar en la columna de acciones
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

/* Tabs verticales */
::v-deep .vertical-tabs-2 .nav-link {
  min-width: 12rem; /* Nuevo ancho mínimo */
  max-width: 10rem; /* Nuevo ancho máximo */
}

/* Opcional: Ajustar el ancho en pantallas más pequeñas */
@media (max-width: 768px) {
  ::v-deep .vertical-tabs-2 .nav-link {
    min-width: 8rem;
    max-width: 8rem;
  }
}
@media (max-width: 576px) {
  ::v-deep .vertical-tabs-2 .nav-link {
    min-width: 100%;
    max-width: 100%;
  }
}

.styleModal {
  min-width: 1200px;
  min-height: 500px;
  background-color: #ffffff;
}
.separarTabs {
  margin-left: 100px;
}
.main-modal-container {
  padding: 20px;
}
.custom-select-height {
  height: 3rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5"><path fill="none" stroke="%23333" stroke-width="1.5" d="M1 1l4 3 4-3"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 10px 5px;
  cursor: pointer;
}

.card.card-body {
  padding: 20px !important;
  position: relative;
}
input {
  height: 50px; /* Altura del input */
  padding: 10px; /* Espaciado interno */
  font-size: 1rem; /* Tamaño de la fuente */
}

.form-container {
  max-width: 800px;
  margin: 0 25px;
  position: relative;
}

h6.text-primary {
  margin-bottom: 20px !important;
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
.q-card-section {
  margin-bottom: 20px;
}
.q-card-actions {
  margin-top: 20px;
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
