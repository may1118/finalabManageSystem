<template>
  <div>
    <div class="gary" v-show="showgary"></div>
    <h2 style="padding: 20px 40px;">凡路记忆</h2>
    <hr style="background: #F3F6F8;border: none; height: 2px;">

    <div style="margin: 20px;" v-show="imgTotal">
      <el-upload
        class="upload-demo"
        :action="api+'upload/image/memoryBatch'"
        :headers="{token: token}"
        name="images"
        :data="{remark: uplodeImgInfo.info,year: uplodeImgInfo.year}"
        accept="image/*"
        :show-file-list="false"
        :on-success="handleSuccess"
      >
        <el-button id="uplodeBtn" type="primary" size="small" style="display: none;">上传照片</el-button>
      </el-upload>
      <el-button type="primary" size="small" @click="showUplodeInfo">上传照片</el-button>
    </div>

    <div class="flexStyle" v-show="imgTotal">
      <div class="imgInfo"
           v-for="(item,index) of memoryInfo"
           @click="showImgDetail"
           :data-id="memoryInfo[index].imgChooseYear"
           :key="index"
      >
        <i class="el-icon-picture iconInfo"></i>
        <br>
        {{memoryInfo[index].imgChooseYear}}年照片
      </div>
    </div>

    <div v-show="!imgTotal">
      <i class="el-icon-back returnBack"
         @click="returnBack"
      >返回</i>
      <br>
      <span v-for="item of memoryInfo" class="flexStyle">
        <div
          class="imgInfoContainer"
          v-for="img of item.imgs"
          v-show="item.imgChooseYear == imgChooseYear && !imgTotal">
          <div style="height: 150px;display: block">
              <img :src="img.photo" alt=""
                   class="imgInfoEach"
                   ref="one"
                   :data-id="img.id"
                   @dblclick="showImgDetailBtn(img)">
            </div>
           <br>
            <span style="color: blue;">
              {{img.remark}}--时间:{{img.time.substr(0,10)}}
            </span>
            <br>
          <el-button type="primary"
                     style="margin: 5px"
                     @click="showImgDetailBtn(img)">查看大图</el-button>
            <el-button type="danger" style="margin: 5px" @click="deleteImg(img)" :data-id="img.id">删除</el-button>
        </div>
      </span>
      <div class="showImgBiger" v-show="showImgDetailBiger">
        <img :src="imgUrl" alt="" class="imgBiger">
        <el-button type="primary"
                   style="margin: 5px"
                   @click="closeImgBiger"
        >确认</el-button>
      </div>
    </div>
    <div v-show="uplodeImg" class="modifyBox">
      <h3 style="color:#3788EE;text-align: center;">上传照片信息</h3>
      <hr style="margin:10px 0;border:none;height:1px;background-color:#0085d1;">
      <el-form ref="form" :model="uplodeImgInfo" label-width="80px" style="padding: 20px 40px">
        <el-form-item label="主题">
          <!--<el-input v-model="uplodeImgInfo.info"></el-input>-->
          <input type="text" name="greeting" list="greetings" class="el-input__inner" placeholder="请选择/输入主题" v-model="uplodeImgInfo.info">
          <!-- 使用style="display:none;"将datalist元素设定为不显示 -->
          <datalist id="greetings" style="display:none;">
            <option value="迎新会">迎新会</option>
            <option value="年会">年会</option>
            <option value="比赛">比赛</option>
          </datalist>
        </el-form-item>
        <el-form-item label="年份">
          <el-input v-model="uplodeImgInfo.year"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmModify">确定</el-button>
          <el-button @click="cancelModifyBtn">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--<paging :allSize="allSize" :perSize="perSize" @pageChange="pageChange" style="margin-bottom: 10px"></paging>-->
  </div>
</template>

