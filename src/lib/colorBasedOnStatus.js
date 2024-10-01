export function colorBasedOnStatus(status){
  if (status === 'Alive') {
    return 'text-green-500'
  } else if (status === 'Dead') {
    return 'text-red-500'
  } else {
    return 'text-white'
  }
}

export function fillBasedOnStatus(status){
  if (status === 'Alive') {
    return 'text-green-500'
  } else if (status === 'Dead') {
    return 'text-red-500'
  } else {
    return 'text-white'
  }
}