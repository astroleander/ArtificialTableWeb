import Title from './title'
import Point from './point'
import Student from './student'

export default {
  requestTitles: Title.requestTitles,
  requestPoints: Point.requestPoints,
  requestStudents: Student.requestStudents,
  addPoints: Point.requestPutPoints,
  addPoint: Point.requestPutPoint,
  modifyPoint: Point.requestPostPoint,
  modifyPoints: Point.requestPostPoints
}
