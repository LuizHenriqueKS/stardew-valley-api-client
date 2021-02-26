import APIClient from '../APIClient';
import JSResponseReader from './JSResponseReader';
import escapeValue from '../util/escapeValue';

class Ref {
  client: APIClient;
  expression: string;

  constructor(client: APIClient, expression: string) {
    this.client = client;
    this.expression = expression;
  }

  run(script?: string): Promise<JSResponseReader> {
    if (script) {
      return this.client.jsRunner.run(script);
    } else {
      return this.client.jsRunner.run(this.expression);
    }
  }

  async evaluate(script?: string): Promise<any> {
    const reader = await this.run(script || `return ${this.expression};`);
    const response = await reader.next();
    return response.result;
  }

  async invokeMethod(methodName: string, ...args: any[]): Promise<JSResponseReader> {
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
    const reader = await this.invokeMethod(methodName, args);
    return reader.next();
  }

  async sync(): Promise<Ref> {
    const refName = await this.evaluate(`return engine.AddReference(${this.expression});`);
    const newExpression = `engine.GetReference('${refName}')`;
    return new Ref(this.client, newExpression);
  }

  sub(expression: string): Ref {
    return new Ref(this.client, expression);
  }

  getChild(relativeExpression: string): Ref {
    return this.sub(`${this.expression}.${relativeExpression}`);
  }

  getPropertyValue(propertyName: string): Promise<any> {
    return this.evaluate(`return ${this.expression}.${propertyName};`);
  }

  setPropertyValue(propertyName: string, propertyValue: number | string | Ref): Promise<JSResponseReader> {
    const value = escapeValue(propertyValue);
    return this.run(`${this.expression}.${propertyName} = ${value}`);
  }
}

export default Ref;
