

/*======================================================================*/


/*======================================================================*/

let _ = require('lodash');

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

      isEquivalent: function(a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
			console.log("LENGTH");
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                let flag = false;
                if(isArray(a[propName]) && isArray(b[propName])) {//process array                    
                    flag = _.isEqual(a[propName], b[propName]);
                } else if (isObject(a[propName]) && isObject(b[propName])){                    
                    flag = _.isEqual(a[propName], b[propName]);
                }
                
                if(flag === false) {
                    console.log(a[propName] + " NOT EQUAL TO " + b[propName]);
                    return false;
                }
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
      },
      cmp :function(a, b) {
        if (a > b) return +1;
        if (a < b) return -1;
        return 0;
      },
    
      capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
    isArray = (a) => {
        return (!!a) && (a.constructor === Array);
    };
    
    isObject = (a) => {
        return (!!a) && (a.constructor === Object);
    };
    