export function columnsBasedOnSize(size){
  switch (size) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2'
    case 3: 
      return 'grid-cols-3'
    default:
      return 'grid-cols-4'
  }
}