<template>
  <div>
    <!-- delay for getting chess data - cannot both be at the same time:  -->
    <Chess delay="200" user="knightofthedead" />
    <!-- <Chess delay="800" user="sstoehr" /> -->
  </div>
</template>


<script>

  import Chess from '@/components/Chess/Chess.vue';

  export default {
    components: {
      Chess
    }
  }

</script>


<style scoped>

  body {
    background-color: #312e2b;
  }


</style>