import { ElMessage } from "element-plus";
export function countChar(sourceStr, countChar) {
  let matches = sourceStr.match(new RegExp(`${countChar}`, `g`))
  return matches ? matches.length : 0;
}


export function recursionIndex(row, begin, limit, splitChar) {
  let index = row.indexOf(splitChar, begin)
  if (limit === 1) {
    return index
  }
  return this.recursionIndex(row, index + 1, limit - 1, splitChar)
}

export function distinctArr(srcArr, discArr) {
  srcArr.forEach(function (self, index, arr) {
    arr.indexOf(self) === index ? discArr.push(self) : null;
  });
}

export function isEmpty(value) {
  switch (typeof value) {
    case 'string':
    case 'undefined':
      return !value;
    case 'boolean':
      return !value;
    case 'number':
      return isNaN(value);
    case 'object':
      return Array.isArray(value) ? !value.length : !Object.keys(value).length;
    default:
      return false;
  }
}