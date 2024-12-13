<template>
  <div class="page main-signin-wrapper">
    <div
      class="d-flex header-setting-icon demo-icon fa-spin"
      data-bs-toggle="offcanvas"
      data-bs-target="#switcher-canvas"
    >
      <a class="nav-link icon" href="javascript:;">
        <i class="fe fe-settings settings-icon text-dark"></i>
      </a>
    </div>
    <div class="row signpages text-center">
      <div class="col-md-12 my-auto">
        <div class="card">
          <div class="row row-sm">
            <div
              class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details"
            >
              <div class="mt-5 pt-4 p-2 position-absolute">
                <router-link :to="url">
                  <img
                    src="/images/brand-logos/desktop-white.png"
                    class="header-brand-img mb-4"
                    alt="logo"
                  />
                </router-link>
                <div class="clearfix"></div>
                <img
                  src="/images/svgs/user.svg"
                  class="ht-100 mb-0"
                  alt="user"
                />
                <h5 class="mt-4 text-fixed-white">Forgot Your Password?</h5>
                <span class="fs-white-6 fs-13 mb-5 mt-xl-0"
                  >Enter your email to receive password reset
                  instructions.</span
                >
              </div>
            </div>
            <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
              <div class="main-container container-fluid">
                <div class="row row-sm">
                  <div class="card-body mt-2 mb-2">
                    <div class="clearfix"></div>
                    <q-form @submit.prevent="handleForgotPassword">
                      <h5 class="text-start mb-2">Reset Your Password</h5>
                      <p class="mb-4 text-muted fs-13 ms-0 text-start">
                        Enter your email address and we'll send you instructions
                        to reset your password.
                      </p>
                      <div class="form-group text-start">
                        <label>Email</label>
                        <q-input
                          v-model="email"
                          type="email"
                          placeholder="Enter your email"
                          outlined
                          dense
                          required
                          :error="!!error"
                          error-message="Correo inválido"
                          class="form-control"
                        />
                      </div>
                      <div class="flex justify-center q-mt-lg">
                        <q-btn
                          type="submit"
                          :label="
                            cargando ? 'Enviando...' : 'Enviar Instrucciones'
                          "
                          color="primary"
                          :disable="cargando"
                          unelevated
                          rounded
                          class="btn ripple btn-primary d-grid"
                        />
                      </div>
                    </q-form>
                    <div v-if="error" class="error-message">
                      <q-banner class="bg-negative text-white" dense>
                        {{ error }}
                      </q-banner>
                    </div>
                    <div v-if="mensajeExito" class="success-message">
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
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { Notify } from "quasar";
import { useRouter } from "vue-router";

const email = ref("");
const cargando = ref(false);
const error = ref(null);
const mensajeExito = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const handleForgotPassword = async () => {
  error.value = null;
  mensajeExito.value = null;
  cargando.value = true;

  if (!email.value.trim()) {
    error.value = "El email es obligatorio.";
    cargando.value = false;
    return;
  }

  try {
    await authStore.forgotPassword(email.value);
    mensajeExito.value = "Se han enviado instrucciones a tu correo.";
    Notify.create({
      message: "Instrucciones enviadas",
      color: "positive",
      position: "top-right",
    });
  } catch (err) {
    error.value = err.message || "Error al enviar las instrucciones.";
    Notify.create({
      message: "Error al enviar las instrucciones",
      color: "negative",
      position: "top-right",
    });
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
/* Puedes mantener los mismos estilos globales si ya están definidos en archivos CSS externos */
</style>
