<template>
  <main id="blog" class="container t-flex">

    <div class="pos-relative sub-container t-flex">
      <button id="resize-btn" v-on:click="expandTextarea('resize')" tabindex="0">resize to fit</button>
      <button id="reset-btn" v-on:click="expandTextarea('reset')" tabindex="0">reset to scroll</button>
      <form>
        <label title="ctrl-space to retrieve current entry markup, ctrl-enter to submit" for="blog-text" >Enter blog markup:</label>
        <textarea id="blog-text" ref="textArea" name="blog-text" rows="20" cols="50" spellcheck="false" v-model="blogText" 
        v-on:keydown.ctrl.enter="submitBlog($event)" v-on:keydown.ctrl.space="populateTextarea"
        v-on:keydown.exact.enter.prevent="addTags($event, {tag: 'enter', text: '\n', atEnd: false})"
        v-on:keydown.ctrl.p.prevent="addTags($event, {tag: 'p', text: '<p></p>', atEnd: false})"
        v-on:keydown.ctrl.b.prevent="addTags($event, {tag: 'br', text: '<br>', atEnd: false})"
        v-on:keydown.ctrl.g.prevent="toggleTagsList" >
        </textarea>
      </form>

      <aside id="draggable-list" ref="draggable_list" v-show="displayList" draggable="true">
        <ul ref="tags">
          <li v-for="tag of tagsList"
          v-bind:key="tag.tag" 
          ref="tags_list"
          v-on:click="addTags($event, {tag: tag.tag, text: tag.text, atEnd: tag.atEnd})"
          v-on:keydown.enter.prevent="addTags($event, {tag: tag.tag, text: tag.text, atEnd: tag.atEnd})"
          v-on:keydown.ctrl.g.prevent="toggleTagsList"><a tabindex="0">{{tag.text | renameListText(tag)}}</a>
          </li>
        </ul>
        <button id="close-list" tabindex="0" 
        v-on:click="toggleTagsList" >
          <svg id="close-list-btn-svg-used" width="24" height="24" viewBox="0 0 24 24" >
            <use xlink:href="#use1"></use>
          </svg>
        </button>

        <button id="drag-grabber" ref="drag_grabber"
        tabindex="0" >
          <svg id="drag-grabber-btn-svg-used" width="24" height="24" viewBox="0 0 24 24" >
            <use xlink:href="#use2"></use>
          </svg>
        </button>

        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
        v-on:click="toggleTagsList" >
          <defs>
            <g id="use1">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </g>
          </defs>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <defs>
            <g id="use2">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </g>
          </defs>
        </svg>

      </aside>
      
    </div>

    <div class="sub-container t-flex">
      <article>
        <h1>My latest blog entry imported as HTML from Firebase Realtime Database</h1>
        <aside id="update-status" class="size_08" >
          {{articleUpdateStatus1}}<br>
          <span v-bind:class="{colorRed: displayRedStyle}"> {{articleUpdateStatus2}}</span>
        </aside>
        <article v-html=blog_article > 
        </article>
      </article>
    </div>

  </main>

</template>


