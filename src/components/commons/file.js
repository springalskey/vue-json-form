/**
 * canvas转文件
 * @param {Canvas} canvas canvas对象
 */
export async function canvasToFile(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(function (blob) {
      resolve(blob);
    });
  });
}

/**
 * 根据图片src获取图片宽高
 * @param {String}} src 图片src
 */
export function getImageSizeBySrc(src) {
  return new Promise((resolve, reject) => {
    let img = document.createElement('img');
    img.src = src;
    img.onload = function () {
      let size = {
        width: this.width,
        height: this.height
      };
      resolve(size);
    };
    img.onerror = function () {
      reject(new Error('load error'));
    };
  });
}

// 返回.png|.pm4
export function getFileExt(fileName) {
  let ext = fileName.substring(fileName.lastIndexOf('.'));
  return ext;
}
