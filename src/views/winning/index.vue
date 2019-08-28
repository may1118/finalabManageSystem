<template>
  <div>
    <!--工具栏-->
    <sticky :z-index="10" class-name="sub-navbar">

      <el-dropdown trigger="click">
        <el-button plain>
          获奖等级<i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="no-border">
          <el-checkbox-group v-model="platforms" style="padding: 5px 15px;">
            <el-checkbox v-for="item in platformsOptions" :key="item.key" :label="item.key">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="time-container">
        <el-date-picker v-model="time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Release time" />
      </div>

      <el-button style="margin-left: 10px;" type="success" icon="el-icon-plus" @click.native.prevent="addVisible = true">
        新增
      </el-button>
    </sticky>

    <!--获奖记录表格-->
    <div class="components-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="项目名称" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="比赛名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.awardName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="获奖等级" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.awardLevel }}
          </template>
        </el-table-column>
        <el-table-column label="获奖成员" width="250" align="center">
          <template slot-scope="scope">
            {{ scope.row.profile }}
          </template>
        </el-table-column>
        <el-table-column label="获奖时间" width="200" align="center" prop="created_at">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.awardTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="viewAdwardImg(scope.row)" type="warning" icon="el-icon-picture" size="mini" circle/>
            <el-button @click="updateAward(scope.row)" type="primary" icon="el-icon-edit" size="mini" circle/>
            <el-button @click="deleteAward(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle/>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--编辑获奖信息-->
    <el-dialog
      title="编辑获奖信息"
      :visible.sync="editVisible"
      :before-close="cancelUpdateAward"
      width="30%"
      center>
      <div class="edit-container">
        <el-form label-position="right" label-width="80px" :model="awardItem">
          <el-form-item label="项目名称">
            <el-input v-model="awardItem.name"/>
          </el-form-item>
          <el-form-item label="比赛名称">
            <el-input v-model="awardItem.awardName"/>
          </el-form-item>
          <el-form-item label="获奖等级">
            <el-input v-model="awardItem.awardLevel"/>
          </el-form-item>
          <el-form-item label="获奖时间">
            <el-date-picker v-model="awardItem.awardTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"/>
          </el-form-item>
          <el-form-item label="获奖成员">
            <el-input v-model="awardItem.profile"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateAward">取 消</el-button>
        <el-button type="primary" @click="saveUpdateAward">保 存</el-button>
      </span>
    </el-dialog>

    <!--添加获奖信息-->
    <el-dialog
      title="添加获奖信息"
      :visible.sync="addVisible"
      :before-close="cancelAddAward"
      width="30%"
      center>
      <div class="edit-container">
        <el-form label-position="right" label-width="80px" :model="awardItem">
          <el-form-item label="项目名称">
            <el-input v-model="awardItem.name"/>
          </el-form-item>
          <el-form-item label="比赛名称">
            <el-input v-model="awardItem.awardName"/>
          </el-form-item>
          <el-form-item label="获奖等级">
            <el-input v-model="awardItem.awardLevel"/>
          </el-form-item>
          <el-form-item label="获奖时间">
            <el-date-picker v-model="awardItem.awardTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"/>
          </el-form-item>
          <el-form-item label="获奖成员">
            <el-input v-model="awardItem.members"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddAward">取 消</el-button>
        <el-button type="primary" @click="addAward">添加</el-button>
      </span>
    </el-dialog>

    <!--获奖图片-->
    <el-dialog
      title="获奖图片"
      :visible.sync="imgVisible"
      :before-close="closeAwardImage"
      width="30%"
      center>
      <img :src="awardItem.awardImage" style="width:90%;display: block;margin: 0 auto;margin-bottom: 20px;">
      <el-upload
        ref="upload"
        :action = "$store.state.api+'upload/image/winning'"
        :head="{token: this.token}"
        :data="{id: awardItem.id}"
        :limit="1"
        :on-success="awardImageUploadSuccess"
        name="image"
        class="upload-demo">
        <el-button size="small" type="primary">更改/上传图片</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { getAllWinning, updateWinning, deleteWinning, addWinning,uploadWinningImage } from '@/api/winning'
import { getToken } from '@/utils/auth'

export default {
  name: 'Wining',
  components: { Sticky },
  data() {
    return {
      token: '',
      list: null,
      listLoading: true,
      editVisible: false,
      addVisible: false,
      imgVisible: false,
      awardItem: {},
      time: '',
      platforms: [],
      platformsOptions: [
        { key: '一等奖', name: '一等奖' },
        { key: '二等奖', name: '二等奖' },
        { key: '三等奖', name: '三等奖' }
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
      this.list = null
      this.awardItem = {}
      this.fetchData()
    },

    //获取凡路荣誉数据
    fetchData() {
      this.listLoading = true
      getAllWinning().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },

    //编辑获奖信息
    updateAward(item) {
      this.editVisible = true
      let _item = JSON.parse(JSON.stringify(item))
      this.awardItem = _item
    },

    //保存修改后的获奖信息
    saveUpdateAward(){
      updateWinning(this.awardItem).then(response => {
        if (response.code === 200) {
          this.editVisible = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          this.refresh()
        }
      })
    },

    //取消保存的修改信息
    cancelUpdateAward(){
      this.$confirm('检测到未保存的内容，是否在关闭前保存修改？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '继续修改',
        cancelButtonText: '放弃修改'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '继续修改'
          });
        })
        .catch(action => {
          this.editVisible = false
          this.$message({
            type: 'info',
            message: '已取消编辑'
          })
          this.awardItem= {}
        });
    },

    //删除获奖记录
    deleteAward(item) {
      const that = this
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWinning({ids: item.id}).then(response => {
          if (response.code === 200) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refresh()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      this.awardItem= {}
    },

    //添加获奖记录
    addAward() {
      addWinning(this.awardItem).then(response => {
        if (response.code === 200) {
          this.refresh()
          this.$message({
            type: 'success',
            message: '添加成功'
          });
          this.addVisible = false
        }
      })
    },

    //取消添加获奖记录
    cancelAddAward() {
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
          this.awardItem= {}
        });
    },

    //查看获奖图片
    viewAdwardImg(item) {
      this.imgVisible = true
      this.awardItem = item
    },

    //获奖图片上传成功
    awardImageUploadSuccess(){
      this.$message({
        type: 'success',
        message: '图片上传成功'
      })
    },

    //关闭获奖图片
    closeAwardImage() {
      this.imgVisible = false
      this.awardItem = {}
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>

.components-container div {
  margin: 10px;
}

.time-container {
  display: inline-block;
}
</style>
