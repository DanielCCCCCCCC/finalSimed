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
                            v-model="pacienteSeleccionado.Codigo"
                            class="form-control"
                            placeholder="Ingresa código"
                          />
                          <!--
                          <div v-if="!validaciones.Codigo" class="text-danger mt-1">
                            El código es obligatorio
                          </div>
                          -->
                        </div>

                        <!-- Paciente Activo? -->
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Paciente Activo?</label>
                          <div class="form-check">
                            <input
                              type="checkbox"
                              v-model="pacienteSeleccionado.Activo"
                              class="form-check-input small-checkbox"
                            />
                          </div>
                        </div>

                        <!-- Médico -->
                        <!-- Selección de Médico -->
                        <div class="col-md-6 mb-3">
                          <label for="medicoSelect" class="form-label"
                            >Médico</label
                          >
                          <select
                            id="medicoSelect"
                            v-model="pacienteSeleccionado.MedicoId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateMedico"
                          >
                            <option disabled value="">
                              Seleccione un médico
                            </option>
                            <option
                              v-for="medico in medicos"
                              :key="medico.MedicoId"
                              :value="medico.MedicoId"
                            >
                              {{ medico.NombreMedico }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.medico"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un médico
                          </div>
                        </div>

                        <!-- Médico de Cabecera -->
                        <div class="col-md-6 mb-3">
                          <label for="medicoCabeceraSelect" class="form-label"
                            >Médico de Cabecera</label
                          >
                          <select
                            id="medicoCabeceraSelect"
                            v-model="pacienteSeleccionado.MedicoCabeceraId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateMedicoCabecera"
                          >
                            <option disabled value="">
                              Seleccione un médico de cabecera
                            </option>
                            <option
                              v-for="medico in medicos"
                              :key="medico.MedicoId"
                              :value="medico.MedicoId"
                            >
                              {{ medico.NombreMedico }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.MedicoCabeceraId"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un médico de cabecera
                          </div>
                        </div>

                        <!-- Referido por -->
                        <div class="col-md-6 mb-3">
                          <label for="referidoPorSelect" class="form-label"
                            >Referido por (Médico)</label
                          >
                          <select
                            id="referidoPorSelect"
                            v-model="pacienteSeleccionado.ReferidoPorId"
                            class="form-select custom-select-height"
                          >
                            <option disabled value="">
                              Seleccione un médico
                            </option>
                            <option
                              v-for="medico in medicos"
                              :key="medico.MedicoId"
                              :value="medico.MedicoId"
                            >
                              {{ medico.NombreMedico }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.ReferidoPorId"
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
                        <!-- Nombre -->
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Nombre</label>
                          <input
                            v-model="pacienteSeleccionado.Nombre"
                            class="form-control"
                            :class="{
                              'is-invalid': !validaciones.Nombre,
                            }"
                            placeholder="Ingrese el nombre del paciente"
                          />
                        </div>

                        <div class="col-md-6 mb-3">
                          <label class="form-label">Identificación</label>
                          <input
                            v-model="pacienteSeleccionado.Identificacion"
                            class="form-control"
                            :class="{
                              'is-invalid': !validaciones.Identificacion,
                            }"
                            placeholder="Ingrese la identificación"
                          />
                          <div
                            v-if="!validaciones.Identificacion"
                            class="text-danger mt-1"
                          >
                            La Identificación es obligatoria.
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Fecha de Nacimiento</label>
                          <input
                            v-model="pacienteSeleccionado.FechaNacimiento"
                            type="date"
                            class="form-control"
                            :class="{
                              'is-invalid': !validaciones.FechaNacimiento,
                            }"
                          />
                          <div
                            v-if="!validaciones.FechaNacimiento"
                            class="invalid-feedback"
                          >
                            Debe ingresar una fecha válida
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Sexo</label>
                          <select
                            v-model="pacienteSeleccionado.Sexo"
                            class="form-select custom-select-height"
                            :class="{
                              'is-invalid': !validaciones.Sexo,
                            }"
                          >
                            <option disabled value="">
                              Seleccione el Sexo
                            </option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                          </select>
                          <div
                            v-if="!validaciones.Sexo"
                            class="invalid-feedback"
                          >
                            Debe seleccionar un Sexo
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label for="estadoCivilSelect" class="form-label"
                            >Estado Civil</label
                          >
                          <select
                            id="estadoCivilSelect"
                            v-model="pacienteSeleccionado.EstadoCivil"
                            class="form-select custom-select-height"
                            required
                            @blur="validateEstadoCivil"
                          >
                            <option disabled value="">
                              Seleccione un estado civil
                            </option>
                            <option
                              v-for="estado in EstadosCivilesList"
                              :key="estado.id"
                              :value="estado.id"
                            >
                              {{ estado.descripcion }}
                            </option>
                          </select>

                          <div
                            v-if="!validaciones.EstadoCivil"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un estado civil
                          </div>
                        </div>

                        <div class="col-md-12 mb-3">
                          <label class="form-label">Observaciones</label>
                          <textarea
                            v-model="pacienteSeleccionado.Observaciones"
                            class="form-control"
                            :class="{
                              'is-invalid': !validaciones.Observaciones,
                            }"
                            placeholder="Ingrese Observaciones"
                          ></textarea>
                          <div
                            v-if="!validaciones.Observaciones"
                            class="invalid-feedback"
                          >
                            Debe ingresar Observaciones
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
                            v-model="pacienteSeleccionado.Direccion"
                            class="form-control"
                            placeholder="Ingrese la dirección"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Teléfono Hogar</label>
                          <input
                            v-model="pacienteSeleccionado.TelefonoDos"
                            class="form-control"
                            placeholder="Ingrese el teléfono del hogar"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Teléfono Personal</label>
                          <input
                            v-model="pacienteSeleccionado.TelefonoUno"
                            class="form-control"
                            :class="{ 'is-invalid': !validaciones.TelefonoUno }"
                            placeholder="Ingrese el teléfono personal"
                          />
                          <div
                            v-if="!validaciones.TelefonoUno"
                            class="invalid-feedback"
                          >
                            Debe ingresar un número de teléfono
                          </div>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Email</label>
                          <input
                            v-model="pacienteSeleccionado.Email"
                            type="Email"
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
                            v-model="pacienteSeleccionado.EstadoId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateDepartamento"
                          >
                            <option disabled value="">
                              Seleccione un departamento
                            </option>
                            <option
                              v-for="departamento in departamentos"
                              :key="departamento.DepartamentoId"
                              :value="departamento.DepartamentoId"
                            >
                              {{ departamento.Descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.EstadoId"
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
                            v-model="pacienteSeleccionado.MunicipioId"
                            class="form-select custom-select-height"
                            required
                            @blur="validateMunicipio"
                          >
                            <option disabled value="">
                              Seleccione un municipio
                            </option>
                            <option
                              v-for="municipio in filteredMunicipios"
                              :key="municipio.MunicipioId"
                              :value="municipio.MunicipioId"
                            >
                              {{ municipio.Descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.MunicipioId"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un municipio
                          </div>
                        </div>

                        <div class="col-md-12 mb-3">
                          <label class="form-label">Organización</label>
                          <input
                            v-model="pacienteSeleccionado.Observaciones"
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
                            v-model="pacienteSeleccionado.Conyugue"
                            class="form-control"
                            placeholder="Ingrese el nombre del cónyuge"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Madre</label>
                          <input
                            v-model="pacienteSeleccionado.Madre"
                            class="form-control"
                            placeholder="Ingrese el nombre de la Madre"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Padre</label>
                          <input
                            v-model="pacienteSeleccionado.Padre"
                            class="form-control"
                            placeholder="Ingrese el nombre del Padre"
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
                            v-model="pacienteSeleccionado.Escolaridad"
                            class="form-select custom-select-height"
                            required
                            @blur="validateEscolaridad"
                          >
                            <option disabled value="">
                              Seleccione una escolaridad
                            </option>
                            <option
                              v-for="escolaridad in EscolaridadesList"
                              :key="escolaridad.id"
                              :value="escolaridad.id"
                            >
                              {{ escolaridad.descripcion }}
                            </option>
                          </select>

                          <div
                            v-if="!validaciones.Escolaridad"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar la escolaridad
                          </div>
                        </div>

                        <div class="col-md-6 mb-3">
                          <label class="form-label">Ocupación</label>
                          <input
                            v-model="pacienteSeleccionado.Ocupacion"
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
                            v-model="pacienteSeleccionado.GrupoSanguineo"
                            class="form-select custom-select-height"
                            required
                            @blur="validateGrupoSanguineo"
                          >
                            <option disabled value="">
                              Seleccione un grupo sanguíneo
                            </option>
                            <option
                              v-for="GrupoSanguineo in GrupoSanguineoList"
                              :key="GrupoSanguineo.id"
                              :value="GrupoSanguineo.id"
                            >
                              {{ GrupoSanguineo.descripcion }}
                            </option>
                          </select>
                          <div
                            v-if="!validaciones.GrupoSanguineo"
                            class="text-danger mt-1"
                          >
                            Debe seleccionar un grupo sanguíneo
                          </div>
                        </div>

                        <div class="col-md-12 mb-3">
                          <label class="form-label">Alergias</label>
                          <textarea
                            v-model="pacienteSeleccionado.Alergias"
                            class="form-control"
                            placeholder="Ingrese las Alergias del paciente"
                          ></textarea>
                        </div>
                        <div class="col-md-12 mb-3">
                          <label class="form-label">VIH</label>
                          <div class="form-check">
                            <input
                              type="checkbox"
                              v-model="pacienteSeleccionado.VIH"
                              class="form-check-input small-checkbox"
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
        :key-expr="'PacienteId'"
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

        <!-- Definir las columnas aquí -->
        <DxColumn
          data-field="Codigo"
          caption="Código"
          :allow-editing="false"
          :min-width="80"
        />
        <DxColumn
          data-field="FechaRegistro"
          caption="F. Registro"
          data-type="date"
          :min-width="100"
          :visible="true"
        />
        <DxColumn
          data-field="Identificacion"
          caption="Identificacíon"
          :min-width="120"
          :visible="true"
        />
        <DxColumn
          data-field="Nombre"
          caption="Nombre"
          sort-order="asc"
          :min-width="130"
        />

        <DxColumn
          data-field="FechaNacimiento"
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
          data-field="Activo"
          caption="Activo"
          data-type="boolean"
          :min-width="80"
          :width="90"
          :visible="true"
        >
          <template #cell="{ data }">
            <DxCheckBox
              class="small-checkbox"
              v-model="data.Activo"
              :value="data.Activo"
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
import { useDirPacientesStore } from "../stores/fichaIdentificacionStores";
import { useTiposPacientesStore } from "../stores/ConfiMedicasStores";
import { useMedicoStore } from "../stores/DirMedico";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { EstadosCiviles } from "../stores/EstadosCiviles";
import { Escolaridades } from "../stores/Escolaridades";
import { GruposSanguineos } from "../stores/GrupoSanguineo";
import PacientePanel from "./PacientePanel.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { useAuthStore } from "../stores/auth"; // Importa la tienda de autenticación
import { supabase } from "../supabaseClient"; // Asegúrate de que la ruta es correcta

// Para emitir eventos (si fuera necesario)
const emit = defineEmits(["cambiar-tab"]);

// Almacenes Pinia
const dirPacientesStore = useDirPacientesStore();
const DepartamentoStore = useDepartamentoStore();
const MunicipioStore = useMunicipioStore();
const MedicoStore = useMedicoStore();
const authStore = useAuthStore(); // Accede a la tienda de autenticación

// Referencias de los stores
const { formIdentificacion } = storeToRefs(dirPacientesStore);
const { medicos } = storeToRefs(MedicoStore);
const { departamentos } = storeToRefs(DepartamentoStore);
const { municipios } = storeToRefs(MunicipioStore);

const EstadosCivilesList = ref(EstadosCiviles);
const EscolaridadesList = ref(Escolaridades);
const GrupoSanguineoList = ref(GruposSanguineos);

console.log("Estados Civiles cargados:", EstadosCivilesList.value);
console.log("Escolaridades cargadas:", EscolaridadesList.value);
// Lifecycle
onMounted(async () => {
  await MedicoStore.cargarMedicos();
  await dirPacientesStore.cargarDatos();
  await DepartamentoStore.cargarDepartamentos();
  await MunicipioStore.cargarMunicipios();
  console.log("PACIENTES CARGADO=: ", formIdentificacion.value);
});

// Modelo reActivo para el paciente seleccionado
const pacienteSeleccionado = reactive({
  id: null, // Se mantiene para operaciones internas
  FechaRegistro: "",
  Codigo: "",
  Activo: false,
  MedicoId: null,
  MedicoCabeceraId: null,
  ReferidoPorId: null,
  Identificacion: "",
  Nombre: "",
  FechaNacimiento: "",
  Sexo: "",
  EstadoCivil: null,
  Observaciones: "",
  Direccion: "",
  TelefonoDos: "",
  TelefonoUno: "",
  Email: "",
  EstadoId: null,
  MunicipioId: null,
  Observaciones: "",
  Conyugue: "",
  Madre: "",
  Padre: "",
  Escolaridad: null,
  Ocupacion: "",
  GrupoSanguineo: null,
  Alergias: "",
  VIH: false,
  userId: "", // Inicializar para evitar undefined
  tenant_id: "", // Inicializar para evitar undefined
});

// Inicializar tenant_id y userId desde authStore
pacienteSeleccionado.userId = authStore.userId;
pacienteSeleccionado.tenant_id = authStore.tenant_id;

const dialogNuevoContacto = ref(false);
const tab = ref("Pacientes");
const subTabFichaIdentificacion = ref("infoTecnica");

// Computed para filtrar municipios en base al departamento seleccionado
const filteredMunicipios = computed(() => {
  // Verificar si pacienteSeleccionado y EstadoId están definidos
  if (!pacienteSeleccionado || !pacienteSeleccionado.EstadoId) {
    console.warn("EstadoId no está definido o pacienteSeleccionado es nulo:", {
      pacienteSeleccionado,
    });
    return [];
  }

  // Mostrar el EstadoId que se está filtrando
  console.log(
    "Filtrando municipios por EstadoId:",
    pacienteSeleccionado.EstadoId
  );

  // Filtrar municipios
  const municipiosFiltrados = municipios.value.filter(
    (municipio) => municipio.EstadoId === pacienteSeleccionado.EstadoId
  );

  // Verificar la salida de municipios filtrados
  console.log(
    `Municipios filtrados para EstadoId ${pacienteSeleccionado.EstadoId}:`,
    municipiosFiltrados
  );

  return municipiosFiltrados;
});

// Validaciones
const validaciones = reactive({
  Codigo: true,
  medico: true,
  MedicoCabeceraId: true,
  Identificacion: true,
  Nombre: true,
  FechaNacimiento: true,
  Sexo: true,
  EstadoCivil: true,
  Observaciones: true, // si decides hacer obligatorio "Observaciones"
  TelefonoUno: true,
  EstadoId: true,
  MunicipioId: true,
  ReferidoPorId: true,
  Escolaridad: true,
  GrupoSanguineo: true,
});

/**
 * @param {string} fullName - Nombre completo del usuario.
 * @returns {string} - Iniciales en mayúsculas.
 */

const validateMedico = () => {
  validaciones.medico = !!pacienteSeleccionado.MedicoId;
};

const validateMedicoCabecera = () => {
  validaciones.MedicoCabeceraId = !!pacienteSeleccionado.MedicoCabeceraId;
};

const validateEstadoCivil = () => {
  validaciones.EstadoCivil = !!pacienteSeleccionado.EstadoCivil;
};

const validateDepartamento = () => {
  validaciones.EstadoId = !!pacienteSeleccionado.EstadoId;
};

const validateMunicipio = () => {
  validaciones.MunicipioId = !!pacienteSeleccionado.MunicipioId;
};

const validateEscolaridad = () => {
  validaciones.Escolaridad = !!pacienteSeleccionado.Escolaridad;
};

const validateGrupoSanguineo = () => {
  validaciones.GrupoSanguineo = !!pacienteSeleccionado.GrupoSanguineo;
};

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
  pacienteSeleccionado.PacienteId = null;
  pacienteSeleccionado.MedicoId = null;
  pacienteSeleccionado.MedicoCabeceraId = null;
  pacienteSeleccionado.ReferidoPorId = null;
  pacienteSeleccionado.EstadoCivil = null;
  pacienteSeleccionado.EstadoId = null;
  pacienteSeleccionado.MunicipioId = null;
  pacienteSeleccionado.Escolaridad = null;
  pacienteSeleccionado.GrupoSanguineo = null;
  pacienteSeleccionado.VIH = false;
  pacienteSeleccionado.userId = authStore.userId;
  pacienteSeleccionado.tenant_id = authStore.tenant_id;
};

/**
 * Validación del formulario
 */
const validarFormulario = () => {
  validaciones.Codigo = !!pacienteSeleccionado.Codigo?.trim();
  validaciones.medico = !!pacienteSeleccionado.MedicoId;
  validaciones.Identificacion = !!pacienteSeleccionado.Identificacion?.trim();
  validaciones.MedicoCabeceraId = !!pacienteSeleccionado.MedicoCabeceraId;
  validaciones.Nombre = !!pacienteSeleccionado.Nombre?.trim();
  validaciones.FechaNacimiento = !!pacienteSeleccionado.FechaNacimiento?.trim();
  validaciones.EstadoCivil = !!pacienteSeleccionado.EstadoCivil;
  validaciones.TelefonoUno = !!pacienteSeleccionado.TelefonoUno?.trim();
  validaciones.Sexo = !!pacienteSeleccionado.Sexo?.trim();
  validaciones.EstadoId = !!pacienteSeleccionado.EstadoId;
  validaciones.MunicipioId = !!pacienteSeleccionado.MunicipioId;
  validaciones.ReferidoPorId = !!pacienteSeleccionado.ReferidoPorId;
  validaciones.Escolaridad = !!pacienteSeleccionado.Escolaridad;
  validaciones.GrupoSanguineo = !!pacienteSeleccionado.GrupoSanguineo;
  // Aquí podrías agregar validaciones específicas para cada campo requerido

  return Object.values(validaciones).every((valido) => valido);
};

/**
 * Guarda o actualiza los datos del paciente.
 */
const guardarDatosFormulario = async () => {
  const formularioValido = validarFormulario();
  if (!formularioValido) {
    Notify.create({
      message: "Por favor corrige los campos con errores",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  // Construir el payload excluyendo el 'id' si es un nuevo paciente
  const payload = {
    FechaRegistro:
      pacienteSeleccionado.FechaRegistro || new Date().toISOString(),
    Codigo: pacienteSeleccionado.Codigo,
    Activo: pacienteSeleccionado.Activo,
    MedicoId: pacienteSeleccionado.MedicoId,
    MedicoCabeceraId: pacienteSeleccionado.MedicoCabeceraId,
    ReferidoPorId: pacienteSeleccionado.ReferidoPorId,
    Identificacion: pacienteSeleccionado.Identificacion,
    Nombre: pacienteSeleccionado.Nombre,
    FechaNacimiento: pacienteSeleccionado.FechaNacimiento,
    Sexo: pacienteSeleccionado.Sexo,
    EstadoCivil: pacienteSeleccionado.EstadoCivil,
    Observaciones: pacienteSeleccionado.Observaciones,
    Direccion: pacienteSeleccionado.Direccion,
    TelefonoDos: pacienteSeleccionado.TelefonoDos,
    TelefonoUno: pacienteSeleccionado.TelefonoUno,
    Email: pacienteSeleccionado.Email,
    EstadoId: pacienteSeleccionado.EstadoId,
    MunicipioId: pacienteSeleccionado.MunicipioId,
    Observaciones: pacienteSeleccionado.Observaciones,
    Conyugue: pacienteSeleccionado.Conyugue,
    Madre: pacienteSeleccionado.Madre,
    Padre: pacienteSeleccionado.Padre,
    Escolaridad: pacienteSeleccionado.Escolaridad,
    Ocupacion: pacienteSeleccionado.Ocupacion,
    GrupoSanguineo: pacienteSeleccionado.GrupoSanguineo,
    Alergias: pacienteSeleccionado.Alergias,
    VIH: pacienteSeleccionado.VIH,
    tenant_id: pacienteSeleccionado.tenant_id,
    userId: pacienteSeleccionado.userId,
  };
  console.log("Payload enviado:", payload);

  try {
    if (pacienteSeleccionado.PacienteId) {
      // Actualización
      if (pacienteSeleccionado.PacienteId) {
        payload.PacienteId = pacienteSeleccionado?.PacienteId;
        console.log("Id del paciente: ", payload.PacienteId);
      } else {
        console.error(
          "Error: PacienteId no está definido para la actualización."
        );
        return;
      }

      await dirPacientesStore.actualizarPaciente(payload);
      // Notify.create({
      //   message: "Paciente actualizado",
      //   color: "positive",
      //   position: "top-right",
      // });
    } else {
      // Nuevo registro (sin 'id')
      await dirPacientesStore.guardarDatos(payload);
      // Notify.create({
      //   message: "Paciente guardado",
      //   color: "positive",
      //   position: "top-right",
      // });
    }
    limpiarFormulario();
    dialogNuevoContacto.value = false;
  } catch (error) {
    if (error.code === "23505") {
      // Código de error para violación de unicidad en PostgreSQL
      Notify.create({
        message: "El código generado ya existe. Por favor, inténtalo de nuevo.",
        color: "negative",
        position: "top-right",
      });
      console.error("Error de duplicación de código:", error);
    } else {
      Notify.create({
        message: `Error al guardar el paciente: ${error.message}`,
        color: "negative",
        position: "top-right",
      });
      console.error("Error guardando el paciente:", error);
    }
  }
};

/**
 * Computed con datos adicionales (Nombre de médicos, etc.)
 */
const pacientesConDetalles = computed(() => {
  return (formIdentificacion.value || []).map((paciente) => {
    const medicoEncontrado = (medicos.value || []).find(
      (medic) => Number(paciente.MedicoId) === Number(medic.MedicoId)
    );
    const medicoCabeceraEncontrado = (medicos.value || []).find(
      (medic) => Number(paciente.MedicoCabeceraId) === Number(medic.MedicoId)
    );
    const referidoPorEncontrado = (medicos.value || []).find(
      (medic) => Number(paciente.ReferidoPorId) === Number(medic.MedicoId)
    );

    return {
      ...paciente,
      medicoNombre: medicoEncontrado
        ? medicoEncontrado.NombreMedico
        : "Médico no encontrado",
      medicoCabeceraNombre: medicoCabeceraEncontrado
        ? medicoCabeceraEncontrado.NombreMedico
        : "No asignado",
      referidoPorNombre: referidoPorEncontrado
        ? referidoPorEncontrado.NombreMedico
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

// Checkbox para actualizar el estado "Activo"
const onCheckboxChange = async (data) => {
  try {
    const success = await dirPacientesStore.actualizarPaciente({
      id: data.id,
      Activo: data.Activo,
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

/**
 * Botón para crear nuevo paciente (abrir modal en blanco)
 */
const handleNuevoContacto = async () => {
  limpiarFormulario();

  dialogNuevoContacto.value = true;
};

/**
 * Llenar el formulario para edición
 * @param {Object} data - Datos del paciente seleccionado
 */
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
  const PacienteId = e.row.data.PacienteId;
  try {
    const success = await dirPacientesStore.eliminarPaciente(PacienteId);
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

// Impresión de los claims en el JWT
onMounted(() => {
  if (authStore.session) {
    console.log("JWT (Access Token):", authStore.session.access_token);
    console.log("Rol del usuario:", authStore.role);
    console.log("Tenant ID del usuario:", authStore.tenant_id);
  } else {
    console.log("No hay sesión activa.");
  }
});
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
.small-checkbox {
  transform: scale(0.8);
  margin-right: 5px; /* Ajusta el margen si es necesario */
  transform-origin: center;
  height: 20px;
  width: 20px;
}

/* Ajuste de alineación vertical */
.form-check-input.small-checkbox {
  margin-top: 0.3rem;
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

.form-labelChecbox {
  font-weight: 100;
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

/* Estilos para DevExtreme DxCheckBox */
.small-checkbox .dx-checkbox-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 576px) {
  .small-checkbox {
    transform: scale(0.7);
  }
}
</style>
