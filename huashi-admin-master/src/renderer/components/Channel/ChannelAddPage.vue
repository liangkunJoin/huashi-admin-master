<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{infoForm.id ? '编辑首页分类' : '添加首页分类'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
          
          <el-form-item label="分类名" prop="name">
            <el-input v-model="infoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" prop="link">
            <el-input v-model="infoForm.link"></el-input>
          </el-form-item>

          <el-form-item label="Icon图片" prop="iconUrl" >
            <el-upload class="avatar-uploader" action="auto" :show-file-list="false" 
              :http-request="channelIconPic"  :headers="uploaderHeader">
              <img v-if="uploadFile || infoForm.iconUrl" :src="infoForm.iconUrl || uploadFileImg" class="avatar">
              <i v-if="!uploadFile && !infoForm.iconUrl" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="form-tip">图片尺寸：58*58</div>
          </el-form-item>
          <!-- 引用网络图片辅助-->
         
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number v-model="infoForm.sortOrder" :min="1" :max="1000"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
            <el-button @click="goBackPage">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'qs';
  
  export default {
    data() {
      return {
        uploaderHeader: {
          'X-huashi-Token': localStorage.getItem('token') || '',
        },
        infoForm: {
          id: 0,
          name: '',
          link: '',
          iconUrl: '',
          sortOrder:'',
          online:'1',
        },
        infoRules: {
          name: [
            { required: true, message: '请输入首页分类名称', trigger: 'blur' },
          ],
          link: [
            { required: true, message: '请输入图片link', trigger: 'blur' },
          ],
        },
        uploadFile: "",
        uploadFileImg: '',
      }
    },
    methods: {
      goBackPage() {
            this.$router.go(-1);
      },
      onClearIconUrl(){
        this.infoForm.iconUrl = "";
        return;
      },
      channelIconPic(param){
        let readFile= new FileReader();
        readFile.readAsDataURL(param.file);
        readFile.onload=e=>{
          this.uploadFileImg=e.target.result;
        }
        this.infoForm.iconUrl = '';
        let fileObj = param.file;
        const isLt2M = fileObj.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
          return;
        }
        if (fileObj.type === "image/jpeg") {
          this.uploadFile = new File([fileObj], new Date().getTime() + ".jpg", {type: "image/jpeg"});
        } else if (fileObj.type === "image/png") {
          this.uploadFile = new File([fileObj], new Date().getTime() + ".png", {type: "image/png"});
        } else {
          this.$message.error("只能上传jpg/png文件");
          return;
        }
      },
      onSubmitInfo() {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            let param = new FormData(document.forms.namedItem("infoForm"))
            param.append('file', this.uploadFile, this.uploadFile.name); 
            param.append('id', this.infoForm.id);
            param.append('name', this.infoForm.name);
            param.append('link', this.infoForm.link);
            param.append('iconUrl', this.infoForm.iconUrl);
            param.append('sortOrder', this.infoForm.sortOrder);
            param.append('online', this.infoForm.online);
            this.axios.post('/api/huashi-cloud-customer/admin/channel/store', param,{                      
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }                    
                    }).then((response) => {
              if (response.data.code == 1) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.$router.go(-1)
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败'
                })
              }
            })
          } else {
            return false;
          }
        });
      },
      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }
        //加载广告详情
        let that = this
        this.axios.get('/api/huashi-cloud-customer/admin/channel/getChannelInfo', {
          params: {
            id: that.infoForm.id
          }
        }).then((response) => {
          let resInfo = response.data.data;
          that.infoForm = resInfo;
        })
      }
    },
    components: {},
    mounted() {
      this.infoForm.id = this.$route.query.id || 0;
      this.getInfo();
    }
  }
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 58px;
    height: 58px;
    line-height: 58px;
    text-align: center;
  }
  .avatar {
    width: 58px;
    height: 58px;
    display: block;
  }
</style>
