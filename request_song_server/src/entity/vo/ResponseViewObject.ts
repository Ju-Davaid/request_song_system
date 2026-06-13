class ResponseViewObject<T = any> {
   private code: number;
   private msg: string;
   private data: T;
   constructor(code: number, msg: string, data: T) {
      this.code = code;
      this.msg = msg;
      this.data = data;
   }
   public static success<T>(data: T) {
      return new ResponseViewObject<T>(200, 'success', data);
   }
   public static error(msg: string) {
      return new ResponseViewObject<null>(400, msg, null);
   }
   public getCode(): number {
      return this.code;
   }
   public getMsg(): string {
      return this.msg;
   }
   public getData(): T {
      return this.data;
   }
}

export default ResponseViewObject;