<script>

  import {mapState} from 'vuex';
  import eventHub from '@/eventHub.js';
  import addElementTags from '@/setCarotPosition.js';
  import {nextTick} from 'vue';
  import createDraggableEvents from '@/dragAndDrop.js';
  import svgIcons from '@/svgIcons.js';

  const mixin = {
  };

  export default {
    // name: 'BlogEntry',
    data: () => ({
      blogText: '',
      displayList: false,
      displayRedStyle: true,
      test: 'hello',
      saved: false,
      tagsList: [
        {tag: 'em', text: '<em></em>',  atEnd: false},
        {tag: 'strong', text: '<strong></strong>', atEnd: false},
        {tag: 'ul', text: '<ul></ul>', atEnd: false},
        {tag: 'li', text: '<li></li>', atEnd: false},
        {tag: 'multi-list', text: '<ul>\n <li></li>\n <li></li>\n <li></li>\n <li></li>\n</ul>', atEnd: false},
        {tag: 'code', text: '<code></code>', atEnd: false},
        {tag: 'h1', text: '<h1></h1>', atEnd: false},
        {tag: 'h2', text: '<h2></h2>', atEnd: false},
        {tag: 'h3', text: '<h3></h3>', atEnd: false},
        {tag: 'h4', text: '<h4></h4>', atEnd: false},
        {tag: 'span', text: '<span></span>', atEnd: false},
        {tag: 'div', text: '<div></div>', atEnd: false},
        {tag: 'p', text: '<p></p>', atEnd: false},
        {tag: 'br', text: '<br>', atEnd: false},
      ]
    }),
    filters: {
      renameListText: function(value, tag) {
        if (value.length > 20) {
          return tag.tag
        } else return value
      }
    },
    computed: {
      nonClosingTags: function() {  //UNUSED
        return this.tagsList.filter((x)=>x.nonClosing == true)
      },
      ...mapState({
        blog_article: 'blog_article', 
        articleUpdateStatus1: 'articleUpdateStatus1',
        articleUpdateStatus2: 'articleUpdateStatus2'
      })
    },
    // mixins: [mixin],
    methods: {
      addTags: function(event, {tag, text, atEnd}) {
        let scrollTop = this.$refs.textArea.scrollTop;
        addElementTags(event, {tag, text, atEnd})
        this.preventTextAreaScroll(scrollTop)
      },
      toggleTagsList: function() {
        this.displayList = !this.displayList;
        let focusTarget;
        let scrollTop = null;
        let this1 = this;
        if (this.displayList) {
          focusTarget = this.$refs.tags_list[0].firstChild;
        } else {
          focusTarget = this.$refs.textArea;
          scrollTop = focusTarget.scrollTop;
        }
        this.$nextTick().then(function() {
          this1.focusTo(focusTarget)
        })
        // let tabEvent = new KeyboardEvent('keyup', 
        // {key: 'Tab'});
        // this.$refs.textArea.dispatchEvent(tabEvent)
      },
      focusTo: function(target, scrollTop) {
        target.focus()
      },
      preventTextAreaScroll: function(scrollTop) {
        // console.log('scrollTop: ', scrollTop);
        this.$refs.textArea.scrollTop = scrollTop;
      },
      // If we are using 2-way binding (v-model) to update textarea content, and we separately try to update textarea content using DOM property 'value' like we are doing here with addElementTags(), textarea content will update, however the data tied to v-model in our vue instance will not update.
      // So, we need to update the 'blogText' data on the instance via addElementTags() so that our added tags do not disappear on any instance refresh. This was a problem when I attempted to update the binded class displayList (my new added tags would disappear upon toggling tagsList):
      update_blogText: function(value) {
        this.blogText = value;
      },
      // submits textarea content to database
      // article content is auto-updated via ref.on():
      submitBlog: function() {
        this.setArticleUpdateStatus('saved')
        let entry = this.blogText;
        eventHub.$emit('writeToDatabase', entry)
      },
      populateTextarea: function() {
        this.blogText = this.$store.state.blog_article;
        this.setArticleUpdateStatus('saved')
      },
      setArticleUpdateStatus: function(savedStatus) {
        let text;
        if (savedStatus === 'unsaved') {
          this.displayRedStyle = true;
          this.saved = false;
          text = 'You have unsaved changes!'
        } else {
          text = 'Latest changes were saved & uploaded!';
          this.displayRedStyle = false;
          this.saved = true;
        }
        this.$store.dispatch('populateArticleUpdateStatus', {latest: false, message: text})
      },
      expandTextarea: function(action) {
        let el = this.$refs.textArea;
        if (action === 'resize') {
          el.style.height = `${el.scrollHeight}px`;
        } else el.style.height = 'initial';
      },
      addToTagslist: function() {
        let svgIcon = svgIcons('openInNew');
        let tag = {tag: '<a></a>', text: svgIcon, atEnd: false};
        this.tagsList.push(tag)
      }
    },
    watch: {
      blogText: function(val, oldVal) {
        if (this.saved) {
          console.log('blogText changed');
          this.setArticleUpdateStatus('unsaved')
        }
      },
      saved: function(val, oldVal) {
        console.log('new saved status: %s, old saved status: %s', val, oldVal)
      }
    },
    created() {
      eventHub.$on('update_blogText', this.update_blogText)
      this.addToTagslist()
    },
    mounted() {
      createDraggableEvents()
    },
    beforeDestroy() {
      eventHub.$off('update_blogText')
    }
  }

