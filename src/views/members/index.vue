<template>
    <div>
      <div class="gary" v-show="showgary"></div>
      <h2 style="padding: 20px 40px;">凡路全部成员</h2>
      <hr style="background: #F3F6F8;border: none; height: 2px;">
      <div style="float: right;margin: 0 10px;">
        <el-upload
          class="upload-demo"
          :action = "api+'sys/member/fileAdd'"
          :headers="{token: token}"
          name="file"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :show-file-list="false"
          :on-success="handleSuccess"
        >
          <el-button type="primary" size="small">添加人员表格</el-button>
        </el-upload>
      </div>
      <el-button type="info" size="small" style="margin: 0 10px;float: right;">
        <a href="https://static.finalab.cn/finalab-data/file/member.xls">下载表格</a>
      </el-button>
      <div class="membersinfoform">
        <el-table
          :data="memberInfo"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="majors"
            label="专业">
          </el-table-column>
          <el-table-column
            prop="grade"
            label="年级">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门">
          </el-table-column>
          <el-table-column
            prop="levelName"
            label="身份">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
           >
            <template slot-scope="scope">
              <el-upload
                class="upload-demo"
                :action = "api+'upload/image/member'"
                :headers="{token: token}"
                name="image"
                accept="image/*"
                :data="{id: scope.row.id}"
                :show-file-list="false"
                :on-success="handleSuccessImg"
                v-show="canUplodeImg(scope.row)"
              >
                <el-button type="text" size="big">上传照片</el-button>
              </el-upload>
              <el-button @click="modifyInfoBtn(scope.row)" type="text" size="big">修改</el-button>
              <el-button type="text" size="big" @click="deleteInfo(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--修改提示框内容-->
      <div class="modifyBox" v-if="showModifyBox">
        <el-steps :active="active" finish-status="success">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
        <el-form ref="form" :model="modifyInfo" label-width="80px" style="padding: 20px 40px">
          <span v-show="active == 0">
            <el-form-item label="姓名">
              <el-input v-model="modifyInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="modifyInfo.gender == 0? '男' : '女'" placeholder="请选择所属部门">
                <el-option label="男" value="0"></el-option>
                <el-option label="女" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学院">
              <el-select v-model="modifyInfo.college" placeholder="请选择所属学院">
                <el-option v-for="(item,index) of college" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业">
            <div class="el-input el-input--suffix">
              <input type="text" name="greeting" list="greetings" class="el-input__inner" placeholder="请选择/输入所属专业" v-model="modifyInfo.majors">
              <!-- 使用style="display:none;"将datalist元素设定为不显示 -->
              <datalist id="greetings" style="display:none;">
                <option value="软件工程">软件工程</option>
                <option value="计算机科学与技术">计算机科学与技术</option>
                <option value="网络工程">网络工程</option>
                <option value="通信工程">通信工程</option>
              </datalist>
            </div>
          </el-form-item>
          </span>
          <span v-show="active == 1">
          <el-form-item label="年级">
            <el-input v-model="modifyInfo.grade"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="modifyInfo.className"></el-input>
          </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="modifyInfo.department" placeholder="请选择所属部门">
                <el-option v-for="(item,index) of department" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份">
              <el-select v-model="modifyInfo.levelName" placeholder="请选择所属部门">
                <el-option v-for="(item,index) of level" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </span>
          <span v-show="active == 2">
            <el-form-item label="电话">
              <el-input v-model="modifyInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮件">
              <el-input v-model="modifyInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="QQ">
              <el-input v-model="modifyInfo.qq"></el-input>
            </el-form-item>
            <el-form-item label="箴言">
              <el-input type="textarea" v-model="modifyInfo.catchphrase"></el-input>
            </el-form-item>
          </span>
        </el-form>
        <div style="text-align: center;">
          <el-button @click="pre" v-show="active != 0">上一步</el-button>
          <el-button type="primary" @click="confirmModify" v-show="active == 2">确定</el-button>
          <el-button @click="next" v-show="active != 2">下一步</el-button>
          <el-button @click="cancelModifyBtn">取消</el-button>
        </div>
      </div>
      <paging :allSize="allSize" :perSize="perSize" @pageChange="pageChange" style="margin-bottom: 10px"></paging>
    </div>
</template>

