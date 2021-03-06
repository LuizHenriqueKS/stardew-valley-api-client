import APIClient from '../APIClient';
import JSResponseReader from './JSResponseReader';
import escapeValue from '../util/escapeValue';
import TypeInfo from '../model/TypeInfo';
import ResponseType from '../enums/ResponseType';
import JSRemoteErrorException from '../exception/JSRemoteErrorException';

class Ref {
  client: APIClient;
  expression: string;

  constructor(client: APIClient, expression: string) {
    this.client = client;
    this.expression = expression;
  }

  run(script?: string): JSResponseReader {
    if (script) {
      return this.client.jsRunner.run(script);
    } else {
      return this.client.jsRunner.run(this.expression);
    }
  }

  async evaluate(script?: string): Promise<any> {
    const response = await this.run(script || `return ${this.expression};`).next();
    if (response.type === ResponseType.RESPONSE) {
      return response.result;
    } else {
      throw new JSRemoteErrorException(response.result);
    }
  }

  invokeMethod(methodName: string, ...args: any[]): JSResponseReader {
    let script = `return ${this.expression}.${methodName}(`;
    let first = true;
    for (const arg of args) {
      if (!first) {
        script += ', ';
      }
      first = false;
      script += escapeValue(arg);
    }
    script += ')';
    return this.run(script);
  }

  async invokeMethodResult(methodName: string, ...args: any[]): Promise<any> {
    const response = await this.invokeMethod(methodName, ...args).next();
    if (response.type === ResponseType.RESPONSE) {
      return response.result;
    } else {
      console.error(response.result.ScriptErrorDetails);
      throw new JSRemoteErrorException(response.result);
    }
  }

  sync(): Ref {
    const refName = this.newRefName();
    const script = `refs['${refName}'] = ${this.expression};`;
    const newExpression = `refs['${refName}']`;
    this.run(script);
    return new Ref(this.client, newExpression);
  }

  newRefName() {
    return `ref#${this.client.jsRunner.lastRefId++}`;
  }

  async getTypeInfo(): Promise<TypeInfo> {
    const script = `return ${this.expression}.GetType()`;
    return await this.evaluate(script);
  }

  sub(expression: string): Ref {
    return new Ref(this.client, expression);
  }

  async getTypeName(): Promise<string> {
    return await this.getPropertyValue('GetType().Name');
  }

  getChild(relativeExpression: string): Ref {
    return this.sub(`${this.expression}.${relativeExpression}`);
  }

  getPropertyValue(propertyName: string): Promise<any> {
    return this.evaluate(`return ${this.expression}.${propertyName};`);
  }

  setPropertyValue(propertyName: string, propertyValue: number | boolean | string | Ref): JSResponseReader {
    const value = escapeValue(propertyValue);
    return this.run(`${this.expression}.${propertyName} = ${value}`);
  }
}

export default Ref;
