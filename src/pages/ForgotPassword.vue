<!-- src/pages/ResetPassword.vue -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Restablecer Contraseña</div>
        <div class="text-subtitle2">
          Ingresa una nueva contraseña para tu cuenta.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleReset">
          <q-input
            v-model="password"
            label="Nueva Contraseña"
            type="password"
            required
            :rules="[
              (val) => (val && val.length >= 6) || 'Mínimo 6 caracteres',
            ]"
          />

          <div class="q-mt-md">
            <q-btn type="submit" label="Restablecer" color="primary" />
          </div>
        </q-form>

        <div v-if="success" class="q-mt-md">
          <q-banner class="bg-green text-white">
            Tu contraseña ha sido restablecida exitosamente.
          </q-banner>
        </div>

        <div v-if="error" class="q-mt-md">
          <q-banner class="bg-red text-white">
            {{ error }}
          </q-banner>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { supabase } from "../supabaseClient";

const password = ref("");
const success = ref(false);
const error = ref("");
const accessToken = ref("");

const $q = useQuasar();

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  accessToken.value = urlParams.get("access_token");

  if (!accessToken.value) {
    error.value = "Enlace inválido o expirado.";
  }
});

const handleReset = async () => {
  if (!accessToken.value) {
    error.value = "Enlace inválido o expirado.";
    return;
  }

  try {
    const { data, error: supabaseError } = await supabase.auth.updateUser(
      {
        password: password.value,
      },
      accessToken.value
    );

    if (supabaseError) throw supabaseError;

    success.value = true;
    error.value = "";
  } catch (err) {
    error.value = err.message;
    success.value = false;
  }
};
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>
