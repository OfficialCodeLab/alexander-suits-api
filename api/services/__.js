

/*======================================================================*/


/*======================================================================*/



// api/services/__.js
module.exports = {

  mergeArrays: function(arr1, arr2) {
    let newArr = arr1;
    if(!!arr1) {
        for(let n of arr2) {
            let found = false;
            for(let i = 0; i < arr1.length; i++) {
                if (arr1[i] == n) {
                    found = true;
                    break;
                }
            }
            if(found === false) {
                newArr.push(n);
            }
        }
        return newArr;
    }
    return arr2;
  },
  
  mergeObjectArrays: function(arr1, arr2) {
    let newArr = arr1;
    if(!!arr1) {
        for(let n of arr2) {
            let found = false;
            for(let i = 0; i < arr1.length; i++) {
                if (arr1[i].id == n.id) {
                    found = true;
                    break;
                }
            }
            if(found === false) {
                newArr.push(n);
            }
        }
        return newArr;
    }
    return arr2;
  },

  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

