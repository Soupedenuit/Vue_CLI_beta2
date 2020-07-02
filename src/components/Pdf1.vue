<template>

  <div id="pdf1" class="container">

    <!-- object element is deprecated -->
    <!-- <object type="pdf/html" data="../assets/NAC_Reopening_phases_v1.pdf" height="600" width="800">
    </object> -->

    <!-- embed element is still valid but not working here -->
    <!-- <embed type="application/pdf" src="../assets/NAC_Reopening_phases_v1.pdf" height="600" width="800"> -->

    <iframe src="../assets/NAC_Reopening_phases_v1.pdf" frameborder="1" width="500" height="400">
    </iframe>
    <!-- <iframe src="file:///C:/Users/Tony/Documents/Atom%20Projects/Vue_CLI/beta2/beta2/src/assets/NAC_Reopening_phases_v1.pdf" frameborder="1" width="500" height="400">
    </iframe> -->

  </div>

</template>


<script>

  export default {
    name: 'Pdf1'
  }

</script>


<style scoped>

  .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    border: 1px solid grey;
  }


</style>