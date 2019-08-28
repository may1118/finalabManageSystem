<template>
<div>
  <div class="gary" v-show="showgary"></div>
  <h2 style="padding: 20px 40px;">凡路理事会成员</h2>
  <hr style="background: #F3F6F8;border: none; height: 2px;">

  <div class="membersinfoform">
    <el-table
      :data="memberInfo"
      stripe
      style="width: 100%">
      <el-table-column prop="comImage" label="照片" align="center" width="120px" padding="0px"
                           :show-overflow-tooltip = "true">
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="" style="width: 100%;height:100%">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="levelName"
        label="职位">
      </el-table-column>
      <el-table-column
        prop="catchphrase"
        label="箴言">
      </el-table-column>
      <!--<el-table-column-->
        <!--fixed="right"-->
        <!--label="操作"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<el-button @click="modifyInfo(scope.row)" type="text" size="big">修改</el-button>-->
          <!--<el-button type="text" size="big" @click="deleteInfo(scope.row)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
  <div v-show="showModifyBox" class="modifyBox">
    <h3 style="color:#3788EE;text-align: center;">修改理事会成员信息</h3>
    <hr style="margin:10px 0;border:none;height:1px;background-color:#0085d1;">
    <el-form ref="form" :model="modifyData" label-width="80px" style="padding: 20px 40px">
      <div style="text-align: center;"><img :src="modifyData.image" alt="" style="height: 100px;width: 100px;"></div>
      <el-form-item label="姓名">
        <el-input v-model="modifyData.name"></el-input>
      </el-form-item>
      <el-form-item label="去向">
        <el-input v-model="modifyData.levelName"></el-input>
      </el-form-item>
      <el-form-item label="箴言">
        <el-input type="textarea" :rows="5" v-model="modifyData.catchphrase"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmModify">确定</el-button>
        <el-button @click="cancelModifyBtn">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  <paging :allSize="allSize" :perSize="perSize" @pageChange="pageChange" style="margin-bottom: 10px"></paging>
</div>
</template>

<script>
  import { getAllMemberInfo } from '@/api/memberLeader'
  import paging from '@/views/Paging/paging'
  import { mapState } from 'vuex'
export default {
  name: 'indexLeader',
  components: {
    paging:paging
  },
  data() {
    return {
      showgary: false,
      showModifyBox: false,
      memberInfo: [],
      allSize: 100,
      perSize: 10,
      pageAc: 0,
      pageEn: 0,
      modifyData: new Object(),
    }
  },
  methods:{
    //进入页面，获取全部信息
    getInfo(id,start){
      let info = new Object();
      info.id = id;
      info.pageNo = parseInt(start/this.perSize+1);
      info.pageSize = this.perSize;
      getAllMemberInfo(info).then(res=>{
        const data = res.data;
        if(res.code == 200){
          this.allSize = data.length;
          this.showMemberInfo(data);
        }
      })
    },
    //处理信息，进行页面展示
    showMemberInfo(data){
      this.memberInfo = data;
    },
    modifyInfo(data){
      this.modifyData = data;
      this.showModifyBox = true;
      this.showgary = true;
    },
    confirmModify(){
      this.cancelModifyBtn();
    },
    cancelModifyBtn(){
      this.showModifyBox = false;
      this.showgary = false;
    },
    deleteInfo(data){

    },
    //  分页函数
    pageChange(start, end){
      this.pageAc = start;
      this.pageEn = end;
      this.getInfo(0,this.pageAc);
    }
  },
  created() {
    //一开始获取页面所有成员前10条数据
    this.getInfo(0,this.pageAc);
  },
  computed: {
    ...mapState(['api']),
  }
}
</script>

<style scoped>
  .membersinfoform{
    padding: 10px;
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
  .gary{
    position: absolute;
    background-color: #333;
    opacity: 0.6;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 5;
  }
</style>
