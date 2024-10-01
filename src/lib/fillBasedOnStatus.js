export function fillBasedOnStatus(status){
  if (status === 'Alive') {
    return 'green'
  } else if (status === 'Dead') {
    return 'red'
  } else {
    return 'grey'
  }
}