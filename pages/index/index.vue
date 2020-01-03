<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">启动时间</view>
				<view class="time">
					<ruiDatePicker fields="hour" start="2000-01-01 00" end="2030-12-30 23" :value="date" @change="stratupdateChange"></ruiDatePicker>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">预警级别</view>
				 <picker @change="polluteTypeChange" :value="polluteTypeIndex" :range="polluteTypeArray">
					<view class="uni-input" v-if="polluteTypeIndex>0">{{polluteTypeArray[polluteTypeIndex]}}</view>
					<view class="uni-input uni-placeholder" v-if="polluteTypeIndex==0">点击选择预警级别</view>
				 </picker>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">提示信息</view>
				<view class="uni-textarea">
				    <textarea v-model="ruleForm.text" placeholder="请输入提示信息"/>
				</view>
			</view>
			<view class="btn-box">
				<button type="primary" class="login-btn-block" @click="publish()">发布</button>
			</view>
		</view>
	</view>
</template>

<script>
	import helper from '../../common/helper.js'
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue'
	export default {
		components: {
			ruiDatePicker
		},
		data() {
			return {
				userInfo:helper.session.get("userInfo"),
				ruleForm: {
					releasedate:helper.formatDate(new Date(),'yyyy-mm-dd hh'),
					stratupdate:'',
					warning: 'pollute_fb',
					polluteType: '',
					text: '',
					issue: 1
				},
				date: helper.formatDate(new Date(),'yyyy-mm-dd hh'),
				polluteTypeArray: ['--选择预警级别--', '黄色预警', '橙色预警', '红色预警'],
				polluteTypeIndex: 0
			}
		},
		onLoad() {
			if(!helper.session.get("userInfo")||!helper.session.get("userInfo").userId){
				uni.reLaunch ({
					url:'../login/login'
				})
			}
		},
		methods: {
			polluteTypeChange: function(e) {
				this.polluteTypeIndex = e.target.value;
				this.ruleForm.polluteType = this.polluteTypeArray[this.polluteTypeIndex];
			},
			stratupdateChange(date){
				this.ruleForm.stratupdate = date;
			},
			publish(){
				if(this.ruleForm.stratupdate==''){
					uni.showToast({title:"请选择启动时间！", icon:"none"});
					return;
				}
				if(this.polluteTypeIndex==0){
					uni.showToast({title:"请选择预警级别！", icon:"none"});
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否发布该预警信息？',
					showCancel:true,
					confirmText:'发布',
					success: res => {
						if(res.confirm){
							uni.showLoading({
								title: '发布中',
								mask: true
							});
							uni.request({
								url: helper.serverUrl+'/wap/cityPollute/update.vm',
								method: 'POST',
								data:this.ruleForm,
								header: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Accept': ' application/json'
								},
								success: (res) => {
									uni.hideLoading();
									if(res.data.id){
										if(res.data.id.length>0){
											uni.showToast({title:"发布成功！", icon:"success"});
											setTimeout(function(){
												uni.reLaunch ({
													url:'../index/index'
												})
											},1500);
										}else{
											uni.showToast({title:"发布失败！", icon:"none"});
										}
									}else{
										uni.showModal({
											title: '发布失败',
											content: '页面已过期，请重新登录后发布',
											showCancel:false,
											success: res => {
												helper.session.remove("userInfo");
												uni.reLaunch ({
													url:'../login/login'
												})
											}
										});
									}
								},
								fail: (e) => {
									uni.hideLoading();
									uni.showToast({title:"发布失败！", icon:"none"});
								}
							});
						}
					}
				});
			},
		}
	}
</script>

<style scoped>
	.btn-box{
		padding:60upx 40upx;
	}
	.rui-picker{
		border: none;
		background-color: #fff;
	}
	.login-btn-block{
		background-color: #1C77AC;
		color:#ffffff;
	}
	.login-btn-block:active{
		background-color: #14547A;
	}
	.uni-placeholder{
		color:#808080;
		font-size:14px;
	}
	.rui-picker{
		font-size:14px;
	}
	.uni-column .title{
		font-weight: bold;
	}
</style>
