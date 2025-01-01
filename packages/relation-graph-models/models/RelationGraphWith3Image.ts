import html2canvas from 'html2canvas';
import { devLog } from '../utils/RGCommon';
import { RGListeners, RGOptions } from '../types';
import { RelationGraphWith2Data } from './RelationGraphWith2Data';
export class RelationGraphWith3Image extends RelationGraphWith2Data {
  constructor(options: RGOptions, listeners: RGListeners) {
    super(options, listeners);
  }
  dataURLToBlob(dataurl:string) { // ie 图片转格式
    const arr = dataurl.split(',');
    const arrItem1 = arr[0];
    const mime = arrItem1 && arrItem1.match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  async createGraphCanvas(format = 'png') {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      const orign_zoom = this.options.canvasZoom;
      const orign_width = this.$canvasDom.clientWidth; // 获取dom 宽度
      const orign_height = this.$canvasDom.clientHeight; // 获取dom 高度
      const _origin_offset_x = this.options.canvasOffset.x;
      const _origin_offset_y = this.options.canvasOffset.y;
      this.options.checkedNodeId = '';
      this.options.canvasZoom = 100;
      const exportDom = this.$canvasDom;
      let _min_x = 999999;
      let _min_y = 999999;
      let _max_x = 0;
      let _max_y = 0;
      const _padding = 200;
      this.loading('Generating...')
      this.graphData.nodes.forEach(thisNode => {
        if (thisNode.x < _min_x) {
          _min_x = thisNode.x;
        }
        if (thisNode.x > _max_x) {
          _max_x = thisNode.x + thisNode.el.offsetWidth;
        }
        if (thisNode.y < _min_y) {
          _min_y = thisNode.y;
        }
        if (thisNode.y > _max_y) {
          _max_y = thisNode.y + thisNode.el.offsetHeight;
        }
      });
      const nodeOffsetX = (_min_x - _padding);
      const nodeOffsetY = (_min_y - _padding);
      this.graphData.nodes.forEach(thisNode => {
        thisNode.x = thisNode.x - nodeOffsetX;
        thisNode.y = thisNode.y - nodeOffsetY;
      });
      const canvasSlotList = this.$canvasDom.querySelectorAll('.rel-canvas-slot');
      canvasSlotList.forEach(canvasSlot => {
        const canvasSlotDiv = canvasSlot as HTMLDivElement;
        canvasSlotDiv.style.left = -nodeOffsetY + 'px';
        canvasSlotDiv.style.top = -nodeOffsetY + 'px';
      });
      this.updateElementLines();
      const elementLineSvgList = this.$canvasDom.querySelectorAll('.rel-lines-svg-el-lines');
      elementLineSvgList.forEach(canvasSlot => {
        const svgEl = canvasSlot as SVGElement;
        svgEl.style.width = '4000px';
        svgEl.style.height = '4000px';
      });
      this.options.canvasOffset.x = _padding * -1;
      this.options.canvasOffset.y = _padding * -1;
      // devLog('offset:', { _origin_offset_x, _origin_offset_y, _min_x, _min_y, _max_x, _max_y });

      const _image_width = _max_x - _min_x + 200 + _padding * 2;
      const _image_height = _max_y - _min_y + 100 + _padding * 2;
      const pixelRatio = window.devicePixelRatio; // 定义任意放大倍数 支持小数
      this.options.canvasSize.width = _image_width * pixelRatio;
      this.options.canvasSize.height = _image_height * pixelRatio;

      // const relationGraphPosition = {
      //   left: this.$dom.offsetLeft - exportDom.getBoundingClientRect().left,
      //   top: this.$dom.offsetTop - exportDom.getBoundingClientRect().top,
      //   canvas_offsetLeft: exportDom.offsetLeft,
      //   canvas_offsetTop: exportDom.offsetTop,
      //   canvas_left: exportDom.getBoundingClientRect().left,
      //   canvas_top: exportDom.getBoundingClientRect().top
      // };
      // exportDom.style.position ='absolute'
      // exportDom.style.left ='0px'
      // exportDom.style.top ='0px'
      // exportDom.style.zIndex ='999'
      window.scrollTo(0, 0);
      // devLog('export image:', { relationGraphPosition, orign_width, orign_height, _image_width, _image_height, _min_x, _min_y, _max_x, _max_y, devicePixelRatio: window.devicePixelRatio });
      const canvas = document.createElement('canvas'); // 创建一个canvas节点
      canvas.width = _image_width * pixelRatio; // 定义canvas 宽度 * 缩放
      canvas.height = _image_height * pixelRatio; // 定义canvas高度 *缩放
      canvas.style.backgroundColor = getComputedStyle(exportDom.parentElement!, null).backgroundColor;
      devLog('canvas.style.backgroundColor:', canvas.style.backgroundColor);
      canvas.style.width = `${_image_width * pixelRatio}px`;
      canvas.style.height = `${_image_height * pixelRatio}px`;
      canvas.getContext('2d')!.scale(1, 1); // 获取context,设置scale
      const opts = {
        backgroundColor: canvas.style.backgroundColor,
        scale: pixelRatio, // 添加的scale 参数
        canvas, // 自定义 canvas
        logging: true, // 日志开关，便于查看html2canvas的内部执行流程
        // windowWidth: _image_width,
        // windowHeight: _image_height,
        width: _image_width, // dom 原始宽度
        height: _image_height,
        // x: relationGraphPosition.left,
        // y: relationGraphPosition.top,
        useCORS: true // 【重要】开启跨域配置
      };
      this.dataUpdated();
      setTimeout(() => {
        this.createImage(exportDom, opts, format, '', (canvas:HTMLCanvasElement) => {
          this.options.canvasSize.width = orign_width;
          this.options.canvasSize.height = orign_height;
          this.options.canvasOffset.x = _origin_offset_x;
          this.options.canvasOffset.y = _origin_offset_y;
          this.options.canvasZoom = orign_zoom;
          const canvasSlotList = this.$canvasDom.querySelectorAll('.rel-canvas-slot');
          canvasSlotList.forEach(canvasSlot => {
            const canvasSlotDiv = canvasSlot as HTMLDivElement;
            canvasSlotDiv.style.left = '0px';
            canvasSlotDiv.style.top = '0px';
          });
          this.graphData.nodes.forEach(thisNode => {
            thisNode.x = thisNode.x + nodeOffsetX;
            thisNode.y = thisNode.y + nodeOffsetY;
          });
          const elementLineSvgList = this.$canvasDom.querySelectorAll('.rel-lines-svg-el-lines');
          elementLineSvgList.forEach(canvasSlot => {
            const svgEl = canvasSlot as SVGElement;
            svgEl.style.width = '1px';
            svgEl.style.height = '1px';
          });
          this.updateElementLines();
          this.clearLoading()
          this.dataUpdated();
          resolve(canvas);
        });
      }, 1000);
    });
  }
  createImage(
    exportDom:HTMLDivElement,
    opts:any,
    format:string,
    fileName:string,
    callback: (canvas:HTMLCanvasElement) => void
  ) {
    devLog('createImage:', opts);
    html2canvas(exportDom, opts).then((canvas) => {
      if (callback) callback(canvas);
    });
  }
  async getImageBase64(format = 'png') {
    const canvas = await this.createGraphCanvas(format);
    const dom = document.body.appendChild(canvas);
    dom.style.display = 'none';
    const base64 = dom.toDataURL(`image/${format}`);
    document.body.removeChild(dom);
    return base64;
  }
  async downloadAsImage(format = 'png', fileName?:string) {
    if (this.listeners.onImageDownload) {
      const contineToDownload = this.listeners.onImageDownload(this.$canvasDom, format);
      if (contineToDownload === false) {
        return;
      }
    }
    if (this.graphData.nodes.length === 0) {
      throw new Error('No nodes, no content to export!');
    }
    if (!fileName) fileName = this.options.downloadImageFileName;
    if (!fileName) fileName = `relation-graph-${(Math.random() * 100000).toFixed(0)}`;
    const canvas = await this.createGraphCanvas(format);
    devLog('downloadImageAsFile:', format, fileName);
    let downloadFlag = true;
    if (this.listeners.onImageSaveAsFile) {
      const stopFlag = this.listeners.onImageSaveAsFile(
        canvas,
        format,
        fileName
      );
      if (stopFlag === false) downloadFlag = false;
    }
    if (downloadFlag) {
      await this.downloadImageAsFile(canvas, format, fileName);
    }
  }
  async downloadImageAsFile(canvas:HTMLCanvasElement, format:string, fileName:string) {
    const dom = document.body.appendChild(canvas);
    // devLog('canvas:', fileName, dom)
    dom.style.display = 'none';
    const blob = this.dataURLToBlob(dom.toDataURL(`image/${format}`));
    document.body.removeChild(dom);
    const a = document.createElement('a');
    a.style.display = 'none';
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (window.navigator.msSaveOrOpenBlob) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, `${fileName}.${format}`);
      } else {
        a.setAttribute('href', URL.createObjectURL(blob));
        a.setAttribute('download', `${fileName}.${format}`);
        document.body.appendChild(a);
        // devLog('click to download:', opts)
        a.click();
        devLog('click ok!');
        URL.revokeObjectURL(await blob.text());
        devLog('revokeObjectURL ok!');
        document.body.removeChild(a);
        devLog('removeChild ok!');
      }
    } catch (e) {
      devLog('[SEEKS Graph]Create and download image error:', e);
    }
  }
}
