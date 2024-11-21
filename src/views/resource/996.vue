<script>
import { ElMessage } from 'element-plus'
import axios from 'axios';

export default {
    data() {
        return {
            gameName: {
                op: '',
                ops: [{ name: '【TT联运】创游传奇', id: 7064 }]
            },
            gameZone: {
                op: '',
                ops: [],
                serverRadio: '2',
                loading: false
            },
            itemOrEq: {
                op: [],
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
            reason: '内部攻沙区',
            uploadUrl: '',
            uploadParam: {
                gameName: ''
            },
            uploadList: [],
            inputRoles: '',
            outputText: ''
        }
    },
    methods: {
        handleScroll(event) {
            const target = event.target;
            // 检查是否滚动到底部，可以根据实际情况调整阈值
            if (target.scrollHeight - target.scrollTop <= target.clientHeight) {
                console.log('滚动底部')
            }
        },
        generateBatchRows(itemThreshold) {
            //开始生成数据输出行方法
            let gameId = this.gameName.op.split('-')[1]
            let zoneId = this.gameZone.op.split('-')[1]
            //此处角色名
            let bindStatus = this.bindRadio
            let sender = this.sender
            let mailTitle = this.mailTitle
            let mailContent = this.mailContent
            let sendLable = this.sendLable
            let reason = this.reason
            let itemArr = this.itemOrEq.op
            let itemQty = this.quantity

            //let itemThreshold = 10
            let itemRow = []
            let itemRows = []
            itemArr.forEach(i => {
                let kv = i.split('-')
                let itemId = kv[1]
                let item = itemId + '#' + itemQty
                if (itemRow.length >= itemThreshold) {
                    itemRows.push(itemRow)
                    itemRow = []
                }
                itemRow.push(item)
            })
            itemRows.push(itemRow)

            let outputRow = [bindStatus, sender, mailTitle, mailContent, sendLable, reason]
            let outputRowStr = outputRow.join('\t')
            let outputRowStrs = []
            itemRows.forEach(itemRow => {
                let itemRowStr = itemRow.join(';')
                outputRowStrs.push(outputRowStr + '\t' + itemRowStr)
            })
            let roleNames = this.inputRoles.split('\n')
            roleNames.forEach(roleName => {
                let gzr = gameId + '\t' + zoneId + '\t' + roleName
                outputRowStrs.forEach(row => {
                    this.outputText += (gzr + '\t' + row + '\n')
                })
            })
        },
        searchGameZone(query) {
            if (query !== "") {
                this.gameZone.loading = true;
                let kv = this.gameName.op.split('-')
                this.$http.get("/Jiu96/selectZone?keyword=" + query +
                    "&gameName=" + kv[0] +
                    "&gameId=" + kv[1] +
                    "&queryRange=" + this.gameZone.serverRadio
                ).then((res) => {
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
                let kv = this.gameName.op.split('-')
                // 开始拿数据                
                this.$http.get("/Jiu96/selectPageByItemOrEq?keyword=" + query
                    + "&gameName=" + kv[0]
                ).then((res) => {
                    //this.itemOrEq.ops = res.data
                    this.itemOrEq.ops = res.data.map((op) => {
                        return { value: `${op.name}-${op.id}`, label: `${op.name}-${op.id}` }
                    })
                    this.itemOrEq.loading = false
                }).catch((error) => {
                    console.log('错误输出：', error)
                })
            } else {
                this.itemOrEq.ops = []
            }
        },
        clickUpload() {
            //上传提交参数
            this.uploadParam.gameName = this.gameName.op.split('-')[0]
            this.uploadUrl = axios.defaults.baseURL + '/Jiu96/uploadOrUpdateItem'
        },
        uploadSuccess(resp) {
            //let respObj = JSON.parse(resp)
            if (resp.code === 'S') {
                ElMessage.success(resp.msg)
            } else {
                ElMessage.error(resp.msg)
            }
        },
        addData() {
            let hasError = false
            if (this.gameName.op == null || this.gameName.op.trim().length === 0) {
                ElMessage.error('游戏名称不能为空！')
                hasError = true
            }
            if (this.gameZone.op == null || this.gameZone.op.trim().length === 0) {
                ElMessage.error('游戏区服不能为空！')
                hasError = true
            }
            if (this.itemOrEq.op == null || this.itemOrEq.op.length === 0) {
                ElMessage.error('道具装备不能为空！')
                hasError = true
            }
            if (this.sender == null || this.sender.trim().length === 0) {
                ElMessage.error('发件人不能为空！')
                hasError = true
            }
            if (this.mailTitle == null || this.mailTitle.trim().length === 0) {
                ElMessage.error('邮件标题不能为空！')
                hasError = true
            }
            if (this.mailContent == null || this.mailContent.trim().length === 0) {
                ElMessage.error('邮件内容不能为空！')
                hasError = true
            }
            if (this.reason == null || this.reason.trim().length === 0) {
                ElMessage.error('申请理由不能为空！')
                hasError = true
            }
            if (this.inputRoles == null || this.inputRoles.trim().length === 0) {
                ElMessage.error('角色列表不能为空！')
                hasError = true
            }
            if (hasError) {
                return
            }

            this.generateBatchRows(10)

        },
        recursionIndex(row, begin, limit, splitChar) {
            let index = row.indexOf(splitChar, begin)
            if (limit === 1) {
                return index
            }
            return this.recursionIndex(row, index + 1, limit - 1, splitChar)
        },
        optimizeData() {
            let rows = this.outputText.split('\n')
            let index = this.recursionIndex(rows[0],0,9,'\t')
            console.log(index,'<'+rows[0].substring(0,index)+'>')
        }
    },
    created() {
        //默认选中第一项
        let ops = this.gameName.ops[0]
        this.gameName.op = ops.name + '-' + ops.id

    }
}
</script>
<template>
    <div class="mailReqBox">
        <el-row>
            <el-col :span="5">
                <span class="font-label">游戏名称 </span>
                <el-select v-model="gameName.op" placeholder="选择游戏" size="small" style="width: 250px" clearable>
                    <el-option v-for="op in gameName.ops" :key="op.id" :label="`${op.name}-${op.id}`"
                        :value="`${op.name}-${op.id}`" />
                </el-select>
            </el-col>
            <el-col :span="7">
                <span class="font-label">区服名称 </span>
                <el-select class="gameZoneSelectBox" v-model="gameZone.op" placeholder="选择区服" size="small"
                    :remote-method="searchGameZone" style="width: 150px" filterable remote clearable>
                    <el-option v-for="op in gameZone.ops" :key="op.id" :label="`${op.name}-${op.id}`"
                        :value="`${op.name}-${op.id}`" />
                </el-select>
                <el-radio-group v-model="gameZone.serverRadio">
                    <el-radio value="1" size="small">主服</el-radio>
                    <el-radio value="2" size="small">子服</el-radio>
                </el-radio-group>
            </el-col>
            <el-col :span="6">
                <span class="font-label">装备道具 </span>
                <!--<el-select v-model="itemOrEq.op" placeholder="请输入装备/道具名" size="small"
                    :remote-method="searchItemOrEquire" :loading="itemOrEq.loading" style="width: 250px;" filterable
                    multiple remote clearable collapse-tags>
                    <el-option v-for="op in itemOrEq.ops" :key="op.id" :label="`${op.name}-${op.id}`"
                        :value="`${op.name}-${op.id}`">
                    </el-option>
                </el-select>-->
                <el-select-v2 v-model="itemOrEq.op" size="small" style="width: 250px;" multiple filterable remote
                    collapse-tags :remote-method="searchItemOrEquire" clearable :options="itemOrEq.ops"
                    :loading="itemOrEq.loading" placeholder="请输入装备/道具名" @scroll="handleScroll">
                    <template #default="{ item }">
                        <span style="margin-right: 8px">{{ item.label }}</span>
                        <!-- <span style="color: var(--el-text-color-secondary); font-size: 13px">
                            {{ item.value }}
                        </span> -->
                    </template>
                </el-select-v2>
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
            <el-col :span="6">
                <el-upload name="uploadFile" accept=".xlsx,.xls" multiple limit="2" :file-list="uploadList"
                    :action="uploadUrl" :data="uploadParam" :on-success="uploadSuccess">
                    <el-button type="primary" @click="clickUpload()">上传道具ID表</el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            <span style="color: red;">先选游戏，再点击上传按钮选道具+装备ID表</span>
                        </div>
                    </template>
                </el-upload>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="addData">添加数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="optimizeData">精简数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary">提交数据</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-input v-model="outputText" style="width: 1500px" :rows="10" type="textarea" resize="none"
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

.gameZoneSelectBox {
    margin-right: 5px;
}

.el-select__tags-text {
    display: inline-block;
    width: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.el-row {
    margin-bottom: 20px;
}
</style>