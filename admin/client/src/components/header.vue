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

  export default {
    name: 'header',
    data () {
      return {
        msg: '这是一个头文件'
      };
    },
    created:function(){
      this.HelloAxios();
    },
    methods:{
      HelloAxios(){
        let self = this;
        this.$http.get('/admin/test')
                .then(function (rs) {
                  self.msg = rs.data.result.a;
                });

      }
    },
    components: {
      BodyFooter
    }
  }


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
