import { Socket } from 'net';
import { convertBytesArrayToNumber, convertNumberToBytesArray } from 'z-convertx';

class APISocket {
  #socket: Socket;
  #host: string;
  #port: number;
  #connected: boolean;
  #pool: Uint8Array[];
  #sending: boolean;

  constructor(host: string, port: number) {
    this.#host = host;
    this.#port = port;
    this.#socket = new Socket();
    this.#connected = false;
    this.#pool = [];
    this.#sending = false;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#socket.on('connect', () => {
        this.#connected = true;
        this.clearPool();
        resolve();
      });
      this.#socket.on('error', err => {
        this.#connected = false;
        this.clearPool();
        reject(err);
      });
      this.#socket.connect(this.#port, this.#host);
    });
  }

  clearPool() {
    this.#pool = [];
  }

  sendJSON(data: Object): void {
    this.sendStr(JSON.stringify(data));
  }

  sendStr(data: string): void {
    const buffer = Buffer.from(data, 'utf-8');
    this.sendInt(buffer.length);
    this.#pool.push(buffer);
    this.sendPool();
  }

  sendInt(data: number): void {
    const buffer = new Uint8Array(convertNumberToBytesArray(data, { maxLength: 4 }));
    this.#pool.push(buffer);
  }

  async readInt(): Promise<number> {
    const buffer = await this.readBytes(4);
    const number = convertBytesArrayToNumber(buffer);
    return number;
  }

  async readBytes(size: number): Promise<number[]> {
    return new Promise((resolve) => {
      const func = () => {
        const value = this.#socket.read(size);
        if (value) {
          resolve(value);
        } else {
          this.#socket.once('readable', () => {
            func();
          });
        }
      };
      func();
    });
  }

  async readString(): Promise<string> {
    const size = await this.readInt();
    const buffer = await this.readBytes(size);
    return Buffer.from(buffer).toString('utf-8');
  }

  async readJSON(): Promise<any> {
    const string = await this.readString();
    const result = JSON.parse(string);
    return result;
  }

  private sendPool(): void {
    const send = () => {
      if (!this.#sending) {
        if (this.#pool.length > 0) {
          this.#sending = true;
          const buffer = this.#pool[0];
          this.#pool.splice(0, 1);
          this.#socket.write(buffer, (err) => {
            this.#sending = false;
            if (err) {
              console.error(err);
              this.close();
            } else {
              send();
            }
          });
        }
      }
    };
    send();
  }

  async close() {
    this.#socket.destroy();
  }

  get connected(): boolean {
    return this.#connected;
  }

  get host(): string {
    return this.#host;
  }

  get port(): number {
    return this.#port;
  }
}

export default APISocket;
