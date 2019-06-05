/**
 * DONE: To Deprecate
 * 0 : student
 * 1 : teacher
 * 2 : manager
 *
 * Map Group Code -> Group Name
 *
 * @param group_code enum code which save in backend
 * @returns group_name
 */
export function mapGroupName(group_code) {
  switch (group_code) {
    case 0:
      return 'student'
    case 1:
      return 'teacher'
    default:
      return 'student'
  }
}

/**
 * Map Group Name -> Group Code
 *
 * @param group_name
 * @returns group_code
 */
export function mapGroupCode(group_name) {
  switch (group_name) {
    case 'student':
      return 0
    case 'teacher':
      return 1
    default:
      return 0
  }
}

/**
 * @param type_code
 *   1. (plural) attendence
 *   2. (plural) assignments
 *   3. (plural) class performance
 *   4. (plural) external addons
 *   5. (singular) middle exam
 *   6. (singular) final exam
 *
 */
export function mapPointTypeName(type_code) {
  switch (type_code) {
    case 1:
      return '签到'
    case 2:
      return '作业'
    case 3:
      return '平时表现'
    case 4:
      return '额外加分'
    case 5:
      return '期中考试'
    case 6:
      return '期末考试'
    default:
      return '未定义'
  }
}
