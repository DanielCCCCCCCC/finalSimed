<template>
  <a
    href="javascript:;"
    class="side-menu__item"
    :class="`${menuData?.selected ? 'active' : ''}`"
    @mouseover="HoverToggleInnerMenuFn($event, menuData)"
    @click="toggleSubmenu($event, menuData, undefined, level)"
  >
    <span class="shape1" v-if="level == 1"></span>
    <span v-if="level == 1" class="shape2"></span>

    <i v-if="menuData.icon" :class="`${menuData.icon} side-menu__icon`"></i>
    <span class="side-menu__label q-ml-md" v-if="level == 1">
      {{ menuData.title }}
      <span v-if="menuData.badge" :class="`badge ${menuData?.badgeColor} ms-1`">
        {{ menuData.badge }}
      </span>
    </span>
    <span v-if="level > 1">
      {{ menuData.title }}
      <span v-if="menuData.badge" :class="`badge ${menuData?.badgeColor} ms-1`">
        {{ menuData.badge }}
      </span>
    </span>
    <i class="fe fe-chevron-right side-menu__angle"></i>
  </a>
  <ul
    class="slide-menu"
    :class="`${
      menuData.active && level == 1 ? 'double-menu-active' : ''
    } child${level} ${menuData?.dirchange ? 'force-left' : ''}`"
    :style="menuData.active ? 'display: block;' : ''"
  >
    <li v-if="level <= 1" class="slide side-menu__label1">
      <a href="javascript:void(0)">{{ menuData.title }}</a>
    </li>

    <li
      v-for="(firstLevelMenuItem, subIndex) in menuData.children"
      :key="subIndex"
      :class="`
            ${firstLevelMenuItem.headTitle ? 'slide__category' : ''} ${
        firstLevelMenuItem?.type == 'empty' ? 'slide' : ''
      } ${firstLevelMenuItem?.type == 'link' ? 'slide' : ''} ${
        firstLevelMenuItem?.type == 'sub' ? 'slide has-sub' : ''
      } ${firstLevelMenuItem?.selected ? 'active' : ''}`"
    >
      <template v-if="firstLevelMenuItem?.type === 'link'">
        <router-link
          :to="firstLevelMenuItem.path"
          class="side-menu__item"
          :class="`${firstLevelMenuItem?.selected ? 'active' : ''}`"
        >
          {{ firstLevelMenuItem.title }}
          <span
            v-if="firstLevelMenuItem.badge"
            :class="`badge ${firstLevelMenuItem.badgeColor} ms-1`"
          >
            {{ firstLevelMenuItem.badge }}
          </span>
        </router-link>
      </template>
      <template v-if="firstLevelMenuItem?.type === 'empty'">
        <a href="javascript:;" class="side-menu__item">
          {{ firstLevelMenuItem.title }}
          <span
            v-if="firstLevelMenuItem.badge"
            :class="`badge ${firstLevelMenuItem.badgeColor} ms-1`"
          >
            {{ firstLevelMenuItem.badge }}
          </span>
        </a>
      </template>
      <template v-if="firstLevelMenuItem?.type === 'sub'">
        <RecursiveMenu
          :menuData="firstLevelMenuItem"
          :toggleSubmenu="toggleSubmenu"
          :HoverToggleInnerMenuFn="HoverToggleInnerMenuFn"
          :level="level + 1"
        />
      </template>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    menuData: {
      type: Object,
      required: true,
    },
    toggleSubmenu: {
      type: Function,
      required: true,
    },
    HoverToggleInnerMenuFn: {
      type: Function,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  created() {
    // Tu lógica existente
  },
};
</script>

<style scoped>
/* Estilo base para todos los submenús */
.slide-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Margen izquierdo para diferentes niveles */
.child1 {
  margin-left: 40px; /* Primer nivel de submenú */
}

.child2 {
  margin-left: 50px; /* Segundo nivel de submenú */
}

.child3 {
  margin-left: 60px; /* Tercer nivel de submenú */
}

/* Añade más niveles según sea necesario */
.child4 {
  margin-left: 80px;
}

.child5 {
  margin-left: 100px;
}

/* Opcional: Transición suave al mostrar el submenú */
.slide-menu {
  transition: margin-left 0.3s ease;
}
</style>
