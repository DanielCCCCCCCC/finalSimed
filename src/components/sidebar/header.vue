<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="app-header">
      <div class="main-header-container container-fluid">
        <!-- Start::header-content-left -->
        <div class="header-content-left">
          <!-- Start::header-element -->
          <div class="header-element">
            <div class="horizontal-logo">
              <router-link :to="`${url}dashboard`" class="header-logo">
                <!-- tus logos aquí -->
              </router-link>
            </div>
          </div>
          <!-- End::header-element -->

          <!-- Start::header-element -->
          <div class="header-element sb">
            <a
              @click="handleToggleMenu"
              aria-label="Hide Sidebar"
              class="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
              href="javascript:void(0);"
            >
              <span></span>
            </a>
          </div>
          <!-- End::header-element -->
        </div>
        <!-- End::header-content-left -->

        <!-- Start::header-content-right -->
        <div
          class="header-content-right bajarIconoFullScreen d-flex align-items-center"
        >
          <!-- Start::header-element (Fullscreen) -->
          <div
            class="header-element header-fullscreen q-mt-xs d-xl-flex d-none"
          >
            <a
              @click="toggleFullScreen"
              href="javascript:void(0);"
              class="header-link"
            >
              <i
                v-if="!isFullScreen"
                class="fe fe-maximize full-screen-open header-link-icon"
              ></i>
              <i
                v-else
                class="fe fe-minimize full-screen-close header-link-icon"
              ></i>
            </a>
          </div>
          <!-- End::header-element -->

          <!-- Start::header-element (Notificaciones) -->
          <div
            class="header-element bajarIconoNotificaciones notifications-dropdown"
          >
            <!-- Botón con ícono de campanita -->
            <q-btn
              flat
              round
              icon="notifications"
              color="dark"
              @click="toggleNotificationMenu"
            >
              <!-- Badge con el conteo de pendientes -->
              <q-badge
                color="secondary"
                floating
                align="top right"
                :label="pendingAppointmentsCount"
                v-if="pendingAppointmentsCount > 0"
              />
            </q-btn>

            <!-- Menú de Notificaciones -->
            <q-menu v-model="notificationMenu" anchor="top right" auto-close>
              <q-card style="min-width: 300px">
                <q-card-section>
                  <div class="d-flex justify-between">
                    <div class="text-h6">Notificaciones</div>
                    <q-badge
                      color="secondary"
                      :label="`Unread: ${pendingAppointmentsCount}`"
                    />
                  </div>
                </q-card-section>
                <q-separator />

                <!-- Lista de Notificaciones -->
                <q-card-section class="q-pa-none">
                  <simplebar
                    data-simplebar-auto-hide="false"
                    style="max-height: 300px"
                  >
                    <!-- Si hay notificaciones pendientes... -->
                    <q-list v-if="notificationList.length">
                      <q-item
                        v-for="item in notificationList"
                        :key="item.id"
                        clickable
                        @click="goToNotification(item)"
                      >
                        <q-item-section avatar>
                          <q-avatar size="40px">
                            <img :src="item.icon" alt="icon" />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ item.title }}</q-item-label>
                          <q-item-label caption>{{ item.time }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            flat
                            icon="close"
                            size="sm"
                            @click.stop="removeNotification(item)"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>

                    <!-- Si no hay notificaciones... -->
                    <div v-else class="q-pa-sm text-center">
                      <q-avatar
                        size="80px"
                        class="bg-secondary-transparent q-mb-md"
                      >
                        <i class="ri-notification-off-line fs-2"></i>
                      </q-avatar>
                      <div>No New Notifications</div>
                    </div>
                  </simplebar>
                </q-card-section>

                <!-- Botón "View All" si hay notificaciones -->
                <q-separator v-if="notificationList.length" />
                <q-card-section
                  v-if="notificationList.length"
                  class="q-pa-sm text-center"
                >
                  <router-link :to="`${url}advancedui/notifications`">
                    <q-btn
                      label="View All"
                      color="primary"
                      class="full-width"
                    />
                  </router-link>
                </q-card-section>
              </q-card>
            </q-menu>
          </div>
          <!-- End::header-element (Notificaciones) -->

          <!-- Start::header-element (Perfil) -->
          <div class="header-element">
            <a
              href="javascript:void(0);"
              class="header-link sizeAltura dropdown-toggle"
              id="mainHeaderProfile"
              aria-expanded="false"
              ref="profileMenuActivator"
              @click.stop="toggleProfileMenu"
            >
              <div class="d-flex align-items-center">
                <div class="header-link-icon q-mt-xs">
                  <img
                    src="../../assets/icons/Imagen2.png"
                    alt="img"
                    width="50"
                    height="50"
                    class="rounded-circle"
                  />
                </div>
                <div class="d-none">
                  <p class="fw-semibold mb-0">Angelica</p>
                  <span class="op-7 fw-normal d-block fs-11">Web Designer</span>
                </div>
              </div>
            </a>

            <q-menu
              v-model="menuVisible"
              anchor="bottom right"
              self="top right"
              transition-show="fadeIn-down"
              transition-hide="fadeOut-up"
              no-arrow
              content-class="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end fixed-width-menu"
            >
              <ul
                aria-labelledby="mainHeaderProfile"
                class="m-0 p-0 border-0 bg-transparent"
              >
                <li>
                  <div class="header-navheading border-bottom">
                    <h6 class="main-notification-title">{{ displayName }}</h6>
                    <p class="main-notification-text mb-0">{{ role }}</p>
                  </div>
                </li>
                <li>
                  <router-link
                    class="dropdown-item d-flex border-bottom"
                    :to="`${url}apps/mail/mailinbox`"
                  >
                    <i class="fe fe-inbox fs-16 align-middle me-2"></i>Inbox
                    <span class="badge bg-success ms-auto">25</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item d-flex border-bottom"
                    :to="`${url}configuraciones`"
                  >
                    <i class="fe fe-settings fs-16 align-middle me-2"></i>
                    Settings
                  </router-link>
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    class="dropdown-item d-flex"
                    @click="logout"
                  >
                    <i class="fe fe-power fs-16 align-middle me-2"></i>
                    Log Out
                  </a>
                </li>
              </ul>
            </q-menu>
          </div>
          <!-- End::header-element -->
        </div>
        <!-- End::header-content-right -->
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
/**
 * Imports
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  QLayout,
  QHeader,
  QMenu,
  QPageContainer,
  Notify,
  QBtn,
  QBadge,
  QCard,
  QCardSection,
  QSeparator,
  QList,
  QItem,
  QItemSection,
  QAvatar,
  QItemLabel,
} from "quasar";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// Tus stores
import { useAuthStore } from "../../stores/auth";
import { useOrganizacionStore } from "../../stores/organizacionStore";
import { useCrearUsuariosStore } from "../../stores/crearUsuarios";
import { useAppointmentsStore } from "../../stores/AppointmentsStore"; // Store de citas

// Variables reactivas
const isFullScreen = ref(false);
const menuVisible = ref(false);
const notificationMenu = ref(false); // Estado del menú de notificaciones

// Base URL
const url = import.meta.env.BASE_URL;

// Instancias de store
const authStore = useAuthStore();
const organizacionStore = useOrganizacionStore();
const crearUsuariosStore = useCrearUsuariosStore();
const appointmentsStore = useAppointmentsStore(); // Store de citas

// De las stores, extraemos propiedades reactivas y métodos
const { organizaciones } = storeToRefs(organizacionStore);
const { users } = storeToRefs(crearUsuariosStore);
const { user, tenant_id, role, isAuthenticated } = storeToRefs(authStore);

// De AppointmentsStore: extraemos el array de citas y el método fetchAutoAppointments
const { appointments, loading, error, pendingAppointmentsCount } =
  storeToRefs(appointmentsStore);
const { fetchAutoAppointments, deleteAppointment } = appointmentsStore; // métodos

// Router
const router = useRouter();

// Emitir evento "toggle-drawer" al padre si es necesario
const emit = defineEmits(["toggle-drawer"]);

/**
 * currentUser: buscar el usuario logueado en users
 */
const currentUser = computed(() => {
  if (!user.value?.id) return null;
  return users.value.find((u) => u.id === user.value.id) || null;
});

/**
 * displayName: mostrar nombreCompleto o email
 */
const displayName = computed(() => {
  if (currentUser.value?.nombreCompleto) {
    return currentUser.value.nombreCompleto;
  }
  return currentUser.value?.email ?? "Usuario sin datos";
});

/**
 * notificationList: Listado de citas "Pendientes" (autoCita o no),
 * o personalizar a tu gusto
 */
const notificationList = computed(() =>
  appointments.value
    .filter((appointment) => appointment.status === "Pendiente")
    .map((appointment) => ({
      id: appointment.id,
      title: `Cita pendiente: ${appointment.description}`,
      time: new Date(appointment.created_at).toLocaleString(),
      icon: "/path/to/icon.png", // Ajusta el ícono o usa un set de íconos
    }))
);

/** toggle sidebar */
function handleToggleMenu() {
  ToggleMenu();
  emit("toggle-drawer");
}

/** Lógica para togglear data-toggled */
function ToggleMenu() {
  let html = document.querySelector("html");
  if (window.innerWidth <= 992) {
    let dataToggled = html.getAttribute("data-toggled");
    if (dataToggled == "open") {
      html.setAttribute("data-toggled", "close");
    } else {
      html.setAttribute("data-toggled", "open");
    }
  } else {
    let menuNavLayoutType = html.getAttribute("data-nav-style");
    let verticalStyleType = html.getAttribute("data-vertical-style");
    if (menuNavLayoutType) {
      let dataToggled = html.getAttribute("data-toggled");
      if (dataToggled) {
        html.removeAttribute("data-toggled");
      } else {
        html.setAttribute("data-toggled", menuNavLayoutType + "-closed");
      }
    } else if (verticalStyleType) {
      let dataToggled = html.getAttribute("data-toggled");
      if (verticalStyleType == "doublemenu") {
        if (
          html.getAttribute("data-toggled") === "double-menu-open" &&
          document.querySelector(".double-menu-active")
        ) {
          html.setAttribute("data-toggled", "double-menu-close");
        } else {
          if (document.querySelector(".double-menu-active")) {
            html.setAttribute("data-toggled", "double-menu-open");
          }
        }
      } else if (dataToggled) {
        html.removeAttribute("data-toggled");
      } else {
        switch (verticalStyleType) {
          case "closed":
            html.setAttribute("data-toggled", "close-menu-close");
            break;
          case "icontext":
            html.setAttribute("data-toggled", "icon-text-close");
            break;
          case "overlay":
            html.setAttribute("data-toggled", "icon-overlay-close");
            break;
          case "detached":
            html.setAttribute("data-toggled", "detached-close");
            break;
        }
      }
    }
  }
}

/** togglear fullscreen */
function toggleFullScreen() {
  const element = document.documentElement;
  if (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }
}

/** callback que actualiza isFullScreen */
function fullscreenchanged() {
  if (document.fullscreenElement) {
    isFullScreen.value = true;
  } else {
    isFullScreen.value = false;
  }
}

/** Manejador de scroll */
function handleScroll() {
  if (window.scrollY > 30) {
    let Scolls = document.querySelectorAll(".sticky");
    Scolls.forEach((e) => {
      e.classList.add("sticky-pin");
    });
  } else {
    let Scolls = document.querySelectorAll(".sticky");
    Scolls.forEach((e) => {
      e.classList.remove("sticky-pin");
    });
  }
}

/** togglear menú del perfil */
function toggleProfileMenu() {
  menuVisible.value = !menuVisible.value;
}

/** toggle menu de notificaciones */
function toggleNotificationMenu() {
  notificationMenu.value = !notificationMenu.value;
}

/** Logout */
async function logout() {
  try {
    await authStore.signOut();
    Notify.create({
      message: "Sesión cerrada exitosamente",
      color: "positive",
      position: "top-right",
    });
    router.push({ name: "login" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    Notify.create({
      message: "Error al cerrar sesión",
      color: "negative",
      position: "top-right",
    });
  }
}

/** Eliminar la 'notificación' => en realidad, borrar la cita Pendiente */
function removeNotification(notification) {
  deleteAppointment(notification.id)
    .then(() => {
      Notify.create({
        message: "Notificación eliminada",
        color: "info",
        position: "top-right",
      });
    })
    .catch((err) => {
      Notify.create({
        message: "Error al eliminar la notificación",
        color: "negative",
        position: "top-right",
      });
      console.error("Error al eliminar la notificación:", err);
    });
}

/** Ir a la página de notificaciones */
function goToNotification(item) {
  router.push({ path: `${url}advancedui/notifications` });
  // O marcar la notificación como leída
}

/** onMounted: cargar data y listeners */
onMounted(async () => {
  await organizacionStore.cargarOrganizaciones();
  await crearUsuariosStore.cargarUsuarios();
  // Cargar citas auto-agendadas (si en tu store fetchAutoAppointments hace eso)
  await appointmentsStore.fetchAutoAppointments();
  console.log("Organizaciones: ", organizaciones.value);
  console.log("Users: ", users.value);
  console.log("Appointments: ", appointments.value);
});

onMounted(() => {
  document.addEventListener("fullscreenchange", fullscreenchanged);
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // iniciar
});

/** onUnmounted: limpiar listeners */
onUnmounted(() => {
  document.removeEventListener("fullscreenchange", fullscreenchanged);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.sb {
  position: relative;
  top: 10px;
}
.sizeAltura {
  height: auto;
}
/* Fijar un ancho mínimo para el menú desplegable */
.fixed-width-menu {
  min-width: 220px;
}
.bajarIconoNotificaciones {
  position: relative;
  top: 5px;
  left: 5px;
}
.bajarIconoFullScreen {
  position: relative;
  top: 8px;
  left: -10px;
}
/* Estilos para la animación de pulso */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
/* Ajustes adicionales para el menú de notificaciones */
.main-header-dropdown {
  width: 300px;
}
</style>
