<script setup>
import { reactive,onMounted } from 'vue'
const gameName = reactive({
    op: '',
    ops: [{ name: '创游传奇', id: 7064 }]
})

const emit = defineEmits(['gameNameOpChange']);

function gameNameOpChange() {
    emit('gameNameOpChange', gameName)
}

onMounted(() => {
    let ops = gameName.ops[0]
    gameName.op = ops.name + '-' + ops.id
    gameNameOpChange()
})
</script>

<template>
    <el-select v-model="gameName.op" placeholder="选择游戏" size="small" style="width: 250px" clearable
        @change="gameNameOpChange">
        <el-option v-for="op in gameName.ops" :key="op.id" :label="`${op.name}-${op.id}`"
            :value="`${op.name}-${op.id}`" />
    </el-select>
</template>