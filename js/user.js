//用户登录和注册表单验证的通用代码
class fieldValidator {
  /**
   *构造器
   * @param {String} txtId 文本框Id
   * @param {Function} validatorFn 验证规则函数
   */
  constructor(txtId, validatorFn) {
    this.input = $(`#${txtId}`);
    this.p = this.input.nextElementSibling;
    this.validatorFn = validatorFn;
    this.input.onblur = () => {
      this.validate();
    };
  }

  async validate() {
    const err = await this.validatorFn(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 对传入的所有验证器进行统一验证，
   * @param  {fieldValidator[]} validators
   * @returns boolean
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const results = await Promise.all(proms);
    return results.every((r) => r);
  }
}
