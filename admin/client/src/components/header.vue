<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<template>
  <div class="header">
    <body-footer></body-footer>
    <h2>Essential Links</h2>
    <router-link to="/">{{ msg }}</router-link>
  </div>
</template>
<script>
  import BodyFooter from './footer.vue'

  import axios from 'axios';


    axios.get('/apis/test')
            .then(function (rs) {
              console.log(rs.data.result.a)
              return rs.data.result.a

            })
            .catch(function (error) {
              console.log(error);
            });


  console.log(get())
  export default {
    name: 'header',
    data () {
      return {
        msg: get()
      };
    },

    components: {
      BodyFooter
    }
  }
  axios.get('/apis/test')
          .then(function (rs) {
            console.log(rs.data.result.a)

          })
          .catch(function (error) {
            console.log(error);
          });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
