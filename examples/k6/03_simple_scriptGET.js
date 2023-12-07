import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  let res = http.get('http://localhost:1234/hello?myVariable=QueOnda');
  console.log(res.body);
  sleep(1);
}