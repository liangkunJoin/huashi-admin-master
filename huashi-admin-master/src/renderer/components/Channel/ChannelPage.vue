<template>
	<div class="content-page">
		<div class="content-nav">
			<el-breadcrumb class="breadcrumb" separator="/">
				<el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>商品管理</el-breadcrumb-item>
				<el-breadcrumb-item>首页分类</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="operation-nav">
				<router-link to="/dashboard/channel/add">
					<el-button type="primary" icon="plus">添加首页分类</el-button>
				</router-link>
			</div>
		</div>
		<div class="content-main">
			<div class="filter-box">
				<el-form :inline="true" :model="filterForm" class="demo-form-inline">
					<el-form-item label="首页分类">
						<el-input v-model="filterForm.name" placeholder="首页分类名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmitFilter">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="form-table-box">
				<el-table :data="tableData" style="width: 100%" border stripe>
					<el-table-column prop="id" label="ID" width="100px">
					</el-table-column>
					<el-table-column prop="name" label="名称">
					</el-table-column>
                    <el-table-column prop="link" label="跳转链接" show-overflow-tooltip="true">
					</el-table-column>
                    <el-table-column prop="iconUrl" label="Icon地址">
                        <template scope="scope">
                            <img  :src="scope.row.iconUrl" alt="" style="width: 50px;height: 50px">
                        </template>
					</el-table-column>
                    <el-table-column prop="sortOrder" label="排序">
					</el-table-column>
					<el-table-column prop="online" label="上下线状态">
						<template scope="scope">
                                    <div v-if="scope.row.online==1">上线</div>
                                    <div v-if="scope.row.online==0">下线</div>
                        </template>
					</el-table-column>
					<el-table-column label="操作" width="140">
						<template scope="scope">
							<el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button v-if="scope.row.online==1" size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">下线</el-button>
							<el-button v-if="scope.row.online==0" size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">上线</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="page-box">
				<el-pagination @current-change="handlePageChange" :current-page="page" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>

 import qs from 'qs';

export default {
	data() {
		return {
			page: 1,
			total: 0,
			filterForm: {
				name: ''
			},
			tableData: []
		}
	},
	methods: {
		handlePageChange(val) {
			this.page = val;
			//保存到localStorage
			localStorage.setItem('channelPage', this.page)
			localStorage.setItem('channelFilterForm', JSON.stringify(this.filterForm));
			this.getList()
		},
		handleRowEdit(index, row) {
			this.$router.push({ name: 'channel_add', query: { id: row.id } })
		},
		handleRowDelete(index, row) {

			this.$confirm(row.online == 0 ? '确定要上线?' : '确定要下线?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {

				this.axios.post('/api/huashi-cloud-customer/admin/channel/onlineChannelById', qs.stringify({ id: row.id, online : row.online == 0 ? 1 : 0  }), {                      
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                        }                    
                    }).then((response) => {
					console.log(response.data)
					if (response.data.code == 1) {
						this.$message({
							type: 'success',
							message: '操作成功!'
						});

						this.getList();
					}
				})
			});
		},
		onSubmitFilter() {
			this.page = 1
			this.getList()
		},
		getList() {
			this.axios.get('/api/huashi-cloud-customer/admin/channel/getChannelList', {
				params: {
					page: this.page,
					name: this.filterForm.name
				}
			}).then((response) => {
				 
                this.tableData = response.data.data.val
                this.page = response.data.data.currentPage
                this.total = response.data.data.totalCount
			})
		}
	},
	components: {

	},
	mounted() {
		this.getList();
	}
}

</script>

<style scoped>

</style>
