<template>
  <div>

    <!--工具栏-->
    <sticky :z-index="10" class-name="sub-navbar">
    <el-dropdown trigger="click">
      <el-button plain>
        项目类别<i class="el-icon-caret-bottom el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown" class="no-border">
        <el-checkbox-group v-model="platforms" style="padding: 5px 15px;">
          <el-checkbox v-for="item in platformsOptions" :key="item.key" :label="item.key">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-dropdown-menu>
    </el-dropdown>

    <el-button style="margin-left: 10px;" type="success" icon="el-icon-plus" @click.native.prevent="addVisible = true">
      添加
    </el-button>
  </sticky>

    <!--项目列表-->
    <div class="components-container">
      <el-col  :xs="10" :sm="8" :md="6" :lg="5" class="card-container" v-for="item in projects">
        <el-card :body-style="{padding: 0}">
          <el-image
            style="margin: 0; padding: 0"
            class="image"
            fit="cover"
            :src="item.coverImage"
            :preview-src-list="[item.coverImage]">
          </el-image>
          <div>
            <span>{{item.name}}</span>
            <el-tag size="mini">{{item.category}}</el-tag>
            <div class="bottom clearfix">
              <el-button type="text" class="button" @click="viewProjectDetail(item)">查看详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </div>

    <!--项目具体信息-->
    <el-dialog
      title="项目信息"
      :visible.sync="detailVisible"
      :before-close="closeEdit"
      width="40%"
      center>
      <div class="edit-container">
        <el-form v-if="edit" label-position="right" label-width="100px" :model="projectItem">
          <el-form-item label="项目名称">
            <el-input v-model="name"/>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="projectItem.version"/>
          </el-form-item>
          <el-form-item label="	策划负责人">
            <el-input v-model="projectItem.chiefPlanner"/>
          </el-form-item>
          <el-form-item label="技术负责人">
            <el-input v-model="projectItem.chiefArtisan"/>
          </el-form-item>
          <el-form-item label="成员列表">
            <el-input v-model="projectItem.memberList"/>
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="projectItem.category"/>
          </el-form-item>
          <el-form-item label="介绍">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="projectItem.introduction">
            </el-input>
          </el-form-item>
        </el-form>
        <el-form label-position="right" label-width="90px" :model="projectItem" v-else>
          <el-carousel>
            <el-carousel-item v-for="item in projectItem.imageList">
              <img :src="item" class="carousel-item-img"/>
            </el-carousel-item>
          </el-carousel>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="	策划负责人">
                {{ projectItem.chiefPlanner}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="技术负责人">
                {{projectItem.chiefArtisan}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="成 员">
            {{projectItem.memberList}}
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="类 型">
                <el-tag type="warning" >{{projectItem.category}}</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版 本 号">
                {{projectItem.version}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="介 绍">
            {{projectItem.introduction}}
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="上传封面">
                <el-upload
                  ref="upload"
                  :action="$store.state.api+'/upload/image/project'"
                  :head="{token: token}"
                  :data="{id: id}"
                  :limit="1"
                  name="image"
                  class="upload-demo">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上传详情图">
                <el-upload
                  ref="uploadBatch"
                  multiple
                  :action="$store.state.api+'/upload/image/projectBatch'"
                  :head="{token: token}"
                  :data="{id: id}"
                  name="image"
                  class="upload-demo">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" >
        <el-button v-if="edit" @click="closeEdit" size="mini">关 闭</el-button>
        <el-button @click="delProject" type="danger" v-else size="mini">删 除</el-button>
        <el-button v-if="edit" type="success" @click="saveEditedProject" size="mini">保 存</el-button>
        <el-button type="primary" @click="edit = true" size="mini" v-else>编 辑</el-button>
      </span>
    </el-dialog>

    <!--添加项目-->
    <el-dialog
      title="添加项目"
      :visible.sync="addVisible"
      width="40%"
      center>
      <div class="edit-container">
        <el-form label-position="right" label-width="100px" :model="projectItem">
          <el-form-item label="项目名称">
            <el-input v-model="projectItem.name"/>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="projectItem.version"/>
          </el-form-item>
          <el-form-item label="	策划负责人">
            <el-input v-model="projectItem.chiefPlanner"/>
          </el-form-item>
          <el-form-item label="技术负责人">
            <el-input v-model="projectItem.chiefArtisan"/>
          </el-form-item>
          <el-form-item label="成员列表">
            <el-input v-model="projectItem.memberList"/>
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="projectItem.category"/>
          </el-form-item>
          <el-form-item label="介绍">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="projectItem.introduction">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddProject">取 消</el-button>
        <el-button type="success" @click="addNewProject">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { getAllProjects, getProjectDetail, addProject, deleteProject, updateProject } from '@/api/project'
import { getToken } from '@/utils/auth'

export default {
  name: 'Project',
  components: { Sticky },
  data() {
    return {
      token: '',
      detailVisible: false,
      addVisible: false,
      edit: false,
      projects: null,
      projectItem: {},
      id: null ,
      name: '',
      time: '',
      platforms: [],
      platformsOptions: [
        { key: '安卓', name: '安卓' },
        { key: '游戏', name: '游戏' },
        { key: 'IOS', name: 'IOS' },
        { key: '物联网', name: '物联网' },
        { key: 'Web', name: 'Web' }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created() {
    this.token = getToken()
    this.fetchData()
  },
  methods: {

    //刷新
    refresh() {
      this.projects = {}
      this.projectItem = {}
      this.fetchData()
    },

    //获取项目信息
    fetchData() {
      getAllProjects().then(response => {
        this.projects = response.data
      })
    },

    //查看项目详细信息
    viewProjectDetail(item) {
      this.name = item.name
      this.id = item.id
      this.detailVisible = true
      getProjectDetail({id: item.id}).then(response => {
        this.projectItem = response.data
        if(this.projectItem.memberList === null) {
          this.projectItem.memberList = '暂无'
        } else {
          this.projectItem.memberList = this.projectItem.memberList.join(',')
        }
      })
    },

    //关闭项目信息框
    closeEdit() {
      this.edit = false
      this.detailVisible = false
      this.projectItem = {}
      // this.$refs.upload.clearFiles()
      // this.$refs.uploadBatch.clearFiles()
    },

    //保存编辑项目信息
    saveEditedProject() {
      this.projectItem.id = this.id
      this.projectItem.name = this.name
      delete this.projectItem.imageList
      updateProject(this.projectItem).then(response => {
        if (response.code === 200) {
          this.refresh()
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.detailVisible = false
          this.edit = false
        }
      })
    },

    //删除项目
    delProject(){
      const that = this
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject({ids: that.id}).then(response => {
          if (response.code === 200) {
            this.refresh()
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //取消添加项目
    cancelAddProject() {
      this.$confirm('检测到未保存的内容，是否在关闭前保存修改？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '继续添加',
        cancelButtonText: '放弃添加'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '继续添加'
          });
        })
        .catch(action => {
          this.addVisible = false
          this.$message({
            type: 'info',
            message: '已取消添加'
          })
          this.projectItem= {}
        });
    },

    //添加新项目
    addNewProject() {
      addProject(this.projectItem).then(response => {
        if (response.code === 200) {
          this.refresh()
          this.$message({
            type: 'success',
            message: '添加成功'
          });
          this.addVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.components-container {
  width: 100%;
}
.components-container div {
  margin: 10px;
}
.card-container {
  /*float: left;*/
  height: 300px;
}
.time-container {
  display: inline-block;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 20px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 200px;
}
.carousel-item-img {
  width: 100%;
  height: 300px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
