import Mock from 'mockjs'

import loginMock from './login'
import userMock from './user'

Mock.mock(/\/user\/login/, 'post', loginMock.login)
Mock.mock(/\/user\/logout/, 'post', loginMock.logout)
Mock.mock(/\/user\/info\/format/, 'get', userMock.info)
