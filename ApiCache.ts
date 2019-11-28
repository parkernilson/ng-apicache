import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Api Cache is an object responsible for requesting a payload from an API endpoint,
 * then caching it, so that multiple requests do not have to be made to access the resource
 * throughout the program.
 */
export class ApiCache<DataType> {
    /** The subject through which the payload is communicated to the requester */
    payloadSubject: ReplaySubject<DataType>; 
    apiEndpoint: string;

    /** ok is false if there are no unresolved errors. */
    ok: boolean = true;
    /** true if a request has been made to the server for the payload. */
    requested: boolean = false;
    /** true if the payload has been successfully retrieved from the server. */
    retrieved: boolean = false;
    /** list of errors that have occurred since this cache was created or since the last time it was reset */
    errors: any[] = [];

    constructor(apiEndpoint: string, public httpClient: HttpClient) {
        this.apiEndpoint = apiEndpoint;
        this.payloadSubject = new ReplaySubject<DataType>(1);
    }

   /**
    * Expose an rxjs subject of the payload, and if a request has not been made
    * to the server yet, make a request.
    */
    getData(): ReplaySubject<DataType> {
        //if the cache is not in error state
        if(this.ok === true) {
            //if the resource has not been requested yet, request it.
            if(!this.requested) {
                this.httpClient.get<DataType>(this.apiEndpoint)
                .subscribe((response: DataType) => {
                    this.retrieved = true; //the resource has been successfully retrieved
                    this.payloadSubject.next(response);
                },
                error => {
                    this.ok = false;
                    this.payloadSubject.error(error) //communicate the error to the subscriber
                    this.errors.push(error); //track this error in the errors array
                })
                this.requested = true; //we have made the request
            }
        }
        //expose the payload to the subscriber
        return this.payloadSubject;
    }

    /** Reset this cache for a new request */
    reset(): void {
        this.ok = true;
        this.requested = false;
        this.errors = [];
    }
}