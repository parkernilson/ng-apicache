import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Api Cache is an object responsible for requesting a payload from an API endpoint,
 * then caching it, so that multiple requests do not have to be made to access the resource
 * throughout the program.
 */
export class ApiCache<DataType> {
   payload: ReplaySubject<DataType>; 
   apiEndpoint: string;

   /** ok is false if there are no unresolved errors. */
   ok: boolean = true;
   /** true if a request has been made to the server for the payload. */
   requested: boolean = false;
   /** true if the payload has been successfully retrieved from the server. */
   retrieved: boolean = false;

   constructor(apiEndpoint: string, public httpClient: HttpClient) {
       this.apiEndpoint = apiEndpoint;
       this.payload = new ReplaySubject<DataType>(1);
   }

   /**
    * Expose an rxjs subject of the payload, and if a request has not been made
    * to the server yet, make a request.
    */
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
       //expose the payload to the subscriber
       return this.payload;
   }
}