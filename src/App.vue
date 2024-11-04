<script setup>

</script>
<template>
    <router-link to="/test"><span class="test-span">测试</span></router-link>
    <router-link to="/index"><span class="index-span">首页</span></router-link>
    <router-view/>
</template>

<style lang="less" scoped>
    a{
        color: rgb(47, 255, 64);
        text-decoration: none;
    }
</style>
