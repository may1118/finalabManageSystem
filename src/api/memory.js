import request from '@/utils/request'
import qs from 'qs'

function getAllPicInfo(params) {
  return request({
    url: '/sys/memory/getAll',
    method: 'get',
  })
}

function deletePicInfo(ids) {
  return request({
    url: '/sys/memory/delete',
    method: 'post',
    data: qs.stringify({ ids: ids }, { indices: false })
  })
}


export { getAllPicInfo,deletePicInfo };
