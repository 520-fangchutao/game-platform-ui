<script>
import { ElMessage } from 'element-plus'

export default {
    data() {
        return {
            gameName: {
                op: null,
                ops: [{ name: '【TT联运】创游传奇', id: 7064 }]
            },
            gameZone: {
                op: null,
                ops: [],
                serverRadio: '2',
                loading: false
            },
            itemOrEq: {
                op: null,
                ops: [],
                loading: false
            },
            quantity: 1,
            bindRadio: '1',            
            sender: 'GM',
            mailTitle: '1',
            mailContent: '1',
            sendLable: 'bug补偿',
            sendLableOps: [{ id: 1, value: 'bug补偿' }, { id: 2, value: '反馈问题奖励' }, { id: 3, value: '官方通知' }, { id: 4, value: '活动奖励' }],
            reason: '1',
            inputRoles: '',
            outputText: ''
        }
    },
    methods: {
        searchGameZone(query) {
            if (query !== "") {
                this.gameZone.loading = true;
                this.$http.get("/Jiu96/selectZone?keyword=" + query + "&gameName=" + this.gameName.op.name + "&gameId=" + this.gameName.op.id + "&queryRange=" + this.gameZone.serverRadio).then((res) => {
                    /* this.gameZone.ops = res.data.filter((item) => {
                        return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
                    }) */
                    this.gameZone.ops = res.data
                    this.gameZone.loading = false
                }).catch((error) => {
                    console.log('错误输出：', error)
                })
            } else {
                this.gameZone.ops = []
            }
        },
        // 当用户输入内容开始远程搜索模糊查询的时候，会触发searchItemOrEquire方法
        searchItemOrEquire(query) {
            // 如果用户输入内容了，就发请求拿数据，远程搜索模糊查询
            if (query !== "") {
                this.itemOrEq.loading = true;
                // 开始拿数据                
                this.$http.get("/Jiu96/selectPageByItemOrEq?keyword=" + query + "&gameName=" + this.gameName.op.name).then((res) => {
                    this.itemOrEq.ops = res.data
                    this.itemOrEq.loading = false
                }).catch((error) => {
                    console.log('错误输出：', error)
                })
            } else {
                this.itemOrEq.ops = []
            }
        },
        addData(){
            if(this.gameName.op == null){
                ElMessage.error('游戏名称不能为空！')
            }
            if(this.gameZone.op == null){
                ElMessage.error('游戏区服不能为空！')
            }
        }
    },
    created() {
        //默认选中第一项
        this.gameName.op = this.gameName.ops[0]
    }
}
</script>
<template>
    <div class="mailReqBox">
        <el-row>
            <el-col :span="5">
                <span class="font-label">游戏名称 </span>
                <el-select v-model="gameName.op" placeholder="选择游戏" size="small" style="width: 250px" clearable>
                    <el-option v-for="op in gameName.ops" :key="op.id" :label="op.name" :value="op" />
                </el-select>
            </el-col>
            <el-col :span="7">
                <span class="font-label">区服名称 </span>
                <el-select class="gameZoneSelectBox" v-model="gameZone.op" placeholder="选择区服" size="small" :remote-method="searchGameZone"
                    style="width: 150px" filterable remote clearable>
                    <el-option v-for="op in gameZone.ops" :key="op.id" :label="`${op.name}-${op.id}`"
                        :value="op.id" />
                </el-select>
                <el-radio-group v-model="gameZone.serverRadio">
                    <el-radio value="1" size="small">主服</el-radio>
                    <el-radio value="2" size="small">子服</el-radio>
                </el-radio-group>
            </el-col>
            <el-col :span="6">
                <span class="font-label">装备道具 </span>
                <!-- 远程搜索要使用filterable和remote -->
                <el-select v-model="itemOrEq.op" placeholder="请输入装备/道具名" size="small"
                    :remote-method="searchItemOrEquire" :loading="itemOrEq.loading" style="width: 250px;" filterable multiple
                    remote clearable>
                    <!-- remote-method封装好的钩子函数。当用户在输入框中输入内容的时候，会触发这个函数的执行，
                        把输入框对应的值作为参数带给回调函数，loading的意思就是远程搜索的时候等待的时间，即：加载中-->
                    <el-option v-for="op in itemOrEq.ops" :key="op.id"
                        :label="`${op.name}-${op.id}`" :value="op.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <span class="font-label">数量 </span>
                <el-input v-model="quantity" style="width: 172px" size="small" />
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
            <el-col :span="6">
                <el-input v-model="inputRoles" style="width: 275px" :rows="5" type="textarea" resize="none"
                    placeholder="角色名称A&#10;角色名称B&#10;角色名称C&#10;......" />
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="addData">添加数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary">提交数据</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-input v-model="outputText" style="width: 800px" :rows="10" type="textarea" resize="none"
                    placeholder="输出批量申请行" />
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

.gameZoneSelectBox{
    margin-right: 5px;
}

.el-row {
    margin-bottom: 20px;
}
</style>