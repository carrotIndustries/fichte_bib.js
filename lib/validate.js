
exports.isbn = function validateISBN(isbn) {
	
  if(isbn == undefined) {
	  return false;
	 }
	 
  if(isbn.match(/[^0-9xX\.\s]/)) {
    return false;
  }
  isbn = isbn.replace(/[^0-9xX]/g,'');
 
  if(isbn.length != 13) {
    return false;
  }
     
    checkDigit = 0;

    checkDigit = 10 -  ((
                 1 * isbn.charAt(0) +
                 3 * isbn.charAt(1) +
                 1 * isbn.charAt(2) +
                 3 * isbn.charAt(3) +
                 1 * isbn.charAt(4) +
                 3 * isbn.charAt(5) +
                 1 * isbn.charAt(6) +
                 3 * isbn.charAt(7) +
                 1 * isbn.charAt(8) +
                 3 * isbn.charAt(9) +
                 1 * isbn.charAt(10) +
                 3 * isbn.charAt(11)
                ) % 10);
              
    if(checkDigit == 10) {
      return (isbn.charAt(12) == 0 ? true : false) ;
    } else {
      return (isbn.charAt(12) == checkDigit ? true : false);
    }
  
}
