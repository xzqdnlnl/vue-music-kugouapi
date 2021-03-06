<template>
  <!--根组件-->
  <div class="music-list" v-if="info">
    <div class="header" ref="header">
      <div class="back" @click="$router.back()">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="title" ref="title">
        <h2 v-html="info.name"></h2>
      </div>
    </div>
    <div class="list" ref="list">
      <scroll
        v-if="songs"
        ref="songscroll"
        :data="songs"
        :listenScroll="listenScroll"
        :probeType="3"
        :scroller="scrolling"
      >
        <div>
          <div class="content" ref="content">
            <div class="filter" :style="bgImg" ref="bgImg"></div>
          <div class="filter"></div>
            <div class="avatar">
              <img
                :src="info.pic300 || info.img || info.pic || require('@/assets/img/default.jpeg')"
              />
            </div>
            <div class="info">
              <span class="name" v-html="info.name"></span>
              <span class="fans-num" v-if="!info.sourceid">歌曲数：{{info.musicNum || info.total}}</span>
              <span class="fans-num" v-else>{{info.pub}}</span>
              <div class="playAll" @click="_randomAll">
                <i class="iconfont icon-zanting"></i>
                <span class="text">随机全部</span>
              </div>
            </div>
          </div>
          <SongList :songs="songs" @selectItem="selectItem" />
          <div class="loading-wrapper" v-if="!songs.length">
            <loading />
          </div>
        </div>
      </scroll>
    </div>
    <div class="commont-btn" @click="clickCommont" v-if="!info.fans">
      <i class="iconfont icon-commont"></i>
    </div>
    <Commont v-if="showCommont" ref="commont" :commont="commont" @scrollToEnd="scrollToEnd" />
  </div>
</template>

<script>
import SongList from "@/base/song-list/song-list.vue";
import Commont from "@/components/Commont/Commont.vue";
import { getCommont } from "@/api/song";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { digest } from "@/api/config";
import { playlistMixin } from "@/assets/js/mixin";
import { random } from "@/assets/js/util";
import { playMode } from "@/assets/js/config";
export default {
  mixins: [playlistMixin],
  props: {
    info: {
      default() {
        return {};
      }
    },
    songs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showCommont: false,
      page: 0,
      commont: {},
      listenScroll: true,
      y: 0
    };
  },
  computed: {
    ...mapGetters(["singer", "mode"]),
    bgImg() {
      return `background: url("${(this.info && this.info.pic300) ||
        require("@/assets/img/default.jpeg") ||
        this.info.img ||
        this.info.pic}") no-repeat;
        background-size: cover`;
    },
    digest() {
      if (this.info.sourceid) {
        return digest.BANG;
      } else {
        return digest.DISC;
      }
    }
  },
  methods: {
    scrolling(pos) {
      let y = pos.y;
      this._pullY(y);
    },
    _pullY(y) {
      y = Math.abs(y);
      if(y/(y+150)==0.498)return;
      if(y<150){
        this.$refs.header.style.background = `rgba(0,0,0,${Math.min(y/(y+100),0.5)})`;
        this.$refs.title.style.opacity = `${y/(y+150)}`;
      }
    },
    selectItem(song, index) {
      this.selectPlay({ song, index, songs: this.songs });
    },
    _randomAll(e) {
      this.randomAll(this.songs);
    },
    clickCommont() {
      this.showCommont = true;
      this.$nextTick(() => {
        this.$refs.commont.show();
      });
    },
    _getCommont(info) {
      this.page++;
      getCommont(
        this.digest.d,
        parseInt(info[this.digest.key]),
        this.page
      ).then(res => {
        if (!this.commont.rows) {
          this.commont = res;
        } else {
          res.rows = this.commont.rows.concat(res.rows);
          this.commont = res;
        }
      });
    },
    scrollToEnd() {
      this._getCommont(this.info);
    },
    handlePlaylist(list) {
      const bottom = list.length ? "60px" : "";
      this.$refs.list.style.bottom = bottom;
      this.$refs.scroll && this.$refs.scroll.refresh();
    },

    ...mapActions(["selectPlay", "randomAll"]),
    ...mapMutations({
      setPlayMode: "SET_PLAYMODE"
    })
  },

  components: {
    SongList,
    Commont
  },
  mounted() {
    this.$nextTick(() => {
      this.bgH = this.$refs.bgImg.clientHeight;
      this.headerH = this.$refs.header.clientHeight;
    });
  },
  created() {},
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler(info) {
        this._getCommont(info);
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.music-list {
  font-size: $font-size-m;
  width: 100%;
  height: 100%;
  position: relative;
  .commont-btn {
    position: fixed;
    right: 15px;
    top: 15px;
    z-index: 100;
    .iconfont {
      font-size: $font-size-ll;
    }
  }
  .header {
    width: 100%;
    position: fixed;
    top: 0;
    height: px2rem(48);
    line-height: px2rem(48);
    display: flex;
    z-index: 50;
    backdrop-filter: blur(5px);
    .back {
      padding: 0 15px 0;
    }
    .title {
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: px2rem(250);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      opacity: 0;
    }
  }
  .content {
    position: relative;
    top: 0;
    padding: px2rem(48) 0 20px;
    display: flex;
    align-items: center;
    z-index: 10;
    overflow: hidden;
    .filter {
      z-index: -1;
      position: absolute;
      width: 100%;
      filter: blur(20px);
      height: 100%;
    }
    .info {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      .name {
        font-size: $font-size-l;
        width: px2rem(200);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fans-num {
        margin: 10px 0;
        color: $text-color-l;
      }
      .playAll {
        position: relative;
        width: px2rem(90);
        font-size: $font-size-m;
        display: flex;
        padding: auto;
        align-items: center;
        border-radius: 20px;
        padding: 5px 10px;
        background-color: $text-color-d;
        .iconfont {
          font-size: $font-size-m;
          margin-right: px2rem(10);
        }
      }
    }
    .avatar {
      img {
        width: 100%;
        height: 100%;
      }
      margin: 0 20px 0 20px;
      width: px2rem(120);
      height: px2rem(120);
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .list {
    .loading-wrapper {
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    width: 100%;
    // padding: 15px 0 0 0;
    position: fixed;
    top: px2rem(0);
    // padding-top: 60%;
    bottom: 0;
    overflow: hidden;
  }
}
</style>