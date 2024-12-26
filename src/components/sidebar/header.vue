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
                <!-- <img
                  src="/images/brand-logos/desktop-logo.png"
                  alt="logo"
                  class="desktop-logo"
                />
                <img
                  src="/images/brand-logos/toggle-logo.png"
                  alt="logo"
                  class="toggle-logo"
                />
                <img
                  src="/images/brand-logos/desktop-dark.png"
                  alt="logo"
                  class="desktop-dark"
                />
                <img
                  src="/images/brand-logos/toggle-dark.png"
                  alt="logo"
                  class="toggle-dark"
                />
                <img
                  src="/images/brand-logos/desktop-white.png"
                  alt="logo"
                  class="desktop-white"
                />
                <img
                  src="/images/brand-logos/toggle-white.png"
                  alt="logo"
                  class="toggle-white"
                /> -->
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
              ><span></span
            ></a>
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
              @click="toggleFullScreen()"
              href="javascript:void(0);"
              class="header-link"
            >
              <i
                v-if="!isFullScreen"
                class="fe fe-maximize full-screen-open header-link-icon"
              ></i>
              <i
                v-if="isFullScreen"
                class="fe fe-minimize full-screen-close header-link-icon"
              ></i>
            </a>
          </div>
          <!-- End::header-element -->

          <!-- Start::header-element -->
          <div class="header-element">
            <a
              href="javascript:void(0);"
              class="header-link dropdown-toggle"
              id="mainHeaderProfile"
              aria-expanded="false"
              ref="profileMenuActivator"
              @click="toggleProfileMenu"
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
                  <span class="op-7 fw-normal d-block fs-11"
                    >Web Designerrr</span
                  >
                </div>
              </div>
            </a>

            <!-- Aquí usamos QMenu para hacer el menú desplegable -->
            <q-menu
              v-model="menuVisible"
              anchor="bottom right"
              self="top right"
              :transition-show="'fadeIn-down'"
              :transition-hide="'fadeOut-up'"
              cover
              no-arrow
              content-class="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
            >
              <ul
                aria-labelledby="mainHeaderProfile"
                class="m-0 p-0 border-0 bg-transparent"
              >
                <li>
                  <div class="header-navheading border-bottom">
                    <h6 class="main-notification-title">Sonia Taylor</h6>
                    <p class="main-notification-text mb-0">Web Designer</p>
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
                    <i class="fe fe-settings fs-16 align-middle me-2"></i
                    >Settings
                  </router-link>
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    class="dropdown-item d-flex"
                    @click="logout"
                  >
                    <i class="fe fe-power fs-16 align-middle me-2"></i>Log Out
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

<script>
import { QLayout, QHeader, QMenu, QPageContainer } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { Notify } from "quasar";
export default {
  name: "Header",
  emits: ["toggle-drawer"], // Definimos el evento que este componente puede emitir
  components: {
    QLayout,
    QHeader,
    QPageContainer,
    QMenu,
  },
  data() {
    return {
      isFullScreen: false,
      value: null,
      options: ["Firefox", "Chrome", "Safari", "Opera", "Internet Explorer"],
      url: import.meta.env.BASE_URL,
    };
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleToggleMenu() {
      this.ToggleMenu();
      this.$emit("toggle-drawer");
    },
    ToggleMenu() {
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
    },
    toggleFullScreen() {
      const element = document.documentElement; // Full-screen target element
      if (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
      ) {
        // If in full-screen mode, exit it
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        // If not in full-screen mode, enter it
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
    },
    fullscreenchanged() {
      if (document.fullscreenElement) {
        this.isFullScreen = true;
      } else {
        this.isFullScreen = false;
      }
    },
    handleScroll() {
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
    },
    headerSearch() {
      let searchBtn = document.querySelector(".header-search");
      searchBtn.classList.toggle("show");
    },
    colorthemeFn(mode) {
      // Función para cambiar el tema, mantén tu lógica existente
      // ...
    },
    async logout() {
      try {
        // Accede a la tienda de autenticación
        const authStore = useAuthStore();
        await authStore.signOut();

        // Muestra una notificación de éxito
        Notify.create({
          message: "Sesión cerrada exitosamente",
          color: "positive",
          position: "top-right",
        });

        // Redirige al usuario a la página de inicio de sesión
        this.$router.push({ name: "login" });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);

        // Muestra una notificación de error
        Notify.create({
          message: "Error al cerrar sesión",
          color: "negative",
          position: "top-right",
        });
      }
    },
  },

  mounted() {
    document.addEventListener("fullscreenchange", this.fullscreenchanged);
  },
};
</script>
<style scoped>
.sb {
  position: relative;
  top: 10px;
}
</style>
