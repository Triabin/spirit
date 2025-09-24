<!-- 歌词调整组件 -->
<template>
  <h2 v-show="!props.hideTitle">歌词调整</h2>
  <div class="tools-lyric-adjuster">
    <textarea v-model="lyricContent"
              rows="10"
              cols="120"
              :style="{ height: props.inputBoxHeight, padding: '10px' }"
              placeholder="输入要调整的歌词内容"
    ></textarea>
    <under-line-msg ref="inputMsgRef"/>
    <i style="margin: 10px 0;">歌词格式：“[mm:ss.xx]本行歌词内容”，其中，mm表示分钟，ss表示秒，xx表示百分之几秒</i>
    <!-- 歌曲信息 -->
    <div v-show="lrcInfoVisible">
      <table>
        <thead>
        <tr>
          <th colspan="2">歌曲信息</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td style="width: 30%">歌词（歌曲）标题</td>
          <td style="width: 70%">{{ title.text }}<i v-show="!title.text" style="color: red;">未在歌词前找到该项</i></td>
        </tr>
        <tr>
          <td>专辑名称</td>
          <td>{{ album.text }}<i v-show="!album.text" style="color: red;">未在歌词前找到该项</i></td>
        </tr>
        <tr>
          <td>歌手</td>
          <td>{{ artist.text }}<i v-show="!artist.text" style="color: red;">未在歌词前找到该项</i></td>
        </tr>
        <tr>
          <td>歌词作者</td>
          <td>{{ author.text }}<i v-show="!author.text" style="color: red;">未在歌词前找到该项</i></td>
        </tr>
        <tr>
          <td>lrc文件创建者</td>
          <td>{{ by.text }}<i v-show="!by.text" style="color: gray;">未在歌词前找到该项</i></td>
        </tr>
        <tr>
          <td>加快（+）/延后（-）时间</td>
          <td>{{ offset.text }}<i v-show="!offset.text" style="color: gray;">未在歌词前找到该项</i></td>
        </tr>
        <tr>
          <td>备注</td>
          <td>{{ remark.text }}<i v-show="!remark.text" style="color: gray;">未在歌词前找到该项</i></td>
        </tr>
        <tr>
          <td>程序版本</td>
          <td>{{ version.text }}<i v-show="!version.text" style="color: gray;">未在歌词前找到该项</i></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="lyric-adjuster-action">
      <label style="margin-right: 10px;">时间轴调整</label>
      <input class="offset-input" type="number" v-model="timeOffset"/> 秒（正数则提前，负数延后）
      <button @click="() => adjustLyric()">逐行修改</button>
      <button @click="() => adjustLyric(true)">通过标签修改</button>
      <under-line-msg ref="paramMsgRef"/>
    </div>
    <textarea v-model="completedLyric"
              rows="10"
              cols="120"
              :style="{ height: props.inputBoxHeight, padding: '10px' }"
              placeholder="歌词调整结果"
              :readonly="isReadOnly"
    ></textarea>
    <div class="lyric-adjuster-action">
      <button @click="copyLyric">复制</button>
      <button @click="editLyric">编辑</button>
      <button @click="genLrcFile">生成文件</button>
    </div>
    <under-line-msg ref="oprMsgRef"/>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import UnderLineMsg from "./UnderLineMsg.vue";
import { clickDownload, debounce } from "../common/utils.js";

const props = defineProps({
  // 是否隐藏标题
  hideTitle: {
    type: Boolean,
    default: false
  },
  // 输入框高度
  inputBoxHeight: {
    type: String,
    default: '300px'
  }
});
const lyricContent = ref('');
const completedLyric = ref('');
const timeOffset = ref(0);
const isReadOnly = ref(true);
const timeLrcReg = /\[(\d{1,2}):(\d{1,2})\.(\d{1,2})?](.+)?/;
const title = reactive({ line: -1, text: '' }); // 歌词（歌曲）标题
const album = reactive({ line: -1, text: '' }); // 专辑名称
const artist = reactive({ line: -1, text: '' }); // 演出者-歌手
const author = reactive({ line: -1, text: '' }); // 歌词作者
const by = reactive({ line: -1, text: '' }); // 词lrc文件创建者
const offset = reactive({ line: -1, text: '' }); // 以毫秒为单位加快（+）和延后（-）歌词的播放
const remark = reactive({ line: -1, text: '' }); // 创建此LRC文件的播放器或编辑器
const version = reactive({ line: -1, text: '' }); // 程序版本
const lrcInfoVisible = ref(false);
const oprMsgRef = ref<any>();
const paramMsgRef = ref<any>();
const inputMsgRef = ref<any>();

