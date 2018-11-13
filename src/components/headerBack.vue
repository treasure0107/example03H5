<template>
    <div class="container">
        <header>
            <slot></slot>
            <p class="back" @click="back"></p>
        </header>
    </div>
</template>
<script>
export default {
    name:'header-back',
    methods:{
        back(){
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~@/design/scoped';
.container{
    position: fixed;
    top: -8px;
    left: 0;
    z-index: 100;
    header{
        @include bg-icon('headerBg.png',750px,111px);
        text-align: center;
        line-height: 95px;
        font-size: 34px;
        color: $font-200;
        .back{
            @include bg-icon('back.png',36px,28px);
            position: absolute;
            top: 35px;
            left: 29px;
        }
    }
}
</style>
