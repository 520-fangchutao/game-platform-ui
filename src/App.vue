<script setup>

</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header>游戏平台</el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu default-active="1" router="true">
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon><Present /></el-icon>
                                <span>资源发放</span>
                            </template>
                            <el-menu-item index="/resource/996">996平台</el-menu-item>
                        </el-sub-menu>
                        <!-- <el-menu-item index="2">
                            <el-icon><icon-menu /></el-icon>
                            <span>Navigator Two</span>
                        </el-menu-item>
                        <el-menu-item index="3" disabled>
                            <el-icon>
                                <document />
                            </el-icon>
                            <span>Navigator Three</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <el-icon>
                                <setting />
                            </el-icon>
                            <span>Navigator Four</span>
                        </el-menu-item> -->
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
.common-layout {
    height: 100vh;
}
.el-container{
    height: 100%;
}
.el-header {
    background-color: #4091ff;
    line-height: 60px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
}
.el-aside {
    border: 1px solid grey;
}
// :deep(.el-menu) {
//     background-color: #4091ff;
// }

// .el-menu-item {
//     color: #fff;
// }
</style>
