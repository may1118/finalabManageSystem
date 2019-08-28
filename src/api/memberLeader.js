import request from '@/utils/request'

function getAllMemberInfo(params) {
  return request({
    url: '/sys/member/getCouncil',
    method: 'get',
    params: params
  })
}

export { getAllMemberInfo };
