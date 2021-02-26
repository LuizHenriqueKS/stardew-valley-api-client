import { Socket } from 'net';
import { convertBytesArrayToNumber, convertNumberToBytesArray } from 'z-convertx';

class APISocket {
  #socket: Socket;
  #host?: string;
  #port?: number;
  #connected: boolean;

  constructor() {
    this.#socket = new Socket();
    this.#connected = false;
  }

  async connect(host: string, port: number): Promise<void> {
    this.#host = host;
    this.#port = port;
    return new Promise((resolve, reject) => {
      this.#socket.on('connect', () => {
        this.#connected = true;
        resolve();
      });
      this.#socket.on('error', err => {
        this.#connected = false;
        reject(err);
      });
      this.#socket.connect(port, host);
    });
  }

  async sendJSON(data: Object): Promise<void> {
    await this.sendStr(JSON.stringify(data));
  }

  async sendStr(data: string): Promise<void> {
    const buffer = Buffer.from(data, 'utf-8');
    await this.sendInt(buffer.length);
    return new Promise((resolve, reject) => {
      this.#socket.write(buffer, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async sendInt(data: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sizeBuffer = new Uint8Array(convertNumberToBytesArray(data, { maxLength: 4 }));
      this.#socket.write(sizeBuffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
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

  async close() {
    this.#socket.destroy();
  }

  get connected(): boolean {
    return this.#connected;
  }
}

export default APISocket;
