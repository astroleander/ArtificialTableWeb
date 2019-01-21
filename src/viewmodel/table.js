import Title from './title'
import Point from './point'
import Student from './student'

export default {
  requestTitles: Title.requestTitles,
  requestPoints: Point.requestPoints,
  requestStudents: Student.requestStudents,
  modifyPoints: Point.requestPutPoints,
  modifyPoint: Point.requestPutPoint,
  addPoint: Point.requestPostPoint,
  addPoints: Point.requestPostPoints,
  deletePoint: Point.requestDelPoint,
  deleteTitle: Title.requestDelTitle
}
