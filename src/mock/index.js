import Mock from 'mockjs'
import urls from '@/urls'

import loginMock from './login'

console.log(urls.login)
Mock.mock(urls.login, 'post', loginMock.login)
