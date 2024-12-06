<!-- <template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <q-card-section class="text-h6 text-primary"
      >Ficha de Identificación</q-card-section
    >
    <q-form class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-4">
          <q-img
            src="/statics/placeholder-image.png"
            label="Foto del Paciente"
            class="fit"
          >
            <div class="absolute-bottom bg-grey-9 text-white text-center">
              Sin imagen
            </div>
          </q-img>

          <q-input v-model="form.codigo" label="Código" outlined dense />
          <q-checkbox v-model="form.activo" label="Activo" />

          <q-select
            v-model="form.tipo"
            :options="tipoOptions"
            label="Tipo"
            outlined
            dense
          />
          <q-input v-model="form.dni" label="DNI" outlined dense />
          <q-select
            v-model="form.medico"
            :options="medicoOptions"
            label="Médico"
            outlined
            dense
          />
          <q-select
            v-model="form.medicoCabecera"
            :options="medicoCabeceraOptions"
            label="Médico Cabecera"
            outlined
            dense
          />
          <q-select
            v-model="form.referidoPor"
            :options="referidoPorOptions"
            label="Referido Por"
            outlined
            dense
          />
        </div>

        <div class="col-8">
          <q-input v-model="form.nombre" label="Nombre" outlined dense />
          <q-input v-model="form.direccion" label="Dirección" outlined dense />
          <q-select
            v-model="form.estado"
            :options="estadoOptions"
            label="Estado"
            outlined
            dense
          />
          <q-select
            v-model="form.municipio"
            :options="municipioOptions"
            label="Municipio"
            outlined
            dense
          />
          <q-select
            v-model="form.sexo"
            :options="sexoOptions"
            label="Sexo"
            outlined
            dense
          />
          <q-date
            v-model="form.fechaNacimiento"
            label="Fecha Nac"
            mask="YYYY-MM-DD"
            outlined
            dense
          />
          <q-select
            v-model="form.estadoCivil"
            :options="estadoCivilOptions"
            label="Estado Civil"
            outlined
            dense
          />
          <q-input v-model="form.conyugue" label="Cónyugue" outlined dense />
          <q-input v-model="form.madre" label="Madre" outlined dense />
          <q-input v-model="form.padre" label="Padre" outlined dense />
          <q-input
            v-model="form.organizacion"
            label="Organización"
            outlined
            dense
          />
          <q-input
            v-model="form.observaciones"
            label="Observaciones"
            type="textarea"
            outlined
            dense
          />
        </div>
      </div>

      <div class="row justify-end q-mt-md">
        <q-btn
          label="Guardar"
          color="primary"
          icon="save"
          @click="guardarFicha"
        />
        <q-btn
          label="Eliminar"
          color="negative"
          icon="delete"
          @click="eliminarFicha"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  codigo: 0,
  activo: true,
  tipo: "",
  dni: "",
  medico: "",
  medicoCabecera: "",
  referidoPor: "",
  nombre: "",
  direccion: "",
  estado: "",
  municipio: "",
  sexo: "",
  fechaNacimiento: "",
  estadoCivil: "",
  conyugue: "",
  madre: "",
  padre: "",
  organizacion: "",
  observaciones: "",
});

// Opciones para selectores
const tipoOptions = ["Tipo1", "Tipo2", "Tipo3"];
const medicoOptions = ["Medico1", "Medico2", "Medico3"];
const medicoCabeceraOptions = ["MedicoCab1", "MedicoCab2"];
const referidoPorOptions = ["Referido1", "Referido2"];
const estadoOptions = ["Estado1", "Estado2"];
const municipioOptions = ["Municipio1", "Municipio2"];
const sexoOptions = ["Masculino", "Femenino"];
const estadoCivilOptions = ["Soltero", "Casado", "Viudo"];

const guardarFicha = () => {
  console.log("Ficha guardada", form.value);
};

const eliminarFicha = () => {  console.log("Ficha eliminada");
};
</script>

<style scoped>
.q-card {
  max-width: 1200px;
  margin: 0 auto;
}

.text-primary {
  color: #1976d2;
}
</style> -->
