'use strict';

import axios from 'axios';

const ajaxCheck = function (name, value) {
    return axios.post('/api/registCheck', {name, value})
                .then(({data: {res}}) => {
                    switch (res) {
                        case 'ok':
                            return true;
                        case 'existed':
                            return false;
                        case 'error':
                            throw new Error('invalid data!');
                    }
                });
};

export default function (vm) {
    return {
        id: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {
                trigger: 'blur',
                validator (rule, value, callback)  {
                    if (value.length < 6 || value.length > 18) {
                        callback(new Error('用户名长度应在6~18之间'));
                        return;
                    }
                    if (!(value[0] >= 'a' && value[0] <= 'z' || value[0] >= 'A' && value[0] <= 'Z')) {
                        callback(new Error('用户名必须以英文字母开头'));
                        return;
                    }
                    if (!value.match(/^[a-zA-Z0-9_]{6,18}$/)) {
                        callback(new Error('用户名只能包含英文字母、数字与下划线'));
                        return;
                    }
                    ajaxCheck('id', value)
                        .then(res => {
                            if (res) callback();
                            else callback(new Error('用户名已存在'));
                        })
                        .catch(err => callback(new Error('数据错误')));
                }
            }
        ],
        pw: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {
                trigger: 'blur',
                validator (rule, value, callback)  {
                    if (value.length < 6 || value.length > 12) {
                        callback(new Error('密码长度应在6~12之间'));
                        return;
                    }
                    if (!value.match(/^[0-9A-Za-z-_]{6,12}$/)) {
                        callback(new Error('密码含有非法字符'));
                        return;
                    }
                    callback();
                }
            }
        ],
        checkpw: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {
                trigger: 'blur',
                validator(rule, value, callback){
                    if (vm.form.pw !== value) {
                        callback(new Error('两次输入密码不一致'));
                    } else {
                        callback();
                    }
                }
            }
        ],
        name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {
                trigger: 'blur',
                validator (rule, value, callback)  {
                    if (value.length < 6 || value.length > 18) {
                        callback(new Error('用户名长度应在6~18之间'));
                        return;
                    }
                    if (!(value[0] >= 'a' && value[0] <= 'z' || value[0] >= 'A' && value[0] <= 'Z')) {
                        callback(new Error('用户名必须以英文字母开头'));
                        return;
                    }
                    if (!value.match(/^[a-zA-Z0-9_]{6,18}$/)) {
                        callback(new Error('用户名只能包含英文字母、数字与下划线'));
                        return;
                    }
                    ajaxCheck('id', value)
                        .then(res => {
                            if (res) callback();
                            else callback(new Error('用户名已存在'));
                        })
                        .catch(err => callback(new Error('数据错误')));
                }
            }
        ],
        mail: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        phone: []
    };
};