<script>
  import paging from '@/views/Paging/paging'
  import { getAllPicInfo } from '@/api/memory'
  import { deletePicInfo } from '@/api/memory'
  import { mapState } from 'vuex'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'index',
    components: {
      paging:paging
    },
    data() {
      return {
        uplodeImg: false,
        token: '',
        fileList: [{}],
        imgTotal: true,
        uplodeImgInfo:{
          year: new Number(),
          info: ""
        },
        imgChooseYear: 2016,
        imgUploadInfo: "",
        memoryInfo: [],
        memoryImgArr: [],
        allSize: 0,
        perSize: 10,
        pageAc: 0,
        pageEn: 0,
        showgary: false,
        showImgDetailBiger: false,
        imgUrl: null,
      }
    },
    methods:{
      showInfoSuccess(info){
        this.$message({
          type: 'info',
          message: info
        });
      },
      getInfo(id,start){
        getAllPicInfo().then(res=>{
          const data = res.data;
          if(res.code == 200){
            this.memoryImgArr = Object.keys(data);
            this.allSize = this.memoryImgArr.length;
            this.showmemoryInfo(data);
          }
        })
      },
      //处理信息，进行页面展示
      showmemoryInfo(data){
        this.memoryInfo = [];
        //为了方便显示，将所有图片内容转成一个数组
        for (var info in data){
          let yearImg = new Object();
          yearImg.imgChooseYear = info;
          yearImg.imgs = [];
          for (var img in data[info]) {
            for (var imgEach in data[info][img]) {
              yearImg.imgs.push(data[info][img][imgEach]);
            }
          }
          this.memoryInfo.push(yearImg);
        }
      },
      showImgDetail(event){
        this.imgTotal = false;
        this.imgChooseYear = event.currentTarget.dataset.id;
      },
      returnBack(){
        this.imgTotal = true;
      },
      showUplodeInfo(){
        this.uplodeImg = true;
        this.showgary = true;
      },
      confirmModify(){
        this.cancelModifyBtn();
        document.getElementById("uplodeBtn").click();
      },
      cancelModifyBtn(){
        this.uplodeImg = false;
        this.showgary = false;
      },
      handleSuccess(res){
        if(res.code == 200){
          this.showInfoSuccess("上传成功");
          this.pageChange(this.pageAc,this.pageEn);
        }else{
          this.showInfoSuccess("上传失败");
        }
      },
      showImgDetailBtn(img){
        this.imgUrl = img.photo;
        this.showgary = true;
        this.showImgDetailBiger = true;
      },
      deleteImg(data){
        if(confirm("确定删除")){
          deletePicInfo([data.id]).then(res=>{
            const data = res.data;
            if(data.code == 200){
              this.showInfoSuccess("删除成功");
              this.pageChange(this.pageAc,this.pageEn);
            }else{
              this.showInfoSuccess("删除失败");
            }
          })
        }
      },
      closeImgBiger(){
        this.showgary = false;
        this.showImgDetailBiger = false;
      },
      //  分页函数
      pageChange(start, end){
        this.pageAc = start;
        this.pageEn = end;
        this.getInfo(0,this.pageAc);
      }
    },
    created() {
      this.token = getToken();
      this.uplodeImgInfo.year = new Date().getFullYear();
      //一开始获取页面所有成员前10条数据
      this.getInfo(0,this.pageAc);
    },
    computed: {
      ...mapState(['api']),
    }
  }
</script>

<style scoped>
  .flexStyle{
    display: flex;
    flex-wrap:wrap;
    margin-left: 20px;
  }
  .modifyBox{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #FFF;
    border: 1px solid #337ab7;
    box-shadow: 0 0 5px #aaaaaa;
    z-index: 8;
    padding: 15px;
    overflow: hidden;
    width: 500px;
  }
  .imgInfo{
    height: 200px;
    width: 240px;
    margin: 10px 30px;
    text-align: center;
    border: 1px solid rgba(214, 214, 214, .8);
    border-radius: 5px;
  }
  .imgInfo:hover{
    box-shadow: 0 0 2px 0 #000;
  }
  .iconInfo{
    font-size: 150px;
    color: #E28F2A;
  }
  .imgInfoContainer{
    border-radius: 5px;
    margin: 10px;
    border: 1px solid rgba(214, 214, 214, .8);
    text-align: center;
    padding: 5px;
    overflow: hidden;
    width: 23%;
    overflow: hidden;
  }
  .imgInfoEach{
    height: 150px;
    overflow: hidden;
  }
  .returnBack{
    font-size: 20px;
    margin: 20px;
  }
  .returnBack:hover{
    cursor: pointer;
  }
  .gary{
    position: absolute;
    background-color: #333;
    opacity: 0.6;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .showImgBiger{
    z-index: 100;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #FFF;
    border: 1px solid #337ab7;
    -webkit-box-shadow: 0 0 5px #aaaaaa;
    box-shadow: 0 0 5px #aaaaaa;
    z-index: 100;
    padding: 15px;
    overflow: hidden;
    text-align: center;
  }
  .imgBiger{
    height: 400px;
  }
</style>
