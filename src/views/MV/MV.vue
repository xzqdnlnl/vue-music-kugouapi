<template>
  <!--根组件-->
  <div class="mv">
    <div class="scrollbar-wrapper">
      <ScrollBar :items="barItem" @selectItem="selectItem" />
    </div>
    <div class="list">
      <keep-alive>
          <router-view @selectItem="selectMV"></router-view>
      </keep-alive>
    </div>
    <MVDetail ref="detail" v-if="mv" :mv="mv" />
    <Dialog ref="dialog" cancel="" />
  </div>
</template>

<script>
import ScrollBar from "@/base/scroll-bar/scroll-bar.vue";
import MVDetail from "@/components/MVDetail/MVDetail.vue";
import { getMVUrl } from "@/api/mv";
import { mapMutations } from 'vuex'
import Dialog from '@/base/dialog/dialog.vue'
export default {
  name: 'MV',
  data() {
    return {
      barItem: [
        { text: "首播", id: 236682871 },
        { text: "华语", id: 236682731 },
        { text: "日韩", id: 236742444 },
        { text: "网络", id: 236682773 },
        { text: "欧美", id: 236682735 },
        { text: "现场", id: 236742576 },
        { text: "热舞", id: 236682777 },
        { text: "伤感", id: 236742508 },
        { text: "剧情", id: 236742578 }
      ],
      mv: {}
    };
  },
  methods: {
    selectItem(index) {
      this.$router.replace({
        path: `/mv/${this.barItem[index].id}`
      });
    },
    _getMVUrl(mv) {
      getMVUrl(mv.id).then(res => {
        if (/^http/.test(res)) {
          let mv = this.mv; 
          mv.url = res;
          this.mv = mv;
          this.$refs.detail.show();
        }else{
            this.$refs.dialog.show();
        }
      });
    },
    selectMV(item) {
      this.mv = item;
      this._getMVUrl(item);
      this.setPlaying(false);
    },



    ...mapMutations({
        setPlaying: "SET_PLAYING",
    })
  },

  components: {
    ScrollBar,
    MVDetail,
    Dialog
  }
};
</script>

<style scoped lang='scss'>
.mv {
  width: 100%;
  height: 100%;
  position: relative;
  .list{
    width: 100%;
    position: fixed;
    top: px2rem(95);
    bottom:0;
  }
  .scrollbar-wrapper{
    position: absolute;
    width: 100%;
    height: px2rem(30);
  }
}
</style>