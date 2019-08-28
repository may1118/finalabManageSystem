import request from '@/utils/request'
import qs from 'qs'

function getAllMemberInfo(params) {
  return request({
    url: '/sys/member/get',
    method: 'get',
    params: params
  })
}

function modifyMemberInfo(data) {
  return request({
    url: '/sys/member/update',
    method: 'post',
    data: qs.stringify(data, { indices: false })
  })
}

function deleteMemberInfo(ids) {
  return request({
    url: '/sys/member/delete',
    method: 'post',
    data: qs.stringify({ ids: ids }, { indices: false })
  })
}

function fileAddMemberInfo(data) {
  let promise = new Promise(((resolve, reject) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if(xmlHttp.readyState === 4){
        if(xmlHttp.state === 200){
          resolve(xmlHttp.response);
        }else{
          reject(xmlHttp.response);
        }
      }
    }
    xmlHttp.open('POST','http://getAllEmploymentInfo175.68.103:8083/sys/member/fileAdd');
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    console.log(data)
    xmlHttp.send(data);
  }))
  return promise;
}

function departmentInfo() {
  return request({
    url: '/sys/info/department',
    method: 'get',
  })
}
function collegeInfo() {
  return request({
    url: '/sys/info/college',
    method: 'get',
  })
}
function levelInfo() {
  return request({
    url: '/sys/info/level',
    method: 'get',
  })
}
export {getAllMemberInfo,modifyMemberInfo,deleteMemberInfo,departmentInfo,collegeInfo,levelInfo,fileAddMemberInfo };
