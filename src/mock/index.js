// /*
import Mock from 'mockjs'

import collegeMock from './college'
import courseMock from './course'
import lessonMock from './lesson'
import loginMock from './login'
import majorMock from './major'
import pointMock from './point'
import studentMock from './student'
import titleMock from './title'
import universityMock from './university'
import userMock from './user'
// */

// /*

Mock.mock(/\/college\/format/, 'get', collegeMock.info)
// course mock
Mock.mock(/\/table\/class_field\/format/, 'get', courseMock.classField)
Mock.mock(/\/table\/class_info\/format/, 'get', courseMock.classInfo)
// lesson mock
Mock.mock(/\/lesson\/format/, 'get', lessonMock.info)
// login mock
Mock.mock(/\/user\/login/, 'post', loginMock.login)
Mock.mock(/\/user\/logout/, 'post', loginMock.logout)
// format mock
Mock.mock(/\/major\/format/, 'get', majorMock.info)
// point mock
Mock.mock(/\/point\/format/, 'get', pointMock.info)
// student mock
Mock.mock(/\/student\/format/, 'get', studentMock.info)
Mock.mock(/\/student\/display/, 'get', studentMock.info)
// title mock
Mock.mock(/\/title\/format/, 'get', titleMock.title)
Mock.mock(/\/titleGroup\/format/, 'get', titleMock.group)
// university mock
Mock.mock(/\/university\/format/, 'get', universityMock.info)
// user mock
Mock.mock(/\/user\/info\/format/, 'get', userMock.info)
// /*/
