<template>
    <div class="step_1">
        <p>您是教师还是学生呢？</p>
        <el-select class="select" @change="update" v-model="value" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-button class="register_btn"  @click="next">下一步</el-button>
    </div >
</template>

<script>
export default {
    data() {
        return {
            options: [{
                value: 'student',
                label: '学生'
            }, {
                value: 'teacher',
                label: '教师'
            }],
            value: ''
        }
    },
    methods: {
        update(){
            //每当结果发生改变都会将结果返回给父组件
            this.$emit('update',this.value);
        },
        next(){
            //预验证
            if(!this.value){
                return this.$message({
                    type:'error',
                    message:'请选择一个职别',
                    showClose:true
                });
            }
            this.$emit('clickDown');
        }
    },
}
</script>

<style lang="less" scoped>
    .step_1{
        padding-top: 60px;
    }
    .select{
        margin-top: 15px;
    }

    .register_btn{
        position:absolute;
        bottom: 10%;
        right: 5%;
    }
</style>
