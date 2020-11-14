<template>
  <v-app id="ledo">
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script>
const defaultLayout = 'default'

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || defaultLayout) + '-layout'
    }
  }
}
</script>

<style lang="scss">
.priority-zero {
  i.v-icon {
    color: #717171 !important;
  }
}
.priority-one {
  i.v-icon {
    color: #2191ea !important;
  }
}
.priority-two {
  i.v-icon {
    color: #f0595a !important;
  }
}
.subtask-list {
  &:hover {
    background-color: #ededed;
    cursor: pointer;
  }
}
</style>
