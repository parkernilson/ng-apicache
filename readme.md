# Angular ApiCache
ApiCache is used to store resources you retrieve from a server in RxJS Subjects so that you only need to request them from the server once.

## Examples
Create an ApiCache with a route to an express endpoint which responds
with a JSON object and an Angular HttpClient (for making the request).
The ApiCache will make a GET request to the specified endpoint
and cache the response in a ReplaySubject with buffer size of 1.
```typescript
let personCache = new ApiCache<Person>(
    'api/get/person', //route to an express endpoint which responds with a JSON object
    this.httpClient //Angular HttpClient
);

personCache.getData().subscribe((person: Person) => {
    /* person will be requested from 'api/get/person'
    if it has not been requested yet. */
    console.log('received: ', person);
}
(error: any) => {
    /* if an error response was received it will be
    emitted here */
    console.error(error);
})
```
ApiCache.getData() returns an RxJS ReplaySubject with buffer size 1
which will emit the current cached response. If the resource has not
been requested yet, it will be requested when ApiCache.getData() is called, then emitted to the returned ReplaySubject when it is received. If any error is received from the server, it is emitted through this ReplaySubject.

After receieving an error response, the ApiCache will be in error state and ApiCache.ok will be false. Any errors received will be stored in the array ApiCache.errors.

ApiCache.reset() will reset the cache to 'ok', clear the errors array, and set the ApiCache so that it will make a new request the next time ApiCache.getData() is called.