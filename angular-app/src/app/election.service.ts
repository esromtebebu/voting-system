import { Injectable } from '@angular/core';
import { Election } from './election';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  url = 'http://localhost:5000/api/elections';
  elections : Election[] = [];

  constructor(private http: HttpClient) { }

  getAllElections(): Observable<Election[]> {
    const data = this.http.get<Election[]>(`${this.url}/getAll`);
    console.log(data);
    return data;
  }
}
