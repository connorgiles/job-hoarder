export default (data: any): object =>
  typeof data === 'string' ? JSON.parse(data) : data;
