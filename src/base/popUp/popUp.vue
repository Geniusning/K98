<template>
	<div class="bg" v-show="show">
		<div class="popUp-wrapper" :style="{width:width+'%',height:height+'rem',top:top+'%'}" v-if="showPopUp">
			<img v-show="showCloseBtn" @click="close" class="close" src="../../assets/image/close-round.png" alt="">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showPopUp: false
			}
		},
		props: {
			showCloseBtn:{
				type:Boolean,
				default:true
			},
			show: {
				type: Boolean,
				default: true
			},
			widh:{
				type:Number,
				default:100,
			},
			height:{
				type:Number,
				default:10
			},
			top:{
				type:Number,
				default:10
			}
		},
		methods: {
			close() {
				this.showPopUp = false
				this.$emit("close", false)
			},
		},
		watch: {
			show: function(newValue) {
				console.log("popUp---",newValue)
				this.showPopUp = newValue
			}
		}
	}
</script>

<style lang="less" scoped>
.bg{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, .2);
	z-index: 3;
	.popUp-wrapper {
		width: 100%;
		height: 10rem;
		position: absolute;
		top: 10%; // left: 50%;
		// margin-left: -4.5rem;
		z-index: 92;
		background-color: #fff;
		color: #333;
		border: 1px solid #ccc;
		box-shadow: darkgrey 10px 10px 30px 5px;
		border-radius: 6px;
		font-weight: 900;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		.close {
			position: absolute;
			top: 0rem;
			right: .3rem;
			margin-left: -0.5333rem;
			width: 1.0667rem;
			height: 1.0667rem;
		}
	}
}
</style>