<script>
import { getAllMemberInfo } from '@/api/member'
import { modifyMemberInfo } from '@/api/member'
import { deleteMemberInfo } from '@/api/member'
import { departmentInfo } from '@/api/member'
import { collegeInfo } from '@/api/member'
import { levelInfo } from '@/api/member'
import paging from '@/views/Paging/paging'
import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
  name: 'index',
  components: {
    paging:paging
  },
  data() {
    return {
      token: '',
      active: 0,
      memberInfo: [],
      allSize: 100,
      perSize: 10,
      pageAc: 0,
      pageEn: 0,
      showgary: false,
      showAddInfo: false,
      showModifyBox: false,
      modifyInfo: null,
      department: [],
      college: [],
      level: [],
      headers: new Object(),
      fileList: []
    }
  },
  methods: {
    showInfoSuccess(info){
      this.$message({
        type: 'info',
        message: info
      });
    },
    //进入页面，获取全部信息
    getInfo(id,start){
      let info = new Object();
      info.id = id;
      info.pageNo = parseInt(start/this.perSize+1);
      info.pageSize = this.perSize;
      getAllMemberInfo(info).then(res=>{
        const data = res.data;
        if(res.code == 200){
          this.allSize = data.total;
          this.showMemberInfo(data.list);
        }
      })
    },
    //处理信息，进行页面展示
    showMemberInfo(data){
      this.memberInfo = data;
      for (let i = 0;i < data.length;i ++){
        this.memberInfo[i].gender = this.memberInfo[i].gender == "男" ? 0 : 1;
      }
    },
  //  添加成员
    addMember(){
      this.showgary = true;
      this.showAddInfo = true;
    },
    handleSuccessImg(res){
      if(res.code == 200){
        this.showInfoSuccess("上传成功");
      }else{
        alert("上传失败")
      }
    },
    canUplodeImg(data){
      var year = new Date().getFullYear();
      if(year - data.grade >= 4){
        return true;
      }
      if(data.levelName == "实验室总裁" || data.levelName == "实验室导师"){
        return true;
      }
      return false;
    },
    //点击修改按钮
    modifyInfoBtn(info){
      this.active = 0;
      this.modifyInfo = info;
      this.showModifyBox = true;
      this.showgary = true;
    },
    //点击删除按钮
    deleteInfo(info){
      if(confirm("确定删除？")){
        deleteMemberInfo([info.id]).then(res=>{
          const data = res.data;
          if(data.code == 200){
            this.showInfoSuccess("删除成功");
            this.pageChange(this.pageAc,this.pageEn);
          }
        })
      }
    },
    handleSuccess(res){
      if(res.code == 200){
        this.showInfoSuccess("上传成功");
      }else{
        alert("文件错误，请按照要求上传");
      }
    },
    confirmModify(){
      let info = new Object();
      for (let i in this.modifyInfo) {
        if(typeof i === "string"){
          info[i] = this.modifyInfo[i];
        }
      }
      delete info["stuId"];
      info.gender = parseInt(info.gender);
      modifyMemberInfo(info).then(res=>{
        const data = res.data;
        if(data.code == 200){
          this.showInfoSuccess("修改成功");
          this.pageChange(this.pageAc,this.pageEn);
        }
      });
      this.cancelModifyBtn();
    },
    cancelModifyBtn(){
      this.showgary = false;
      this.showModifyBox = false;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    pre(){
      this.active--;
    },
    //  分页函数
    pageChange(start, end){
      this.pageAc = start;
      this.pageEn = end;
      this.getInfo(0,this.pageAc);
    },
    getDepartment(){
      departmentInfo().then(res=>{
        const data = res.data;
        this.department = data.data;
      })
    },
    getCollege(){
      collegeInfo().then(res=>{
        const data = res.data;
        this.college = data.data;
      })
    },
    getLevel(){
      levelInfo().then(res=>{
        const data = res.data;
        this.level = data.data;
      })
    },
  },
  created() {
    this.token = getToken();
    //一开始获取页面所有成员前10条数据
    this.getInfo(0,this.pageAc);
    this.getDepartment();
    this.getCollege();
    this.getLevel();
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
.membersinfoform{
  padding: 10px;
}
  .addMember{
    float: right;
    margin-right: 20px;
  }
.gary{
  position: absolute;
  background-color: #333;
  opacity: 0.6;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 7;
}
</style>
