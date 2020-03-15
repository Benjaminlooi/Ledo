<template>
  <v-app id="ledo">
    <router-view />
  </v-app>
</template>

<script>
export default {};
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
