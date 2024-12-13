<!-- <script>
export default{
    data(){
        return {
            designSelect: {
                op: [],
                ops: [],
                loading: false
            }
        }
    },
    props: {
        searchDesignParam: {
            type: Object,
            required: true
        } 
    },
    methods: {
        clearSelectVal() {
            this.designSelect.op = []
            this.itemDesignOpChange()
        },
        searchItemDesign(query) {
            if (query !== "") {
                this.designSelect.loading = true;
                let gameName = this.searchDesignParam.gameName
                // 开始拿数据                
                this.$http.get("/Jiu96/selectPageByDesign?keyword=" + query
                    + "&gameName=" + gameName
                ).then((res) => {
                    let respData = res.data
                    if (respData.code === 'S') {
                        this.designSelect.ops = respData.data.map((op) => {
                            return { value: `${op.designValue}`, label: `${op.designName}` }
                        })
                    } else {
                        ElMessage.error(respData.msg)
                    }
                    this.designSelect.loading = false
                }).catch((error) => {
                    console.log('意料之外的错误：', error)
                })
            } else {
                this.designSelect.ops = []
            }
        },
        itemDesignOpChange(){
            this.$emit('itemDesignOpChange',this.designSelect)
        }
    }
}
</script> -->
<script setup>
import { reactive, getCurrentInstance } from 'vue';
const globalProperties = getCurrentInstance().appContext.config.globalProperties;
const designSelect = reactive({
    op: [],
    ops: [],
    loading: false
})
const props = defineProps(['searchDesignParam'])
const emit = defineEmits(['itemDesignOpChange'])

function itemDesignOpChange() {
    emit('itemDesignOpChange', designSelect)
}
function clearSelectVal() {
    designSelect.op = []
    itemDesignOpChange()
}
defineExpose({clearSelectVal})

function searchItemDesign(query) {
    if (query !== "") {
        designSelect.loading = true;
        let gameName = props.searchDesignParam.gameName
        // 开始拿数据                
        globalProperties.$http.get("/Jiu96/selectPageByDesign?keyword=" + query
            + "&gameName=" + gameName
        ).then((res) => {
            let respData = res.data
            if (respData.code === 'S') {
                designSelect.ops = respData.data.map((op) => {
                    return { value: `${op.designValue}`, label: `${op.designName}` }
                })
            } else {
                ElMessage.error(respData.msg)
            }
            designSelect.loading = false
        }).catch((error) => {
            console.log('意料之外的错误：', error)
        })
    } else {
        designSelect.ops = []
    }
}
</script>
<template>
    <el-select-v2 v-bind="$attrs" v-model="designSelect.op" :remote-method="searchItemDesign"
        :options="designSelect.ops" :loading="designSelect.loading" :reserve-keyword="false" placeholder="请输入方案名称"
        size="small" style="width: 150px;" clearable filterable remote collapse-tags collapse-tags-tooltip
        @change="itemDesignOpChange">
        <template #default="{ item }">
            <span style="margin-right: 8px">{{ item.label }}</span>
        </template>
    </el-select-v2>
</template>