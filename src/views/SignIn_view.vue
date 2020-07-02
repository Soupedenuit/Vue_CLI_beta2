<template>
  <SignIn ref="yo" title="Sign in"/>
</template>

<script>
  import SignIn from '@/components/SignIn/SignIn';

  export default {
    components: {
      SignIn
    }
  }
  console.log('SignIn module lazy-loaded via router')
</script>