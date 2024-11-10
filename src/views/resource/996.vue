<script>
export default {
    data() {
        return {
            gameName: '【TT联运】创游传奇',
            gameZone: '',
            gameZoneOps: [{ name: '1区', id: 5000 }],
            itemOrEquire: [],
            itemOrEquireOps: [],
            quantity: 1,
            loading: false,
            gameInfoOps: [{ name: '【TT联运】创游传奇', id: 7064 }],
            bindRadio: '1',
            sender: 'GM',
            mailTitle: '1',
            mailContent: '1',
            sendLable: 'bug补偿',
            sendLableOps: [{ id: 1, value: 'bug补偿' }, { id: 2, value: '反馈问题奖励' }, { id: 3, value: '官方通知' }, { id: 4, value: '活动奖励' }],
            reason: '1',
            textarea: ''
        }
    },
    methods: {
        // 当用户输入内容开始远程搜索模糊查询的时候，会触发searchItemOrEquire方法
        searchItemOrEquire(query) {
            // 如果用户输入内容了，就发请求拿数据，远程搜索模糊查询
            if (query !== "") {
                this.loading = true; // 开始拿数据喽
                // 这里模拟发请求，res就当成发请求返回来的数据吧。
                // let res = [
                //     {
                //         label: "孙悟空",
                //         value: 500,
                //     },
                //     {
                //         label: "孙尚香",
                //         value: 18,
                //     },
                //     {
                //         label: "沙和尚",
                //         value: 1000,
                //     },
                //     {
                //         label: "沙师弟",
                //         value: 999,
                //     },
                // ];
                let data = null
                this.$http.get("http://localhost:8083/selectPageByKeyword?keyword="+query).then((res) => {
                    data = res.data;
                    console.log('装备OR道具：',data)
                }).catch((error) => {
                    console.log('错误输出：', error)
                })
                this.loading = false
                // 然后把拿到的所有数据，首先进行一个过滤，把有关联的过滤成一个新数组给到options使用
                this.itemOrEquireOps = data.filter((item) => {
                    // indexOf等于0代表只要首个字匹配的，如：搜索 王 王小虎数据会被过滤出来，但是 小虎王的数据不会被过滤出来。因为indexOf等于0代表以什么开头
                    // return item.label.toLowerCase().indexOf(query.toLowerCase()) == 0

                    // indexOf大于-1代表的是，只要有这个字出现的即可，如：搜索 王 王小虎、小虎王、小王虎都会被过滤出来。因为indexOf找不到才会返回-1，
                    // 大于-1说明只要有就行，不论是不是开头也好，中间也好，或者结尾也好
                    return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                })
            } else {
                this.itemOrEquireOps = []
            }
        }
    }
}
</script>
<template>
    <div class="mailReqBox">
        <el-row>
            <el-col :span="7">
                <span class="font-label">游戏名称 </span>
                <el-select v-model="gameName" placeholder="选择游戏" size="small" style="width: 250px">
                    <el-option v-for="gameInfoOp in gameInfoOps" :key="gameInfoOp.id" :label="gameInfoOp.name"
                        :value="gameInfoOp.id" />
                </el-select>
            </el-col>
            <el-col :span="4">
                <span class="font-label">区服名称 </span>
                <el-select v-model="gameZone" placeholder="选择区服" size="small" style="width: 100px">
                    <el-option v-for="gameZoneOp in gameZoneOps" :key="gameZoneOp.id" :label="gameZoneOp.name"
                        :value="gameZoneOp.id" />
                </el-select>
            </el-col>
            <el-col :span="9">
                <span class="font-label">装备道具 </span>
                <!-- 远程搜索要使用filterable和remote -->
                <el-select v-model="itemOrEquire" filterable remote placeholder="请输入装备/道具名" size="small"
                    :remote-method="searchItemOrEquire" :loading="loading" style="width: 330px;">
                    <!-- remote-method封装好的钩子函数。当用户在输入框中输入内容的时候，会触发这个函数的执行，
                        把输入框对应的值作为参数带给回调函数，loading的意思就是远程搜索的时候等待的时间，即：加载中-->
                    <el-option v-for="itemOrEquireOp in itemOrEquireOps" :key="itemOrEquireOp.id"
                        :label="itemOrEquireOp.name" :value="itemOrEquireOp.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <span class="font-label">数量 </span>
                <el-input v-model="quantity" style="width: 100px" size="small" />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">
                <el-radio-group v-model="bindRadio">
                    <el-radio value="1" size="small">绑定</el-radio>
                    <el-radio value="0" size="small">不绑定</el-radio>
                </el-radio-group>
            </el-col>
            <el-col :span="4">
                <span class="font-label">发件人 </span>
                <el-input v-model="sender" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">邮标 </span>
                <el-input v-model="mailTitle" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">内容 </span>
                <el-input v-model="mailContent" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">标签 </span>
                <el-select v-model="sendLable" size="small" style="width: 150px">
                    <el-option v-for="sendLableOp in sendLableOps" :key="sendLableOp.id" :label="sendLableOp.value"
                        :value="sendLableOp.id" />
                </el-select>
            </el-col>
            <el-col :span="5">
                <span class="font-label">理由 </span>
                <el-input v-model="reason" style="width: 172px" size="small" />
            </el-col>
        </el-row>
        <el-row>
            <span class="font-label">游戏角色列表 </span>
            <el-col :span="5">
                <el-input v-model="textarea" style="width: 275px" :rows="5" type="textarea" resize="none"
                    placeholder="角色名称A&#10;角色名称B&#10;角色名称C&#10;......" />
            </el-col>
            <el-col :span="2">
                <el-button type="primary">添加数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary">提交数据</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="less" scoped>
.font-label {
    color: black;
    font-family: 宋体;
    font-size: 14px;
}

.el-row {
    margin-bottom: 20px;
}
</style>