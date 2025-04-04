import {version} from '../constants';
import * as screenfull from 'screenfull';
import * as html2canvas from 'html2canvas';

export const getScreenWidth = () => {
  return window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
};
export const getScreenHeight = () => {
  return window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
};
export const getColorId = (color:string) => {
  color = color.replace('#', '');
  color = color.replace('(', '');
  color = color.replace(')', '');
  color = color.replace(/,/g, '-');
  return color;
};
export const getLightColor = (col:string) => {
  if (col[0] === '#') {
    let _s = col.slice(1);
    if (_s.length === 3) {
      _s = _s[0] + _s[0] + _s[1] + _s[1] + _s[2] + _s[2];
    }
    const _rgb_arr = [
      Number.parseInt(`${_s[0]}${_s[1]}`, 16),
      Number.parseInt(`${_s[2]}${_s[3]}`, 16),
      Number.parseInt(`${_s[4]}${_s[5]}`, 16)
    ];
    devLog('getLightColor1:', col, ':', _rgb_arr.join(','));
    col = `rgb(${_rgb_arr.join(',')})`;
  }
  let _st = col.slice(Math.max(0, col.indexOf('(') + 1));
  _st = _st.slice(0, Math.max(0, _st.indexOf(')')));
  const _rgb_string = _st.split(',');
  if (_rgb_string.length >= 3) {
    const _rgb_number = [
      Math.round(Number.parseInt(_rgb_string[0]) * 0.9),
      Math.round(Number.parseInt(_rgb_string[1]) * 0.9),
      Math.round(Number.parseInt(_rgb_string[2]) * 0.9)
    ];
    devLog('getLightColor2:', col, ':', _rgb_number.join(','));
    return `rgb(${_rgb_number.join(',')}, 0.3)`;
  } else {
    return col;
  }
};
export const getTextSize = (text:string) => {
  let width = 0;
  for (const _thisChar of text) {
    const _charCode = _thisChar.charCodeAt(0);
    if (_charCode < 0 || _charCode > 255) {
      width += 2;
    } else {
      width++;
    }
  }
  return width;
};

export const mergeRGObject = (oldObj:Record<string, any>, newObj:Record<string, any>) => {
  Object.keys(newObj).forEach(key => {
    oldObj[key] = newObj[key];
  });
  return oldObj;
};

export const isSupportTouch = (e:MouseEvent|TouchEvent) => {
  // console.log('e:', e instanceof PointerEvent, e instanceof MouseEvent, e instanceof TouchEvent);
  // console.log('e:', e);
  // e.type.startsWith('touch')
  try {
    // if ('pointerId' in e && e.pointerId) return true;
    if ('touches' in e && e.touches) return true;
    if ('targetTouches' in e && e.targetTouches) return true;
  } catch (error:any) {
    // devLog('touch event error:', error.message, e);
  }
  return false;
};
export const getClientCoordinate = (e:MouseEvent|TouchEvent) => {
  if (isSupportTouch(e)) {
    return {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY
    };
  } else {
    return {
      clientX: e.clientX,
      clientY: e.clientY
    };
  }
};

export const devLog = (...args:any[]) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if ((typeof window !== 'undefined' && window.relationGraphDebug))console.log('[relation-graph:debug]', ...args);
};
export const deprecatedWaring = (...args:any[]) => {
  console.warn('[relation-graph]', ...args);
};
export const findParentByClassName = (el:HTMLElement|null, clasName:string, stopClass:string):HTMLElement|null => {
  if (!el) {
    return null;
  }
  if (el.classList.contains(clasName)) {
    return el;
  }
  if (el.classList.contains(stopClass)) {
    return null;
  }
  return findParentByClassName(el.parentElement, clasName, stopClass);
};
export const sleep = async(time:number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
export const getNumberOption = (v:any) => {
  if (typeof v === 'string') {
    return Number.parseInt(v);
  } else if (typeof v === 'number') {
    return v;
  } else {
    return v;
  }
};
const getPrintFcuntionName = () => {
  const _lnc1 = 'l';
  const _lnc2 = 'o';
  const _lnc3 = 'g';
  const time = new Date().getFullYear();
  const _lnc = [];
  if (time > 1) {
    _lnc.push(_lnc1);
  }
  if (time > 201) {
    _lnc.push(_lnc2);
  }
  if (time > 1113) {
    _lnc.push(_lnc3);
  }
  return _lnc.join('');
};
const getPrintObject = () => {
  const _lnc1 = 'c';
  const _lnc2 = 'o';
  const _lnc3 = 'n';
  const _lnc4 = 's';
  const _lnc5 = 'o';
  const _lnc6 = 'l';
  const _lnc7 = 'e';
  const time = new Date().getFullYear();
  const _lnc = [];
  if (time > 1) {
    _lnc.push(_lnc1);
  }
  if (time > 21) {
    _lnc.push(_lnc2);
  }
  if (time > 35) {
    _lnc.push(_lnc3);
  }
  if (time > 55) {
    _lnc.push(_lnc4);
  }
  if (time > 189) {
    _lnc.push(_lnc5);
  }
  if (time > 231) {
    _lnc.push(_lnc6);
  }
  if (time > 1234) {
    _lnc.push(_lnc7);
  }
  return _lnc.join('');
};
const getPrintDecodeText = (encodeText:string) => {
  return encodeText.replace(/-/g, '').replace(/\*/g, '-');
};
/**
 * 注意：
 *    根据MIT许可证的规定，允许您自由地使用、修改和分发源代码。您可以根据自己的需求对源代码进行更改。
 *    然而，您仍然需要遵守MIT许可证的其他规定，如保留版权声明和免责声明等
 *    relation-graph和relation-graph的网址是它的版权声明，请勿注释掉这一行信息
 * @param platform
 */
export const relationGraphVersionInfo = (platform?:string) => {
  const printObj = getPrintObject();
  const printFun = getPrintFcuntionName();
  const rgName = 'r-e-l-a-t-i-o-n*g-r-a-p-h';
  const rgSite = 'h-t-t-p-s-:-/-/-g-i-t-h-u-b-.-c-o-m-/-s-e-e-k-s-d-r-e-a-m-/-r-e-l-a-t-i-o-n-*-g-r-a-p-h';
  window && window[printObj] && window[printObj][printFun](
    `%c ${getPrintDecodeText(rgName)} %c Version v${version}(${platform}) %c More info: ${getPrintDecodeText(rgSite)} %c`,
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:#fff ; padding: 1px; border-radius: 0 3px 3px 0;  color: #41b883',
    'background:transparent'
  );
  if (!screenfull) {
    console.error(
      '[relation-graph]Please introduce component screenfull, for example:https://cdnjs.cloudflare.com/ajax/libs/screenfull.js/5.1.0/screenfull.min.js'
    );
  }
  if (!html2canvas) {
    console.error(
      '[relation-graph]Please introduce component html2canvas, for example:https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
    );
  }
};
