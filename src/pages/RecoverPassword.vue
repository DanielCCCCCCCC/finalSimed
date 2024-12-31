<template>
  <div class="page main-signin-wrapper">
    <!-- Row Principal -->
    <div class="row signpages text-center" @click="Removebutton">
      <div class="col-md-12 my-auto">
        <div class="card bg-primary">
          <div class="row row-sm">
            <!-- Columna de Detalles (Solo para pantallas grandes) -->
            <div
              class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details"
            >
              <div class="mt-3 pt-3 p-2 position-absolute">
                <router-link :to="`${url}dashboard`">
                  <img
                    src="../assets/icons/recoverPassIcon.png"
                    class="header-brand-img mb-4"
                    alt="logo"
                  />
                </router-link>
                <div class="clearfix"></div>
                <img
                  src="../assets/icons/Imagen2.png"
                  class="ht-100 mb-0"
                  alt="user"
                />
                <h5 class="mt-4 text-fixed-white">Reset Your Password</h5>
                <span class="fs-white-6 fs-13 mb-5 mt-xl-0">
                  Signup to create, discover and connect with the global
                  community
                </span>
              </div>
            </div>

            <!-- Columna del Formulario -->
            <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
              <div class="main-container container-fluid">
                <div class="row row-sm justify-content-center">
                  <div class="col-md-10 col-lg-8">
                    <div class="card-body mt-2 mb-2">
                      <div class="clearfix"></div>
                      <h5 class="text-start mb-2">Forgot Password</h5>
                      <p class="mb-4 text-muted fs-13 ms-0 text-start">
                        It's free to signup and only takes a minute.
                      </p>

                      <!-- Formulario de Recuperación -->
                      <form @submit.prevent="handleRecover">
                        <div class="form-group text-start mb-3">
                          <label for="email" class="form-label fs-14 text-dark"
                            >Correo Electrónico</label
                          >
                          <div class="input-group">
                            <span class="input-group-text">
                              <i class="ri-mail-line"></i>
                            </span>
                            <input
                              id="email"
                              v-model="email"
                              type="email"
                              placeholder="Ingresa tu correo electrónico"
                              class="form-control"
                              autofocus
                              @keyup.enter="handleRecover"
                              @blur="validateEmail"
                              required
                            />
                          </div>
                          <div v-if="emailError" class="text-danger fs-13 mt-1">
                            {{ emailError }}
                          </div>
                          <div v-if="emailError" class="text-danger fs-13 mt-1">
                            {{ emailError }}
                          </div>
                        </div>

                        <div class="form-group text-start mb-3">
                          <button type="submit" class="btn btn-primary w-100">
                            Enviar
                          </button>
                        </div>
                      </form>

                      <!-- Mensajes de Éxito y Error -->
                      <div v-if="success" class="q-mt-md">
                        <q-banner class="bg-green text-white">
                          Se ha enviado un correo para restablecer tu
                          contraseña.
                        </q-banner>
                      </div>

                      <div v-if="error" class="q-mt-md">
                        <q-banner class="bg-red text-white">
                          {{ error }}
                        </q-banner>
                      </div>

                      <!-- Footer del Formulario -->
                      <div
                        class="card-footer border-top-0 ps-0 mt-3 text-start"
                      >
                        <p>¿Recordaste tu contraseña?</p>
                        <p class="mb-0">
                          Intenta
                          <router-link :to="`${url}login`"
                            >Iniciar Sesión</router-link
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Fin de main-container -->
            </div>
            <!-- Fin de login_form -->
          </div>
          <!-- Fin de row-sm -->
        </div>
        <!-- Fin de card -->
      </div>
      <!-- Fin de col-md-12 -->
    </div>
    <!-- Fin de row signpages -->
  </div>
  <!-- Fin de page main-signin-wrapper -->
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { supabase } from "../supabaseClient";

const email = ref("");
const success = ref(false);
const error = ref("");
const emailError = ref(""); // Añadido para manejar errores de validación

const $q = useQuasar();
const url = import.meta.env.BASE_URL; // Asegurarse de definir 'url'

const handleRecover = async () => {
  // Resetear mensajes de error
  emailError.value = "";

  // Validaciones
  if (!email.value) {
    emailError.value = "Correo es requerido";
    return;
  }
  const emailPattern = /.+@.+\..+/;
  if (!emailPattern.test(email.value)) {
    emailError.value = "Correo inválido";
    return;
  }

  try {
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: window.location.origin + "/reset-password",
      }
    );

    if (supabaseError) throw supabaseError;

    success.value = true;
    error.value = "";
  } catch (err) {
    error.value = err.message;
    success.value = false;
  }
};

const Removebutton = () => {
  // Implementar según sea necesario
};
</script>

<style scoped>
/* Estilos Personalizados */

.page.main-signin-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa; /* Fondo claro */
}

.card {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* .bg-primary {
  background-color: #007bff !important;
} */

.text-fixed-white {
  color: #ffffff !important;
}

.details {
  position: relative;
  height: 100%;
}

.login_form {
  padding: 30px;
}

.header-brand-img {
  width: 150px;
}

.ht-100 {
  height: 100px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.text-start {
  text-align: left;
}
</style>
