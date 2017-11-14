

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

      isEquivalent: function(a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
      },
    
      capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
    
    