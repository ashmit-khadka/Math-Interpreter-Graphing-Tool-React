module ResponseHandler

type success = {
    status:string;
    data:string;    //contains the serialised JSON.
}