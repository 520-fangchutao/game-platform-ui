<script setup>

</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-header class="game-header">游戏平台</el-header>
            <el-container>
                <el-aside class="game-aside" width="200px">Aside</el-aside>
                <el-main class="game-main">
                    <el-select class="inputInfo" v-model="searchcursom" filterable clearable remote placeholder="搜索内容"
                        :remote-method="querySearch" @change="handleSelect" :loading="loading" @clear="removeclear">
                        <template slot="prefix">//输入框前搜索图标和后搜索文字
                            <i class="el-icon-search prefixSearch"></i>
                            <span class="prefixSpan">搜索</span>
                        </template>
                        <el-option v-for="item in helpList" :disabled="item.disabled" :key="item.fPkHelpCenterId"
                            :label="item.fVcHelpCenterName" :value="item.fPkHelpCenterId">
                            <div v-html="item.parsename"></div>
                        </el-option>
                        <div slot="empty" style="height:30px;text-align:center;line-height:30px">无数据</div>
                        //搜不到结果的时候展示对应的文字
                    </el-select>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
.game-header {
    background-color: hotpink;
}

.game-aside {
    background-color: chartreuse;
}

.game-main {
    border-style: solid;
    border-width: 1px;
    border-color: black;
}
</style>