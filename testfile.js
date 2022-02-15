const text = '1*2*3*4*5*6*7*8';
console.log('The text was', text);
console.log('The text value was', text.split('*').length);
console.log('The text after split is', (text.split('*').slice(8).join('*')).length);