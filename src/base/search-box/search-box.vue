<template>
  <!--根组件-->
  <div class="search-box">
    <div class="input-box">
      <input type="text" v-model="key" ref="key" :placeholder="placeholder"/>
      <i class="iconfont icon-delete" v-show="key" @click="chearKey"></i>
    </div>
    <!-- <div class="suggest-key" v-show="key && isFocus">
      <scroll>
        <ul>
          <li v-for="(item, index) in sug" :key="index" @click="searchKey(item)">
            <i class="iconfont icon-chaxun"></i>
            <span>{{index===0?item+'”':item}}</span>
          </li>
        </ul>
      </scroll>
    </div> -->
  </div>
</template>

<script>
import { ERR_OK } from "@/api/config";
import { debounce } from '@/assets/js/util'

export default {
  props:{
      placeholder:{
          type: String,
          default: "搜索歌曲丶歌手"
      }
  },
  data() {
    return {
      key: "",
      sug: [],
      isFocus: true,
    };
  },
  methods: {
    setKey(key) {
      this.key = key;
    },
    exprotKey(item) {
      this.$emit("exportKey", item);
    },
    chearKey(){
      this.key = '';
    },
  },
  created(){
    // 截留导出结果
    this.$watch('key',debounce((key)=>{
      this.exprotKey(key);
    },300))
  }
};
</script>

<style scoped lang='scss'>
.search-box {
  width: 100%;
  height: 40px;
  position: relative;
  .input-box {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid $text-color-d;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 25px;
      padding: 0 10px;
      color: $text-color-d;
    }
    input {
      width: 100%;
      outline: none;
      color: $text-color-l;
      font-size: $font-size-mm;
      background-color: rgba(0, 0, 0, 0);
    }
  }
  .suggest-key {
    z-index: 10;
    width: 100%;
    font-size: $font-size-mm;
    background-color: $bg-hig-color;
    box-sizing: border-box;
    border-radius: 10px;
    position: absolute;
    top: 50px;
    overflow: hidden;
    left: 0;
    max-height: px2rem(450);
    li {
      &:first-child {
        span {
          &::before {
            content: "搜索: “";
          }
        }

        color: $theme-color;
      }
      &:last-child {
        border: 0;
      }
      border-bottom: solid 1px $bg-color-d;
      .iconfont {
        color: $text-color-d;
        padding: 0 10px;
      }
      span {
        padding-left: 10px;
      }
      line-height: 2.5;
    }
  }
}
</style>