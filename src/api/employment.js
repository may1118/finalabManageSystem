import request from '@/utils/request'
import qs from 'qs'


function getAllEmploymentInfo(data) {
  return request({
    url: '/sys/achieve/get',
    method: 'post',
    data:data
  })
}
function addMemory(data) {
  return request({
    url: '/sys/achieve/add',
    method: 'post',
    data: qs.stringify({
      stuId: data.stuId,
      whereabouts: data.whereabouts,
      catchphrase: data.catchphrase
    }, { indices: false })
  })
}
function modifyMemory(data) {
  return request({
    url: '/sys/achieve/alter',
    method: 'post',
    data: qs.stringify(data, { indices: false })
  })
}

function deleteMemory(data) {
  return request({
    url: '/sys/achieve/delete',
    method: 'post',
    data: qs.stringify({ ids: data }, { indices: false })
  })
}
export { getAllEmploymentInfo,modifyMemory,addMemory,deleteMemory }
