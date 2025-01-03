<template>
  <div class="page main-signin-wrapper">
    <div
      class="d-flex"
      data-bs-toggle="offcanvas"
      data-bs-target="#switcher-canvas"
    >
      <a class="nav-link icon" href="javascript:;">
        <i class="fe text-dark"></i>
      </a>
    </div>

    <div class="row signpages text-center">
      <div class="col-md-12 my-auto">
        <div class="card">
          <div class="row row-sm">
            <!-- Lado izquierdo del formulario -->
            <div
              class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details"
            >
              <div class="mt-5 pt-5 p-2 position-absolute">
                <router-link :to="url">
                  <img
                    src="../assets/icons/Imagen2.png"
                    class="header-brand-img mb-4"
                    alt="logo"
                  />
                </router-link>
                <div class="clearfix"></div>
                <h5 class="mt-4 text-fixed-white">Registrar Organización</h5>
                <span class="fs-white-6 fs-13 mb-5 mt-xl-0">
                  Completa el formulario para registrar una nueva organización
                </span>
              </div>
            </div>

            <!-- Lado derecho del formulario -->
            <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
              <div class="main-container container-fluid">
                <div class="row row-sm">
                  <div class="card-body mt-2 mb-2">
                    <div class="clearfix"></div>
                    <h5 class="text-start mb-2">Registrar Organización</h5>
                    <p class="mb-4 text-muted fs-13 ms-0 text-start">
                      Completa los campos para registrar una nueva organización.
                    </p>

                    <q-form @submit.prevent="handleSubmit" ref="form">
                      <!-- Campos de la organización -->
                      <div class="form-group text-start">
                        <label>Nombre de la Organización</label>
                        <input
                          v-model="nombre"
                          placeholder="Ingrese el nombre de la organización"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="form-group text-start">
                        <label>Dirección</label>
                        <input
                          v-model="direccion"
                          placeholder="Ingrese la dirección"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="form-group text-start">
                        <label>Email de Contacto</label>
                        <input
                          v-model="email_contacto"
                          placeholder="Ingrese el email de contacto"
                          type="email"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="form-group text-start">
                        <label>Número de Teléfono</label>
                        <input
                          v-model="numero_telefono"
                          placeholder="Ingrese el número de teléfono"
                          type="text"
                          class="form-control"
                        />
                      </div>

                      <!-- Campos del administrador -->
                      <h5 class="text-start mt-4">Datos del Administrador</h5>
                      <div class="form-group text-start">
                        <label>Email del Administrador</label>
                        <div class="input-group">
                          <span class="input-group-text">
                            <i class="ri-mail-line"></i>
                          </span>
                          <input
                            v-model="admin_email"
                            placeholder="Ingrese el email del administrador"
                            type="email"
                            class="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div class="form-group text-start">
                        <label>Contraseña del Administrador</label>
                        <div class="input-group">
                          <div class="input-group-text">
                            <i class="ri-lock-line"></i>
                          </div>
                          <input
                            type="password"
                            id="admin_password"
                            v-model="admin_password"
                            class="form-control"
                            placeholder="Ingrese la contraseña"
                            required
                            @input="validatePassword"
                          />
                        </div>
                      </div>

                      <div class="d-grid mt-4">
                        <q-btn
                          type="submit"
                          label="Registrar Organización"
                          color="primary"
                          unelevated
                          rounded
                          :loading="cargando"
                          class="btn ripple btn-primary"
                        />
                      </div>
                    </q-form>

                    <div v-if="error" class="mt-4">
                      <q-banner class="bg-negative text-white" dense>
                        {{ error }}
                      </q-banner>
                    </div>

                    <div v-if="mensajeExito" class="mt-4">
                      <q-banner class="bg-positive text-white" dense>
                        {{ mensajeExito }}
                      </q-banner>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, Notify } from "quasar";
import { useRouter } from "vue-router";
import { useOrganizacionStore } from "../stores/organizacionStore";
import { useThemeStore } from "../stores/themeStore"; // Asegúrate de que la ruta es correcta

// Refs para los campos del formulario
const nombre = ref("");
const direccion = ref("");
const email_contacto = ref("");
const numero_telefono = ref("");
const admin_email = ref("");
const admin_password = ref("");

// Estado del formulario
const organizacionStore = useOrganizacionStore();
const router = useRouter();
const error = ref(null);
const mensajeExito = ref(null);
const cargando = ref(false);
const $q = useQuasar();
const themeStore = useThemeStore();

// Ref para el formulario
const form = ref(null);

// Reglas de validación para el Email
const emailRules = [
  (value) => !!value || "El email es obligatorio.",
  (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || "Ingrese un email válido.";
  },
];

// Reglas de validación para la Contraseña
const passwordRules = [
  (value) => {
    console.log("Validando contraseña:", value);
    return !!value || "La contraseña es obligatoria.";
  },
  (value) => {
    // Regex actualizada para permitir una gama más amplia de símbolos
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    const isValid = regex.test(value);
    console.log(`Contraseña válida: ${isValid}`);
    return (
      isValid ||
      "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos."
    );
  },
];

// Manejo del envío del formulario
const handleSubmit = async () => {
  // Validar el formulario antes de enviar
  const isValid = await form.value.validate();
  if (!isValid) {
    return;
  }

  cargando.value = true;
  error.value = null;

  const datosOrganizacion = {
    nombre: nombre.value,
    direccion: direccion.value,
    email_contacto: email_contacto.value,
    numero_telefono: numero_telefono.value || null,
  };

  const datosAdmin = {
    email: admin_email.value,
    password: admin_password.value,
  };

  try {
    await organizacionStore.registrarOrganizacion(
      datosOrganizacion,
      datosAdmin
    );
    mensajeExito.value = "Organización registrada exitosamente.";
    $q.notify({
      type: "positive",
      message: "Revise el correo electrónico para verificar su cuenta.",
      position: "top-right",
    });
    router.push({ name: "dashboard" });
  } catch (err) {
    error.value =
      err.message || "Ocurrió un error al registrar la organización.";
    $q.notify({
      type: "negative",
      message: "Fallo al crear la organización, inténtelo más tarde.",
      position: "top-right",
    });
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  // Definir el tema light
  themeStore.colorThemeFn("light");
  themeStore.layoutStylesFn("icon-overlay");

  // Establecer el color naranja para --primary-rgb
  document.documentElement.style.setProperty("--primary-rgb", "223, 90, 90"); // RGB para naranja
});
</script>

<style scoped>
/* Mantiene las clases globales y agrega estilos específicos */
.page {
  min-height: 100vh;
}

.details {
  position: relative;
  padding: 20px;
}

.login_form {
  padding: 30px;
}

.btn-primary {
  font-size: 1rem;
  width: 100%;
}

/* .bg-primary {
  background: #3f51b5;
} */

.text-fixed-white {
  color: white;
}

.fs-13 {
  font-size: 13px;
}

/* Estilos para mensajes de error en los campos */
.q-field__messages {
  color: #f44336; /* Rojo para mensajes de error */
}

.q-input--error .q-field__control {
  border-color: #f44336;
}
</style>
