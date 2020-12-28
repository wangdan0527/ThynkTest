import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee'

const CREATE_EMPLOYEE = 'Create';
const LIST_EMPLOYEE = 'List';
const DELTE_EMPLOYEE = 'Delete';
const EDIT_EMPLOYEE = 'Edit';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  createEmployee(Name: string, Title: string, Blog: string, ProfileImage: string, Motto: string, Hobbies: string, Hometown: string): Observable<any> {
    const formData = new FormData();
    formData.append('Name', Name);
    formData.append('Title', Title);
    formData.append('Blog', Blog);
    formData.append('ProfileImage', ProfileImage);
    formData.append('Motto', Motto);
    formData.append('Hobbies', Hobbies);
    formData.append('Hometown', Hometown);
    return this.http.post(environment.API_ENDPOINT + CREATE_EMPLOYEE, formData, { responseType: 'text' });
  }

  editEmployee(Id: string, Name: string, Title: string, Blog: string, ProfileImage: string, Motto: string, Hobbies: string, Hometown: string): Observable<any> {
    const formData = new FormData();
    formData.append('Name', Name);
    formData.append('Title', Title);
    formData.append('Blog', Blog);
    formData.append('ProfileImage', ProfileImage);
    formData.append('Motto', Motto);
    formData.append('Hobbies', Hobbies);
    formData.append('Hometown', Hometown);
    return this.http.post(environment.API_ENDPOINT + EDIT_EMPLOYEE + "/" + Id, formData, { responseType: 'text' });
  }

  getEmployees(): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + LIST_EMPLOYEE).pipe(
      map((data: any) => {
        return data.map((item: any) => new Employee(
          item.Id,
          item.Name,
          item.Title,
          item.ProfileImage,
          item.Motto,
          item.Hobbies,
          item.Hometown,
          item.Blog,
        )
      )})
    );
  }

  deleteEmployee(Id: string): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + DELTE_EMPLOYEE + '/' + Id);
  }
}
