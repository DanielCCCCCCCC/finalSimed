<template>
  <q-page class="profile-page">
    <div class="profile-container">
      <!-- Banner superior -->
      <div class="profile-banner">
        <img
          src="../assets/icons/banner.jpg"
          alt="Banner"
          class="banner-image"
        />
      </div>
      <!-- Sección principal del perfil -->
      <div class="profile-main">
        <!-- Avatar y nombre -->
        <div class="profile-header">
          <q-avatar size="150px" class="profile-avatar">
            <img src="../assets/icons/profileMedico.jpg" alt="Doctor" />
          </q-avatar>
          <h3 class="profile-name">Dr. Sonia Taylor</h3>
        </div>
      </div>

      <!-- Tabs -->
      <q-card class="custom-card main-content-body-profile">
        <q-tab-panels animated v-model="tab">
          <q-tabs
            v-model="tab"
            class="tabs-menu profile-nav-line"
            dense
            align="left"
          >
            <q-tab name="about" label="About" />
            <q-tab name="edit" label="Edit Profile" />
            <q-tab name="timeline" label="Timeline" />
            <q-tab name="gallery" label="Gallery" />
            <q-tab name="settings" label="Account Settings" />
          </q-tabs>

          <!-- Contenido de los Tabs -->
          <q-tab-panel name="about">
            <q-card-section>
              <h4 class="fs-15 text-uppercase mb-3">BIOdata</h4>
              <p>
                Dr. Sonia Taylor es una especialista en Cardiología con más de
                10 años de experiencia en el cuidado y tratamiento de
                enfermedades cardiovasculares.
              </p>
              <div>
                <h5 class="text-primary m-b-5 fs-14">Lead Cardiologist</h5>
                <p>Hospital Central</p>
                <p><b>2015-2023</b></p>
                <p class="text-muted fs-13">
                  Responsable de diagnósticos avanzados y tratamientos
                  personalizados para pacientes con enfermedades
                  cardiovasculares.
                </p>
              </div>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const tab = ref("about");
</script>

<style scoped>
/* .profile-page {
  background-color: #ffffff;
  position: relative;
  top: -40px;
} */

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-banner {
  position: relative;
  height: 200px;
}

.banner-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.profile-main {
  text-align: center;
  padding: 20px;
}

.profile-avatar {
  margin-top: -75px; /* Para superponer el avatar al banner */
  border: 5px solid #ffffff;
}

.profile-name {
  margin-top: 10px;
  font-size: 1.8rem;
  font-weight: bold;
}

.profile-buttons {
  margin-top: 15px;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.profile-stats div {
  text-align: center;
}

.profile-stats strong {
  display: block;
  font-size: 1.2rem;
}

.tabs-menu {
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
