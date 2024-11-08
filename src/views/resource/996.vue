<script>
export default {
    data() {
        return {
            options: [],
            value: [],
            loading: false,
        };
    },
    methods: {
        // 当用户输入内容开始远程搜索模糊查询的时候，会触发remoteMethod方法
        remoteMethod(query) {
            // 如果用户输入内容了，就发请求拿数据，远程搜索模糊查询
            if (query !== "") {
                this.loading = true; // 开始拿数据喽
                // 这里模拟发请求，res就当成发请求返回来的数据吧。
                let res = [
                    {
                        label: "孙悟空",
                        value: 500,
                    },
                    {
                        label: "孙尚香",
                        value: 18,
                    },
                    {
                        label: "沙和尚",
                        value: 1000,
                    },
                    {
                        label: "沙师弟",
                        value: 999,
                    },
                ];
                this.loading = false // 拿到数据喽
                // 然后把拿到的所有数据，首先进行一个过滤，把有关联的过滤成一个新数组给到options使用
                this.options = res.filter((item) => {

                    // indexOf等于0代表只要首个字匹配的，如：搜索 王 王小虎数据会被过滤出来，但是 小虎王的数据不会被过滤出来。因为indexOf等于0代表以什么开头
                    // return item.label.toLowerCase().indexOf(query.toLowerCase()) == 0

                    // indexOf大于-1代表的是，只要有这个字出现的即可，如：搜索 王 王小虎、小虎王、小王虎都会被过滤出来。因为indexOf找不到才会返回-1，
                    // 大于-1说明只要有就行，不论是不是开头也好，中间也好，或者结尾也好
                    return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                })
            } else {
                this.options = [];
            }
        },
    },
};
</script>
<template>
    <div>
        <el-row>
            <el-col :span="24">
                <span class="font-label">装备道具</span>
                <!-- 远程搜索要使用filterable和remote -->
                <el-select v-model="value" filterable remote placeholder="请输入关键词" :remote-method="remoteMethod"
                    :loading="loading" style="width: 300px;">
                    <!-- remote-method封装好的钩子函数。当用户在输入框中输入内容的时候，会触发这个函数的执行，
                        把输入框对应的值作为参数带给回调函数，loading的意思就是远程搜索的时候等待的时间，即：加载中-->
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <!-- <el-button color="#626aef">添加</el-button> -->
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-input v-model="textarea" style="width: 350px" :rows="10" type="textarea"
                    placeholder="Please input" />
            </el-col>
        </el-row>
    </div>
</template>

<style lang="less" scoped>
.font-label{
    color: black;
    font-family: 宋体;
    font-size: 18px;
}
</style>