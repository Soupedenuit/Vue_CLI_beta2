<template>
  <!-- won't mount otherwise -->
  <!-- placed in VuetifyLogIn.vue -->
  <div id="empty"></div> 
</template>


<script>

  import {auth, database} from '../firebase_config.js'
  import eventHub from '@/eventHub.js'

  export default {
    name: 'EmptyComponent', // placed in VuetifyLogIn.vue
    data: function() {
      return {
        databaseState: {
          blog_entry_state: null,
          entryNum_state: null,
          ref_state: null,
          snapshot_state: null,
          uid_state: null
        }
      }
    },
    computed: {
    },
    methods: {
      // called in VuetifyLogin.vue:
      readDatabase: function({uid, uidChange}) {
        if (uidChange === 'login') {
          this.set_ref_state(uid)
          this.set_uid_state(uid) 
        }
        if (uidChange === 'logout') {
          database.ref(`${uid}`).off('value')
          this.set_uid_state(null)
          this.set_entryNum_state(null)
          this.databaseState.ref_state = null;
          this.databaseState.snapshot_state = null;
          this.databaseState.blog_entry_state = null;
        }    
      },
      // called in getSnapshot & writeToDatabase:
      // called in readDatabase: (if 'logout')
      set_entryNum_state: function(num) {
        this.databaseState.entryNum_state = num;
      },
      // called in readDatabase:
      set_uid_state: function(uid) {
        this.databaseState.uid_state = uid;
      },
      // called in readDatabase(if 'login'): 
      set_ref_state: function(uid) {
        let ref = database.ref(`${uid}`);
        this.databaseState.ref_state = ref;
        ref.on('value', this.getSnapshot, this.errorSnapshot)
        // .catch(function(error) {
        //   console.log(error.message)
        //   alert(error.message)
        // })
      },
      createUserData: function() {
        let ref = this.databaseState.ref_state;
        let date = new Date().toString();
        let user = {
          name: auth.currentUser.displayName,
          email: auth.currentUser.email
        };
        let initialEntry = '<p>no entries yet</p>';
        ref.child('entryNumber').set(1)
        ref.child('blogs/blog1/timestamp').set(date)
        ref.child('blogs/blog1/user').set(user)
        ref.child('blogs/blog1/entry').set(initialEntry)
        this.set_entryNum_state(1)
        this.databaseState.blog_entry_state = initialEntry;
        this.$store.dispatch('populateBlogArticle', initialEntry)
      },
      // called in set_ref_state
      getSnapshot: function(dataSnapshot) {
        if ( dataSnapshot.exists() ) {
          this.databaseState.snapshot_state = dataSnapshot; 
          if (dataSnapshot.child('entryNumber').exists()) {
            let entryNum = dataSnapshot.child('entryNumber').val(); 
            this.set_entryNum_state(entryNum)
            let blogEntry = dataSnapshot.child(`blogs/blog${entryNum}/entry`).val();
            this.databaseState.blog_entry_state = blogEntry;
            this.$store.dispatch('populateBlogArticle', blogEntry)
            let timestamp = dataSnapshot.child(`blogs/blog${entryNum}/timestamp`).val() //.substring(0, 24);
            let timestampText = timestamp.substring(0, 24);
            let payload1 = {latest: true, timestamp: timestampText};
            this.$store.dispatch('populateArticleUpdateStatus', payload1)
          }
        } else {
          this.createUserData()
        }
      },
      // called in set_ref_state
      errorSnapshot: function(error) {
        console.log('Error! => ', error)
      },
      // called in Blog_view.vue via $emit:
      writeToDatabase: function(blogEntry) {
        if (this.databaseState.ref_state) {
          let ref = this.databaseState.ref_state;
          let entryNum = this.databaseState.entryNum_state;
          let user = {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email
          }
          let next_entryNum = entryNum + 1;
          let date = new Date().toString();
          ref.child('entryNumber')
          .set(next_entryNum)
          ref.child(`blogs/blog${next_entryNum}/timestamp`)
          .set(date)
          ref.child(`blogs/blog${next_entryNum}/entry`)
          .set(blogEntry)
          ref.child(`blogs/blog${next_entryNum}/user`)
          .set(user)
          this.set_entryNum_state(next_entryNum)
          // publish to public:
          ref.parent.child('public/published/blog').set(blogEntry)
          ref.parent.child('public/published/timestamp').set(date)
          ref.parent.child('public/published/user').set(user)
        } else window.alert('You must be logged in to submit your blog entry')
      },
      populateDefaultText: function(blogEntry) {
        this.$store.dispatch('populateDefaultText', blogEntry)
      }
    },
    created() {
      eventHub.$on('readDatabase', this.readDatabase)
      eventHub.$on('writeToDatabase', this.writeToDatabase)
    },
    beforeDestroy() {
      eventHub.$off('readDatabase')
      eventHub.$off('writeToDatabase')
    },
    mounted() {
      bluesky.databaseState = this.databaseState;
    }
  }


</script>