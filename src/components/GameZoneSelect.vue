<script>
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            gameZone: {
                op: '',
                ops: [],
                serverRadio: '2',
                loading: false
            }
        }
    },
    props: {
        searchZoneParam: {
            type: Object,
            required: true
        }
    },
    methods: {
        clearSelectVal() {
            this.gameZone.op = ''
            this.gameZoneOpChange()
        },
        searchGameZone(query) {
            if (query !== "") {
                this.gameZone.loading = true;
                let gameName = this.searchZoneParam.gameName
                let gameId = this.searchZoneParam.gameId
                this.$http.get("/Jiu96/queryZones?keyword=" + query +
                    "&gameName=" + gameName +
                    "&gameId=" + gameId +
                    "&queryRange=" + this.gameZone.serverRadio
                ).then((res) => {
                    let respData = res.data
                    if (respData.code === 'S') {
                        this.gameZone.ops = respData.data
                    } else {
                        ElMessage.error(respData.msg)
                    }
                    this.gameZone.loading = false
                }).catch((error) => {
                    console.log(error)
                    ElMessage.error('意料之外的错误：' + error)
                })
            } else {
                this.gameZone.ops = []
            }
        },
        gameZoneOpChange() {
            this.$emit('gameZoneOpChange', this.gameZone)
        },
        mounted() {
            const entries = Object.entries(this.$refs.innerGameZoneRef);
            for (const [key, value] of entries) {
                this[key] = value;
            }
        }
    }
}
</script>

<template>
    <el-select ref="innerGameZoneRef" v-bind="$attrs" class="gameZoneSelectBox" v-model="gameZone.op" placeholder="选择区服"
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