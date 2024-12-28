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
        <div class="header-content-right">
          <!-- Start::header-element -->
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

          <!-- Start::header-element -->
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
                <!-- En caso de querer mostrar algo adicional a la derecha del avatar,
                     lo puedes poner aquí, pero se mantiene oculto con d-none por ahora -->
                <div class="d-none">
                  <p class="fw-semibold mb-0">Angelica</p>
                  <span class="op-7 fw-normal d-block fs-11"
                    >Web Designerrr</span
                  >
                </div>
              </div>
            </a>

            <!-- Menú desplegable -->
            <q-menu
              v-model="menuVisible"
              anchor="bottom right"
              self="top right"
              transition-show="fadeIn-down"
              transition-hide="fadeOut-up"
              no-arrow
              content-class="main-header-dropdown dropdown-menu pt-0
              overflow-hidden header-profile-dropdown dropdown-menu-end
              fixed-width-menu"
            >
              <ul
                aria-labelledby="mainHeaderProfile"
                class="m-0 p-0 border-0 bg-transparent"
              >
                <li>
                  <div class="header-navheading border-bottom">
                    <!-- Aquí mostramos el nombre dinámico según el rol -->
                    <h6 class="main-notification-title">
                      {{ displayName }}
                    </h6>
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
import { QLayout, QHeader, QMenu, QPageContainer, Notify } from "quasar";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// Tus stores
import { useAuthStore } from "../../stores/auth";
import { useOrganizacionStore } from "../../stores/organizacionStore";
import { useCrearUsuariosStore } from "../../stores/crearUsuarios";

// Variables reactivas
const isFullScreen = ref(false);
const menuVisible = ref(false);

// Base URL
const url = import.meta.env.BASE_URL;

// Instancias de store
const authStore = useAuthStore();
const organizacionStore = useOrganizacionStore();
const crearUsuariosStore = useCrearUsuariosStore();

// De las stores, extraemos propiedades reactivas
const { organizaciones } = storeToRefs(organizacionStore);
const { users } = storeToRefs(crearUsuariosStore);
const { user, tenant_id, role, isAuthenticated } = storeToRefs(authStore);

// Router
const router = useRouter();

// Emitir evento "toggle-drawer" al padre si es necesario
const emit = defineEmits(["toggle-drawer"]);

/**
 * Computed: Obtenemos el "currentUser" según el ID de `user.value`,
 * para luego poder acceder a alias, email, etc.
 */
const currentUser = computed(() => {
  if (!user.value?.id) return null;
  return users.value.find((u) => u.id === user.value.id) || null;
});

/**
 * Computed: displayName
 * - Si role es 'admin': mostrar organizaciones[0]?.nombre
 * - Si role es 'medico': mostrar alias de currentUser. Si no existe alias, mostrar email
 * - Otros roles: igual que 'medico', alias o email
 */
const displayName = computed(() => {
  const r = role.value; // rol actual (admin, medico, etc.)
  if (!r) {
    // si no hay rol, fallback
    return user.value?.email ?? "Usuario";
  }

  if (r === "admin") {
    // Mostrar nombre de la organización
    return organizaciones.value[0]?.nombre ?? "Org. sin nombre";
  } else if (r === "medico") {
    // Mostrar alias si existe, de lo contrario email
    if (!currentUser.value) {
      // si no tenemos usuario en la lista, fallback
      return user.value?.email ?? "Medico sin datos";
    }
    return currentUser.value.alias
      ? currentUser.value.alias
      : currentUser.value.email;
  } else {
    // otros roles => alias si existe, sino email
    if (!currentUser.value) {
      return user.value?.email ?? "Usuario";
    }
    return currentUser.value.alias
      ? currentUser.value.alias
      : currentUser.value.email;
  }
});

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
    // Salir de fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    // Entrar a fullscreen
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

/** onMounted: cargar data y listeners */
onMounted(async () => {
  await organizacionStore.cargarOrganizaciones();
  await crearUsuariosStore.cargarUsuarios();
  console.log("Organizaciones: ", organizaciones.value);
  console.log("Users: ", users.value);
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
  min-width: 220px; /* Ajusta a tu preferencia */
}
</style>
