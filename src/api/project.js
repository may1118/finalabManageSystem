import request from '@/utils/request'

export function getAllProjects() {
  return request({
    url: '/sys/project/getAll',
    method: 'get'
  })
}

export function getProjectDetail(id) {
  return request({
    url: '/sys/project/detail',
    method: 'get',
    params: id
  })
}

export function addProject(data) {
  return request({
    url: '/sys/project/add',
    method: 'post',
    params: data
  })
}

export function deleteProject(id) {
  return request({
    url: '/sys/project/delete',
    method: 'post',
    params: id
  })
}

export function updateProject(data) {
  return request({
    url: '/sys/project/update',
    method: 'post',
    params: data
  })
}

