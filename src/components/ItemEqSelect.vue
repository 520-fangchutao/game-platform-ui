<!-- <script>
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            itemOrEq: {
                op: [],
                ops: [],
                loading: false
            }
        }
    },
    props: {
        searchItemParam: {
            type: Object,
            required: true
        } 
    },
    methods: {
        clearSelectVal(){
            this.itemOrEq.op = []
            this.itemOrEqOpChange()
        },
        searchItemOrEquire(query) {
            if (query !== "") {
                this.itemOrEq.loading = true;
                let gameName = this.searchItemParam.gameName
                // 开始拿数据                
                this.$http.get("/Jiu96/selectPageByItemOrEq?keyword=" + query
                    + "&gameName=" + gameName
                ).then((res) => {
                    let respData = res.data
                    if (respData.code === 'S') {
                        this.itemOrEq.ops = respData.data.map((op) => {
                            return { value: `${op.name}-${op.id}`, label: `${op.name}-${op.id}` }
                        })
                    } else {
                        ElMessage.error(respData.msg)
                    }
                    this.itemOrEq.loading = false
                }).catch((error) => {
                    console.log('意料之外的错误：', error)
                })
            } else {
                this.itemOrEq.ops = []
            }
        },
        itemOrEqOpChange(){
            this.$emit('itemOrEqOpChange',this.itemOrEq)
        }
    },
    mounted() {
        const entries = Object.entries(this.$refs.innerItemEqRef);
        for (const [key, value] of entries) {
            this[key] = value;
        }
    }
}
</script> -->
<script setup>
import { ElMessage } from 'element-plus'
import { reactive,getCurrentInstance } from 'vue';

const globalProperties = getCurrentInstance().appContext.config.globalProperties;

const itemOrEq = reactive({
    op: [],
    ops: [],
    loading: false
})

const emit = defineEmits(['itemOrEqOpChange'])

function itemOrEqOpChange() {
    emit('itemOrEqOpChange', itemOrEq)
}

const props = defineProps(['searchItemParam'])
function clearSelectVal() {
    itemOrEq.op = []
    itemOrEqOpChange()
}
defineExpose({clearSelectVal})
function searchItemOrEquire(query) {
    if (query !== "") {
        itemOrEq.loading = true;
        let gameName = props.searchItemParam.gameName
        // 开始拿数据                
        globalProperties.$http.get("/Jiu96/selectPageByItemOrEq?keyword=" + query
            + "&gameName=" + gameName
        ).then((res) => {
            let respData = res.data
            if (respData.code === 'S') {
                itemOrEq.ops = respData.data.map((op) => {
                    return { value: `${op.name}-${op.id}`, label: `${op.name}-${op.id}` }
                })
            } else {
                ElMessage.error(respData.msg)
            }
            itemOrEq.loading = false
        }).catch((error) => {
            console.log('意料之外的错误：', error)
        })
    } else {
        itemOrEq.ops = []
    }
}
</script>
<template>
    <el-select-v2 v-bind="$attrs" v-model="itemOrEq.op" :remote-method="searchItemOrEquire"
        :options="itemOrEq.ops" :loading="itemOrEq.loading" :reserve-keyword="false" placeholder="请输入装备/道具名"
        size="small" style="width: 200px;" clearable multiple filterable remote collapse-tags collapse-tags-tooltip
        @change="itemOrEqOpChange">
        <template #default="{ item }">
            <span style="margin-right: 8px">{{ item.label }}</span>
        </template>
    </el-select-v2>
</template>

<style lang="less" scoped>
:v-deep(.el-select__tags-text) {
    display: inline-block;
    max-width: 80px; // 根据实际情况调整
    overflow: hidden; // 溢出隐藏
    text-overflow: ellipsis; // 超出文本以省略号显示
    white-space: nowrap; // 文本不换行
}

.el-tag__close.el-icon-close {
    top: -7px; // 清除下标的位置调整
}
</style>