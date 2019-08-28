<template>
    <div>
      <div class="gary" v-show="showgary"></div>
      <h2 style="padding: 20px 40px;">凡路就业</h2>
      <hr style="background: #F3F6F8;border: none; height: 2px;">
      <el-button type="primary" @click="addEmployInfo" style="margin: 0 20px">添加新人员信息</el-button>
      <div>
        <div class="membersinfoform">
          <el-table
            :data="memberInfo"
            stripe
            style="width: 100%">
            <el-table-column
              prop="comImage"
              label="照片"
              align="center"
              width="150px"
              padding="0px"
              :show-overflow-tooltip = "true">
              <template slot-scope="scope">
                <img :src="scope.row.headPortrait" alt="" style="width: 100%;height:100%">
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              prop="name"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="whereabouts"
              width="200"
              label="去向">
            </el-table-column>
            <el-table-column
              prop="catchphrase"
              label="箴言">
            </el-table-column>
            <el-table-column
              fixed="right"
              width="200"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button @click="modifyInfo(scope.row)" type="text" size="big">修改</el-button>
                <el-button type="text" size="big" @click="deleteInfo(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--添加新成员弹出框-->
      <div class="modifyBox" v-show="showAddBox">
        <h3 style="color:#3788EE;text-align: center;">添加成员去向信息</h3>
        <hr style="margin:10px 0;border:none;height:1px;background-color:#0085d1;">

        <el-form ref="form" :model="form" label-width="80px" style="padding: 20px 40px">
          <el-form-item label="学号">
            <el-input v-model="form.stuId"></el-input>
          </el-form-item>
          <el-form-item label="去向">
            <el-input v-model="form.whereabouts"></el-input>
          </el-form-item>
          <el-form-item label="箴言">
            <el-input type="textarea" v-model="form.catchphrase"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
            <el-button @click="cancelBtn">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--修改成员弹出框-->
      <div class="modifyBox" v-show="showModifyBox">
        <h3 style="color:#3788EE;text-align: center;">修改成员去向信息</h3>
        <hr style="margin:10px 0;border:none;height:1px;background-color:#0085d1;">
        <el-form ref="form" :model="form" label-width="80px" style="padding: 20px 40px">
          <el-form-item label="姓名">
            <el-input v-model="changeInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="去向">
            <el-input v-model="changeInfo.whereabouts"></el-input>
          </el-form-item>
          <el-form-item label="箴言">
            <el-input type="textarea" :rows="10" v-model="changeInfo.catchphrase"></el-input>
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
  import { getAllEmploymentInfo } from '@/api/employment'
  import { modifyMemory } from '@/api/employment'
  import { addMemory } from '@/api/employment'
  import { deleteMemory } from '@/api/employment'
  import paging from '@/views/Paging/paging'
  import { mapState,mapGetters } from 'vuex'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'index',
    components: {
      paging:paging
    },
    data() {
      return {
        token: '',
        getId: 0,
        memberInfo: null,
        memberInfoOrigin: null,
        allSize: 100,
        perSize: 3,
        pageAc: 0,
        pageEn: 0,
        showModifyBox: false,
        showAddBox: false,
        showgary: false,
        changeInfo: new Object(),
        form: {
          stuId: '',
          whereabouts: '',
          catchphrase: ''
        }
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
        this.getId++;
        let info = new Object();
        info.pageNo = parseInt(start/this.perSize+1);
        info.pageSize = this.perSize;
        getAllEmploymentInfo(info).then(res=>{
          const data = res.data;
          if(res.code == 200){
            this.allSize = data.total;
            this.showMemberInfo(data.list);
          }
        })
      },
      //处理信息，进行页面展示
      showMemberInfo(data){
        this.memberInfoOrigin = data;
        this.pageChange(this.pageAc,this.pageEn);
      },
      modifyInfo(data){
        this.changeInfo = data;
        this.showModifyBox = true;
        this.showgary = true;
      },
      deleteInfo(data){
        if(confirm("确定删除")){
          deleteMemory(data.id).then(res=>{
            const data = res.data;
            if(data.code == 200){
              this.getInfo(0,this.pageAc);
              this.showInfoSuccess("删除成功");
            }
          });
        }
      },
      addEmployInfo(){
        this.showgary = true;
        this.showAddBox = true;
      },
      confirmAdd(){
        addMemory(this.form).then(res=>{
          const data = res.data;
          if(data.code == 200){
            this.getInfo(0,this.pageAc);
            this.showInfoSuccess("添加成功");
            this.cancelBtn();
          }else{
            alert(data.msg);
          }
        });
      },
      cancelBtn(){
        this.showgary = false;
        this.showAddBox = false;
        this.form.stuId = "";
        this.form.whereabouts = "";
        this.form.catchphrase = "";
      },
      confirmModify(){
        let info = new Object();
        for (let i in this.changeInfo) {
          if(typeof i === "string"){
            info[i] = this.changeInfo[i];
          }
        }
        modifyMemory(info).then(res=>{
          const data = res.data;
          if(data.code == 200){
            this.showInfoSuccess("修改成功");
            this.cancelModifyBtn();
          }else{
            alert("修改失败");
          }
        });
      },
      cancelModifyBtn(){
        this.showgary = false;
        this.showModifyBox = false;
      },
      pageChange(start, end){
        this.pageAc = start;
        this.pageEn = end;
        this.memberInfo = this.memberInfoOrigin.slice(start,end);
      },
    },
    created() {
      this.token = getToken();
      this.pageEn = this.perSize;
      //一开始获取页面所有成员前10条数据
      this.getInfo(0,this.pageAc);
    },
    computed: {
      ...mapState(['api']),
    }
  }
</script>

<style scoped>
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
