<script>
import {Present,Document,HomeFilled} from '@element-plus/icons-vue'
// 解决ERROR ResizeObserver loop completed with undelivered notifications.
// 重写ResizeObserver的构造函数，并在其中定义并调用防抖函数
window.ResizeObserver = class ResizeObserver extends window.ResizeObserver {
    constructor(callback) {
        let timer = null
        const debouncedCallback = function () {
            let context = this
            let args = arguments
            clearTimeout(timer)
            timer = setTimeout(function () {
                callback.apply(context, args)
            }, 16)
        }
        super(debouncedCallback)
    }
}
export default {
    components: {
        Present,
        Document,
        HomeFilled
    }
}
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header>游戏平台</el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router>
                        <!-- <el-menu-item index="/">
                            <el-icon><HomeFilled /></el-icon>
                            <span>原神启动</span>
                        </el-menu-item> -->
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <Present />
                                </el-icon>
                                <span>资源发放</span>
                            </template>
                            <el-menu-item index="/resource/996">996平台</el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="/report/dailyData">
                            <el-icon><Document /></el-icon>
                            <span>数据报表</span>
                        </el-menu-item>
                        <!-- <el-menu-item index="/jiu96">
                            <el-icon><Document /></el-icon>
                            <span>测试页</span>
                        </el-menu-item> -->
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
.common-layout {
    height: 100vh;
}

.el-container {
    height: 100%;
    overflow: hidden;
}

.el-main {
    margin: 0;
    padding: 0;
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
    border-top-style: none;
}
</style>
