<template>
  <!-- <v-app> (ONLY USED ONCE IN WHOLE APP) -->
  <v-container class="container fill-height" fluid>
    <v-layout class="d-flex flex-column align-center justify-center" >
      <aside id="auth-container">
        <div id="auth-container-heading">
          <h2 id="sign-in-heading">{{title}}</h2>
        </div>
          <!-- separate forms to allow only password reset via form.reset() -->
        <div id="auth-container-body">
          <form id="email-input-form" action="" >   
            <label for="email-input">email address:</label>
            <input type="email" id="email-input" class="credentials" placeholder="enter email" value="" autocomplete="on" required/> 
          </form>

          <form id="password-input-form" action="" autocomplete="off"> 
            <label id="password-label" for="password-input">password:</label>
            <input type="password" id="password-input" class="credentials" autocomplete="off" placeholder="enter password" value="" required/>
          </form>

          <form id="password-confirm-input-form" class="display-none" action="" autocomplete="off"> 
            <label for="password-confirm-input">confirm password:</label>
            <input type="password" id="password-confirm-input" class="credentials" autocomplete="off" placeholder="enter password again" value="" />
          </form>
          
          <button id="sign-in-form-btn" data-sign-in-mode="1">sign in</button>

          <button id="guest-form-btn">guest</button>

          <p id="sign-up-link" data-sign-in-mode="1">sign up</p>
          <p id="reset-password-link">forgot password?</p>
        </div>
      </aside>
    </v-layout>
  </v-container>
  <!-- </v-app> -->
</template>


<script>
export default {
  name: 'SignIn',
  data: () => ({
  }),
  props: {
    title: String
  }
}
</script>


<style scoped>
  .container {
    width: 900px;
  }
  
  #auth-container {
  /* position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center; */
  width: 250px;
  height: 330px;
  color: var(--widget-color-1); /*rgb(3,252,171);*/
  background-color: rgb(25, 25, 25);
  border: 2px solid var(--widget-color-1);
  border-radius: 10px;
  -webkit-transition: -webkit-transform 0.3s ease;
     -moz-transition: transform 0.3s ease;
      -ms-transition: transform 0.3s ease;
       -o-transition: transform 0.3s ease;
          transition: transform 0.3s ease;
  }

  #auth-container-heading {
    display: flex;
    flex-direction: column;
    /* justify-items: center; */
    align-items: center;
    margin: 0 0 10px 0;
    padding: 0;
    width: 100%;
    height: 50px;
    /* text-align: center; */
  }

  #auth-container-body {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 280px;
    margin: 0;
  }

  #auth-container form {
    /* display: inline-block; */
    width: 190px;
  }

  #auth-container label {
    font-size: 0.9em;
  }

  .credentials {
    width: 190px;
    height: 20px;
    margin-bottom: 10px;
  }

  /* #login-btn, #guest-btn { */
  #auth-container button {
    border: 1px solid black;
    width: 70px;
    height: 35px;
    margin-top: 10px;
    -webkit-appearance: none;
      -moz-appearance: none;
        -ms-appearance: none;
            appearance: none;
  }

  #sign-up-link, #reset-password-link {
    text-decoration: underline;
    font-size: .9em;
    margin-bottom: 5px;
    cursor: pointer;
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE/Edge */
          -o-user-select: none; /* Opera */
              user-select: none; /* prevents text selection */
  }

  input {
    background-color: #bbb;
    box-sizing: border-box;
  }

  button {
    color: rgb(25, 25, 25);
    background-color: #80ff80;
    border: solid 1px black;
    border-radius: 0.25em;
    font-family: 'Roboto', 'Open Sans', 'Poiret One';
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }


</style>
