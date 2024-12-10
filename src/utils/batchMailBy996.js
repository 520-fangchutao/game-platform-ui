import { isEmpty, isNotEmpty } from '@/utils/common.js'
import { ElMessage } from 'element-plus'

export function checkDesignRowNotNull(designReqRow) {
    let hasError = false
    if (isEmpty(designReqRow.gameDesign)) {
        ElMessage.error('方案名称不能为空！')
        hasError = true
    }
    if (isEmpty(designReqRow.itemOrEq)) {
        ElMessage.error('道具不能为空！')
        hasError = true
    }
    return hasError
}

export function checkInputRowNotNull(dataReqRow) {
    let hasError = false
    if (isEmpty(dataReqRow.gameName)) {
        ElMessage.error('游戏名称不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.gameZone)) {
        ElMessage.error('游戏区服不能为空！')
        hasError = true
    }
    let hasDesign = false
    let hasItemEq = false
    if (isNotEmpty(dataReqRow.itemOrEq)) {
        hasItemEq = true
    }
    if (isNotEmpty(dataReqRow.designName)) {
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

    if (isEmpty(dataReqRow.sender)) {
        ElMessage.error('发件人不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.mailTitle)) {
        ElMessage.error('邮件标题不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.mailContent)) {
        ElMessage.error('邮件内容不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.reason)) {
        ElMessage.error('申请理由不能为空！')
        hasError = true
    }
    if (isEmpty(dataReqRow.inputRoles)) {
        ElMessage.error('角色列表不能为空！')
        hasError = true
    }
    return { hasError: hasError, hasDesign: hasDesign, hasItemEq: hasItemEq }
}

export function generateBatchRows(itemThreshold, dataReqRow) {
    //开始生成数据输出行方法
    let gameId = dataReqRow.gameName.split('-')[1]
    let zoneId = dataReqRow.gameZone.split('-')[1]
    //此处角色名
    let bindStatus = dataReqRow.bindRadio
    let sender = dataReqRow.sender
    let mailTitle = dataReqRow.mailTitle
    let mailContent = dataReqRow.mailContent
    let sendLable = dataReqRow.sendLable
    let reason = dataReqRow.reason
    let itemArr = dataReqRow.itemOrEq
    let itemQty = dataReqRow.quantity

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
    let roleNames = dataReqRow.inputRoles.split('\n')
    roleNames.forEach(roleName => {
        let gzr = gameId + '\t' + zoneId + '\t' + roleName
        outputRowStrs.forEach(row => {
            dataReqRow.outputText += (gzr + '\t' + row + '\n')
        })
    })
    return dataReqRow.outputText
}

export function generateDesignRows(dataReqRow) {
    //开始生成数据输出行方法
    let gameId = dataReqRow.gameName.split('-')[1]
    let zoneId = dataReqRow.gameZone.split('-')[1]
    let roleNames = dataReqRow.inputRoles.split('\n')
    let bindStatus = dataReqRow.bindRadio
    let sender = dataReqRow.sender
    let mailTitle = dataReqRow.mailTitle
    let mailContent = dataReqRow.mailContent
    let sendLable = dataReqRow.sendLable
    let reason = dataReqRow.reason
    let designOp = dataReqRow.designName
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
    dataReqRow.outputText += outputDesignText
    return dataReqRow.outputText
}