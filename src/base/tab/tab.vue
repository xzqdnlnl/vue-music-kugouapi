<template><!--根组件-->
<div class="tab">
    <router-link v-for="(item, index) in items" :key="index" :to="item.url" tag="div" class="tab-item">
      {{item.name}}  
    </router-link>
</div>
</template>

<script>
export default {
    props:{
        items:{
            type: Array,
            default(){return []},
        }
    }
}
</script>

<style scoped lang='scss'>
.tab{
    font-size: $font-size-m;
    display: flex;
    justify-content: space-around;
    align-items:center;
    color: $text-color-l;
    text-align:center;
    height: px2rem(30);
    .tab-item{
        box-sizing: border-box;
        flex: 1;
        line-height: px2rem(30);
        &.router-link-active{
            color: $theme-color !important;
        }
    }
}
</style>