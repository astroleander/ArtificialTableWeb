import Mock from 'mockjs'
import urls from '@/urls'

import loginMock from './login'

Mock.mock(urls.login, 'post', loginMock.login)
// Mock.mock(urls.logout, 'get', loginMock.logout)
