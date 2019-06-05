const TitlePrototype = function() {
  this.id = ''
  this.name = ''
  this.titleGroup_id = ''
  this.classInfo_id = ''
  this.weight = 1
}
const titleMap = {
  title: {
    code: '2000',
    message: 'OK, with Response',
    subjects: [
      {
        id: 1,
        name: '听力一',
        titleGroup_id: 1,
        weight: 10,
        classInfo_id: 1
      },
      {
        id: 2,
        name: '听力2',
        titleGroup_id: 1,
        weight: 10,
        classInfo_id: 1
      },
      {
        id: 3,
        name: '写作1',
        titleGroup_id: 2,
        weight: 10,
        classInfo_id: 1
      },
      {
        id: 4,
        name: '期末考试',
        titleGroup_id: 3,
        weight: 70,
        classInfo_id: 1
      },
      {
        id: 25,
        name: 'res',
        titleGroup_id: 3,
        weight: 0,
        classInfo_id: 1
      },
      {
        id: 27,
        name: 'ssss',
        titleGroup_id: 1,
        weight: 0,
        classInfo_id: 1
      },
      {
        id: 32,
        name: 'sss',
        titleGroup_id: 1,
        weight: 0,
        classInfo_id: 1
      },
      {
        id: 33,
        name: 'fff',
        titleGroup_id: 1,
        weight: 0,
        classInfo_id: 1
      },
      {
        id: 34,
        name: 'ssss',
        titleGroup_id: 1,
        weight: 0,
        classInfo_id: 1
      },
      {
        id: 66,
        name: 'esdv',
        titleGroup_id: 1,
        weight: 0,
        classInfo_id: 1
      }
    ],
    count: 10
  }
}

const titlegroupMap = {
  titlegroup: {
    code: '2000',
    message: 'OK, with Response',
    subjects: [
      {
        id: 1,
        name: '听力成绩',
        lesson_id: 1,
        weight: 20
      },
      {
        id: 2,
        name: '写作成绩',
        lesson_id: 1,
        weight: 30
      },
      {
        id: 3,
        name: '期末成绩',
        lesson_id: 1,
        weight: 50
      }
    ],
    'count': 3
  }
}
export default {
  title: config => {
    return titleMap.title
  },
  getTitlePrototype: () => {
    const newtitle = new TitlePrototype()
    return newtitle
  },
  group: config => {
    return titlegroupMap.titlegroup
  }
}
