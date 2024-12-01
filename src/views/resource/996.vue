<script>
import { ElMessage } from 'element-plus'
import axios from 'axios';
import ItemEqSelect from '@/components/ItemEqSelect.vue';
import GameNameSelect from '@/components/GameNameSelect.vue';
import GameZoneSelect from '@/components/GameZoneSelect.vue';
import GameDesignSelect from '@/components/GameDesignSelect.vue';
export default {
    components: {
        ItemEqSelect,
        GameNameSelect,
        GameZoneSelect,
        GameDesignSelect
    },
    data() {
        return {
            gameName: {
                op: '',
                ops: []
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
            gameDesign: {
                name: '',
                designSelect: {
                    op: [],
                    ops: [],
                    loading: false
                },
                itemOrEq: {
                    op: [],
                    ops: [],
                    loading: false
                },
                gameName: {
                    op: '',
                    ops: []
                },
                quantity: 1,
                dialogVisible: false,
                outputText: '',
            },
            quantity: 1,
            bindRadio: '1',
            sender: 'GM',
            mailTitle: '1',
            mailContent: '1',
            sendLable: 'bug补偿',
            sendLableOps: [{ id: 1, value: 'bug补偿' }, { id: 2, value: '反馈问题奖励' }, { id: 3, value: '官方通知' }, { id: 4, value: '活动奖励' }],
            reason: 'GS资源申请',
            uploadUrl: '',
            uploadParam: {
                gameName: ''
            },
            uploadList: [],
            inputRoles: '',
            outputText: '',
            batchProcCode: ''
        }
    },
    methods: {
        searchZoneParam() {
            return {
                gameName: (this.gameName.op === undefined) ? '' : this.gameName.op.split('-')[0],
                gameId: (this.gameName.op === undefined) ? '' : this.gameName.op.split('-')[1]
            }
        },
        searchItemParam() {
            return { gameName: (this.gameName.op === undefined) ? '' : this.gameName.op.split('-')[0] }
        },
        submitDesign() {
            if (this.gameDesign.outputText.trim().length === 0) {
                ElMessage.info('没有可提交的方案行！')
                return
            }
            let batchReqName = this.gameDesign.name
            let batchReqText = this.gameDesign.outputText
            let gameName = this.gameName.op.split('-')[0]
            this.$http.post(
                "/Jiu96/saveItemDesign",
                { gameName: gameName, batchReqName: batchReqName, batchReqText: batchReqText }
            ).then((res) => {
                let respData = res.data
                if (respData.code === 'S') {
                    ElMessage.success(respData.data)
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.error(error)
                ElMessage.error('意料之外的错误：' + error)
            })
            this.gameDesign.name = ''
            this.$refs.outerItemEqDesignRef.clearSelectVal()
            this.gameDesign.quantity = 1
            this.gameDesign.outputText = ''
            this.gameDesign.dialogVisible = false
        },
        optimizeDesign() {
            if (this.gameDesign.outputText.trim().length === 0) {
                ElMessage.info('没有可压缩的数据行！')
                return
            }
            let outputText = this.gameDesign.outputText.split('\n').join(';')
            let count = this.$commUtil.countChar(outputText, '#')
            let splitStrs = []
            if (count > 10) {
                this.splitItems(outputText, splitStrs, 10, ';')
                splitStrs = splitStrs.map(row => row.substring(0, row.length - 1))
                this.gameDesign.outputText = splitStrs.join('\n') + '\n'
            } else {
                this.gameDesign.outputText = outputText.substring(0, outputText.length - 1) + '\n'
            }
            ElMessage.success('压缩数据成功！')
        },
        addDesign() {
            let hasError = false
            if (this.gameDesign.name.trim().length === 0) {
                ElMessage.error('方案名称不能为空！')
                hasError = true
            }
            if (this.gameDesign.itemOrEq.op.length === 0) {
                ElMessage.error('道具不能为空！')
                hasError = true
            }
            if (hasError) {
                return
            }
            let itemQty = this.gameDesign.quantity
            let selectedItems = this.gameDesign.itemOrEq.op
            let itemRow = []
            let itemRows = []
            selectedItems.forEach(i => {
                let itemId = i.split('-')[1]
                let item = itemId + '#' + itemQty
                if (itemRow.length >= 10) {
                    itemRows.push(itemRow)
                    itemRow = []
                }
                itemRow.push(item)
            })
            itemRows.push(itemRow)
            let outputText = ''
            itemRows.forEach(itemRow => {
                let itemRowStr = itemRow.join(';')
                outputText = outputText + itemRowStr + '\n'
            })
            this.$refs.outerItemEqDesignRef.clearSelectVal()
            this.gameDesign.outputText += outputText
        },
        gameZoneOpChange(gameZone) {
            this.gameZone = gameZone
        },
        gameNameOpChange(gameName) {
            this.gameName = gameName
        },
        gameNameOpChanDesign(gameName) {
            this.gameDesign.gameName = gameName
        },
        itemOrEqOpChange(itemOrEq) {
            this.itemOrEq = itemOrEq
        },
        itemOrEqOpChanDesign(itemOrEq) {
            this.gameDesign.itemOrEq = itemOrEq
        },
        itemDesignOpChange(designSelect) {
            this.gameDesign.designSelect = designSelect
        },
        generateDesignRows() {
            //开始生成数据输出行方法
            let gameId = this.gameName.op.split('-')[1]
            let zoneId = this.gameZone.op.split('-')[1]
            let roleNames = this.inputRoles.split('\n')
            let bindStatus = this.bindRadio
            let sender = this.sender
            let mailTitle = this.mailTitle
            let mailContent = this.mailContent
            let sendLable = this.sendLable
            let reason = this.reason
            let designOp = this.gameDesign.designSelect.op
            let items = designOp.substring(0, designOp.length - 1).split('\n')
            let headers = []
            roleNames.forEach(roleName => {
                let header = gameId + '\t' +
                    zoneId + '\t' +
                    roleName + '\t' +
                    bindStatus + '\t' +
                    sender + '\t' +
                    mailTitle + '\t' +
                    mailContent + '\t' +
                    sendLable + '\t' +
                    reason
                headers.push(header)
            })
            let outputDesignText = ''
            headers.forEach(header => {
                items.forEach(item => {
                    outputDesignText += header + '\t' + item + '\n'
                })
            })
            this.outputText += outputDesignText
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
        clearAllItems() {
            let gameName = this.gameName.op.split('-')[0];
            this.$http.get(
                `/Jiu96/clearAll?gameName=${gameName}`
            ).then((res) => {
                let respData = res.data
                if (respData.code === 'S') {
                    ElMessage.success(respData.data)
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.log(error)
                ElMessage.error('意料之外的错误：' + error)
            })
        },
        clickUpload() {
            //上传提交参数
            this.uploadParam.gameName = this.gameName.op.split('-')[0]
            this.uploadUrl = axios.defaults.baseURL + '/Jiu96/uploadItems'
        },
        uploadSuccess(respData) {
            if (respData.code === 'S') {
                ElMessage.success(respData.data)
            } else {
                ElMessage.error(respData.msg)
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
            let hasDesign = false
            let hasItemEq = false
            if (!(this.itemOrEq.op == null || this.itemOrEq.op.length === 0)) {
                hasItemEq = true
            }
            if (!(this.gameDesign.designSelect.op == null || this.gameDesign.designSelect.op.length === 0)) {
                hasDesign = true
            }
            if (!hasDesign && !hasItemEq) {
                ElMessage.error('道具装备与预设方案不能都为空！')
                hasError = true
            }
            if (hasDesign && hasItemEq) {
                ElMessage.error('道具装备与预设方案只能二选一！')
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
            if (hasItemEq) {
                this.generateBatchRows(10)
            }
            if (hasDesign) {
                this.generateDesignRows()
            }
            this.$refs.outerGameDesignRef.clearSelectVal()
            this.$refs.outerItemEqRef.clearSelectVal()
            ElMessage.success('添加数据成功！')
        },
        splitItems(splitStr, splitStrs, divisor, separator) {
            let count = this.$commUtil.countChar(splitStr, separator) + 1
            let splitCount = Math.floor(count / divisor)
            if (count % divisor === 0) {
                splitCount = splitCount - 1
            }
            for (let i = 0; i < splitCount; i++) {
                let splitIdx = this.$commUtil.recursionIndex(splitStr, 0, divisor, separator) + 1
                let splitPart = splitStr.substring(0, splitIdx)
                splitStrs.push(splitPart)
                splitStr = splitStr.substring(splitIdx)
            }
            splitStrs.push(splitStr)
        },
        procExceedPart(e) {
            let headIdx = this.$commUtil.recursionIndex(e, 0, 9, '\t')
            let headStr = e.substring(0, headIdx + 1)
            let splitStr = e.substring(headIdx + 1)
            let splitStrs = []
            this.splitItems(splitStr, splitStrs, 10, ';')
            splitStrs.push(headStr)
            return splitStrs
        },
        optimizeData() {
            if (this.outputText.trim().length === 0) {
                ElMessage.info('没有可压缩的数据行！')
                return
            }
            let rows = this.outputText.split('\n')
            let sourceRows = []
            let distinctRows = []
            rows.forEach(row => {
                row = row.trim()
                if (row.length !== 0) {
                    let index = this.$commUtil.recursionIndex(row, 0, 9, '\t')
                    let key = row.substring(0, index + 1)
                    sourceRows.push(key)
                }
            })
            let rowStrs = []
            this.$commUtil.distinctArr(sourceRows, distinctRows)

            //合并同类项
            distinctRows.forEach((key, keyIdx) => {
                let first = true
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].includes(key)) {
                        let value = rows[i].substring(key.length)
                        if (first) {
                            rowStrs.push(key + value)
                            first = false
                        } else {
                            rowStrs[keyIdx] = rowStrs[keyIdx] + ';' + value
                        }
                        rows.splice(i, 1)
                        i--
                    }
                }
            })

            //分离超长数据，跟正常数据
            let exceedLenStrs = []
            for (let i = 0; i < rowStrs.length; i++) {
                let count = this.$commUtil.countChar(rowStrs[i], '#')
                if (count > 10) {
                    exceedLenStrs.push(rowStrs[i])
                    rowStrs.splice(i, 1)
                    i--
                }
            }
            //处理超长数据为正常数据
            exceedLenStrs.forEach(e => {
                let splitStrs = this.procExceedPart(e)
                let pos = splitStrs.length - 1
                let headStr = splitStrs[pos]
                splitStrs.splice(pos, 1)
                pos = splitStrs.length - 1
                splitStrs.forEach((sp, idx) => {
                    if (idx === pos) {
                        rowStrs.push(headStr + sp)
                    } else {
                        rowStrs.push(headStr + sp.substring(0, sp.length - 1))
                    }
                })
            })
            ElMessage.success('压缩数据成功！')
            this.outputText = rowStrs.join('\n') + '\n'
        },
        submitBatchData() {
            if (this.outputText.trim().length === 0) {
                ElMessage.info('没有可供提交的数据行！')
                return
            }
            let gameName = this.gameName.op.split('-')[0];
            let batchReqText = this.outputText;
            this.$http.post(
                "/Jiu96/batchItemSend",
                { gameName: gameName, batchReqText: batchReqText }
            ).then((res) => {
                let respData = res.data
                if (respData.code === 'S') {
                    let code = respData.data
                    this.batchProcCode = code
                    this.$refs.outerGameZoneRef.clearSelectVal()
                    this.$refs.outerItemEqRef.clearSelectVal()
                    this.quantity = 1
                    this.inputRoles = ''
                    this.outputText = ''
                    ElMessage.success('邮件申请已经发送，点击<处理结果>按钮查询最近的邮件申请处理进度(' + code + ')')
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.error(error)
                ElMessage.error('意料之外的错误：' + error)
            })
        },
        queryBatchResult() {
            if (this.batchProcCode.length === 0) {
                ElMessage.info('该页面暂无批量申请记录！')
                return
            }
            let gameName = this.gameName.op.split('-')[0];
            let code = this.batchProcCode
            this.$http.get(
                `/Jiu96/queryBatchMailStatus?gameName=${gameName}&code=${code}`
            ).then((res) => {
                let respData = res.data
                if (respData.code === 'S') {
                    let data = respData.data
                    //，current:${data.current}，取消:${data.isCancel}，错误:${data.isError}
                    ElMessage.success(`处理码:${this.batchProcCode}，总数:${data.total}，成功数:${data.successCount}，失败数:${data.errorCount}`)
                } else {
                    ElMessage.error(respData.msg)
                }
            }).catch((error) => {
                console.log(error)
                ElMessage.error('意料之外的错误：' + error)
            })
        },
        copyOutput() {
            this.$copyText(this.outputText).then(
                function (e) {
                    ElMessage.success('复制成功!')
                },
                function (e) {
                    ElMessage.error('复制失败!')
                }
            )
        }
    }
}
</script>
<template>
    <div class="mailReqBox">
        <el-row>
            <el-col :span="5">
                <span class="font-label">游戏名称</span>
                <GameNameSelect @gameNameOpChange="gameNameOpChange" />
            </el-col>
            <el-col :span="6">
                <span class="font-label">区服名称</span>
                <GameZoneSelect ref="outerGameZoneRef" :search-zone-param="searchZoneParam()"
                    @gameZoneOpChange="gameZoneOpChange" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">装备道具</span>
                <ItemEqSelect ref="outerItemEqRef" :search-item-param="searchItemParam()"
                    @itemOrEqOpChange="itemOrEqOpChange" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">方案</span>
                <GameDesignSelect ref="outerGameDesignRef" :search-design-param="searchItemParam()"
                    @itemDesignOpChange="itemDesignOpChange" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">数量</span>
                <el-input v-model="quantity" type="number" style="width: 172px" size="small" />
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
                <span class="font-label">发件人</span>
                <el-input v-model="sender" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">邮标</span>
                <el-input v-model="mailTitle" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">内容</span>
                <el-input v-model="mailContent" style="width: 150px" size="small" />
            </el-col>
            <el-col :span="4">
                <span class="font-label">标签</span>
                <el-select v-model="sendLable" size="small" style="width: 150px">
                    <el-option v-for="sendLableOp in sendLableOps" :key="sendLableOp.id" :label="sendLableOp.value"
                        :value="sendLableOp.id" />
                </el-select>
            </el-col>
            <el-col :span="5">
                <span class="font-label">理由</span>
                <el-input v-model="reason" style="width: 172px" size="small" />
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <el-input v-model="inputRoles" style="width: 275px" :rows="5" type="textarea" resize="none"
                    placeholder="<游戏角色列表格式>&#10;角色名称A&#10;角色名称B&#10;角色名称C&#10;......" />
            </el-col>
            <el-col :span="5">
                <el-button class="clearAllItemsBtn" type="primary" @click="clearAllItems">清空旧道具表</el-button>
                <el-upload name="uploadFile" accept=".xlsx,.xls" multiple limit="2" :file-list="uploadList"
                    :action="uploadUrl" :data="uploadParam" :on-success="uploadSuccess">
                    <el-button type="primary" @click="clickUpload">上传新道具表</el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            <span style="color: red;">先清理旧数据表，再多选上传道具+装备ID表</span>
                        </div>
                    </template>
                </el-upload>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="addData">添加数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="optimizeData">压缩数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="copyOutput">复制输出</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="submitBatchData">提交数据</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="queryBatchResult">处理结果</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="gameDesign.dialogVisible = true">新建方案</el-button>
                <el-dialog v-model="gameDesign.dialogVisible" width="80%" title="新建方案">
                    <div class="createDesignBox">
                        <el-row>
                            <el-col :span="6">
                                <span class="font-label">游戏名称</span>
                                <GameNameSelect @gameNameOpChange="gameNameOpChanDesign" />
                            </el-col>
                            <el-col :span="5">
                                <span class="font-label">方案名称</span>
                                <el-input v-model="gameDesign.name" placeholder="请输入方案名" style="width: 200px"
                                    size="small" />
                            </el-col>
                            <el-col :span="5">
                                <span class="font-label">装备道具</span>
                                <ItemEqSelect ref="outerItemEqDesignRef" :search-item-param="searchItemParam()"
                                    @itemOrEqOpChange="itemOrEqOpChanDesign" />
                            </el-col>
                            <el-col :span="4">
                                <span class="font-label">数量</span>
                                <el-input v-model="gameDesign.quantity" type="number" style="width: 100px"
                                    size="small" />
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" size="small" @click="addDesign">添加</el-button>
                                <el-button type="primary" size="small" @click="optimizeDesign">压缩</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-input v-model="gameDesign.outputText" style="width: 1350px" :rows="10"
                                    type="textarea" resize="none" placeholder="输出预设方案道具行" />
                            </el-col>
                        </el-row>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="gameDesign.dialogVisible = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="submitDesign" size="small">确 定</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-input v-model="outputText" style="width: 1500px" :rows="30" type="textarea" resize="none"
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
    margin-right: 10px;
}

.clearAllItemsBtn {
    margin-bottom: 5px;
}

.el-row {
    margin-bottom: 20px;
}
</style>