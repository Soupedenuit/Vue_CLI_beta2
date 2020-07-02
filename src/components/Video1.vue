<template>

  <div id="video1">

    <div class="container">

      <!-- <video src="../assets/Vuex_Modules.mp4" type="video/mp4" controls duration> -->
      <video src="https://res.cloudinary.com/bluesky73/video/upload/v1588620734/IMG_5072_kx8en9.mp4" type="video/mp4" controls duration>
      <!-- cloudinary demo: -->
      <!-- <video src="https://res.cloudinary.com/demo/video/upload/du_30,q_70:qmax_20/Liverpool_vs_Roma_full.mp4" type="video/mp4" controls duration> -->
      Sorry, your browser doesn't support embedded videos.
      </video>

    </div>

  </div>

</template>


<script>

  export default {
    name: 'Video1'
  }

</script>


<style scoped>

  .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
    /* height: 90%; */
    /* margin-left: 50%;
    transform: translateX(-50%); */
    border: 1px solid grey;
  }

  video {
    width: 70%;
    /* height: 500px; */
  }

</style>