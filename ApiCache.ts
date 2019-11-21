import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ApiCache<DataType> {
   payload: ReplaySubject<DataType>; 
   apiEndpoint: string;

   ok: boolean = false;
   requested: boolean = false;
   retrieved: boolean = false;

   constructor(apiEndpoint: string, public httpClient: HttpClient) {
       this.apiEndpoint = apiEndpoint;
       this.payload = new ReplaySubject<DataType>(1);
   }

   getData(): ReplaySubject<DataType> {
       if(this.ok === false) {
        //TODO: if any errors have ocurred, we need to create a new payload stream
       }
       //if the resource has not been requested yet, request it.
       if(!this.requested) {
           this.httpClient.get<DataType>(this.apiEndpoint)
           .subscribe((response: DataType) => {
               this.retrieved = true; //the resource has been successfully retrieved
               this.payload.next(response);
           },
           error => {
               //TODO: handle this error better
               console.error(error);
               this.ok = false;
           })
           this.requested = true; //we have made the request
       }
       return this.payload;
   }
}