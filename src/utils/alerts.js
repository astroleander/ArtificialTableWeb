export const CLIP_BOARD_ALERT = {
  id: '021312312dsadas',
  title: '请使用 「Ctrl+V」 进行粘贴',
  description: '出于安全因素的考虑，现代浏览器不允许网页自动从您的剪切板中获取数据。'
}

export const REQUIRE_STUDENT_COLUMN = {
  id: 'fasfasfa1',
  title: '您可能缺少学号列',
  description: ''
}

export const REQUIRE_STUDENT_COLUMN_LEFT = {
  id: '2asfasfasdasdqwrfvxzbdhth',
  title: '您的最左侧的列不是最长的列, 您的最左列不是学号吗?',
  description: '您的拥有最大行数的列未放置在最左侧, 这不会导致系统导入的问题, 但是您最好确认所有学生的学号已经导入'
}

export const DUPLICATE_SID = {
  id: '114154',
  title: '系统检测到多个学号列, 请删除多余的学号列后再进行下一步。',
  type: 'error'
}

export const REQUIRED_SID = {
  id: 'AEDVHF',
  title: '系统没有检测到学号列, 请添加学号列后再进行下一步。',
  // description: '',
  type: 'error'
}


export const REQUIRED_AT_LEAST_A_TITLE = {
  id: 'AFIAFHJAIOD',
  title: '您需要至少设置一个导入的项。',
  type: 'error'
}

export const REQUIRED_TITLEGROUP = {
  id: 'DJAIOPHDAIODHA',
  title: '您尚有未分类的小项, 点击列头的「类别」框来为小项选择一个类别。',
  type: 'error'
}

export const REQUIRED_TITLE = {
  id: 'FHAOIFOI',
  title: '您尚有未命名的小项。点击列头的「列名」框来为小项输入一个名字。',
  type: 'error'
}

export const NO_TITLE_GROUP = {
  id: 'fIOSHFoiahsf',
  title: '需要添加分数类别 (大项)',
  description: '您当前选择的课程无分数组大项信息，将无法完成导入流程，请到左侧 「权重调整」 页面中添加大项, 若您是教师, 请联系管理员',
  type: 'error'
}
