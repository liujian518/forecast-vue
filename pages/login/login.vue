<template>
	<view class="content" v-show="showLogin==true">
		<view class="bg" v-bind:style="{height: windowHeight + 'px' }"></view>
		<view class="login-title">
			登录预警提示
		</view>
		<view class="login-body">
			<view class="uni-flex uni-row">
			    <view class="flex-item input-title"><text class="uni-icon uni-icon-contact"></text></view>
                <input class="flex-item uni-input" v-model="username" placeholder="请输入登录账号" />
			</view>
			<view class="login-line"></view>
			<view class="uni-flex uni-row">
			    <view class="flex-item input-title"><text class="uni-icon uni-icon-locked"></text></view>
			    <input class="flex-item uni-input" v-model="password" password type="text" placeholder="请输入登录密码" />
			</view>
			<view class="login-line"></view>
		</view>
		<view class="login-btn">
			<button class="login-btn-block" type="primary" @click="login">登录</button>
		</view>
		<view class="copy">
			<text>陕西省空气质量预报预警系统</text>
		</view>
	</view>
</template>

<script>
	import helper from '../../common/helper.js'
	export default {
		data() {
			return {
				showLogin:true,
				windowHeight:0,
				username:'',
				password:''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
				}
			})
		},
		onReady() {
		},
		methods: {
			login(){
				if(this.username==''){
					uni.showToast({title:"请输入登录账号！", icon:"none"});
					return;
				}
				if(this.password==''){
					uni.showToast({title:"请输入登录密码！", icon:"none"});
					return;
				}
				uni.showLoading({
					title: '登录中',
					mask: true
				});
				uni.request({
					url: helper.serverUrl+'/wap/login.vm?format=json',
					method: 'POST',
					data: {loginName:this.username,password:this.password},
					success: res => {
						uni.hideLoading();
						if(res.data.status==1){
							helper.session.set('userInfo',res.data.userInfo);
							uni.reLaunch ({
								url:'../index/index'
							})
						}else{
							uni.showToast({title:"登录失败,"+res.data.message, icon:"none"});
						}
					},
					fail: () => {
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>
<style scoped>
page {
	background-color: #FFFFFF;
}
.bg{
	position: absolute;
		width: 100%;
		height: 100%;
		background-image: url('../../static/bg.jpg');
		background-position: center bottom;
		background-repeat: no-repeat;
		background-size: 100%;
		opacity: 0.33;
}
.login-title{
	padding:0upx 0upx 10upx 30upx;
	font-size: 50upx;
	background-color: #ffffff;
	color:#14547A;
}
.login-body{
	padding:30upx;
	background-color: #ffffff;
}
.input-title{
	padding:12upx 2upx 0 18upx;
}
.input-title .uni-icon{
	font-size:64upx;
	color:#14547A;
}
.uni-input{
	font-size:34upx;
}
.login-line{
	width: 100%;
	border-top: 1px solid #EBEBEB;
	margin:14upx 0upx;
}
.login-btn{
	padding:20upx 30upx;
}
.login-btn-block{
	background-color: #1C77AC;
	color:#ffffff;
}
.login-btn-block:active{
	background-color: #14547A;
}
.copy{
	text-align: center;
	color: #14547A;
	position:absolute;
	bottom: 40upx;
	width: 100%;
}
</style>
