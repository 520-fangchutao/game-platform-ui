export function countChar(sourceStr,countChar){
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

export function distinctArr(srcArr,discArr){
    srcArr.forEach(function (self, index, arr) {
        arr.indexOf(self) === index ? discArr.push(self) : null;
    });
}
