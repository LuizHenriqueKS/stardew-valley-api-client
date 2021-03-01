import TypeInfo from '../model/TypeInfo';
import Ref from './Ref';

abstract class Proxy<T> {
  #ref: Ref;

  constructor(ref: Ref) {
    this.#ref = ref;
  }

  abstract sub(ref: Ref): T;

  async sync(): Promise<T> {
    const syncRef = await this.ref.sync();
    return this.sub(syncRef);
  }

  getTypeInfo(): Promise<TypeInfo> {
    return this.ref.getTypeInfo();
  }

  get ref(): Ref {
    return this.#ref;
  }
}

export default Proxy;
