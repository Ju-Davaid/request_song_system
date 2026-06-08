class ResponseViewObject {
   private code: number;
   private msg: string;
   private data: any;
   constructor(code: number, msg: string, data: any) {
    this.code = code;
    this.msg = msg;
    this.data = data;
   }
   public static success(data: any) {
    return new ResponseViewObject(200, 'success', data);
   }
   public static error(msg: string) {
    return new ResponseViewObject(400, msg, null);
   }
   public getCode(): number {
    return this.code;
   }
   public getMsg(): string {
    return this.msg;
   }
   public getData(): any {
    return this.data;
   }
}

export default ResponseViewObject;