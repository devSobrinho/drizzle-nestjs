import { v4 as uuidV4 } from 'uuid';

export class GenerationHelper {
  public static code(maxLength: number = 6): string {
    const uuid = uuidV4().replace(/-/g, '').substring(0, maxLength);
    let result = '';
    for (let i = 0; i < maxLength; i++) {
      result += uuid[Math.floor(Math.random() * uuid.length)];
    }
    return result;
  }
}
