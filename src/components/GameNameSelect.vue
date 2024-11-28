<script>
export default {
    data(){
        return {
            gameName: {
                op: '',
                ops: [{ name: '【TT联运】创游传奇', id: 7064 }]
            }
        }
    },
    methods: {
        gameNameOpChange(){
            this.$emit('gameNameOpChange',this.gameName)
        }
    },
    mounted() {
        //默认选中第一项
        let ops = this.gameName.ops[0]
        this.gameName.op = ops.name + '-' + ops.id
        this.gameNameOpChange()
        //console.log('默认选中第一项',this.gameName.op)
    }
}
</script>

<template>
    <el-select v-model="gameName.op" placeholder="选择游戏" size="small" style="width: 250px" clearable @change="gameNameOpChange">
        <el-option v-for="op in gameName.ops" :key="op.id" :label="`${op.name}-${op.id}`"
            :value="`${op.name}-${op.id}`" />
    </el-select>
</template>