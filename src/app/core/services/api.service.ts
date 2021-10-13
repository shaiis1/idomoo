import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpMethodType } from '../models/enums/general.enums';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl:string
  authorization =
    'Basic ' +
    btoa('3550:PiKQ1xfuKC22c1c5c0061af12a240e092d93ec6a47gmckwQGhp6');
  accept = 'application/json';

  constructor(private http: HttpClient,private router:Router) { 
    this.apiUrl = "https://usa-api.idomoo.com/api/v2";
  }

  getStoryBoard(){
    var apiUrl = this.apiUrl+'/storyboards/31193';
    return this.sendApiRequest(HttpMethodType.GET,null,apiUrl);
  }

  getVideoStatus(url: string){
    var apiUrl = url;
    return this.sendApiRequest(HttpMethodType.GET, null, apiUrl);
  }

  postMessage(data: any){
    var apiUrl = this.apiUrl + '/storyboards/generate';
    return this.sendApiRequest(HttpMethodType.POST, data, apiUrl);
  }

  sendApiRequest(method:HttpMethodType,data:any, serverUrl:string):Observable<any>
    {
      if(method==HttpMethodType.GET)
      {
        return this.http.get(serverUrl,{headers :{
          Authorization: this.authorization,
          Accept: this.accept
        }}).pipe(
          map(data => {
            return data;
          }),  (catchError(this.handleError))
        )}
      else
      {
          return this.http.post(serverUrl,data, {headers :{
            Authorization: this.authorization,
            Accept: this.accept
          }}).pipe(
            map((data:any)=> {
              return data;
            }), (catchError(this.handleError))
          )

      }
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
     
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
          console.error("Error Event");
      } else {
          console.log(`error status : ${error.status} ${error.statusText}`);
            this.router.navigateByUrl("/error");
          }
       
  } else {
      console.error("some thing else happened");
  }
  return throwError(error);
  };
}
