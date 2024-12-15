<script setup>
import { ElMessage } from 'element-plus'
import { reactive,getCurrentInstance } from 'vue'
const globalProperties = getCurrentInstance().appContext.config.globalProperties
const gameZone = reactive({
    op: '',
    ops: [],
    serverRadio: '2',
    loading: false
})
const props = defineProps(['searchZoneParam'])
const emit = defineEmits(['gameZoneOpChange'])
function gameZoneOpChange() {
    emit('gameZoneOpChange', gameZone)
}
function clearSelectVal() {
    gameZone.op = ''
    gameZoneOpChange()
}
defineExpose({clearSelectVal})

function searchGameZone(query) {
    if (query !== "") {
        gameZone.loading = true;
        console.log('props.searchZoneParam',props.searchZoneParam)
        let gameName = props.searchZoneParam.gameName
        let gameId = props.searchZoneParam.gameId
        globalProperties.$http.get("/Jiu96/queryZones?keyword=" + query +
            "&gameName=" + gameName +
            "&gameId=" + gameId +
            "&queryRange=" + gameZone.serverRadio
        ).then((res) => {
            let respData = res.data
            if (respData.code === 'S') {
                gameZone.ops = respData.data
            } else {
                ElMessage.error(respData.msg)
            }
            gameZone.loading = false
        }).catch((error) => {
            console.log(error)
            ElMessage.error('意料之外的错误：' + error)
        })
    } else {
        gameZone.ops = []
    }
}
</script>

<template>
    <el-select v-bind="$attrs" class="gameZoneSelectBox" v-model="gameZone.op" placeholder="选择区服"
        size="small" :remote-method="searchGameZone" style="width: 150px" filterable remote clearable
        @change="gameZoneOpChange">
        <el-option v-for="op in gameZone.ops" :key="op.id" :label="`${op.name}-${op.id}`"
            :value="`${op.name}-${op.id}`" />
    </el-select>
    <el-radio-group v-model="gameZone.serverRadio">
        <el-radio value="1" size="small">主服</el-radio>
        <el-radio value="2" size="small">子服</el-radio>
    </el-radio-group>
</template>

<style lang="less" scoped>
.gameZoneSelectBox {
    margin-right: 5px;
}
</style>