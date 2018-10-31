import Mock from 'mockjs'
import urls from '@/urls'

import loginMock from './login'
import userMock from './user'

Mock.mock(urls.login, 'post', loginMock.login)
Mock.mock(urls.logout, 'post', loginMock.logout)
Mock.mock(urls.info, 'get', userMock.info)
