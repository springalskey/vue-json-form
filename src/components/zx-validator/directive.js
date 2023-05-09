import is from '../commons/is';

// 防抖提交，在提交时置灰按钮
let refs = {};
let definition = {
  bind(el, binding, vnode) {
    vnode.componentInstance.$on('click', async (e) => {
      e.stopPropagation();
      el.disabled = true;
      let vid = el.getAttribute('vid');
      if (!vid) {
        console.error('提交按钮vid属性必填');
        return;
      }
      // 一个组件中（或一个页面中）vid不能重复
      let validatorEl = vnode.context.$el.querySelector(
        `div[vid="${vid}"]`
      );
      let valided = await validAll(validatorEl);
      let formInstance = [refs[validatorEl.dataset.uuid]];
      let { form, list } = formInstance[0];
      let formData = JSON.parse(JSON.stringify(form));
      getFormData(formData, list);
      let onSave = binding.value;
      let promise = onSave.call(vnode.context, valided, {
        formInstance,
        formData
      });
      if (promise instanceof Promise) {
        promise.finally(() => {
          el.disabled = false;
        });
      } else {
        console.error('v-onsubmit指令必须返回Promise');
      }
    });
  }
};

/**
 * 获取formData，当formList配置中_vif=false时设删除字段属性，避免提交不需要的数据
 * @param {Object} formData
 * @param {Array} formList
 */
function getFormData(formData, formList = []) {
  for (let config of formList) {
    // key不为空代表有重复的field
    if (config.field && config.field.includes('.')) {
      delete formData[config.field];
      if (!config.key && !config._vif) {
        let arr = config.field.split('.');
        delete formData[arr[0]][arr[1]];
      }
    } else if (!config.key && !config._vif && config.field) {
      delete formData[config.field];
    }
    let list = config.list || config.formList;
    if (!is.empty(list)) {
      let data = config.deepData ? formData[config.field] : formData;
      if (!data || !is.object(data)) {
        break;
      }
      if (config._vif) {
        getFormData(data, list);
      } else {
        for (let item of list) {
          delete data[item.field];
          if (item.list || item.formList) {
            getFormData(data, item.list || item.formList);
          }
        }
      }
    }
  }
  // 删除空数据
  for (let p in formData) {
    if (is.empty(formData[p])) {
      delete formData[p];
    }
  }
}

/**
 * 调用表单校验，会遍历所有的form进行验证，并返回校验是否通过。
 * 假设有一个表单里面嵌套一个表单（嵌套表单）
 * 只要某个表单中的任意一个字段值校验不通过，就返回false；当两个表单中所有字段校验通过才返回true。
 * @param {Dom} validatorEl
 */
export async function validAll(validatorEl) {
  let components = [refs[validatorEl.dataset.uuid]];
  // 查询当前下面所有validator
  let nodeList = [...validatorEl.querySelectorAll('.form-validator')];
  if (!is.empty(nodeList)) {
    nodeList.forEach(node => {
      let uuid = node.dataset.uuid;
      components.push(refs[uuid]);
    });
  }
  components = components.reverse();
  let valided = true;
  for (let item of components.entries()) {
    let component = item[1];
    let bool = await component.valid();
    if (!bool) {
      valided = false;
    }
  }
  return valided;
}

export { refs, definition };