</script>


<style scoped>

  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&family=Rubik:wght@400;500&display=swap');

  .pos-relative {
    position: relative;
  }

  .container {
    /* position: relative; */
    /* display: flex; */
    flex-direction: row;
    justify-content: space-around;
    align-items: start;
    width: 100%;
    /* height: 95%; */
    height: min-content;
    background-color: lightskyblue;
    /* background-color: aquamarine; */
    border: 1px solid #666;
  }

  .sub-container {
    /* display: flex; */
    /* flex-direction: row; */
    /* justify-content: space-evenly; */
    flex-direction: column;
    justify-content: start;
    /* align-items: center; */
    width: 48%;
    /* height: 95%; */
    height: fit-content;
    background-color: mediumslateblue;
    border: 1px solid #999;
  }

  form {
    /* display: flex; */
    flex-direction: column;
    margin: 7px;
    padding: 10px;
    /* width: 45%;
    height: 95%; */
    border: 1px solid #666;
    background-color: deepskyblue;
  }

  label {
    font-weight: 500;
    text-decoration-line: underline;
  }

  textarea {
    padding: 5px;
    width: 100%;
    overflow: auto;
  }

  #resize-btn, #reset-btn {
    position: absolute;
    top: 12px;
    /* right: 10px; */
    border: 1px solid #666;
    padding: 1px 3px;
    background-color: mediumslateblue;
  }

  #resize-btn {
    width: 87px;
    right: 123px;
  }

  #reset-btn {
    width: 105px;
    right: 12px;
  }

  article {
    /* display: flex; */
    position: relative;
    flex-direction: column;
    justify-content: start;
    /* width: 45%; */
    /* height: 95%; */
    margin: 7px;
    padding: 5px;
    background-color: cornflowerblue;
    /* Manrope is nice but wonky & looks terrible on Edge */
    /* font-family: Manrope, Rubik, Roboto; */
    font-family: Rubik, Roboto;
    font-size: 1.1em;
    line-height: 1.4em;
  }

  article article {
    /* margin-top: 35px; */
    margin-top: 5px;
  }

  #update-status {
    /* display: block; */
    /* position: absolute; */
    /* top: 55px; */
    /* right: 10px; */
    /* margin: 0; */
    margin-top: 5px;
    padding: 0;
    /* width: 280px; */
    /* text-align: right; */
    text-align: center;
    line-height: 1em;
    height: 40px;
  }

  .size_08 {
    font-size: 0.8em;
  }

  .colorRed {
    color: red;
    font-size: 1.2rem;
    font-weight: 500;
  }

  #draggable-list {
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
            transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
       -moz-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    width: 160px;
    text-align: center;
    background-color: mediumslateblue;
    border: 2px solid black;
    box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.19), 0 6px 20px 2px rgba(0, 0, 0, 0.20);
  }

  ul {
    list-style-type: none;
    padding: 5px 0 30px 0;
  }

  li:hover {
    /* background-color: aqua; */
    cursor: pointer;
    font-weight: bold;
  }

  /* li:focus {
    background-color: deeppink;
  } */

  a {
    display: block;
    color: black;
    text-decoration: none;
    /* background-color: lime; */
    width: 100%;
  }

  a:focus {
    background-color: deepskyblue;
    outline: none;
  }

  #close-list {
    position: absolute;
    bottom: 5px;
    left: 5px;
    cursor: pointer;
  }

  #close-list:focus {
    background-color: deepskyblue;
    outline: none;
  }

  #drag-grabber {
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: move;
  }


</style>