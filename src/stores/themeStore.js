// src/stores/themeStore.js

import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    // Set HTML attributes
    html: document.getElementsByTagName("html")[0],
    colortheme: "light", // light, dark
    direction: "ltr", // ltr, rtl
    navigationStyles: "vertical", // vertical, horizontal
    menuStyles: "", // menu-click, menu-hover, icon-click, icon-hover
    layoutStyles: "default-menu", // double-menu, detached, icon-overlay, icontext-menu, closed-menu, default-menu
    pageStyles: "regular", // regular, classic, modern
    widthStyles: "fullwidth", // fullwidth, boxed
    menuPosition: "fixed", // fixed, scrollable
    headerPosition: "fixed", // fixed, scrollable
    menuColor: "dark", // light, dark, color, gradient, transparent
    headerColor: "light", // light, dark, color, gradient, transparent
    themePrimary: "", // '58, 88, 146', '92, 144, 163', '161, 90, 223', '78, 172, 76', '223, 90, 90'
    themeBackground: "",
    backgroundImage: "", // bgimg1, bgimg2, bgimg3, bgimg4, bgimg5
  }),

  getters: {},

  actions: {
    /**
     * Cambia el tema de color (light/dark)
     * @param {string} theme - "light" o "dark"
     */
    colorThemeFn(theme) {
      const html = this.html;
      if (theme === "light") {
        this.colortheme = "light";
        this.menuColorFn(this.menuColor);
        this.headerColorFn(this.headerColor);
        this.themePrimary = "";
        this.themeBackground = "";

        if (html) {
          html.setAttribute("data-theme-mode", "light");
          html.setAttribute("data-header-styles", "light");
          html.setAttribute("data-menu-styles", "light"); // Comentado: 'dark'
          html.style.removeProperty("--body-bg-rgb");
          html.style.removeProperty("--body-bg-rgb2");
          html.style.removeProperty("--light-rgb");
          html.style.removeProperty("--sidemenu-active-bgcolor");
          html.style.removeProperty("--form-control-bg");
          html.style.removeProperty("--input-border");
        }
      }

      if (theme === "dark") {
        this.colortheme = "dark";
        this.menuColorFn(this.menuColor);
        this.headerColorFn(this.headerColor);
        this.themePrimary = "";
        this.themeBackground = "";

        if (
          !localStorage.getItem("spruhaMenu") ||
          localStorage.getItem("spruhaMenu") === "dark"
        ) {
          this.menuColor = "dark";
        }

        if (
          !localStorage.getItem("spruhaHeader") ||
          localStorage.getItem("spruhaHeader") === "dark"
        ) {
          this.headerColor = "dark";
        }

        if (html) {
          html.setAttribute("data-theme-mode", "dark");
          html.setAttribute("data-header-styles", "dark");
          html.setAttribute("data-menu-styles", "dark");
          html.style.removeProperty("--body-bg-rgb");
          html.style.removeProperty("--body-bg-rgb2");
          html.style.removeProperty("--light-rgb");
          html.style.removeProperty("--sidemenu-active-bgcolor");
          html.style.removeProperty("--form-control-bg");
          html.style.removeProperty("--input-border");
        }
      }
    },

    /**
     * Cambia el color del menú
     * @param {string} color - Nombre del color
     */
    menuColorFn(color) {
      const html = this.html;
      if (color && html) {
        this.menuColor = color;
        html.setAttribute("data-menu-styles", color);
      }
    },

    /**
     * Cambia el color del encabezado
     * @param {string} color - Nombre del color
     */
    headerColorFn(color) {
      const html = this.html;
      if (color && html) {
        this.headerColor = color;
        html.setAttribute("data-header-styles", color);
      }
    },

    /**
     * Cambia los estilos del layout según la opción seleccionada
     * @param {string} menuStyle - Nombre del estilo del menú
     */
    layoutStylesFn(menuStyle) {
      const html = this.html;
      const qDrawer = document.querySelector(".q-drawer"); // Cambiar selector
      const mainMenu = document.querySelector(".main-menu"); // Verificar si existe
      const mainContentDiv = document.querySelector(".main-content");
      const appSidebar = document.querySelector(".app-sidebar");

      // Eliminar event listeners previos si existen
      if (qDrawer) {
        if (this.iconoverLayoutHoverFnBound) {
          qDrawer.removeEventListener(
            "mouseenter",
            this.iconoverLayoutHoverFnBound
          );
          qDrawer.removeEventListener(
            "mouseleave",
            this.iconoverLayoutHoverFnBound
          );
        }
        if (this.icontextOpenFnBound) {
          qDrawer.removeEventListener("click", this.icontextOpenFnBound);
        }
      }
      if (mainContentDiv && this.icontextCloseFnBound) {
        mainContentDiv.removeEventListener("click", this.icontextCloseFnBound);
      }

      // Resetear estilos y atributos
      localStorage.removeItem("spruhamenuStyles");
      if (html) {
        html.removeAttribute("data-nav-style");
      }
      if (mainMenu) {
        mainMenu.style.marginInlineStart = "0";
      }

      switch (menuStyle) {
        case "default-menu":
          this.layoutStyles = menuStyle;
          if (html) {
            html.setAttribute("data-vertical-style", "overlay");
            html.removeAttribute("data-toggled");
            html.setAttribute("data-nav-layout", "vertical");
          }
          if (mainMenu) {
            document.querySelectorAll(".main-menu>li.open").forEach((ele) => {
              if (ele && !ele.classList.contains("active")) {
                ele.classList.remove("open");
                const ul = ele.querySelector("ul");
                if (ul) ul.style.display = "none";
              }
            });
          }

          if (qDrawer) {
            this.iconoverLayoutHoverFnBound =
              this.iconoverLayoutHoverFn.bind(this);
            qDrawer.addEventListener(
              "mouseenter",
              this.iconoverLayoutHoverFnBound
            );
            qDrawer.addEventListener(
              "mouseleave",
              this.iconoverLayoutHoverFnBound
            );
          }
          break;

        case "closed-menu":
          this.layoutStyles = menuStyle;
          if (html) {
            html.setAttribute("data-nav-layout", "vertical");
            html.setAttribute("data-toggled", "close-menu-close");
            html.setAttribute("data-vertical-style", "closed");
          }
          if (mainMenu) {
            document.querySelectorAll(".main-menu>li.open").forEach((ele) => {
              if (ele && !ele.classList.contains("active")) {
                ele.classList.remove("open");
                const ul = ele.querySelector("ul");
                if (ul) ul.style.display = "none";
              }
            });
          }
          break;

        case "detached":
          this.layoutStyles = menuStyle;
          if (html) {
            html.setAttribute("data-nav-layout", "vertical");
            html.setAttribute("data-toggled", "detached-close");
            html.setAttribute("data-vertical-style", "detached");
          }
          if (appSidebar) {
            this.iconoverLayoutHoverFnBound =
              this.iconoverLayoutHoverFn.bind(this);
            appSidebar.addEventListener(
              "mouseenter",
              this.iconoverLayoutHoverFnBound
            );
            appSidebar.addEventListener(
              "mouseleave",
              this.iconoverLayoutHoverFnBound
            );
          }
          break;

        case "icontext-menu":
          this.layoutStyles = menuStyle;
          if (html) {
            html.setAttribute("data-nav-layout", "vertical");
            html.setAttribute("data-toggled", "icon-text-close");
            html.setAttribute("data-vertical-style", "icontext");
          }
          if (appSidebar) {
            this.icontextOpenFnBound = this.icontextOpenFn.bind(this);
            appSidebar.addEventListener("click", this.icontextOpenFnBound);
          }
          if (mainContentDiv) {
            this.icontextCloseFnBound = this.icontextCloseFn.bind(this);
            mainContentDiv.addEventListener("click", this.icontextCloseFnBound);
          }
          break;

        case "icon-overlay":
          this.layoutStyles = menuStyle;
          if (html) {
            html.setAttribute("data-nav-layout", "vertical");
            html.setAttribute("data-toggled", "icon-overlay-close");
            html.setAttribute("data-vertical-style", "overlay");
          }
          if (mainMenu) {
            document.querySelectorAll(".main-menu>li.open").forEach((ele) => {
              if (ele && !ele.classList.contains("active")) {
                ele.classList.remove("open");
                const ul = ele.querySelector("ul");
                if (ul) ul.style.display = "none";
              }
            });
          }

          if (appSidebar) {
            // Ahora appSidebar está definido
            console.log("appSidebar encontrado, agregando event listeners");
            this.iconoverLayoutHoverFnBound =
              this.iconoverLayoutHoverFn.bind(this);
            appSidebar.addEventListener(
              "mouseenter",
              this.iconoverLayoutHoverFnBound
            );
            appSidebar.addEventListener(
              "mouseleave",
              this.iconoverLayoutHoverFnBound
            );
          } else {
            console.warn(
              "appSidebar no encontrado. Asegúrate de que el elemento tiene la clase 'app-sidebar'."
            );
          }
          break;

        case "double-menu":
          this.layoutStyles = menuStyle;
          if (html) {
            html.setAttribute("data-nav-layout", "vertical");
            html.setAttribute("data-toggled", "double-menu-open");
            html.setAttribute("data-vertical-style", "doublemenu");
          }

          // Seleccionar los elementos del menú
          const menuSlideItem = document.querySelectorAll(
            ".main-menu > li > .side-menu__item"
          );

          // Crear el elemento tooltip
          const tooltip = document.createElement("div");
          tooltip.className = "custome-tooltip";

          // Establecer propiedades CSS del tooltip
          Object.assign(tooltip.style, {
            position: "fixed",
            display: "none",
            padding: "0.5rem",
            fontWeight: "500",
            fontSize: "0.75rem",
            backgroundColor: "rgb(248, 248, 248)",
            color: "rgb(255, 255, 255)",
            marginInlineStart: "45px",
            borderRadius: "0.25rem",
            zIndex: "99",
          });

          // Eliminar listeners previos de doble clic
          const sidemenulink = document.querySelectorAll(
            ".main-menu li > .side-menu__item"
          );
          sidemenulink.forEach((ele) =>
            ele.removeEventListener("click", this.doubleClickFnBound)
          );

          // Agregar listeners para mostrar/ocultar el tooltip y manejar doble clic
          menuSlideItem.forEach((e) => {
            if (e) {
              // Mostrar tooltip al pasar el mouse
              e.addEventListener("mouseenter", () => {
                tooltip.style.display = "block";
                const label = e.querySelector(".side-menu__label");
                const value =
                  label && label.childNodes.length > 0
                    ? label.childNodes[0].nodeValue
                    : "";
                if (value) tooltip.textContent = value;
                if (html.getAttribute("data-vertical-style") === "doublemenu") {
                  e.appendChild(tooltip);
                }
              });

              // Ocultar tooltip al quitar el mouse
              e.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
                const label = e.querySelector(".side-menu__label");
                const value = label ? label.textContent : "";
                if (value) tooltip.textContent = value;
                if (html.getAttribute("data-vertical-style") === "doublemenu") {
                  if (e.contains(tooltip)) {
                    e.removeChild(tooltip);
                  }
                }
              });

              // Manejar doble clic
              this.doubleClickFnBound = this.doubleClickFn.bind(this);
              e.addEventListener("click", this.doubleClickFnBound);
            }
          });

          if (!document.querySelector(".double-menu-active") && html) {
            html.setAttribute("data-toggled", "double-menu-close");
          }
          break;

        default:
          console.warn(`Unknown menuStyle: ${menuStyle}`);
          break;
      }
    },

    /**
     * Maneja el hover en el layout de iconos
     * @param {Event} event - Evento del mouse
     */
    iconoverLayoutHoverFn(event) {
      const html = this.html;
      if (
        html.getAttribute("data-toggled") === "icon-overlay-close" ||
        html.getAttribute("data-toggled") === "detached-close"
      ) {
        if (event.type === "mouseenter") {
          html.setAttribute("data-icon-overlay", "open");
        }
        if (event.type === "mouseleave") {
          html.removeAttribute("data-icon-overlay");
        }
      }
    },

    /**
     * Abre el menú de icono-texto
     */
    icontextOpenFn() {
      const html = this.html;
      if (html.getAttribute("data-toggled") === "icon-text-close") {
        html.setAttribute("data-icon-text", "open");
      }
    },

    /**
     * Cierra el menú de icono-texto
     */
    icontextCloseFn() {
      const html = this.html;
      if (html.getAttribute("data-toggled") === "icon-text-close") {
        html.removeAttribute("data-icon-text");
      }
    },

    /**
     * Maneja el doble clic en el menú doble
     * @param {Event} event - Evento del click
     */
    doubleClickFn(event) {
      const html = this.html;
      const target = event.currentTarget;
      const checkElement = target.nextElementSibling;

      if (checkElement) {
        if (!checkElement.classList.contains("double-menu-active")) {
          // Cerrar otros menús dobles activos
          if (document.querySelector(".slide-menu")) {
            const slidemenu = document.querySelectorAll(".slide-menu");
            slidemenu.forEach((e) => {
              if (e && e.classList.contains("double-menu-active")) {
                e.classList.remove("double-menu-active");
                if (html) {
                  html.setAttribute("data-toggled", "double-menu-close");
                }
              }
            });
          }

          // Activar el menú doble seleccionado
          checkElement.classList.add("double-menu-active");
          if (html) {
            html.setAttribute("data-toggled", "double-menu-open");
          }
        }
      }
    },
  },
});
