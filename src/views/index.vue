<script>

export default {
  methods: {
    getTest() {
      //console.log(this.$http)
      this.$http.get("http://localhost:8083/selectPageByKeyword?keyword=金币").then((res) => {
        console.log(res.data);
      }).catch((error) => {
        console.log('错误输出：',error)
      })
    }
  }
}
</script>


<template>
    <el-button type="primary" @click="getTest">提交数据</el-button>
</template>