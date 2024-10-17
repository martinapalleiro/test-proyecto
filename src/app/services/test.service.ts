import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { celulares } from '../models/celulares';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private url="https://api.restful-api.dev/objects"
  
  constructor(private http: HttpClient) { }

  getAll(): Observable<any>{
    return this.http.get(this.url)//promesa

  }
  add(celulares: celulares): Observable<any>{
    return this.http.post(this.url, celulares)
  }
  
  delete(id: string): Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }
  
  update(celulares: celulares): Observable<any>{
    return this.http.put(this.url, celulares)
  }
  
}
