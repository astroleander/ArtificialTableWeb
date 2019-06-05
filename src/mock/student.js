const stuMap = {
  stu: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, sid: '20180001', name: 'ruan1', year: '2018', major_id: 1, passed: 0 },
      { id: 2, sid: '20180002', name: 'ruan2', year: '2018', major_id: 1, passed: 0 },
      { id: 3, sid: '20180003', name: 'ruan3', year: '2018', major_id: 1, passed: 1 },
      { id: 4, sid: '20180004', name: 'ruan4', year: '2018', major_id: 1, passed: 0 },
      { id: 5, sid: '20180011', name: 'wang1', year: '2018', major_id: 2, passed: 1 },
      { id: 6, sid: '20180012', name: 'wang2', year: '2018', major_id: 2, passed: 0 },
      { id: 7, sid: '20180013', name: 'wang3', year: '2018', major_id: 2, passed: 1 },
      { id: 8, sid: '20180021', name: 'hei1', year: '2018', major_id: 3, passed: 0 },
      { id: 9, sid: '20180022', name: 'hei2', year: '2018', major_id: 3, passed: 0 },
      { id: 10, sid: '20180023', name: 'hei3', year: '2018', major_id: 3, passed: 1 },
      { id: 11, sid: '20180031', name: 'ying1', year: '2018', major_id: 4, passed: 0 },
      { id: 12, sid: '20180032', name: 'ying2', year: '2018', major_id: 4, passed: 0 },
      { id: 13, sid: '20180033', name: 'ying3', year: '2018', major_id: 4, passed: 0 },
      { id: 14, sid: '20180041', name: 'xi1', year: '2018', major_id: 5, passed: 1 },
      { id: 15, sid: '20180042', name: 'xi2', year: '2018', major_id: 5, passed: 0 },
      { id: 16, sid: '20180043', name: 'xi3', year: '2018', major_id: 5, passed: 0 },
      { id: 17, sid: '20180044', name: 'xi4', year: '2018', major_id: 5, passed: 1 },
      { id: 18, sid: '20180045', name: 'xi5', year: '2018', major_id: 5, passed: 0 },
      { id: 19, sid: '20180051', name: 'fa1', year: '2018', major_id: 6, passed: 0 },
      { id: 20, sid: '20180052', name: 'fa2', year: '2018', major_id: 6, passed: 1 }
    ],
    count: 20
  }
}
export default {
  info: config => {
    return stuMap.stu
  }
}
