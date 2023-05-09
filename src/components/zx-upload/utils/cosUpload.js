class CosUpload {
  async uploadFile(options) {
    // 上传文件
    if (window.uploadFile) {
      let result = await window.uploadFile(options);
      return result;
    }
    return {
      // 上传后的URL
      path: 'https://esys-1254463895.cos.ap-shanghai.myqcloud.com/biz/2023/04/27/6993ad27447d02285c4b800ade982ec1.jpeg',
      // 如果是视频返回封面
      poster: ''
    };
  }
}

export default new CosUpload();
