export function transElIconName(iconName){
  return 'elicon'+iconName.replace(/[A-Z]/g,(match)=>'-'+match.toLowerCase())
}