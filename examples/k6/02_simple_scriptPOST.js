import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  let data = { myVariable: 'El performance de k6' };
  let res = http.post('http://localhost:1234/hello',data);
  console.log(res.body);
  sleep(1);
}