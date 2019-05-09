
export default {
    info:function(){ 
			let  publicUrl={	// 测试环境
				linkUrl: "http://47.99.198.9:8888/",    //测试接口
				loginUrl:'http://47.110.226.195/#/', 
				materTestUrl: 'http://116.62.68.173:8080/', // 素材公网测试
			}

			// let  publicUrl={	// 预发布
			// 		linkUrl: "http://47.111.98.235:8080/",    //测试接口
			// 		loginUrl:'http://47.111.98.235/#/',       //登录页
			// 		materTestUrl: 'http://120.55.57.224:5000/', // 素材
			// 	}


			// let  publicUrl={	//生产环境1
			// 		linkUrl: "http://47.110.234.49:8888/",    //正式接口
			// 		loginUrl:'http://47.110.234.49/#/',       //登录页
			// 		materTestUrl: 'http://47.110.233.8:5000/', // 素材公网正式
			// }

			// let  publicUrl={	// 正式2
			// 	linkUrl: "http://47.244.13.47:8888/",    //测试接口
			// 	loginUrl:'http://47.75.244.219/#/', 
			// 	materTestUrl: 'http://47.75.242.133:5000/', // 素材公网测试
			// }


			// let  publicUrl={	// 正式3
			// 	linkUrl: "http://47.111.97.243:8888/",    //测试接口
			// 	loginUrl:'http://47.111.100.152/#/', 
			// 	materTestUrl: 'http://47.111.103.241:5000/', // 素材公网测试
			// }

			return publicUrl
		}
}