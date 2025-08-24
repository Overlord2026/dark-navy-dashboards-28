import { COUNTY_META, CountyMeta } from './countyMeta';

export function useCountyMeta() {
  const list: CountyMeta[] = Object.values(COUNTY_META);
  
  function byState(state: string) { 
    return list.filter(c => c.state === state); 
  }
  
  function get(state: string, county: string) { 
    return COUNTY_META[`${state}/${county}`]; 
  }
  
  function search(q: string) {
    const s = (q || '').toLowerCase();
    return list.filter(c => (`${c.state} ${c.county}`).toLowerCase().includes(s));
  }
  
  return { list, byState, get, search };
}