let lrcLines: Array<string> | undefined;
let lrcIDTagEndLine = -1;
let lrcStartTime = -1;
watch(lyricContent, (value, oldValue) => debounce(() => initData(value)));
watch(timeOffset, (value, oldValue) => debounce(() => {
  paramMsgRef.value.showMsg();
  oprMsgRef.value.showMsg();
  completedLyric.value = '';
}));

/**
 * 函数描述：初始化数据
 * @param content {string} 输入的内容
 */
const initData = (content: string) => {
  reset();
  if (!content) {
    lrcInfoVisible.value = false;
    return;
  }

  lrcLines = content.split('\n');
  for (let i = 0; i < lrcLines.length; i++) {
    let line = lrcLines[i];
    if (!line) continue;

    // 如果遇到符合时间的行，则不再往下匹配
    let time = line.match(timeLrcReg);
    if (time) {
      lrcStartTime = parseInt(time[1]) * 60 * 1000 + parseInt(time[2]) * 1000 + (time[3] ? parseInt(time[3]) : 0) * 10;
      break;
    }

    // 标题
    let tiMatcher = line.match(/\[ti:(.+)?]/);
    if (tiMatcher) {
      title.line = i + 1;
      let ti = tiMatcher[1];
      if (!ti) continue;
      ti = ti.trim();
      if (ti) {
        title.text = ti;
        continue;
      }
    }

    // 专辑
    let alMatcher = line.match(/\[al:(.+)?]/);
    if (alMatcher) {
      album.line = i + 1;
      let al = alMatcher[1];
      if (!al) continue;
      al = al.trim();
      if (al) {
        album.text = al;
        continue;
      }
    }

    // 歌手
    let arMatcher = line.match(/\[ar:(.+)?]/);
    if (arMatcher) {
      artist.line = i + 1;
      let ar = arMatcher[1];
      if (!ar) continue;
      ar = ar.trim();
      if (ar) {
        artist.text = ar;
        continue;
      }
    }

    // 歌词作者
    let auMatcher = line.match(/\[au:(.+)?]/);
    if (auMatcher) {
      author.line = i + 1;
      let au = auMatcher[1];
      if (!au) continue;
      au = au.trim();
      if (au) {
        author.text = au;
        continue;
      }
    }

    // 词LRC文件创建者
    let byMatcher = line.match(/\[by:(.+)?]/);
    if (byMatcher) {
      by.line = i + 1;
      let b = byMatcher[1];
      if (!b) continue;
      b = b.trim();
      if (b) {
        by.text = b;
        continue;
      }
    }

    // 以毫秒为单位加快（+）和延后（-）歌词的播放
    let offsetMatcher = line.match(/\[offset:(.+)?]/);
    if (offsetMatcher) {
      offset.line = i + 1;
      let oft = offsetMatcher[1];
      if (!oft) continue;
      oft = oft.trim();
      if (oft) {
        offset.text = oft;
        continue;
      }
    }

    // 备注
    let reMatcher = line.match(/\[re:(.+)?]/);
    if (reMatcher) {
      remark.line = i + 1;
      let re = reMatcher[1];
      if (!re) continue;
      re = re.trim();
      if (re) {
        remark.text = re;
        continue;
      }
    }

    // 软件版本
    let veMatcher = line.match(/\[ve:(.+)?]/);
    if (veMatcher) {
      version.line = i + 1;
      let ve = veMatcher[1];
      if (!ve) continue;
      ve = ve.trim();
      if (ve) {
        version.text = ve;
      }
    }
  }
  lrcIDTagEndLine = Math.max(title.line, album.line, artist.line, author.line, by.line, offset.line, remark.line, version.line);
  lrcInfoVisible.value = true;
}

/**
 * 调整歌词时间轴函数
 */
