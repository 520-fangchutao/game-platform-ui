<script>
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
    methods: {
        searchItemOrEquire(query) {
            if (query !== "") {
                this.itemOrEq.loading = true;
                let kv = this.gameName.op.split('-')
                // 开始拿数据                
                this.$http.get("/Jiu96/selectPageByItemOrEq?keyword=" + query
                    + "&gameName=" + kv[0]
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
        }
    }
}
</script>
<template>
    <el-select-v2 v-model="itemOrEq.op" :remote-method="searchItemOrEquire" :options="itemOrEq.ops"
        :loading="itemOrEq.loading" :reserve-keyword="false" placeholder="请输入装备/道具名" size="small" style="width: 200px;"
        clearable multiple filterable remote collapse-tags>
        <template #default="{ item }">
            <span style="margin-right: 8px">{{ item.label }}</span>
        </template>
    </el-select-v2>
</template>