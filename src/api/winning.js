import request from '@/utils/request'

export function getAllWinning() {
  return request({
    url: '/sys/winning/getAll',
    method: 'get'
  })
}

export function addWinning(data) {
  return request({
    url: '/sys/winning/add',
    method: 'post',
    params: data
  })
}

export function deleteWinning(id) {
  return request({
    url: 'sys/winning/delete',
    method: 'post',
    params: id
  })
}

export function updateWinning(data) {
  return request({
    url: 'sys/winning/update',
    method: 'post',
    params: data
  })
}

export function uploadWinningImage(data) {
  return request({
    url: '/upload/image/winning',
    method: 'post',
    params: data
  })
}