const adjustLyric = (byOffset: boolean = false) => {
  if (!lyricContent.value) {
    return;
  }
  initData(lyricContent.value);
  lrcLines = lyricContent.value.split('\n');
  if (!lrcLines || lrcLines.length === 0) {
    inputMsgRef.value.showMsg('歌词内容为空！', 'fail');
    return;
  }

  if (byOffset) {
    // 通过offset标签修改
    let index = -1;
    let newMillis: number;
    if (offset.line === -1) {
      // 插入索引
      index = lrcIDTagEndLine === -1 ? 0 : lrcIDTagEndLine;
      // 内容
      newMillis = timeOffset.value * 1000;
      if (lrcStartTime - newMillis < 0) {
        paramMsgRef.value.showMsg(`最小时间调整后小于0，请注意时间`, "fail");
        return;
      }
      lrcLines.splice(index, 0, `[offset:${newMillis}]`)
      offset.line = index + 1;
      lrcIDTagEndLine = Math.max(lrcIDTagEndLine, index + 1);
    } else {
      newMillis = (offset.text ? parseInt(offset.text) : 0) + timeOffset.value * 1000;
      if (lrcStartTime - newMillis < 0) {
        paramMsgRef.value.showMsg(`最小时间调整后小于0，请注意时间`, "fail");
        return;
      }
      lrcLines[offset.line - 1] = `[offset:${newMillis}]`;
    }
    offset.text = newMillis + '';
  } else {
    // 逐行修改
    for (let i = 0; i < lrcLines.length; i++) {
      let line = lrcLines[i];
      if (!line) continue;
      const time = line.match(timeLrcReg);
      if (!time) continue;
      const timeMillis = parseInt(time[1]) * 60 * 1000 + parseInt(time[2]) * 1000 + (time[3] ? parseInt(time[3]) : 0) * 10;
      const newTimeMillis = timeMillis - timeOffset.value * 1000;
      if (newTimeMillis < 0) {
        paramMsgRef.value.showMsg(`第${i + 1}行时间调整后小于0，请注意时间，该行内容：${line}`, "fail");
        return;
      }
      const newTime = newTimeMillis / 1000;
      const minute = Math.floor(newTime / 60);
      const second = Math.floor(newTime % 60);
      const percentSecond = Math.round((newTimeMillis - minute * 60 * 1000 - second * 1000) / 10); // 转为百分之秒
      lrcLines[i] = `[${(Array(2).join('0') + minute).slice(-2)}:${(Array(2).join('0') + second).slice(-2)}.${(Array(2).join('0') + percentSecond).slice(-2)}]${time[4] ? time[4] : ''}`;
    }
  }
  completedLyric.value = lrcLines.join('\n');
}

/**
 * 切换处理后的歌词为可编辑
 */
const editLyric = () => {
  isReadOnly.value = false;
}

/**
 * 复制歌词函数
 */
const copyLyric = async () => {
  try {
    await navigator.clipboard.writeText(completedLyric.value);
    oprMsgRef.value.showMsg('已复制到剪切板！', "success", 3000);
  } catch (e) {
    console.error(e);
    oprMsgRef.value.showMsg(`复制失败，失败原因：\n${e}`, "fail", 3000);
  }
}

/**
 * 生成歌词文件函数
 */
const genLrcFile = () => {
  if (!completedLyric.value) {
    oprMsgRef.value.showMsg('内容为空！', 'fail', 3000);
    return;
  }
  clickDownload(
      completedLyric.value,
      'text/plain',
      () => ((title.line === -1 && artist.line === -1) ? '歌词' : `${artist.text === '' ? '歌手' : artist.text} - ${title.text === '' ? '歌名' : title.text}`) + '.lrc'
  );
}

/**
 * 重置各个值
 */
const reset = () => {
  completedLyric.value = '';
  // timeOffset.value = 0;
  isReadOnly.value = true;
  title.line = -1;
  title.text = '';
  album.line = -1;
  album.text = '';
  artist.line = -1;
  artist.text = '';
  author.line = -1;
  author.text = '';
  by.line = -1;
  by.text = '';
  offset.line = -1;
  offset.text = '';
  remark.line = -1;
  remark.text = '';
  version.line = -1;
  version.text = '';
  lrcLines = undefined;
  lrcIDTagEndLine = -1;
  lrcStartTime = -1;
  inputMsgRef.value.showMsg();
  paramMsgRef.value.showMsg();
  oprMsgRef.value.showMsg();
}
</script>
<style lang="css" scoped>
.tools-lyric-adjuster {
  margin-top: 20px;
  width: 100%;
  display: block;
}

.tools-lyric-adjuster textarea {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  resize: none;
}

.textArea::-webkit-scrollbar {
  display: none;
}

.lyric-adjuster-action {
  margin: 10px 0;
}

.lyric-adjuster-action .offset-input {
  width: 5em;
  height: 1.5em;
  text-align: center;
}

input:focus, textarea:focus {
  outline: none;
}

/* 按钮样式 */
button {
  background-color: #1861E9;
  color: #FFFFFF;
  border: 1px solid #000000;
  width: auto;
  height: 2.5em;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-right: 10px;
  padding: 2px;
}

button:hover {
  background-color: #4585FE;
}

button:active {
  background-color: #1861E9;
  transform: translateY(1px);
}
</style>
