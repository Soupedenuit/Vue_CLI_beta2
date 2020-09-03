<template>
  <main>
    <h1>Fetching From A Text File</h1>
    <article v-html=content ></article>
    <time v-html=updatedTime ></time>
  </main>
</template>


<script>
import {populateTarget, lastUpdated} from '@/fetch_from_text.js';

export default {
  data: ()=> ({
    content: '',
    updatedTime: ''
  }),
  methods: {
    populateContent: function() {
      let this1 = this;
      populateTarget('json')
      .then(function(result) {
        this1.content = result;
        this1.updatedTime = lastUpdated();  //non-promise function
      })
      .catch((error) => {
        console.log(error);
        this1.content = error;
        this1.updatedTime = lastUpdated();  //non-promise function
    })
    }
  },
  mounted() {
    this.populateContent()
    setInterval(()=> this.populateContent(), 1000*60*5)
  }
}

</script>


<style scoped>

main {
  margin-top: 50px;
  width: 100%;
  background-color: var(--backg4);
  color: var(--color2);
  font-family: 'Roboto', 'Open Sans', 'Poiret One';
}

h1, time {
  text-align: center;
  color: var(--color5);
}

time {
  display: block; /* time cannot align without display:block */
  position: relative;
  /* left: 50%;
  transform: translateX(-50%); */
}

article {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  max-width: 550px;
  padding: 0 5px;
  font-size: larger;
}

p {
  /* text-justify: inter-word; */
  /* text-justify: inter-character; */
  text-justify: auto;
  text-align: justify;
}

/* this won't work as .v-application code located in index.css takes precedence */
code {
  color: var(--color6);
  font-size: 1.1em;
}


</style>